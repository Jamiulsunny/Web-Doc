import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { notifyCreate } from "@/lib/notify";
const include: any = {
  members: { include: { user: { select: { id: true, name: true, studentId: true } } } },
  supervisor: { select: { id: true, name: true } },
  proposals: { include: { versions: { orderBy: { version: "desc" } } } },
  milestones: { orderBy: { dueDate: "asc" }, include: { submissions: { orderBy: { createdAt: "desc" }, include: { feedback: { orderBy: { createdAt: "asc" } } } } } },
};
export async function GET(req: Request) {
  const u = await getUser(); if (!u) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const as = new URL(req.url).searchParams.get("as") || "student";
  const roles = u.roles as string[];
  const map: any = { coordinator: ["COORDINATOR", {}], supervisor: ["SUPERVISOR", { supervisorId: u.id }], student: ["STUDENT", { members: { some: { userId: u.id } } }] };
  const m = map[as];
  if (!m || !roles.includes(m[0])) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const groups = await prisma.projectGroup.findMany({ where: m[1], include, orderBy: { createdAt: "desc" } });
  if (as === "student") for (const g of groups as any[]) for (const m of g.milestones) if (m.dueDate < new Date() && ["PENDING", "REVISION_REQUESTED"].includes(m.status)) {
    const message = `Overdue: ${m.title} (${g.title})`;
    if (!(await prisma.notification.findFirst({ where: { userId: u.id, message } }))) await notifyCreate({ data: { userId: u.id, message } });
  }
  const supervisors = await prisma.user.findMany({ where: { roles: { has: "SUPERVISOR" }, status: "ACTIVE" }, select: { id: true, name: true, maxGroups: true, _count: { select: { supervised: true } } } });
  return NextResponse.json({ groups, supervisors });
}
export async function POST(req: Request) {
  const u = await getUser(); if (!u || !(u.roles as string[]).includes("STUDENT")) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { title, abstract, scope, preferredSupervisor, members } = await req.json();
  if (!title || !abstract || !scope) return NextResponse.json({ error: "Title, abstract and scope are required." }, { status: 400 });
  const ids = Array.from(new Set<string>((members || []).map((s: string) => s.trim()).filter(Boolean)));
  const found = await prisma.user.findMany({ where: { studentId: { in: ids }, status: "ACTIVE" } });
  if (found.length !== ids.length) return NextResponse.json({ error: "Some member student IDs were not found or are not active." }, { status: 400 });
  const all = [u, ...found.filter((f) => f.id !== u.id)];
  if (await prisma.groupMember.findFirst({ where: { userId: { in: all.map((a) => a.id) } } }))
    return NextResponse.json({ error: "You or a listed member already belongs to a group." }, { status: 409 });
  const g = await prisma.projectGroup.create({ data: {
    title, abstract, members: { create: all.map((a) => ({ userId: a.id })) },
    proposals: { create: { preferredSupervisor, versions: { create: { version: 1, title, abstract, scope, createdBy: u.id, note: "Initial submission" } } } },
  } });
  return NextResponse.json({ ok: true, id: g.id });
}
