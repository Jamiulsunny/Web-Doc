// Only http(s) links and our own uploaded-file URLs are accepted (blocks javascript: links).
export function safeUrl(v: unknown): string | null {
  const s = String(v ?? "").trim();
  return /^(https?:\/\/\S+|\/api\/files\/[a-z0-9]+)$/i.test(s) ? s : null;
}
