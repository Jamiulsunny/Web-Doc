"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
export default function NotificationBell() {
  const [items, setItems] = useState<any[]>([]); const [open, setOpen] = useState(false);
  useEffect(() => {
    fetch("/api/notifications").then((r) => r.json()).then((d) => Array.isArray(d) && setItems(d));
    const s = io();
    s.on("notification", (n: any) => setItems((p) => [{ id: n.id || Math.random(), message: n.message, read: false, createdAt: new Date().toISOString() }, ...p]));
    return () => { s.disconnect(); };
  }, []);
  const unread = items.filter((i) => !i.read).length;
  return (<div style={{ position: "relative" }}>
    <button className="btn ghost sm" onClick={async () => { setOpen(!open); if (!open && unread) { await fetch("/api/notifications", { method: "PATCH" }); setTimeout(() => setItems((p) => p.map((i) => ({ ...i, read: true }))), 1500); } }}>Notifications{unread > 0 && <span className="badge REJECTED" style={{ marginLeft: 6 }}>{unread}</span>}</button>
    {open && <div className="card" style={{ position: "absolute", right: 0, top: 42, width: 320, maxHeight: 360, overflow: "auto", zIndex: 10 }}>
      {items.length === 0 && <p>No notifications.</p>}{items.map((i) => <div key={i.id} style={{ padding: "8px 0", borderBottom: "1px solid var(--line)", fontSize: 13, fontWeight: i.read ? 400 : 700 }}>{i.message}<div className="muted" style={{ fontSize: 11 }}>{new Date(i.createdAt).toLocaleString()}</div></div>)}</div>}
  </div>);
}
