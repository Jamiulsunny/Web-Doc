import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth";
import ChatView from "@/components/ChatView";
export default async function Page() {
  const u = await getUser(); if (!u) redirect("/login");
  const r = u.roles as string[];
  if (!r.includes("STUDENT") && !r.includes("SUPERVISOR")) redirect("/dashboard");
  return <ChatView role={r.includes("STUDENT") ? "student" : "supervisor"} me={u.id} />;
}
