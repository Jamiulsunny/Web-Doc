import { safeUrl } from "@/lib/url";
import { notifyCreate } from "@/lib/notify";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
const include: any = { group: { select: { id: true, title: true, supervisor: { select: { name: true } }, members: { include: { user: { select: { name: true } } } } } } };
export async function GET(req: Request) {
  const u = await getUser(); if (!u) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const as = new URL(req.url).searchParams.get("as"); const roles = u.roles as string[];
  let where: any;
  if (as === "student" && roles.includes("STUDENT")) where = { group: { members: { some: { userId: u.id } } } };
  else if (as === "supervisor" && roles.includes("SUPERVISOR")) where = { group: { supervisorId: u.id } };
  else if (as === "coordinator" && roles.includes("COORDINATOR")) where = {};
  else return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json(await prisma.journalSubmission.findMany({ where, include, orderBy: { createdAt: "desc" } }));
}
export async function POST(req: Request) {
  const u = await getUser(); if (!u || !(u.roles as string[]).includes("STUDENT")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json();
  const g = await prisma.projectGroup.findFirst({ where: { members: { some: { userId: u.id } } }, include: { defense: { include: { evaluations: true } }, journal: true } });
  if (!g) return NextResponse.json({ error: "You do not have a project group." }, { status: 400 });
  if (!g.defense || !g.defense.evaluations.length) return NextResponse.json({ error: "You can request journal publication only after your final defense has been evaluated." }, { status: 400 });
  if (g.journal.some((j) => j.status !== "REJECTED")) return NextResponse.json({ error: "A journal request already exists for your group." }, { status: 409 });
  if (!b.abstract || !safeUrl(b.thesisUrl)) return NextResponse.json({ error: "Abstract and thesis link are required." }, { status: 400 });
  const tags = String(b.tags || "").split(",").map((t) => t.trim()).filter(Boolean);
  await prisma.journalSubmission.create({ data: { groupId: g.id, abstract: b.abstract, thesisUrl: safeUrl(b.thesisUrl)!, repoUrl: safeUrl(b.repoUrl), paperUrl: safeUrl(b.paperUrl), tags } });
  if (g.supervisorId) await notifyCreate({ data: { userId: g.supervisorId, message: `Journal request: ${g.title}` } });
  return NextResponse.json({ ok: true });
}
