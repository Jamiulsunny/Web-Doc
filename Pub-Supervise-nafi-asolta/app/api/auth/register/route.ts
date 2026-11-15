import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendOtp } from "@/lib/mail";
export async function POST(req: Request) {
  const { name, email, phone, studentId, password } = await req.json();
  if (!name || !email || !phone || !studentId || !password || password.length < 8)
    return NextResponse.json({ error: "All fields are required and the password needs at least 8 characters." }, { status: 400 });
  const mail = String(email).toLowerCase().trim();
  if (await prisma.user.findFirst({ where: { OR: [{ email: mail, roles: { has: "STUDENT" } }, { studentId }] } }))
    return NextResponse.json({ error: "An account with this email or student ID already exists." }, { status: 409 });
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const data = { name, phone, studentId, passwordHash: await bcrypt.hash(password, 10), otpHash: await bcrypt.hash(otp, 8), expiresAt: new Date(Date.now() + 10 * 60000), attempts: 0 };
  await prisma.pendingRegistration.upsert({ where: { email: mail }, update: data, create: { email: mail, ...data } });
  try { await sendOtp(mail, otp); } catch { return NextResponse.json({ error: "Could not send the verification email. Check SMTP settings." }, { status: 500 }); }
  return NextResponse.json({ ok: true });
}
