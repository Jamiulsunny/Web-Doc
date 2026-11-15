import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createSession, panelFor } from "@/lib/auth";
export async function POST(req: Request) {
  const { email, password } = await req.json();
  const id = String(email || "").toLowerCase().trim();
  // Faculty log in with their username; students and the coordinator can use email or username.
  const u = await prisma.user.findFirst({ where: { OR: [{ username: id }, { email: id, roles: { hasSome: ["STUDENT", "COORDINATOR"] } }] } });
  if (!u || !(await bcrypt.compare(String(password || ""), u.passwordHash)))
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  if (u.status === "DEACTIVATED") return NextResponse.json({ error: "Your account has been deactivated. Please contact the department coordinator." }, { status: 403 });
  if (u.status === "PENDING_APPROVAL") return NextResponse.json({ error: "Your account is awaiting coordinator approval." }, { status: 403 });
  if (u.status === "REJECTED") return NextResponse.json({ error: "Your registration was not approved. Please contact the coordinator." }, { status: 403 });
  await createSession(u.id);
  const roles = u.roles as string[];
  return NextResponse.json({ ok: true, redirect: u.mustChangePassword ? "/account/password" : roles.length === 1 ? panelFor[roles[0]] : "/dashboard" });
}
