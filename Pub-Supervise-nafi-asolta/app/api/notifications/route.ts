import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
export async function GET() {
  const u = await getUser(); if (!u) return NextResponse.json([], { status: 401 });
  return NextResponse.json(await prisma.notification.findMany({ where: { userId: u.id }, orderBy: { createdAt: "desc" }, take: 20 }));
}
export async function PATCH() {
  const u = await getUser(); if (!u) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await prisma.notification.updateMany({ where: { userId: u.id, read: false }, data: { read: true } });
  return NextResponse.json({ ok: true });
}
