import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { sendCredentials } from "@/lib/mail";
import { makeUsername } from "@/lib/username";
export async function GET() {
  if (!(await requireRole("COORDINATOR"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json(await prisma.facultyDirectory.findMany({ include: { user: { select: { id: true, username: true, roles: true, status: true, maxGroups: true } } }, orderBy: [{ department: "asc" }, { name: "asc" }] }));
}
export async function POST(req: Request) {
  if (!(await requireRole("COORDINATOR"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json();
  if (!b.directoryId) { // add a faculty member who is not in the official list yet
    if (!b.name || !b.department || !/^\S+@\S+\.\S+$/.test(b.email || "")) return NextResponse.json({ error: "Name, department and a valid email are required." }, { status: 400 });
    try { await prisma.facultyDirectory.create({ data: { name: b.name.trim(), department: b.department.trim(), designation: (b.designation || "").trim(), email: b.email.trim().toLowerCase() } }); }
    catch { return NextResponse.json({ error: "This faculty member already exists in the list." }, { status: 409 }); }
    return NextResponse.json({ ok: true });
  }
  const roles = (b.roles || []).filter((x: string) => ["SUPERVISOR", "BOARD_MEMBER"].includes(x));
  if (!roles.length) return NextResponse.json({ error: "Select at least one role." }, { status: 400 });
  const d = await prisma.facultyDirectory.findUnique({ where: { id: b.directoryId } });
  if (!d) return NextResponse.json({ error: "Faculty member not found." }, { status: 404 });
  if (d.userId) return NextResponse.json({ error: "Account already exists for this faculty member. Edit access or re-activate it instead." }, { status: 409 });
  const pw = crypto.randomBytes(6).toString("base64url"), username = await makeUsername(d.name);
  await prisma.user.create({ data: { name: d.name, email: d.email, username, roles, status: "ACTIVE", mustChangePassword: true, passwordHash: await bcrypt.hash(pw, 10), facultyProfile: { connect: { id: d.id } } } });
  try { await sendCredentials(d.email, d.name, username, pw); } catch { return NextResponse.json({ ok: true, warning: `Account created (username: ${username}) but the email could not be sent.` }); }
  return NextResponse.json({ ok: true, username });
}
