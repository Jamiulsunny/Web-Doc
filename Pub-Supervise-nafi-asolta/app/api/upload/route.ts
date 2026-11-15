import { NextResponse } from "next/server";
import path from "path";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
export const runtime = "nodejs";
const ALLOWED = [".pdf", ".zip", ".doc", ".docx", ".ppt", ".pptx", ".png", ".jpg", ".jpeg"];
const MAX = 25 * 1024 * 1024; // 25 MB; larger files must be shared as a Google Drive link
export async function POST(req: Request) {
  const u = await getUser();
  if (!u) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const file = (await req.formData()).get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file selected." }, { status: 400 });
  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED.includes(ext)) return NextResponse.json({ error: "Allowed types: PDF, ZIP, Word, PowerPoint, PNG, JPG." }, { status: 400 });
  if (file.size > MAX) return NextResponse.json({ error: "File is larger than 25 MB. Please upload it to Google Drive and paste the sharing link instead." }, { status: 413 });
  const saved = await prisma.uploadedFile.create({ data: { name: file.name, mimeType: file.type || "application/octet-stream", size: file.size, data: Buffer.from(await file.arrayBuffer()), uploadedBy: u.id } });
  return NextResponse.json({ url: `/api/files/${saved.id}`, originalName: file.name });
}
