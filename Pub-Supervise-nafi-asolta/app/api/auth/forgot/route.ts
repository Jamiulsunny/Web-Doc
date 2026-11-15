import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { findByIdentifier } from "@/lib/auth";
import { sendOtp } from "@/lib/mail";
export async function POST(req: Request) {
  const { identifier } = await req.json();
  const u = await findByIdentifier(identifier);
  if (u) {
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    const data = { otpHash: await bcrypt.hash(otp, 8), expiresAt: new Date(Date.now() + 10 * 60000), attempts: 0 };
    await prisma.passwordReset.upsert({ where: { userId: u.id }, update: data, create: { userId: u.id, ...data } });
    try { await sendOtp(u.email, otp); } catch {}
  }
  return NextResponse.json({ ok: true }); // same response whether or not the account exists
}
