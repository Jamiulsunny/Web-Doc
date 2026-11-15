import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "fs";
const prisma = new PrismaClient();
async function main() {
  const email = process.env.SEED_COORDINATOR_EMAIL!, pw = process.env.SEED_COORDINATOR_PASSWORD!;
  await prisma.user.upsert({ where: { username: "coordinator" }, update: {}, create: { name: "Department Coordinator", username: "coordinator", email, passwordHash: await bcrypt.hash(pw, 10), roles: ["COORDINATOR"], status: "ACTIVE" } });
  // Faculty directory. FACULTY_DEFAULT_EMAIL (if set) replaces the spreadsheet email for every entry that has no account yet.
  const list = JSON.parse(fs.readFileSync("prisma/faculty.json", "utf8"));
  const override = process.env.FACULTY_DEFAULT_EMAIL?.trim().toLowerCase();
  for (const f of list) {
    const mail = override || f.email;
    await prisma.facultyDirectory.upsert({ where: { name_department_designation: { name: f.name, department: f.department, designation: f.designation } }, update: { ...(override ? { email: mail } : {}) }, create: { ...f, email: mail } });
  }
  console.log(`Coordinator login: username "coordinator" | Faculty directory entries: ${list.length}`);
}
main().finally(() => prisma.$disconnect());
