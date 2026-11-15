import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import JournalView from "@/components/JournalView";
export default async function Page() { if (!(await requireRole("SUPERVISOR"))) redirect("/login"); return <JournalView role="supervisor" />; }
