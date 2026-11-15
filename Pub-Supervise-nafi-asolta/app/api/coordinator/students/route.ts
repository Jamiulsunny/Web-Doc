import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
const sel = { id: true, name: true, email: true, phone: true, studentId: true, status: true, createdAt: true };
export async function GET() {
  if (!(await requireRole("COORDINATOR"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json(await prisma.user.findMany({ where: { roles: { has: "STUDENT" } }, select: sel, orderBy: { createdAt: "desc" } }));
}
export async function PATCH(req: Request) {
  if (!(await requireRole("COORDINATOR"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id, action } = await req.json();
  const status = action === "approve" ? "ACTIVE" : action === "reject" ? "REJECTED" : action === "deactivate" ? "DEACTIVATED" : null;
  if (!status) return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  await prisma.user.update({ where: { id }, data: { status } });
  return NextResponse.json({ ok: true });
}
