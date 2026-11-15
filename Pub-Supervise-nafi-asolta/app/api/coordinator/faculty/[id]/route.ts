import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await requireRole("COORDINATOR"))) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const b = await req.json();
  const data: any = {};
  if (b.status === "ACTIVE" || b.status === "DEACTIVATED") data.status = b.status;
  if (Array.isArray(b.roles)) {
    const r = b.roles.filter((x: string) => ["SUPERVISOR", "BOARD_MEMBER"].includes(x));
    if (!r.length) return NextResponse.json({ error: "At least one role is required." }, { status: 400 });
    data.roles = r;
  }
  if (typeof b.maxGroups === "number") data.maxGroups = Math.max(0, Math.min(20, b.maxGroups));
  await prisma.user.update({ where: { id: params.id }, data });
  return NextResponse.json({ ok: true });
}
