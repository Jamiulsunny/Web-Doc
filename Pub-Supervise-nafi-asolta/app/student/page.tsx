import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import Workspace from "@/components/Workspace";
export default async function Page() { if (!(await requireRole("STUDENT"))) redirect("/login"); return <Workspace role="student" />; }
