import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
export async function POST(req: Request) {
  const u = await getUser(); if (!u) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { current, next } = await req.json();
  if (!(await bcrypt.compare(String(current || ""), u.passwordHash))) return NextResponse.json({ error: "Current password is incorrect." }, { status: 400 });
  if (String(next || "").length < 8) return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });
  await prisma.user.update({ where: { id: u.id }, data: { passwordHash: await bcrypt.hash(next, 10), mustChangePassword: false } });
  return NextResponse.json({ ok: true });
}
