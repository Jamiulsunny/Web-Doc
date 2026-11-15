import { safeUrl } from "@/lib/url";
import { notifyCreate, notifyMembers } from "@/lib/notify";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
const bad = (e: string, s = 400) => NextResponse.json({ error: e }, { status: s });
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const u = await getUser(); if (!u) return bad("Unauthorized", 401);
  const b = await req.json();
  const g = await prisma.projectGroup.findUnique({ where: { id: params.id }, include: { members: true, proposals: { include: { versions: { orderBy: { version: "desc" }, take: 1 } } } } });
  if (!g) return bad("Not found", 404);
  const roles = u.roles as string[];
  const isCoord = roles.includes("COORDINATOR"), isSup = g.supervisorId === u.id, isMember = g.members.some((m) => m.userId === u.id);
  const p = g.proposals[0], last = p?.versions[0];
  switch (b.action) {
    case "assign": {
      if (!isCoord) return bad("Forbidden", 403);
      const s = await prisma.user.findUnique({ where: { id: b.supervisorId }, include: { _count: { select: { supervised: true } } } });
      if (!s || s.status !== "ACTIVE" || !(s.roles as string[]).includes("SUPERVISOR")) return bad("Invalid supervisor.");
      if (s.id !== g.supervisorId && s._count.supervised >= s.maxGroups) return bad(`${s.name} has reached the maximum of ${s.maxGroups} groups.`);
      await prisma.projectGroup.update({ where: { id: g.id }, data: { supervisorId: s.id } });
      await notifyCreate({ data: { userId: s.id, message: `New project assigned: ${g.title}` } });
      break;
    }
    case "proposal-approve": case "proposal-revision": {
      if (!isSup && !isCoord) return bad("Forbidden", 403);
      const approve = b.action === "proposal-approve";
      await prisma.$transaction([
        prisma.proposal.update({ where: { id: p.id }, data: { status: approve ? "APPROVED" : "REVISION_REQUESTED" } }),
        prisma.proposalVersion.create({ data: { proposalId: p.id, version: last.version + 1, title: last.title, abstract: last.abstract, scope: last.scope, note: (approve ? "APPROVED: " : "REVISION REQUESTED: ") + (b.note || ""), createdBy: u.id } }),
      ]);
      break;
    }
    case "resubmit": {
      if (!isMember) return bad("Forbidden", 403);
      await prisma.$transaction([
        prisma.proposal.update({ where: { id: p.id }, data: { status: "SUBMITTED" } }),
        prisma.proposalVersion.create({ data: { proposalId: p.id, version: last.version + 1, title: b.title || last.title, abstract: b.abstract || last.abstract, scope: b.scope || last.scope, note: "Resubmitted", createdBy: u.id } }),
      ]);
      break;
    }
    case "milestone-create": {
      if (!isSup && !isCoord) return bad("Forbidden", 403);
      if (!b.title || !b.dueDate) return bad("Title and due date are required.");
      await prisma.milestone.create({ data: { groupId: g.id, title: b.title, dueDate: new Date(b.dueDate) } });
      break;
    }
    case "submit": {
      if (!isMember) return bad("Forbidden", 403);
      const m = await prisma.milestone.findFirst({ where: { id: b.milestoneId, groupId: g.id } });
      if (!m) return bad("Milestone not found.", 404);
      if (!b.fileUrl && !b.codeLink && !b.notes) return bad("Add a file link, code link or notes.");
      await prisma.$transaction([
        prisma.submission.create({ data: { milestoneId: m.id, fileUrl: safeUrl(b.fileUrl), codeLink: safeUrl(b.codeLink), notes: b.notes, submittedBy: u.id } }),
        prisma.milestone.update({ where: { id: m.id }, data: { status: "SUBMITTED" } }),
      ]);
      if (g.supervisorId) await notifyCreate({ data: { userId: g.supervisorId, message: `New submission: ${m.title} (${g.title})` } });
      break;
    }
    case "review": {
      if (!isSup && !isCoord) return bad("Forbidden", 403);
      const s = await prisma.submission.findUnique({ where: { id: b.submissionId }, include: { milestone: true } });
      if (!s || s.milestone.groupId !== g.id) return bad("Submission not found.", 404);
      const rev = b.decision === "revision";
      await prisma.$transaction([
        prisma.feedback.create({ data: { submissionId: s.id, authorId: u.id, comment: b.comment || (rev ? "Revision requested" : "Approved"), revisionRequested: rev } }),
        prisma.milestone.update({ where: { id: s.milestoneId }, data: { status: rev ? "REVISION_REQUESTED" : "APPROVED" } }),
      ]);
      break;
    }
    case "milestone-edit": {
      if (!isSup && !isCoord) return bad("Forbidden", 403);
      await prisma.milestone.updateMany({ where: { id: b.milestoneId, groupId: g.id }, data: { ...(b.title ? { title: b.title } : {}), ...(b.dueDate ? { dueDate: new Date(b.dueDate) } : {}) } });
      break;
    }
    case "milestone-delete": {
      if (!isSup && !isCoord) return bad("Forbidden", 403);
      const m = await prisma.milestone.findFirst({ where: { id: b.milestoneId, groupId: g.id }, include: { _count: { select: { submissions: true } } } });
      if (!m) return bad("Milestone not found.", 404);
      if (m._count.submissions) return bad("Milestones that already have submissions cannot be deleted (history is preserved).");
      await prisma.milestone.delete({ where: { id: m.id } });
      break;
    }
    case "member-add": {
      if (!isCoord) return bad("Forbidden", 403);
      const st = await prisma.user.findFirst({ where: { studentId: String(b.studentId || "").trim(), status: "ACTIVE" } });
      if (!st) return bad("No active student with this ID.");
      if (await prisma.groupMember.findFirst({ where: { userId: st.id } })) return bad("This student already belongs to a group.", 409);
      await prisma.groupMember.create({ data: { userId: st.id, groupId: g.id } });
      break;
    }
    case "member-remove": {
      if (!isCoord) return bad("Forbidden", 403);
      if (g.members.length <= 1) return bad("A group needs at least one member.");
      await prisma.groupMember.deleteMany({ where: { groupId: g.id, userId: b.userId } });
      break;
    }
    default: return bad("Unknown action.");
  }
  const msgs: any = { "proposal-approve": "Your proposal scope was approved", "proposal-revision": "Revision requested on your proposal", "milestone-create": "A new milestone was added", review: "New feedback on your submission", "milestone-edit": "A milestone was updated", assign: "A supervisor was assigned to your project" };
  if (msgs[b.action]) await notifyMembers(g.id, `${msgs[b.action]}: ${g.title}`);
  if (b.action === "resubmit" && g.supervisorId) await notifyCreate({ data: { userId: g.supervisorId, message: `Proposal resubmitted: ${g.title}` } });
  return NextResponse.json({ ok: true });
}
