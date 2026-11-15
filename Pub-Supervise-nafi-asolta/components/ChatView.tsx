"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import styles from "./ChatView.module.css";

const cx = (...a: (string | false | undefined)[]) => a.filter(Boolean).join(" ");
const COLORS = ["#2563eb", "#059669", "#d97706", "#7c3aed", "#db2777", "#0891b2", "#b91c1c", "#4f46e5"];
const colorOf = (s: string) => { let h = 0; for (const c of s || "") h = (h * 31 + c.charCodeAt(0)) >>> 0; return COLORS[h % COLORS.length]; };
const initials = (n: string) => (n || "?").split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
const time = (d: Date) => d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const dayLabel = (d: Date) => {
  const t = new Date(), y = new Date(); y.setDate(t.getDate() - 1);
  return d.toDateString() === t.toDateString() ? "Today" : d.toDateString() === y.toDateString() ? "Yesterday" : d.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
};
const ICONS: Record<string, string[]> = {
  chat: ["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"],
  send: ["M22 2 11 13", "M22 2 15 22l-4-9-9-4 20-7z"],
  back: ["M19 12H5", "M12 19l-7-7 7-7"],
  down: ["M12 5v14", "M19 12l-7 7-7-7"],
};
const Icon = ({ name, size = 20 }: { name: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{ICONS[name].map((p, i) => <path key={i} d={p} />)}</svg>
);

export default function ChatView({ role, me }: { role: "student" | "supervisor"; me: string }) {
  const [groups, setGroups] = useState<any[]>([]); const [loaded, setLoaded] = useState(false);
  const [gid, setGid] = useState(""); const [open, setOpen] = useState(false); const [query, setQuery] = useState("");
  const [msgs, setMsgs] = useState<any[]>([]); const [loading, setLoading] = useState(false);
  const [text, setText] = useState(""); const [up, setUp] = useState(false);
  const [onlineIds, setOnlineIds] = useState<Set<string>>(new Set());
  const [typer, setTyper] = useState<{ groupId: string; userId: string; name: string } | null>(null);
  const [atBottom, setAtBottom] = useState(true);
  const sock = useRef<Socket | null>(null); const cur = useRef("");
  const bodyRef = useRef<HTMLDivElement>(null); const box = useRef<HTMLTextAreaElement>(null);
  const groupsRef = useRef<any[]>([]); const bottomRef = useRef(true); const typingTimer = useRef<any>(null); const lastTyping = useRef(0);
  const group = groups.find((g) => g.id === gid);

  const others = (g: any): string[] => [g.supervisor?.id, ...g.members.map((m: any) => m.user.id)].filter((id) => id && id !== me);
  const onlineCount = (g: any) => others(g).filter((id) => onlineIds.has(id)).length;
  const sub = (g: any) => role === "student" ? (g.supervisor ? `Supervisor: ${g.supervisor.name}` : "No supervisor assigned yet") : `Team: ${g.members.map((x: any) => x.user.name).join(", ")}`;
  const refresh = () => groupsRef.current.forEach((g) => sock.current?.emit("presence-request", g.id)); // ask the server who is online
  const scrollDown = (smooth = true) => bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: smooth ? "smooth" : "auto" });

  useEffect(() => {
    fetch(`/api/groups?as=${role}`).then((r) => r.json()).then((d) => { const g = d.groups || []; groupsRef.current = g; setGroups(g); if (g[0]) setGid(g[0].id); setLoaded(true); refresh(); });
    const s = io(); sock.current = s;
    s.on("connect", () => { setUp(true); if (cur.current) s.emit("join-group", cur.current); refresh(); });
    s.on("disconnect", () => { setUp(false); setOnlineIds(new Set()); });
    s.on("presence-list", ({ all, online }: { all: string[]; online: string[] }) => setOnlineIds((p) => { const n = new Set(p); all.forEach((id) => (online.includes(id) ? n.add(id) : n.delete(id))); return n; }));
    s.on("presence-init", (ids: string[]) => setOnlineIds(new Set(ids)));
    s.on("presence", ({ userId, online }: { userId: string; online: boolean }) => setOnlineIds((p) => { const n = new Set(p); online ? n.add(userId) : n.delete(userId); return n; }));
    s.on("typing", (t: any) => {
      if (t.groupId !== cur.current) return;
      setTyper(t); clearTimeout(typingTimer.current); typingTimer.current = setTimeout(() => setTyper(null), 3000);
    });
    s.on("message", (m: any) => {
      if (m.groupId !== cur.current) return;
      setMsgs((p) => (p.some((x) => x.id === m.id) ? p : [...p, m]));
      setTyper((t) => (t && t.userId === m.senderId ? null : t));
      if (m.senderId === me) bottomRef.current = true;
    });
    const iv = setInterval(refresh, 10000); // self-heal: re-check who is online every 10 seconds
    return () => { s.disconnect(); clearTimeout(typingTimer.current); clearInterval(iv); };
  }, []);

  useEffect(() => {
    if (!gid) return;
    cur.current = gid; setMsgs([]); setLoading(true); setTyper(null); bottomRef.current = true;
    sock.current?.emit("join-group", gid);
    fetch(`/api/messages?groupId=${gid}`).then((r) => r.json()).then((d) => { if (cur.current === gid && Array.isArray(d)) setMsgs(d); }).finally(() => setLoading(false));
  }, [gid]);

  useEffect(() => { if (bottomRef.current) scrollDown(msgs.length > 1); }, [msgs, typer]);

  const rows = useMemo(() => msgs.map((m, i) => {
    const d = new Date(m.createdAt), prev = msgs[i - 1], pd = prev && new Date(prev.createdAt);
    const newDay = !prev || pd.toDateString() !== d.toDateString();
    return { m, d, newDay, first: newDay || prev.senderId !== m.senderId || d.getTime() - pd.getTime() > 5 * 60000, mine: m.senderId === me };
  }), [msgs, me]);

  const send = () => {
    const t = text.trim(); if (!t || !gid) return;
    sock.current?.emit("send", { groupId: gid, body: t }); setText("");
    if (box.current) box.current.style.height = "auto";
  };
  const onType = (v: string, el: HTMLTextAreaElement) => {
    setText(v); el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 120) + "px";
    if (v && Date.now() - lastTyping.current > 2000) { lastTyping.current = Date.now(); sock.current?.emit("typing", gid); }
  };
  const onScroll = () => {
    const el = bodyRef.current; if (!el) return;
    const near = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    bottomRef.current = near; setAtBottom(near);
  };
  const shown = groups.filter((g) => (g.title + sub(g)).toLowerCase().includes(query.toLowerCase()));
  const count = group ? onlineCount(group) : 0;

  return (
    <div className={styles.page}>
      <div className={styles.title}><h1>Messages</h1><span>Private to the team and the assigned supervisor. Encrypted at rest.</span></div>

      {loaded && groups.length === 0 ? (
        <div className={cx(styles.empty, styles.emptyBig)}><div className={styles.eico}><Icon name="chat" size={30} /></div><h3>No conversations yet</h3><p>Your chat appears here once you have a project group{role === "student" ? " and a supervisor" : ""}.</p></div>
      ) : (
        <div className={cx(styles.shell, open && styles.open)}>
          <aside className={styles.side}>
            <div className={styles.sideHead}><b>Conversations</b><input className={styles.search} placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} /></div>
            <div className={styles.list}>
              {shown.map((g) => {
                const on = onlineCount(g) > 0;
                return (
                  <button key={g.id} className={cx(styles.item, g.id === gid && styles.itemOn)} onClick={() => { setGid(g.id); setOpen(true); }}>
                    <span className={styles.avWrap}><span className={cx(styles.av, styles.avSq)} style={{ background: colorOf(g.id) }}>{initials(g.title)}</span>{on && <i className={styles.dot} />}</span>
                    <span className={cx(styles.meta, on && styles.metaOn)}><b>{g.title}</b><small>{on ? "Online" : sub(g)}</small></span>
                  </button>);
              })}
              {shown.length === 0 && <div className={styles.hint}>No results</div>}
            </div>
          </aside>

          <section className={styles.main}>
            {group && (
              <header className={styles.head}>
                <button className={styles.back} onClick={() => setOpen(false)} aria-label="Back"><Icon name="back" /></button>
                <span className={styles.avWrap}><span className={cx(styles.av, styles.avSq)} style={{ background: colorOf(group.id) }}>{initials(group.title)}</span>{count > 0 && <i className={styles.dot} />}</span>
                <div className={styles.hmeta}>
                  <b>{group.title}</b>
                  <small className={typer ? styles.typingText : undefined}>{typer ? `${typer.name} is typing...` : sub(group)}</small>
                </div>
                {!up ? <span className={cx(styles.chip, styles.chipWarn)}><i />Reconnecting</span>
                  : count > 0 ? <span className={cx(styles.chip, styles.chipOn)}><i />{count > 1 ? `${count} online` : "Online"}</span>
                  : <span className={styles.chip}><i />Offline</span>}
              </header>)}

            <div className={styles.body} ref={bodyRef} onScroll={onScroll}>
              {loading && <div className={styles.hint}>Loading messages...</div>}
              {!loading && msgs.length === 0 && <div className={styles.empty}><div className={styles.eico}><Icon name="chat" size={28} /></div><h3>No messages yet</h3><p>Say hello to start the conversation.</p></div>}
              {rows.map(({ m, d, newDay, first, mine }) => (
                <div key={m.id}>
                  {newDay && <div className={styles.day}><span>{dayLabel(d)}</span></div>}
                  <div className={cx(styles.row, mine && styles.mine, first && styles.first)}>
                    {!mine && (first ? <span className={styles.av} style={{ background: colorOf(m.senderId) }}>{initials(m.sender?.name)}</span> : <span className={styles.sp} />)}
                    <div className={styles.bub}>
                      {!mine && first && <div className={styles.name} style={{ color: colorOf(m.senderId) }}>{m.sender?.name}</div>}
                      <div className={styles.text}>{m.body}</div>
                      <div className={styles.time}>{time(d)}</div>
                    </div>
                  </div>
                </div>))}
              {typer && <div className={styles.typing}><span className={styles.av} style={{ background: colorOf(typer.userId) }}>{initials(typer.name)}</span><div className={styles.dots}><i /><i /><i /></div></div>}
            </div>
            {!atBottom && <button className={styles.toBottom} onClick={() => scrollDown()} aria-label="Scroll to latest"><Icon name="down" /></button>}

            <div className={styles.bar}>
              <div className={styles.field}>
                <textarea ref={box} rows={1} maxLength={2000} value={text} placeholder="Type a message..."
                  onChange={(e) => onType(e.target.value, e.target)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} />
                {text.length > 1800 && <span className={styles.count}>{2000 - text.length}</span>}
              </div>
              <button className={styles.send} onClick={send} disabled={!text.trim()} aria-label="Send"><Icon name="send" /></button>
            </div>
          </section>
        </div>)}
    </div>
  );
}