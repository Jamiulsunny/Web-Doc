"use client";
import { useEffect, useState } from "react";
const api = (url: string, method = "GET", body?: any) => fetch(url, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined }).then(async (r) => { const d = await r.json(); return Array.isArray(d) ? d : { ok: r.ok, ...d }; });
export default function MeetingsView({ role }: { role: "student" | "supervisor" | "coordinator" }) {
  const [groups, setGroups] = useState<any[]>([]); const [gid, setGid] = useState(""); const [list, setList] = useState<any[]>([]); const [f, setF] = useState<any>({}); const [err, setErr] = useState("");
  const canEdit = role !== "student";
  const load = async (id = gid) => { if (!id) return; const r: any = await api(`/api/meetings?groupId=${id}`); if (Array.isArray(r)) setList(r); };
  useEffect(() => { api(`/api/groups?as=${role}`).then((d: any) => { setGroups(d.groups || []); if (d.groups?.[0]) { setGid(d.groups[0].id); load(d.groups[0].id); } }); }, []);
  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value });
  const go = async (body: any) => { const r: any = await api("/api/meetings", "POST", body); setErr(r.ok ? "" : r.error); if (r.ok) load(); };
  const parse = (t: string) => (t || "").split("\n").map((l) => l.split("|").map((x) => x.trim())).filter((p) => p[0] && p[1]).map((p) => ({ task: p[0], assignee: p[1], dueDate: p[2] || null }));
  return (<div className="wrap"><h1>Meeting log</h1>{err && <div className="err">{err}</div>}
    <select value={gid} onChange={(e) => { setGid(e.target.value); load(e.target.value); }} style={{ margin: "12px 0", maxWidth: 400 }}>{groups.map((g) => <option key={g.id} value={g.id}>{g.title}</option>)}</select>
    {canEdit && gid && <div className="card row" style={{ marginBottom: 16 }}><input type="datetime-local" value={f.at || ""} onChange={set("at")} style={{ maxWidth: 220 }} /><input placeholder="Agenda" value={f.agenda || ""} onChange={set("agenda")} style={{ maxWidth: 360 }} />
      <button className="btn sm" onClick={() => go({ action: "create", groupId: gid, scheduledAt: f.at, agenda: f.agenda })}>Schedule meeting</button></div>}
    {list.length === 0 && <p className="muted">No meetings yet.</p>}
    {list.map((m) => <div className="card" key={m.id} style={{ marginBottom: 14 }}><div className="row" style={{ justifyContent: "space-between" }}><b>{new Date(m.scheduledAt).toLocaleString()}</b>{canEdit && <span><button className="btn sm ghost" onClick={() => { const d = prompt("New date and time (yyyy-mm-ddThh:mm)", m.scheduledAt.slice(0, 16)); if (d) go({ action: "edit", meetingId: m.id, scheduledAt: d }); }}>Reschedule</button> <button className="btn sm red" onClick={() => confirm("Delete this meeting?") && go({ action: "delete", meetingId: m.id })}>Delete</button></span>}<span className="muted">{m.agenda}</span></div>
      {m.minutes && <p><b>Minutes:</b> {m.minutes}</p>}
      {m.actionItems.map((i: any) => <label key={i.id} className="chk" style={{ margin: "6px 0" }}><input type="checkbox" checked={i.done} onChange={() => go({ action: "toggle", itemId: i.id })} />{i.task} <span className="muted">- {i.assignee}{i.dueDate && `, due ${new Date(i.dueDate).toLocaleDateString()}`}</span></label>)}
      {canEdit && <div style={{ marginTop: 10 }}><textarea className="card" style={{ width: "100%", marginBottom: 6 }} placeholder="Discussion / minutes" value={f["m" + m.id] || ""} onChange={set("m" + m.id)} />
        <textarea className="card" style={{ width: "100%", marginBottom: 6 }} placeholder={"Action items, one per line: task | assignee | yyyy-mm-dd"} value={f["a" + m.id] || ""} onChange={set("a" + m.id)} />
        <button className="btn sm" onClick={() => { go({ action: "log", meetingId: m.id, minutes: f["m" + m.id] ?? m.minutes, actionItems: parse(f["a" + m.id]) }); setF({ ...f, ["a" + m.id]: "" }); }}>Save minutes and action items</button></div>}
    </div>)}
  </div>);
}
