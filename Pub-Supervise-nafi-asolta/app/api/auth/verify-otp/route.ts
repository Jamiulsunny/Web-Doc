import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
export async function POST(req: Request) {
  const { email, otp } = await req.json();
  const mail = String(email || "").toLowerCase().trim();
  const p = await prisma.pendingRegistration.findUnique({ where: { email: mail } });
  if (!p || p.expiresAt < new Date()) return NextResponse.json({ error: "Code expired. Please register again." }, { status: 400 });
  if (p.attempts >= 5) return NextResponse.json({ error: "Too many attempts. Please register again." }, { status: 429 });
  if (!(await bcrypt.compare(String(otp), p.otpHash))) {
    await prisma.pendingRegistration.update({ where: { email: mail }, data: { attempts: { increment: 1 } } });
    return NextResponse.json({ error: "Incorrect code." }, { status: 400 });
  }
  await prisma.$transaction([
    prisma.user.create({ data: { name: p.name, email: mail, phone: p.phone, studentId: p.studentId, passwordHash: p.passwordHash, roles: ["STUDENT"], status: "PENDING_APPROVAL" } }),
    prisma.pendingRegistration.delete({ where: { email: mail } }),
  ]);
  return NextResponse.json({ ok: true });
}
