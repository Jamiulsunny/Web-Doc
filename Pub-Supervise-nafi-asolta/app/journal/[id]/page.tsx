import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
export const dynamic = "force-dynamic";
export default async function Paper({ params }: { params: { id: string } }) {
  const j = await prisma.journalSubmission.findFirst({ where: { id: params.id, status: "PUBLISHED" }, include: { group: { select: { title: true, supervisor: { select: { name: true } }, members: { include: { user: { select: { name: true } } } } } } } });
  if (!j) notFound();
  const authors = j.group.members.map((m) => m.user.name).join(", "), year = j.publishedAt?.getFullYear();
  return (<div className="wrap" style={{ maxWidth: 820 }}><span className="badge">{j.citationCode}</span><h1 style={{ marginTop: 10 }}>{j.group.title}</h1>
    <p className="muted">Authors: {authors} | Supervisor: {j.group.supervisor?.name || "N/A"} | Published {j.publishedAt?.toLocaleDateString()}</p>
    <div className="card" style={{ margin: "16px 0" }}><h3>Abstract</h3><p style={{ lineHeight: 1.7 }}>{j.abstract}</p></div>
    <p>{j.tags.map((t) => <span key={t} className="badge" style={{ marginRight: 6 }}>{t}</span>)}</p>
    <p style={{ margin: "16px 0" }}><a className="btn" href={j.thesisUrl} target="_blank">Thesis book</a> {j.paperUrl && <a className="btn ghost" href={j.paperUrl} target="_blank">Research paper</a>} {j.repoUrl && <a className="btn ghost" href={j.repoUrl} target="_blank">Source code</a>}</p>
    <div className="card"><h3>Cite as</h3><p>{authors} ({year}). {j.group.title}. Pundra University of Science &amp; Technology, Department Journal. [{j.citationCode}]</p></div></div>);
}
