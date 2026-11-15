import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, port: Number(process.env.SMTP_PORT || 465),
  secure: Number(process.env.SMTP_PORT || 465) === 465,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});
const wrap = (body: string) => `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;border:1px solid #e5e7eb;border-radius:12px;padding:24px"><h2 style="color:#2e3192;margin:0 0 12px">PubSupervise</h2>${body}<p style="color:#6b7280;font-size:12px;margin-top:24px">Pundra University of Science &amp; Technology, Bogura</p></div>`;
export async function sendMail(to: string, subject: string, html: string) {
  await transporter.sendMail({ from: process.env.MAIL_FROM, to, subject, html: wrap(html) });
}
export const sendOtp = (to: string, otp: string) =>
  sendMail(to, "Your verification code", `<p>Your 6-digit verification code is:</p><p style="font-size:32px;letter-spacing:8px;font-weight:bold">${otp}</p><p>It expires in 10 minutes.</p>`);
export const sendCredentials = (to: string, name: string, username: string, pw: string) =>
  sendMail(to, "Your PubSupervise account", `<p>Hello ${name},</p><p>An account has been created for you.</p><p><b>Username:</b> ${username}<br/><b>Temporary password:</b> ${pw}</p><p>Log in with your username and change your password immediately.</p>`);
