"use client";
import { useEffect, useState } from "react";
import FileInput from "./FileInput";
const api = (url: string, method = "GET", body?: any) => fetch(url, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined }).then(async (r) => ({ ok: r.ok, ...(await r.json()) }));
export default function DefenseView({ role }: { role: "student" | "board" | "coordinator" }) {
  const [d, setD] = useState<any>({ defenses: [], rubric: [] }); const [groups, setGroups] = useState<any[]>([]);
  const [f, setF] = useState<any>({}); const [err, setErr] = useState("");
  const load = async () => {
    const r: any = await api(`/api/defense?as=${role}`); if (r.defenses) setD(r);
    if (role === "coordinator") { const g: any = await api("/api/groups?as=coordinator"); setGroups(g.groups || []); }
  };
  useEffect(() => { load(); }, []);
  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value });
  const go = async (url: string, method: string, body: any) => { const r: any = await api(url, method, body); setErr(r.ok ? "" : r.error); if (r.ok) load(); };
  const link = (l: string, u?: string) => u ? <a href={u} target="_blank" style={{ marginRight: 10 }}>{l}</a> : <span className="muted" style={{ marginRight: 10 }}>{l}: missing</span>;
  return (<div className="wrap"><h1>{role === "board" ? "Defense evaluation" : role === "coordinator" ? "Defense scheduling and results" : "My defense"}</h1>{err && <div className="err">{err}</div>}{role === "coordinator" && <a className="btn ghost sm" href="/api/defense/export">Export results (CSV)</a>}
    {role === "coordinator" && <form className="card" style={{ margin: "16px 0" }} onSubmit={(e) => { e.preventDefault(); go("/api/defense", "POST", { groupId: f.groupId, scheduledAt: f.at, venue: f.venue, examinerIds: f.ex || [] }); }}><h3>Schedule a defense</h3>
      <div className="row"><select required value={f.groupId || ""} onChange={set("groupId")} style={{ maxWidth: 320 }}><option value="">Select project group</option>{groups.map((g) => <option key={g.id} value={g.id}>{g.title}</option>)}</select>
        <input type="datetime-local" required value={f.at || ""} onChange={set("at")} style={{ maxWidth: 220 }} /><input placeholder="Venue" value={f.venue || ""} onChange={set("venue")} style={{ maxWidth: 220 }} /><button className="btn">Save schedule</button></div>
      <div className="row" style={{ marginTop: 10 }}><span className="muted">Examiners:</span>{(d.boardMembers || []).map((b: any) => <label key={b.id} className="chk"><input type="checkbox" checked={(f.ex || []).includes(b.id)} onChange={() => setF({ ...f, ex: (f.ex || []).includes(b.id) ? f.ex.filter((x: string) => x !== b.id) : [...(f.ex || []), b.id] })} />{b.name}</label>)}</div></form>}
    {d.defenses.length === 0 && <p className="muted">No defenses scheduled.</p>}
    {d.defenses.map((x: any) => { const mine = x.evaluations[0]; const avg = x.evaluations.length ? (x.evaluations.reduce((s: number, e: any) => s + e.total, 0) / x.evaluations.length).toFixed(1) : null;
      return (<div className="card" key={x.id} style={{ marginTop: 16 }}>
        <div className="row" style={{ justifyContent: "space-between" }}><h3>{x.group.title}</h3><span className="badge">{new Date(x.scheduledAt).toLocaleString()} {x.venue && `| ${x.venue}`}</span></div>
        <p className="muted">Team: {x.group.members.map((m: any) => `${m.user.name} (${m.user.studentId})`).join(", ")}</p>
        <p>{link("Plagiarism report", x.plagiarismReportUrl)}{link("Code", x.codeUrl)}{link("Poster", x.posterUrl)}{link("Thesis book", x.thesisUrl)}</p>
        {role === "student" && <div className="row">{[["plagiarismReportUrl", "Plagiarism report", "file"], ["codeUrl", "Code repository link", "link"], ["posterUrl", "Poster", "file"], ["thesisUrl", "Thesis book", "file"]].map(([k, label, type]) => type === "file"
  ? <FileInput key={k} label={label} value={f[x.id + k] ?? x[k]} onChange={(url) => setF({ ...f, [x.id + k]: url })} />
  : <input key={k} placeholder={label} defaultValue={x[k] || ""} onChange={(e) => setF({ ...f, [x.id + k]: e.target.value })} style={{ maxWidth: 230 }} />)}
          <button className="btn sm" onClick={() => go(`/api/defense/${x.id}`, "PATCH", { action: "materials", ...Object.fromEntries(["plagiarismReportUrl", "codeUrl", "posterUrl", "thesisUrl"].map((k) => [k, f[x.id + k] ?? x[k]])) })}>Save materials</button></div>}
        {role === "coordinator" && <div><b>Average: {avg ?? "no evaluations yet"}</b>{x.evaluations.map((e: any) => <div key={e.id} className="muted">{e.examiner.name}: {e.total}/100 {e.remarks && `- ${e.remarks}`}</div>)}</div>}
        {role === "board" && <div><table><thead><tr><th>Criterion</th><th>Max</th><th>Score</th></tr></thead><tbody>{d.rubric.map((c: any) => <tr key={c.key}><td>{c.label}</td><td>{c.max}</td>
          <td style={{ width: 100 }}><input type="number" min={0} max={c.max} defaultValue={mine?.rubric?.[c.key]?.score ?? ""} onChange={(e) => setF({ ...f, [x.id + c.key]: e.target.value })} /></td></tr>)}</tbody></table>
          <input placeholder="Remarks" defaultValue={mine?.remarks || ""} onChange={(e) => setF({ ...f, [x.id + "r"]: e.target.value })} style={{ margin: "10px 0" }} />
          <button className="btn sm" onClick={() => go(`/api/defense/${x.id}`, "PATCH", { action: "evaluate", remarks: f[x.id + "r"] ?? mine?.remarks, scores: Object.fromEntries(d.rubric.map((c: any) => [c.key, f[x.id + c.key] ?? mine?.rubric?.[c.key]?.score])) })}>{mine ? "Update evaluation" : "Submit evaluation"} {mine && `(current ${mine.total}/100)`}</button></div>}
      </div>); })}
  </div>);
}
