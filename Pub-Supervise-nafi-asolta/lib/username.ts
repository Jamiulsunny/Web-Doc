import { prisma } from "./prisma";
export async function makeUsername(name: string) {
  const w = name.toLowerCase().replace(/[^a-z\s.]/g, " ").split(/\s+/).filter((p) => p && !p.endsWith("."));
  const base = w.length > 1 ? `${w[0]}.${w[w.length - 1]}` : w[0] || "faculty";
  let u = base, n = 1;
  while (await prisma.user.findUnique({ where: { username: u } })) u = `${base}${++n}`;
  return u;
}
