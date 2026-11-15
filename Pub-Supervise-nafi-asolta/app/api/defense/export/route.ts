import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
const q = (v: any) => `"${String(v ?? "").replace(/"/g, '""')}"`;
export async function GET() {
  if (!(await requireRole("COORDINATOR"))) return new Response("Forbidden", { status: 403 });
  const ds = await prisma.defense.findMany({ include: { group: { include: { members: { include: { user: true } }, supervisor: true } }, evaluations: { include: { examiner: true } } }, orderBy: { scheduledAt: "asc" } });
  const rows = [["Project", "Team", "Supervisor", "Defense date", "Evaluations", "Average (/100)", "Per examiner"].map(q).join(",")];
  for (const d of ds) {
    const avg = d.evaluations.length ? (d.evaluations.reduce((s, e) => s + e.total, 0) / d.evaluations.length).toFixed(2) : "";
    rows.push([d.group.title, d.group.members.map((m) => `${m.user.name} (${m.user.studentId})`).join("; "), d.group.supervisor?.name, d.scheduledAt.toISOString(), d.evaluations.length, avg, d.evaluations.map((e) => `${e.examiner.name}: ${e.total}`).join("; ")].map(q).join(","));
  }
  return new Response(rows.join("\n"), { headers: { "Content-Type": "text/csv", "Content-Disposition": "attachment; filename=defense-results.csv" } });
}
