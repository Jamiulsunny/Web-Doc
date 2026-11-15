"use client";
import { useEffect, useState } from "react";
import FileInput from "./FileInput";
type Role = "student" | "supervisor" | "coordinator";
const api = (url: string, method = "GET", body?: any) => fetch(url, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined }).then(async (r) => ({ ok: r.ok, ...(await r.json()) }));
const links: any = { student: [["Chat","/chat"],["Meetings","/meetings"],["Defense","/student/defense"],["Journal request","/student/journal"]], supervisor: [["Chat","/chat"],["Meetings","/meetings"],["Journal reviews","/supervisor/journal"]], coordinator: [["Dashboard","/coordinator"],["Risk dashboard","/coordinator/risk"],["Meetings","/meetings"],["Defense","/coordinator/defense"],["Journal reviews","/coordinator/journal"]] };
const overdue = (m: any) => new Date(m.dueDate) < new Date() && ["PENDING", "REVISION_REQUESTED"].includes(m.status);
export default function Workspace({ role }: { role: Role }) {
  const [data, setData] = useState<any>({ groups: [], supervisors: [] });
  const [err, setErr] = useState(""); const [f, setF] = useState<any>({}); const [loaded, setLoaded] = useState(false);
  const load = async () => { const d: any = await api(`/api/groups?as=${role}`); if (d.groups) setData(d); setLoaded(true); };
  useEffect(() => { load(); }, []);
  const act = async (id: string, body: any) => { const d: any = await api(`/api/groups/${id}`, "PATCH", body); setErr(d.ok ? "" : d.error); if (d.ok) load(); };
  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value });
  const input = (k: string, ph: string) => <input placeholder={ph} value={f[k] || ""} onChange={set(k)} style={{ marginBottom: 8 }} />;
  async function createGroup(e: React.FormEvent) {
    e.preventDefault();
    const d: any = await api("/api/groups", "POST", { ...f, members: (f.members || "").split(",") });
    setErr(d.ok ? "" : d.error); if (d.ok) { setF({}); load(); }
  }
  if (!loaded) return <div className="wrap muted">Loading...</div>;
  return (<div className="wrap"><h1>{role === "student" ? "My project" : role === "supervisor" ? "My supervised groups" : "All projects"}</h1>
    {err && <div className="err">{err}</div>}
    {role === "student" && data.groups.length === 0 && <form className="card" onSubmit={createGroup} style={{ marginTop: 16 }}><h3>Submit a proposal</h3>
      {input("title", "Project title")}<textarea className="card" style={{ width: "100%", marginBottom: 8 }} placeholder="Abstract" value={f.abstract || ""} onChange={set("abstract")} />
      <textarea className="card" style={{ width: "100%", marginBottom: 8 }} placeholder="Scope and objectives" value={f.scope || ""} onChange={set("scope")} />
      {input("members", "Other team members' student IDs, comma separated")}
      <select value={f.preferredSupervisor || ""} onChange={set("preferredSupervisor")} style={{ marginBottom: 8 }}><option value="">Preferred supervisor (optional)</option>{data.supervisors.map((s: any) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
      <button className="btn">Submit proposal</button></form>}
    {data.groups.length === 0 && role !== "student" && <p className="muted">No projects yet.</p>}
    {data.groups.map((g: any) => { const p = g.proposals[0]; const v = p?.versions[0];
      return (<div className="card" key={g.id} style={{ marginTop: 16 }}>
        <div className="row" style={{ justifyContent: "space-between" }}><h3>{g.title}</h3><span className="badge">{p?.status.replace("_", " ")}</span></div>
        <p>{g.abstract}</p>
        <p className="muted">Team: {g.members.map((m: any) => `${m.user.name} (${m.user.studentId})`).join(", ")} | Supervisor: {g.supervisor?.name || "Not assigned"}</p>
        {role === "coordinator" && p?.preferredSupervisor && <p className="muted">Preferred supervisor: {data.supervisors.find((s: any) => s.id === p.preferredSupervisor)?.name || "N/A"}</p>}
        {role === "coordinator" && <div className="row" style={{ margin: "6px 0" }}><button className="btn sm ghost" onClick={() => { const id = prompt("Student ID to add"); if (id) act(g.id, { action: "member-add", studentId: id }); }}>Add member</button>
          <button className="btn sm ghost" onClick={() => { const id = prompt("Student ID to remove"); const m = g.members.find((x: any) => x.user.studentId === id); if (m) act(g.id, { action: "member-remove", userId: m.userId }); else if (id) setErr("Student not found in this group."); }}>Remove member</button></div>}
        {g.milestones.length > 0 && (() => { const a = g.milestones.filter((m: any) => m.status === "APPROVED").length, t = g.milestones.length; return <div style={{ margin: "8px 0" }}><div className="muted" style={{ fontSize: 12 }}>Progress: {a}/{t} milestones approved</div><div style={{ height: 8, background: "#e5e7eb", borderRadius: 99 }}><div style={{ width: (a / t * 100) + "%", height: 8, background: "var(--green)", borderRadius: 99 }} /></div></div>; })()}
        {role === "coordinator" && <div className="row" style={{ margin: "10px 0" }}><select defaultValue={g.supervisorId || ""} onChange={(e) => e.target.value && act(g.id, { action: "assign", supervisorId: e.target.value })} style={{ maxWidth: 320 }}>
          <option value="">Assign supervisor...</option>{data.supervisors.map((s: any) => <option key={s.id} value={s.id}>{s.name} ({s._count.supervised}/{s.maxGroups})</option>)}</select></div>}
        <details><summary style={{ cursor: "pointer", fontWeight: 600 }}>Proposal version history ({p?.versions.length})</summary>
          {p?.versions.map((x: any) => <p key={x.id} className="muted">v{x.version} - {new Date(x.createdAt).toLocaleString()} - {x.note}<br />Scope: {x.scope}</p>)}</details>
        {role !== "student" && <div className="row" style={{ margin: "10px 0" }}>
          <input placeholder="Note for the team" value={f["n" + g.id] || ""} onChange={set("n" + g.id)} style={{ maxWidth: 320 }} />
          <button className="btn sm green" onClick={() => act(g.id, { action: "proposal-approve", note: f["n" + g.id] })}>Approve scope</button>
          <button className="btn sm red" onClick={() => act(g.id, { action: "proposal-revision", note: f["n" + g.id] })}>Request revision</button></div>}
        {role === "student" && p?.status === "REVISION_REQUESTED" && <div className="row" style={{ margin: "10px 0" }}><input placeholder="Updated scope" value={f["s" + g.id] || ""} onChange={set("s" + g.id)} style={{ maxWidth: 420 }} /><button className="btn sm" onClick={() => act(g.id, { action: "resubmit", scope: f["s" + g.id] })}>Resubmit proposal</button></div>}
        <h3 style={{ marginTop: 16 }}>Milestones</h3>
        {g.milestones.length === 0 && <p className="muted">No milestones yet.</p>}
        {g.milestones.map((m: any) => <div key={m.id} style={{ borderTop: "1px solid var(--line)", padding: "10px 0" }}>
          <div className="row" style={{ justifyContent: "space-between" }}><b>{m.title}</b>{role !== "student" && <span style={{ marginLeft: 8 }}><button className="btn sm ghost" onClick={() => { const t = prompt("Milestone title", m.title); const d = prompt("Due date (yyyy-mm-dd)", m.dueDate.slice(0, 10)); if (t && d) act(g.id, { action: "milestone-edit", milestoneId: m.id, title: t, dueDate: d }); }}>Edit</button> <button className="btn sm red" onClick={() => confirm("Delete this milestone?") && act(g.id, { action: "milestone-delete", milestoneId: m.id })}>Delete</button></span>}<span>Due {new Date(m.dueDate).toLocaleDateString()} {overdue(m) && <span className="badge REJECTED">Overdue</span>} <span className="badge">{m.status.replace("_", " ")}</span></span></div>
          {m.submissions.map((s: any, i: number) => <div key={s.id} className="muted" style={{ marginTop: 6 }}>
            Submission #{m.submissions.length - i} - {new Date(s.createdAt).toLocaleString()} {s.fileUrl && <a href={s.fileUrl} target="_blank">[file]</a>} {s.codeLink && <a href={s.codeLink} target="_blank">[code]</a>} {s.notes && `- ${s.notes}`}
            {s.feedback.map((fb: any) => <div key={fb.id} style={{ marginLeft: 14, color: fb.revisionRequested ? "#b91c1c" : "#047857" }}>Feedback: {fb.comment}</div>)}
            {role !== "student" && i === 0 && <div className="row" style={{ marginTop: 6 }}><input placeholder="Comment" value={f["c" + s.id] || ""} onChange={set("c" + s.id)} style={{ maxWidth: 300 }} />
              <button className="btn sm green" onClick={() => act(g.id, { action: "review", submissionId: s.id, decision: "approve", comment: f["c" + s.id] })}>Approve</button>
              <button className="btn sm red" onClick={() => act(g.id, { action: "review", submissionId: s.id, decision: "revision", comment: f["c" + s.id] })}>Request revision</button></div>}</div>)}
          {role === "student" && m.status !== "APPROVED" && <div className="row" style={{ marginTop: 8 }}>
            <FileInput label="Attach file (PDF, ZIP, etc.)" value={f["f" + m.id]} onChange={(url) => setF({ ...f, ["f" + m.id]: url })} /><input placeholder="Code link" value={f["k" + m.id] || ""} onChange={set("k" + m.id)} style={{ maxWidth: 220 }} /><input placeholder="Notes" value={f["t" + m.id] || ""} onChange={set("t" + m.id)} style={{ maxWidth: 220 }} />
            <button className="btn sm" onClick={() => act(g.id, { action: "submit", milestoneId: m.id, fileUrl: f["f" + m.id], codeLink: f["k" + m.id], notes: f["t" + m.id] })}>Submit</button></div>}
        </div>)}
        {role !== "student" && <div className="row" style={{ marginTop: 10 }}><input placeholder="New milestone title" value={f["mt" + g.id] || ""} onChange={set("mt" + g.id)} style={{ maxWidth: 260 }} /><input type="date" value={f["md" + g.id] || ""} onChange={set("md" + g.id)} style={{ maxWidth: 170 }} />
          <button className="btn sm" onClick={() => act(g.id, { action: "milestone-create", title: f["mt" + g.id], dueDate: f["md" + g.id] })}>Add milestone</button></div>}
      </div>); })}
  </div>);
}
