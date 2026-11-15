"use client";
import { useState } from "react";
export default function Forgot() {
  const [step, setStep] = useState(1); const [f, setF] = useState({ identifier: "", otp: "", next: "" }); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  async function post(url: string, body: any) { setBusy(true); setErr(""); const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); const d = await r.json(); setBusy(false); if (!r.ok) { setErr(d.error); return false; } return true; }
  return (<div className="auth"><div className="card"><img className="logo" src="/logo.png" alt="PUB" /><h2>Reset password</h2>
    {step === 1 && <form onSubmit={async (e) => { e.preventDefault(); if (await post("/api/auth/forgot", { identifier: f.identifier })) setStep(2); }}><div className="muted">Enter your email (students) or username (faculty). A code will be sent to your registered email.</div>
      <label>Email or username</label><input required value={f.identifier} onChange={(e) => setF({ ...f, identifier: e.target.value })} />{err && <div className="err">{err}</div>}<button className="btn" style={{ width: "100%", marginTop: 18 }} disabled={busy}>Send code</button></form>}
    {step === 2 && <form onSubmit={async (e) => { e.preventDefault(); if (await post("/api/auth/reset", f)) setStep(3); }}><div className="muted">Enter the 6-digit code and your new password.</div>
      <label>Code</label><input required maxLength={6} value={f.otp} onChange={(e) => setF({ ...f, otp: e.target.value })} />
      <label>New password (min 8 characters)</label><input type="password" minLength={8} required value={f.next} onChange={(e) => setF({ ...f, next: e.target.value })} />{err && <div className="err">{err}</div>}<button className="btn" style={{ width: "100%", marginTop: 18 }} disabled={busy}>Reset password</button></form>}
    {step === 3 && <div><div className="ok">Password updated.</div><a className="btn" style={{ marginTop: 16 }} href="/login">Log in</a></div>}</div></div>);
}
