// Custom Next.js server with Socket.io (real-time chat, online presence, typing and notifications)
const { createServer } = require("http");
const next = require("next");
const { Server } = require("socket.io");
const { jwtVerify } = require("jose");
const { encrypt } = require("./lib/crypto");
const dev = !process.argv.includes("--prod");
const app = next({ dev });
const handle = app.getRequestHandler();
app.prepare().then(() => {
  const { PrismaClient } = require("@prisma/client");
  const prisma = new PrismaClient();
  const server = createServer((req, res) => handle(req, res));
  const io = new Server(server);
  globalThis.io = io;
  const key = new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");
  io.use(async (socket, cb) => {
    try {
      const m = /pub_session=([^;]+)/.exec(socket.handshake.headers.cookie || "");
      const { payload } = await jwtVerify(m[1], key);
      const u = await prisma.user.findUnique({ where: { id: payload.uid } });
      if (!u || u.status !== "ACTIVE") throw new Error("inactive");
      socket.user = u; cb();
    } catch { cb(new Error("unauthorized")); }
  });
  // Private chat: only team members and the assigned supervisor
  const access = async (u, groupId) => {
    const g = await prisma.projectGroup.findUnique({ where: { id: String(groupId) }, include: { members: true } });
    return g && (g.supervisorId === u.id || g.members.some((m) => m.userId === u.id)) ? g : null;
  };
  const people = (g) => [g.supervisorId, ...g.members.map((m) => m.userId)].filter(Boolean);

  const conns = new Map();   // userId -> Set of open socket ids (several tabs count as one user)
  const roomsOf = new Map(); // userId -> group ids this user was announced in

  io.on("connection", (socket) => {
    const uid = socket.user.id;
    if (!conns.has(uid)) conns.set(uid, new Set());
    conns.get(uid).add(socket.id); // registered immediately, before any await
    socket.join("user:" + uid);

    socket.on("join-group", async (gid) => { if (await access(socket.user, gid)) socket.join("group:" + gid); });
    // The client asks "who is online in this group?" and always gets a fresh answer
    socket.on("presence-request", async (gid) => {
      const g = await access(socket.user, gid);
      if (!g) return;
      const all = people(g).filter((id) => id !== uid);
      socket.emit("presence-list", { groupId: g.id, all, online: all.filter((id) => conns.has(id)) });
    });
    socket.on("typing", (gid) => {
      if (socket.rooms.has("group:" + gid)) socket.to("group:" + gid).emit("typing", { groupId: gid, userId: uid, name: socket.user.name });
    });
    socket.on("send", async ({ groupId, body }) => {
      const text = String(body || "").trim().slice(0, 2000);
      const g = text && (await access(socket.user, groupId));
      if (!g) return;
      const msg = await prisma.message.create({ data: { groupId: g.id, senderId: uid, body: encrypt(text) }, include: { sender: { select: { id: true, name: true } } } });
      io.to("group:" + g.id).emit("message", { ...msg, body: text }); // users get plaintext, the database stores only ciphertext
      for (const id of people(g).filter((x) => x !== uid)) {
        const message = `New message in ${g.title}`;
        await prisma.notification.create({ data: { userId: id, message } });
        io.to("user:" + id).emit("notification", { message });
      }
    });
    socket.on("disconnect", () => {
      const set = conns.get(uid);
      if (set) set.delete(socket.id);
      if (set && set.size > 0) return; // still connected in another tab
      conns.delete(uid);
      for (const gid of roomsOf.get(uid) || []) io.to("group:" + gid).emit("presence", { userId: uid, online: false });
      roomsOf.delete(uid);
      console.log(`[presence] ${socket.user.name} is offline`);
    });

    // join this user's group rooms and announce that they are online
    (async () => {
      const mine = await prisma.projectGroup.findMany({ where: { OR: [{ supervisorId: uid }, { members: { some: { userId: uid } } }] }, include: { members: true } });
      if (socket.disconnected) return;
      for (const g of mine) socket.join("group:" + g.id);
      const peers = new Set(mine.flatMap(people).filter((id) => id !== uid));
      socket.emit("presence-init", [...peers].filter((id) => conns.has(id)));
      if (!roomsOf.has(uid)) {
        roomsOf.set(uid, mine.map((g) => g.id));
        for (const g of mine) socket.to("group:" + g.id).emit("presence", { userId: uid, online: true });
        console.log(`[presence] ${socket.user.name} is online`);
      }
    })();
  });
  const port = Number(process.env.PORT || 3000);
  server.listen(port, () => console.log(`PubSupervise ready on http://localhost:${port}`));
});