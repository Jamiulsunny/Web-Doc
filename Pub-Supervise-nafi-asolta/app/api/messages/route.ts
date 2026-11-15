import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { decrypt } from "@/lib/crypto";
export async function GET(req: Request) {
  const u = await getUser(); if (!u) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const groupId = new URL(req.url).searchParams.get("groupId") || "";
  const g = await prisma.projectGroup.findFirst({ where: { id: groupId, OR: [{ supervisorId: u.id }, { members: { some: { userId: u.id } } }] } });
  if (!g) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const msgs = await prisma.message.findMany({ where: { groupId }, include: { sender: { select: { id: true, name: true } } }, orderBy: { createdAt: "asc" }, take: 200 });
return NextResponse.json(msgs.map((m) => ({ ...m, body: decrypt(m.body) })));
}
