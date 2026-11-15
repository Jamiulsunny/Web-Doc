import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
const key = () => new TextEncoder().encode(process.env.JWT_SECRET || "dev-secret");
export const COOKIE = "pub_session";
export async function createSession(userId: string) {
  const token = await new SignJWT({ uid: userId }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("7d").sign(key());
  cookies().set(COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 604800 });
}
// Always re-reads the user so deactivation and role edits take effect immediately.
export async function getUser() {
  const t = cookies().get(COOKIE)?.value;
  if (!t) return null;
  try {
    const { payload } = await jwtVerify(t, key());
    const u = await prisma.user.findUnique({ where: { id: payload.uid as string } });
    return u && u.status === "ACTIVE" ? u : null;
  } catch { return null; }
}
export async function requireRole(role: string) {
  const u = await getUser();
  return u && (u.roles as string[]).includes(role) ? u : null;
}
export const panelFor: Record<string, string> = { COORDINATOR: "/coordinator", SUPERVISOR: "/supervisor", BOARD_MEMBER: "/board", STUDENT: "/student" };

export async function findByIdentifier(identifier: string) {
  const id = String(identifier || "").toLowerCase().trim();
  return prisma.user.findFirst({ where: { status: "ACTIVE", OR: [{ username: id }, { email: id, roles: { hasSome: ["STUDENT", "COORDINATOR"] } }] } });
}
