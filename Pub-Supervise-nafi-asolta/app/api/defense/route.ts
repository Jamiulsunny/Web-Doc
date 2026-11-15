import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { RUBRIC } from "@/lib/rubric";
import { notifyMembers, notifyCreate } from "@/lib/notify";
const include: any = { group: { select: { id: true, title: true, members: { include: { user: { select: { name: true, studentId: true } } } } } }, evaluations: { include: { examiner: { select: { name: true } } } } };
export async function GET(req: Request) {
  const u = await getUser(); if (!u) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const as = new URL(req.url).searchParams.get("as");
  const roles = u.roles as string[];
  let where: any;
  if (as === "coordinator" && roles.includes("COORDINATOR")) where = {};
  else if (as === "board" && roles.includes("BOARD_MEMBER")) where = { examinerIds: { has: u.id } };
  else if (as === "student" && roles.includes("STUDENT")) where = { group: { members: { some: { userId: u.id } } } };
  else return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const defenses = await prisma.defense.findMany({ where, include, orderBy: { scheduledAt: "asc" } });
  // Board members see only their own evaluation; students see no scores.
  const out = defenses.map((d: any) => as === "coordinator" ? d : as === "board" ? { ...d, evaluations: d.evaluations.filter((e: any) => e.examinerId === u.id) } : { ...d, evaluations: [] });
  const boardMembers = as === "coordinator" ? await prisma.user.findMany({ where: { roles: { has: "BOARD_MEMBER" }, status: "ACTIVE" }, select: { id: true, name: true } }) : [];
  return NextResponse.json({ defenses: out, rubric: RUBRIC, boardMembers });
}
export async function POST(req: Request) {
  const u = await getUser(); if (!u || !(u.roles as string[]).includes("COORDINATOR")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { groupId, scheduledAt, venue, examinerIds } = await req.json();
  if (!groupId || !scheduledAt) return NextResponse.json({ error: "Group and date/time are required." }, { status: 400 });
  const data = { scheduledAt: new Date(scheduledAt), venue, examinerIds: Array.isArray(examinerIds) ? examinerIds : [] };
  await prisma.defense.upsert({ where: { groupId }, update: data, create: { groupId, ...data } });
  const when = new Date(scheduledAt).toLocaleString();
  await notifyMembers(groupId, `Your defense is scheduled for ${when}${venue ? " at " + venue : ""}`);
  for (const id of data.examinerIds) await notifyCreate({ data: { userId: id, message: `You are assigned as an examiner for a defense on ${when}` } });
  return NextResponse.json({ ok: true });
}
