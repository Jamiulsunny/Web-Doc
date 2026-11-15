import { redirect } from "next/navigation";
import Link from "next/link";
import { getUser, panelFor } from "@/lib/auth";
import { ROLE_COLOR, ROLE_LABEL } from "@/lib/roles";
const desc: Record<string, string> = { STUDENT: "Proposals, milestones, submissions and chat.", SUPERVISOR: "Review proposals, milestones and journal requests.", BOARD_MEMBER: "Evaluate defenses using the rubric.", COORDINATOR: "Approvals, assignments, defenses and risk monitoring." };
export default async function Dashboard() {
  const u = await getUser(); if (!u) redirect("/login");
  const roles = u.roles as string[];
  return (<div className="wrap"><h1>Welcome, {u.name}</h1><p className="muted">You have access to {roles.length} panel{roles.length > 1 ? "s" : ""}. Choose one to continue.</p>
    <div className="grid" style={{ margin: "24px 0", padding: 0 }}>{roles.map((r) => <Link key={r} href={panelFor[r]} className="card rolecard" style={{ borderTop: `4px solid ${ROLE_COLOR[r]}` }}><h3 style={{ color: ROLE_COLOR[r] }}>{ROLE_LABEL[r]} panel</h3><p>{desc[r]}</p></Link>)}</div></div>);
}
