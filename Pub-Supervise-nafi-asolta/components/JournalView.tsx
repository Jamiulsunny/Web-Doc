"use client";
import { useEffect, useState } from "react";
import FileInput from "./FileInput";
const api = (url: string, method = "GET", body?: any) => fetch(url, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined }).then(async (r) => { const d = await r.json(); return Array.isArray(d) ? d : { ok: r.ok, ...d }; });
export default function JournalView({ role }: { role: "student" | "supervisor" | "coordinator" }) {
  const [list, setList] = useState<any[]>([]); const [f, setF] = useState<any>({}); const [err, setErr] = useState("");
  const load = async () => { const r: any = await api(`/api/journal?as=${role}`); if (Array.isArray(r)) setList(r); };
  useEffect(() => { load(); }, []);
  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value });
  const go = async (url: string, method: string, body: any) => { const r: any = await api(url, method, body); setErr(r.ok ? "" : r.error); if (r.ok) { setF({}); load(); } };
  const form = (onSubmit: () => void, label: string) => <div style={{ marginTop: 10 }}>
    <textarea className="card" style={{ width: "100%", marginBottom: 8 }} placeholder="Abstract" value={f.abstract || ""} onChange={set("abstract")} />
    <div className="row"><FileInput label="Thesis book (PDF)" value={f.thesisUrl} onChange={(url) => setF({ ...f, thesisUrl: url })} /><input placeholder="Source code repository link" value={f.repoUrl || ""} onChange={set("repoUrl")} style={{ maxWidth: 240 }} />
      <FileInput label="Research paper (PDF)" value={f.paperUrl} onChange={(url) => setF({ ...f, paperUrl: url })} /><input placeholder="Tags (React, Machine Learning)" value={f.tags || ""} onChange={set("tags")} style={{ maxWidth: 280 }} /></div>
    <button className="btn" style={{ marginTop: 10 }} onClick={onSubmit}>{label}</button></div>;
  return (<div className="wrap"><h1>{role === "student" ? "Journal publication request" : "Journal portal reviews"}</h1>{err && <div className="err">{err}</div>}
    {role === "student" && list.filter((j) => j.status !== "REJECTED").length === 0 && <div className="card" style={{ marginTop: 16 }}><h3>Request publication</h3><p className="muted">Available after your final defense has been evaluated.</p>{form(() => go("/api/journal", "POST", f), "Send request")}</div>}
    {list.length === 0 && <p className="muted">No journal requests.</p>}
    {list.map((j) => <div className="card" key={j.id} style={{ marginTop: 16 }}>
      <div className="row" style={{ justifyContent: "space-between" }}><h3>{j.group.title}</h3><span className="badge">{j.status.replace("_", " ")}</span></div>
      <p>{j.abstract}</p><p className="muted">{j.tags.join(", ")} | <a href={j.thesisUrl} target="_blank">Thesis</a> {j.repoUrl && <a href={j.repoUrl} target="_blank">Code</a>} {j.paperUrl && <a href={j.paperUrl} target="_blank">Paper</a>} {j.citationCode && `| ${j.citationCode}`}</p>
      {j.supervisorNote && <div className="err">Note: {j.supervisorNote}</div>}
      {role === "student" && j.status === "REVISION_REQUESTED" && form(() => go(`/api/journal/${j.id}`, "PATCH", { action: "resubmit", ...f }), "Resubmit with corrections")}
      {((role === "supervisor" && j.status === "SUBMITTED") || (role === "coordinator" && j.status === "SUPERVISOR_APPROVED")) && <div className="row" style={{ marginTop: 10 }}>
        <input placeholder="Note / required corrections" value={f["n" + j.id] || ""} onChange={set("n" + j.id)} style={{ maxWidth: 320 }} />
        {role === "supervisor" ? <><button className="btn sm green" onClick={() => go(`/api/journal/${j.id}`, "PATCH", { action: "sup-approve", note: f["n" + j.id] })}>Approve</button><button className="btn sm red" onClick={() => go(`/api/journal/${j.id}`, "PATCH", { action: "sup-revision", note: f["n" + j.id] })}>Send back for correction</button></>
          : <><button className="btn sm green" onClick={() => go(`/api/journal/${j.id}`, "PATCH", { action: "publish" })}>Approve and publish</button><button className="btn sm ghost" onClick={() => go(`/api/journal/${j.id}`, "PATCH", { action: "revision", note: f["n" + j.id] })}>Request revision</button><button className="btn sm red" onClick={() => go(`/api/journal/${j.id}`, "PATCH", { action: "reject", note: f["n" + j.id] })}>Reject</button></>}</div>}
    </div>)}
  </div>);
}
