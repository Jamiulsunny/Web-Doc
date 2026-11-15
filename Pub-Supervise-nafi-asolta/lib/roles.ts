export const ROLE_LABEL: Record<string, string> = { STUDENT: "Student", SUPERVISOR: "Supervisor", BOARD_MEMBER: "Board Member", COORDINATOR: "Coordinator" };
export const ROLE_COLOR: Record<string, string> = { STUDENT: "#2563eb", SUPERVISOR: "#059669", BOARD_MEMBER: "#d97706", COORDINATOR: "#b91c1c" };
const ORDER = ["COORDINATOR", "SUPERVISOR", "BOARD_MEMBER", "STUDENT"];
export const primaryRole = (roles: string[]) => ORDER.find((r) => roles.includes(r)) || "STUDENT";
const LINKS: Record<string, [string, string][]> = {
  STUDENT: [["My Project", "/student"], ["Chat", "/chat"], ["Meetings", "/meetings"], ["Defense", "/student/defense"], ["Journal Request", "/student/journal"]],
  SUPERVISOR: [["My Groups", "/supervisor"], ["Chat", "/chat"], ["Meetings", "/meetings"], ["Journal Reviews", "/supervisor/journal"]],
  BOARD_MEMBER: [["Evaluations", "/board"]],
  COORDINATOR: [["Overview", "/coordinator"], ["Projects", "/coordinator/projects"], ["Defense", "/coordinator/defense"], ["Journal Reviews", "/coordinator/journal"], ["Risk", "/coordinator/risk"], ["Meetings", "/meetings"]],
};
export function navLinks(roles: string[]) {
  const seen = new Set<string>(), out: [string, string][] = [];
  for (const r of ORDER) if (roles.includes(r)) for (const l of LINKS[r]) if (!seen.has(l[1])) { seen.add(l[1]); out.push(l); }
  if (roles.length > 1) out.push(["Switch Panel", "/dashboard"]);
  return out;
}
