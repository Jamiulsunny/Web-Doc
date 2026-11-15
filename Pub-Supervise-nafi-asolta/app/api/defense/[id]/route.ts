import { safeUrl } from "@/lib/url";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { RUBRIC } from "@/lib/rubric";
const bad = (e: string, s = 400) => NextResponse.json({ error: e }, { status: s });
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const u = await getUser(); if (!u) return bad("Unauthorized", 401);
  const b = await req.json(); const roles = u.roles as string[];
  const d = await prisma.defense.findUnique({ where: { id: params.id }, include: { group: { include: { members: true } } } });
  if (!d) return bad("Not found", 404);
  if (b.action === "materials") {
    if (!d.group.members.some((m) => m.userId === u.id)) return bad("Forbidden", 403);
    await prisma.defense.update({ where: { id: d.id }, data: { plagiarismReportUrl: safeUrl(b.plagiarismReportUrl), codeUrl: safeUrl(b.codeUrl), posterUrl: safeUrl(b.posterUrl), thesisUrl: safeUrl(b.thesisUrl) } });
    return NextResponse.json({ ok: true });
  }
  if (b.action === "evaluate") {
    if (!roles.includes("BOARD_MEMBER")) return bad("Forbidden", 403);
    if (!d.examinerIds.includes(u.id)) return bad("You are not assigned as an examiner for this defense.", 403);
    const rubric: any = {}; let total = 0;
    for (const c of RUBRIC) {
      const s = Number(b.scores?.[c.key]);
      if (!Number.isFinite(s) || s < 0 || s > c.max) return bad(`${c.label}: score must be between 0 and ${c.max}.`);
      rubric[c.key] = { max: c.max, score: s }; total += s;
    }
    await prisma.evaluation.upsert({ where: { defenseId_examinerId: { defenseId: d.id, examinerId: u.id } }, update: { rubric, total, remarks: b.remarks }, create: { defenseId: d.id, examinerId: u.id, rubric, total, remarks: b.remarks } });
    return NextResponse.json({ ok: true });
  }
  return bad("Unknown action.");
}
