"use client";
import { useState } from "react";
const MAX_MB = 25;
export default function FileInput({ value, onChange, label }: { value?: string; onChange: (url: string) => void; label: string }) {
  const [busy, setBusy] = useState(false); const [err, setErr] = useState(""); const [big, setBig] = useState(false);
  const uploaded = !!value && value.startsWith("/api/files/");
  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setErr(""); setBig(false);
    if (file.size > MAX_MB * 1024 * 1024) { setBig(true); e.target.value = ""; return; }
    setBusy(true);
    const fd = new FormData(); fd.append("file", file);
    const r = await fetch("/api/upload", { method: "POST", body: fd }); const d = await r.json();
    setBusy(false);
    if (r.ok) onChange(d.url); else setErr(d.error);
  }
  return (<div style={{ display: "inline-block", width: 270, marginRight: 10, verticalAlign: "top" }}>
    <div className="muted" style={{ fontSize: 12, marginBottom: 2 }}>{label} <span style={{ opacity: 0.7 }}>(max {MAX_MB} MB)</span></div>
    <input type="file" onChange={pick} accept=".pdf,.zip,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg" style={{ padding: 6 }} />
    {busy && <div className="muted" style={{ fontSize: 12 }}>Uploading...</div>}
    {big && <div className="err" style={{ marginTop: 4 }}>This file is larger than {MAX_MB} MB and cannot be uploaded here. Please upload it to Google Drive, set sharing to "Anyone with the link", and paste the link below.</div>}
    {err && <div className="err" style={{ marginTop: 4 }}>{err}</div>}
    <input type="text" placeholder="Or paste a Google Drive link" value={uploaded ? "" : value || ""} onChange={(e) => onChange(e.target.value.trim())} style={{ marginTop: 4 }} />
    {value && !busy && <div style={{ fontSize: 12, marginTop: 2 }}>{uploaded ? "Uploaded file" : "Link"} attached: <a href={value} target="_blank">view</a></div>}
  </div>);
}
