import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import Workspace from "@/components/Workspace";
export default async function Page() { if (!(await requireRole("SUPERVISOR"))) redirect("/login"); return <Workspace role="supervisor" />; }
