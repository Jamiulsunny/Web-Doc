// AES-256-GCM encryption for data stored at rest (chat messages). Shared by server.js and the API routes.
const crypto = require("crypto");
const PREFIX = "enc:v1:";
function key() {
  const k = process.env.CHAT_ENCRYPTION_KEY;
  if (k && /^[0-9a-f]{64}$/i.test(k)) return Buffer.from(k, "hex");
  return crypto.createHash("sha256").update(process.env.JWT_SECRET || "dev-secret").digest(); // fallback if no dedicated key is set
}
function encrypt(text) {
  const iv = crypto.randomBytes(12);
  const c = crypto.createCipheriv("aes-256-gcm", key(), iv);
  const enc = Buffer.concat([c.update(String(text), "utf8"), c.final()]);
  return PREFIX + Buffer.concat([iv, c.getAuthTag(), enc]).toString("base64");
}
function decrypt(value) {
  if (!value || !value.startsWith(PREFIX)) return value; // older plaintext messages still display
  try {
    const b = Buffer.from(value.slice(PREFIX.length), "base64");
    const d = crypto.createDecipheriv("aes-256-gcm", key(), b.subarray(0, 12));
    d.setAuthTag(b.subarray(12, 28));
    return Buffer.concat([d.update(b.subarray(28)), d.final()]).toString("utf8");
  } catch { return "[message cannot be decrypted]"; }
}
module.exports = { encrypt, decrypt };