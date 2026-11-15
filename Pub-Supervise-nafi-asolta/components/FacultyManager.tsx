"use client";
import { useEffect, useState } from "react";
const call = (url: string, method = "GET", body?: any) => fetch(url, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined }).then(async (r) => { const d = await r.json(); return Array.isArray(d) ? d : { ok: r.ok, ...d }; });
const tog = (r: string, a: string[]) => (a.includes(r) ? a.filter((x) => x !== r) : [...a, r]);
export default function FacultyManager() {
  const [list, setList] = useState<any[]>([]); const [q, setQ] = useState(""); const [msg, setMsg] = useState<any>(null);
  const [roles, setRoles] = useState<Record<string, string[]>>({}); const [all, setAll] = useState(""); const [bulk, setBulk] = useState(""); const [nf, setNf] = useState<any>({});
  const load = async () => { const r: any = await call("/api/coordinator/faculty"); if (Array.isArray(r)) setList(r); };
  useEffect(() => { load(); }, []);
  const run = async (url: string, method: string, body: any, okMsg?: string) => { const r: any = await call(url, method, body); setMsg(r.ok ? { t: "ok", m: r.warning || r.message || okMsg || "Done." } : { t: "err", m: r.error }); if (r.ok) load(); return r.ok; };
  const shown = list.filter((d) => (d.name + d.department + d.designation + (d.user?.username || "")).toLowerCase().includes(q.toLowerCase()));
  return (<>
    <div className="card" style={{ marginBottom: 16 }}><h3>Faculty email settings</h3><p className="muted">Credentials are sent to each faculty member's email below. Change one row, set one address for everyone (testing), or paste the real list.</p>
      <div className="row" style={{ margin: "10px 0" }}><input placeholder="One email for ALL faculty (test mode)" value={all} onChange={(e) => setAll(e.target.value)} style={{ maxWidth: 340 }} /><button className="btn sm" onClick={() => confirm("Replace the email of every faculty member?") && run("/api/coordinator/faculty/emails", "POST", { mode: "all", email: all })}>Apply to all</button></div>
      <textarea className="card" style={{ width: "100%" }} rows={3} placeholder={"Bulk update, one per line:\nName, email   (or Name, Department, email)"} value={bulk} onChange={(e) => setBulk(e.target.value)} />
      <button className="btn sm" style={{ marginTop: 8 }} onClick={async () => { if (await run("/api/coordinator/faculty/emails", "POST", { mode: "bulk", text: bulk })) setBulk(""); }}>Update from list</button></div>
    <details className="card" style={{ marginBottom: 16 }}><summary style={{ cursor: "pointer", fontWeight: 600 }}>Add a faculty member who is not in the list</summary>
      <div className="row" style={{ marginTop: 10 }}>{[["name", "Name"], ["designation", "Designation"], ["department", "Department"], ["email", "Email"]].map(([k, p]) => <input key={k} placeholder={p} value={nf[k] || ""} onChange={(e) => setNf({ ...nf, [k]: e.target.value })} style={{ maxWidth: 200 }} />)}
        <button className="btn sm" onClick={async () => { if (await run("/api/coordinator/faculty", "POST", nf, "Faculty added to the list.")) setNf({}); }}>Add</button></div></details>
    {msg && <div className={msg.t === "ok" ? "ok" : "err"} style={{ marginBottom: 12 }}>{msg.m}</div>}
    <div className="card"><input placeholder="Search by name, department, designation or username" value={q} onChange={(e) => setQ(e.target.value)} style={{ marginBottom: 12 }} />
      <div style={{ overflowX: "auto" }}><table><thead><tr><th>Name</th><th>Department</th><th>Email</th><th>Account</th><th>Access</th><th>Max</th><th></th></tr></thead><tbody>
        {shown.map((d) => {
          const u = d.user; const r = roles[d.id] || ["SUPERVISOR"];
          return (<tr key={d.id}><td>{d.name}<div className="muted" style={{ fontSize: 12 }}>{d.designation}</div></td><td>{d.department}</td>
            <td style={{ minWidth: 220 }}><input defaultValue={d.email} key={d.email} onBlur={(e) => e.target.value !== d.email && run("/api/coordinator/faculty/emails", "POST", { mode: "one", id: d.id, email: e.target.value })} /></td>
            <td>{u ? <><b>{u.username}</b> <span className={"badge " + u.status}>{u.status}</span></> : <span className="muted">No account</span>}</td>
            <td><div className="row">{["SUPERVISOR", "BOARD_MEMBER"].map((x) => <label key={x} className="chk"><input type="checkbox" checked={(u ? u.roles : r).includes(x)} onChange={() => { if (!u) return setRoles({ ...roles, [d.id]: tog(x, r) }); const n = tog(x, u.roles.filter((y: string) => y !== "COORDINATOR")); if (n.length) run(`/api/coordinator/faculty/${u.id}`, "PATCH", { roles: n }); }} />{x === "SUPERVISOR" ? "Supervisor" : "Board"}</label>)}</div></td>
            <td style={{ width: 70 }}>{u && <input type="number" min={0} defaultValue={u.maxGroups} onBlur={(e) => run(`/api/coordinator/faculty/${u.id}`, "PATCH", { maxGroups: Number(e.target.value) })} />}</td>
            <td>{!u ? <button className="btn sm" onClick={() => run("/api/coordinator/faculty", "POST", { directoryId: d.id, roles: r }, "Account created and credentials emailed.")}>Create account</button>
              : u.status === "ACTIVE" ? <button className="btn sm red" onClick={() => run(`/api/coordinator/faculty/${u.id}`, "PATCH", { status: "DEACTIVATED" })}>Deactivate</button>
                : <button className="btn sm green" onClick={() => run(`/api/coordinator/faculty/${u.id}`, "PATCH", { status: "ACTIVE" })}>Activate Account</button>}</td></tr>);
        })}
      </tbody></table></div></div></>);
}
