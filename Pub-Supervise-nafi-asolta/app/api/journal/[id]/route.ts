import { safeUrl } from "@/lib/url";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
import { DEPT_CODE } from "@/lib/rubric";
import { notifyMembers, notifyCoordinators } from "@/lib/notify";
const bad = (e: string, s = 400) => NextResponse.json({ error: e }, { status: s });
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const u = await getUser(); if (!u) return bad("Unauthorized", 401);
  const b = await req.json(); const roles = u.roles as string[];
  const j = await prisma.journalSubmission.findUnique({ where: { id: params.id }, include: { group: { include: { members: true } } } });
  if (!j) return bad("Not found", 404);
  const isSup = j.group.supervisorId === u.id, isMember = j.group.members.some((m) => m.userId === u.id), isCoord = roles.includes("COORDINATOR");
  const set = (data: any) => prisma.journalSubmission.update({ where: { id: j.id }, data });
  if (b.action === "resubmit" && isMember && j.status === "REVISION_REQUESTED") {
    const tags = b.tags !== undefined ? String(b.tags).split(",").map((t) => t.trim()).filter(Boolean) : j.tags;
    await set({ status: "SUBMITTED", abstract: b.abstract || j.abstract, thesisUrl: safeUrl(b.thesisUrl) || j.thesisUrl, repoUrl: b.repoUrl ? safeUrl(b.repoUrl) : j.repoUrl, paperUrl: b.paperUrl ? safeUrl(b.paperUrl) : j.paperUrl, tags });
  } else if ((b.action === "sup-approve" || b.action === "sup-revision") && isSup && j.status === "SUBMITTED") {
    if (b.action === "sup-revision" && !b.note) return bad("Describe the required corrections.");
    await set({ status: b.action === "sup-approve" ? "SUPERVISOR_APPROVED" : "REVISION_REQUESTED", supervisorNote: b.note || null });
  } else if (isCoord && j.status === "SUPERVISOR_APPROVED") {
    if (b.action === "publish") {
      const year = new Date().getFullYear();
      const n = (await prisma.journalSubmission.count({ where: { status: "PUBLISHED" } })) + 1;
      await set({ status: "PUBLISHED", publishedAt: new Date(), citationCode: `PUB-${DEPT_CODE}-${year}-TH-${String(n).padStart(3, "0")}` });
    } else if (b.action === "reject") await set({ status: "REJECTED", supervisorNote: b.note || null });
    else if (b.action === "revision") await set({ status: "REVISION_REQUESTED", supervisorNote: b.note || null });
    else return bad("Unknown action.");
  } else return bad("Action not allowed in the current state.", 403);
  const jm: any = { "sup-approve": "was approved by your supervisor and sent to the coordinator", "sup-revision": "needs corrections", publish: "has been published", reject: "was rejected", revision: "needs revision" };
  if (jm[b.action]) await notifyMembers(j.groupId, `Journal request ${jm[b.action]}`);
  if (b.action === "sup-approve") await notifyCoordinators(`Journal request awaiting your approval: ${j.group.title}`);
  return NextResponse.json({ ok: true });
}
