import Link from "next/link";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export default async function Journal({ searchParams }: { searchParams: { q?: string } }) {
  const q = searchParams.q?.trim();
  const items = await prisma.journalSubmission.findMany({
    where: { status: "PUBLISHED", ...(q ? { OR: [{ group: { title: { contains: q, mode: "insensitive" } } }, { tags: { has: q } }, { citationCode: { contains: q, mode: "insensitive" } }] } : {}) },
    include: { group: { select: { title: true, supervisor: { select: { name: true } }, members: { include: { user: { select: { name: true } } } } } } }, orderBy: { publishedAt: "desc" },
  });
  return (<div className="wrap"><h1>Departmental Research Journal</h1><p className="muted">Published theses and projects of the department.</p>
    <form style={{ margin: "16px 0", display: "flex", gap: 8, maxWidth: 520 }}><input name="q" defaultValue={q} placeholder="Search by title, tag or citation code" /><button className="btn">Search</button></form>
    {items.length === 0 && <p className="muted">No published work found.</p>}
    <div className="grid" style={{ margin: 0, padding: 0 }}>{items.map((j) => <Link key={j.id} href={`/journal/${j.id}`} className="card"><span className="badge">{j.citationCode}</span><h3 style={{ marginTop: 10 }}>{j.group.title}</h3>
      <p>{j.abstract.slice(0, 160)}{j.abstract.length > 160 ? "..." : ""}</p><p style={{ marginTop: 8 }}>{j.tags.map((t) => <span key={t} className="badge" style={{ marginRight: 4 }}>{t}</span>)}</p></Link>)}</div></div>);
}
