import path from "path";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
export const runtime = "nodejs";
const TYPES: Record<string, string> = {
  ".pdf": "application/pdf", ".zip": "application/zip", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".doc": "application/msword", ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".ppt": "application/vnd.ms-powerpoint", ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
};
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  if (!/^[a-z0-9]{20,32}$/.test(id)) return new Response("Not found", { status: 404 });
  const u = await getUser();
  if (!u) { // logged-out visitors may open only files of PUBLISHED journal papers
    const pub = await prisma.journalSubmission.findFirst({ where: { status: "PUBLISHED", OR: [{ thesisUrl: { endsWith: id } }, { paperUrl: { endsWith: id } }] } });
    if (!pub) return new Response("Unauthorized", { status: 401 });
  }
  const f = await prisma.uploadedFile.findUnique({ where: { id } });
  if (!f) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(f.data), { headers: { "Content-Type": TYPES[path.extname(f.name).toLowerCase()] || "application/octet-stream", "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(f.name)}` } });
}
