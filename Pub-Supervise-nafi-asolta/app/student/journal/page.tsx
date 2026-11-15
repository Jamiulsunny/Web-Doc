import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import JournalView from "@/components/JournalView";
export default async function Page() { if (!(await requireRole("STUDENT"))) redirect("/login"); return <JournalView role="student" />; }
