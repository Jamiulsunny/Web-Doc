import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { findByIdentifier } from "@/lib/auth";
export async function POST(req: Request) {
  const { identifier, otp, next } = await req.json();
  const fail = (m: string) => NextResponse.json({ error: m }, { status: 400 });
  if (String(next || "").length < 8) return fail("New password must be at least 8 characters.");
  const u = await findByIdentifier(identifier);
  const r = u && (await prisma.passwordReset.findUnique({ where: { userId: u.id } }));
  if (!u || !r || r.expiresAt < new Date() || r.attempts >= 5) return fail("Code expired or invalid. Request a new one.");
  if (!(await bcrypt.compare(String(otp), r.otpHash))) { await prisma.passwordReset.update({ where: { userId: u.id }, data: { attempts: { increment: 1 } } }); return fail("Incorrect code."); }
  await prisma.$transaction([prisma.user.update({ where: { id: u.id }, data: { passwordHash: await bcrypt.hash(next, 10), mustChangePassword: false } }), prisma.passwordReset.delete({ where: { userId: u.id } })]);
  return NextResponse.json({ ok: true });
}
