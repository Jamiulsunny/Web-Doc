import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import MeetingsView from "@/components/MeetingsView";
export default async function Page() {
  const u = await getUser(); if (!u) redirect("/login");
  const r = u.roles as string[];
  const role = r.includes("STUDENT") ? "student" : r.includes("SUPERVISOR") ? "supervisor" : r.includes("COORDINATOR") ? "coordinator" : null;
  if (!role) redirect("/dashboard");
  return <MeetingsView role={role} />;
}
