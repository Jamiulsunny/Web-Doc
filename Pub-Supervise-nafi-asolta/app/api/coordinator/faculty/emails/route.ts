import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
const valid = (e: string) => /^\S+@\S+\.\S+$/.test(e);
async function setEmail(id: string, email: string) {
  const d = await prisma.facultyDirectory.update({ where: { id }, data: { email } });
  if (d.userId) await prisma.user.update({ where: { id: d.userId }, data: { email } }); // keep the account's delivery email in sync
}
export async function POST(req: Request) {
  if (!(await requireRole("COORDINATOR"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json(); const bad = (m: string) => NextResponse.json({ error: m }, { status: 400 });
  if (b.mode === "one") { if (!valid(b.email)) return bad("Invalid email."); await setEmail(b.id, b.email.trim().toLowerCase()); return NextResponse.json({ ok: true }); }
  if (b.mode === "all") { // swap the single test address for everyone
    if (!valid(b.email)) return bad("Invalid email."); const e = b.email.trim().toLowerCase();
    await prisma.facultyDirectory.updateMany({ data: { email: e } }); await prisma.user.updateMany({ where: { facultyProfile: { isNot: null } }, data: { email: e } });
    return NextResponse.json({ ok: true, message: "All faculty emails updated." });
  }
  if (b.mode === "bulk") { // lines: Name, email  (or Name, Department, email)
    const all = await prisma.facultyDirectory.findMany(); let ok = 0; const miss: string[] = [];
    for (const line of String(b.text || "").split("\n").map((l) => l.trim()).filter(Boolean)) {
      const parts = line.split(/[,\t]/).map((x) => x.trim()); const email = parts[parts.length - 1].toLowerCase(), name = parts[0].toLowerCase(), dept = parts.length > 2 ? parts[1].toLowerCase() : null;
      const m = all.filter((d) => d.name.toLowerCase() === name && (!dept || d.department.toLowerCase() === dept));
      if (m.length !== 1 || !valid(email)) { miss.push(parts[0]); continue; }
      await setEmail(m[0].id, email); ok++;
    }
    return NextResponse.json({ ok: true, message: `${ok} updated.${miss.length ? " Not matched or invalid: " + miss.join("; ") : ""}` });
  }
  return bad("Unknown mode.");
}
