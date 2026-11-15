"use client";
import { useState } from "react";
export default function Password() {
  const [f, setF] = useState({ current: "", next: "" }); const [msg, setMsg] = useState<any>(null);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/auth/change-password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) });
    const d = await r.json();
    if (r.ok) { setMsg({ ok: true, m: "Password updated. Redirecting..." }); setTimeout(() => (location.href = "/dashboard"), 1000); } else setMsg({ ok: false, m: d.error });
  }
  return (<div className="auth"><form className="card" onSubmit={submit}><h2>Change password</h2><div className="muted">Use the temporary password from your email as the current password.</div>
    <label>Current password</label><input type="password" required value={f.current} onChange={(e) => setF({ ...f, current: e.target.value })} />
    <label>New password (min 8 characters)</label><input type="password" minLength={8} required value={f.next} onChange={(e) => setF({ ...f, next: e.target.value })} />
    {msg && <div className={msg.ok ? "ok" : "err"}>{msg.m}</div>}<button className="btn" style={{ width: "100%", marginTop: 18 }}>Update password</button></form></div>);
}
