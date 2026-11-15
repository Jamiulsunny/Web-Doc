import { prisma } from "./prisma";
// Same shape as prisma.notification.create, plus a real-time push via Socket.io when the custom server is running.
export async function notifyCreate(arg: { data: { userId: string; message: string } }) {
  const n = await prisma.notification.create(arg);
  (globalThis as any).io?.to("user:" + n.userId).emit("notification", { id: n.id, message: n.message });
  return n;
}

export async function notifyMembers(groupId: string, message: string) {
  const ms = await prisma.groupMember.findMany({ where: { groupId } });
  for (const m of ms) await notifyCreate({ data: { userId: m.userId, message } });
}
export async function notifyCoordinators(message: string) {
  const cs = await prisma.user.findMany({ where: { roles: { has: "COORDINATOR" }, status: "ACTIVE" } });
  for (const c of cs) await notifyCreate({ data: { userId: c.id, message } });
}
