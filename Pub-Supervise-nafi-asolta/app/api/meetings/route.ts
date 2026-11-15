import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { notifyCreate } from "@/lib/notify";
const bad = (e: string, s = 400) => NextResponse.json({ error: e }, { status: s });
async function access(u: any, groupId: string) {
  const g = await prisma.projectGroup.findUnique({ where: { id: groupId }, include: { members: true } });
  if (!g) return null;
  const isSup = g.supervisorId === u.id || (u.roles as string[]).includes("COORDINATOR");
  const isMember = g.members.some((m) => m.userId === u.id);
  return isSup || isMember ? { g, isSup } : null;
}
export async function GET(req: Request) {
  const u = await getUser(); if (!u) return bad("Unauthorized", 401);
  const groupId = new URL(req.url).searchParams.get("groupId") || "";
  if (!(await access(u, groupId))) return bad("Forbidden", 403);
  return NextResponse.json(await prisma.meeting.findMany({ where: { groupId }, include: { actionItems: true }, orderBy: { scheduledAt: "desc" } }));
}
export async function POST(req: Request) {
  const u = await getUser(); if (!u) return bad("Unauthorized", 401);
  const b = await req.json();
  if (b.action === "create") {
    const a = await access(u, b.groupId); if (!a?.isSup) return bad("Forbidden", 403);
    if (!b.scheduledAt) return bad("Date and time are required.");
    await prisma.meeting.create({ data: { groupId: b.groupId, scheduledAt: new Date(b.scheduledAt), agenda: b.agenda } });
    for (const m of await prisma.groupMember.findMany({ where: { groupId: b.groupId } })) await notifyCreate({ data: { userId: m.userId, message: `Meeting scheduled for ${new Date(b.scheduledAt).toLocaleString()}` } });
    return NextResponse.json({ ok: true });
  }
  const meeting = b.meetingId ? await prisma.meeting.findUnique({ where: { id: b.meetingId } }) : null;
  if (b.action === "log") {
    if (!meeting) return bad("Not found", 404);
    const a = await access(u, meeting.groupId); if (!a?.isSup) return bad("Forbidden", 403);
    await prisma.$transaction([
      prisma.meeting.update({ where: { id: meeting.id }, data: { minutes: b.minutes } }),
      ...(b.actionItems || []).filter((i: any) => i.task && i.assignee).map((i: any) => prisma.actionItem.create({ data: { meetingId: meeting.id, task: i.task, assignee: i.assignee, dueDate: i.dueDate ? new Date(i.dueDate) : null } })),
    ]);
    return NextResponse.json({ ok: true });
  }
  if (b.action === "delete" || b.action === "edit") {
    if (!meeting) return bad("Not found", 404);
    const a = await access(u, meeting.groupId); if (!a?.isSup) return bad("Forbidden", 403);
    if (b.action === "delete") await prisma.$transaction([prisma.actionItem.deleteMany({ where: { meetingId: meeting.id } }), prisma.meeting.delete({ where: { id: meeting.id } })]);
    else await prisma.meeting.update({ where: { id: meeting.id }, data: { ...(b.scheduledAt ? { scheduledAt: new Date(b.scheduledAt) } : {}), ...(b.agenda !== undefined ? { agenda: b.agenda } : {}) } });
    return NextResponse.json({ ok: true });
  }
  if (b.action === "toggle") {
    const item = await prisma.actionItem.findUnique({ where: { id: b.itemId }, include: { meeting: true } });
    if (!item || !(await access(u, item.meeting.groupId))) return bad("Forbidden", 403);
    await prisma.actionItem.update({ where: { id: item.id }, data: { done: !item.done } });
    return NextResponse.json({ ok: true });
  }
  return bad("Unknown action.");
}
