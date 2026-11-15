"use client";

import { useState } from "react";

export default function Register() {
  const [step, setStep] = useState<"form" | "otp" | "done">("form");

  const [f, setF] = useState({
    name: "",
    email: "",
    phone: "",
    studentId: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const set = (k: keyof typeof f) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setF((prev) => ({ ...prev, [k]: e.target.value }));

  async function post(url: string, body: unknown) {
    setBusy(true);
    setErr("");

    try {
      const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const d = await r.json();

      if (!r.ok) {
        setErr(d.error || "Something went wrong. Please try again.");
        return false;
      }

      return true;
    } catch {
      setErr("Network error. Please try again.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    height: 48,
    boxSizing: "border-box",
    padding: "0 14px",
    color: "#0f172a",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: 11,
    outline: "none",
    fontSize: 14,
    transition: "all 0.2s ease",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: 7,
    color: "#334155",
    fontSize: 13,
    fontWeight: 600,
  };

  const fieldStyle: React.CSSProperties = {
    marginBottom: 16,
  };

  const focusInput = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "#6366f1";
    e.currentTarget.style.background = "#fff";
    e.currentTarget.style.boxShadow =
      "0 0 0 4px rgba(99,102,241,0.12)";
  };

  const blurInput = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "#e2e8f0";
    e.currentTarget.style.background = "#f8fafc";
    e.currentTarget.style.boxShadow = "none";
  };

  const primaryButton: React.CSSProperties = {
    display: "block",
    width: "100%",
    minHeight: 49,
    marginTop: 19,
    padding: "12px 16px",
    color: "#fff",
    background: "linear-gradient(135deg, #4f46e5, #6366f1)",
    border: "none",
    borderRadius: 12,
    boxShadow: "0 7px 18px rgba(79,70,229,0.22)",
    fontSize: 14,
    fontWeight: 700,
    cursor: busy ? "not-allowed" : "pointer",
    opacity: busy ? 0.7 : 1,
    textAlign: "center",
    textDecoration: "none",
    boxSizing: "border-box",
  };

  const linkStyle: React.CSSProperties = {
    color: "#4f46e5",
    fontWeight: 650,
    textDecoration: "none",
  };

  return (
    <div
      className="auth"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "28px 16px",
        boxSizing: "border-box",
        background:
          "radial-gradient(circle at 10% 10%, #e0e7ff 0%, transparent 35%), radial-gradient(circle at 90% 90%, #dbeafe 0%, transparent 35%), #f5f7fc",
        fontFamily: "Inter, Arial, sans-serif",
      }}
    >
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: 450,
          boxSizing: "border-box",
          padding: "30px 32px 26px",
          background: "rgba(255,255,255,0.97)",
          border: "1px solid rgba(226,232,240,0.9)",
          borderRadius: 24,
          boxShadow:
            "0 25px 70px rgba(15,23,42,0.10), 0 4px 12px rgba(15,23,42,0.03)",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 18,
          }}
        >
          <div
            style={{
              width: 66,
              height: 66,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#eef2ff",
              border: "1px solid #e0e7ff",
              borderRadius: 18,
            }}
          >
            <img
              src="/logo.png"
              alt="PUB"
              style={{
                width: 54,
                height: 54,
                objectFit: "contain",
              }}
            />
          </div>
        </div>

        {/* Registration Form */}
        {step === "form" && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();

              if (await post("/api/auth/register", f)) {
                setStep("otp");
              }
            }}
          >
            <h2
              style={{
                margin: 0,
                color: "#111827",
                textAlign: "center",
                fontSize: 27,
                fontWeight: 750,
                letterSpacing: "-0.7px",
              }}
            >
              Student registration
            </h2>

            <p
              style={{
                margin: "9px 0 25px",
                color: "#64748b",
                textAlign: "center",
                fontSize: 13,
                lineHeight: 1.6,
              }}
            >
              Create your account to get started.
      
            </p>

            <div style={fieldStyle}>
              <label htmlFor="name" style={labelStyle}>
                Full name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Enter your full name"
                required
                value={f.name}
                onChange={set("name")}
                style={inputStyle}
                onFocus={focusInput}
                onBlur={blurInput}
              />
            </div>

            <div style={fieldStyle}>
              <label htmlFor="email" style={labelStyle}>
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                value={f.email}
                onChange={set("email")}
                style={inputStyle}
                onFocus={focusInput}
                onBlur={blurInput}
              />
            </div>

            <div style={fieldStyle}>
              <label htmlFor="phone" style={labelStyle}>
                Phone number
              </label>
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="Enter your phone number"
                required
                value={f.phone}
                onChange={set("phone")}
                style={inputStyle}
                onFocus={focusInput}
                onBlur={blurInput}
              />
            </div>

            <div style={fieldStyle}>
              <label htmlFor="studentId" style={labelStyle}>
                Student ID
              </label>
              <input
                id="studentId"
                type="text"
                placeholder="Enter your student ID"
                required
                value={f.studentId}
                onChange={set("studentId")}
                style={inputStyle}
                onFocus={focusInput}
                onBlur={blurInput}
              />
            </div>

            <div style={fieldStyle}>
              <label htmlFor="password" style={labelStyle}>
                Password
                <span
                  style={{
                    marginLeft: 6,
                    color: "#94a3b8",
                    fontSize: 11,
                    fontWeight: 400,
                  }}
                >
                  (min 8 characters)
                </span>
              </label>

              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  minLength={8}
                  required
                  value={f.password}
                  onChange={set("password")}
                  style={{
                    ...inputStyle,
                    paddingRight: 48,
                  }}
                  onFocus={focusInput}
                  onBlur={blurInput}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                  title={
                    showPassword ? "Hide password" : "Show password"
                  }
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: 8,
                    transform: "translateY(-50%)",
                    width: 34,
                    height: 34,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 0,
                    color: "#64748b",
                    background: "transparent",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M3 3l18 18" />
                      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                      <path d="M9.9 5.2A10.8 10.8 0 0 1 12 5c5 0 8.3 4.5 9 7-.3 1.1-1 2.3-2 3.4" />
                      <path d="M6.2 6.2C3.8 7.7 2.3 10 2 12c.7 2.5 4 7 10 7 1.4 0 2.7-.3 3.8-.8" />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {err && (
              <div
                role="alert"
                style={{
                  marginTop: 14,
                  padding: "11px 13px",
                  color: "#b91c1c",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: 10,
                  fontSize: 13,
                  lineHeight: 1.5,
                }}
              >
                {err}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              style={primaryButton}
            >
              {busy ? "Sending code..." : "Create account  →"}
            </button>

            <p
              style={{
                margin: "22px 0 0",
                textAlign: "center",
                color: "#64748b",
                fontSize: 12,
                lineHeight: 1.8,
              }}
            >
              Already have an account?{" "}
              <a href="/login" style={linkStyle}>
                Log in
              </a>
            </p>
          </form>
        )}

        {/* OTP Verification */}
        {step === "otp" && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();

              if (await post("/api/auth/verify-otp", {
                email: f.email,
                otp,
              })) {
                setStep("done");
              }
            }}
          >
            <div
              style={{
                width: 58,
                height: 58,
                margin: "0 auto 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#eef2ff",
                color: "#4f46e5",
                borderRadius: 17,
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="5" width="18" height="14" rx="3" />
                <path d="m3 7 9 6 9-6" />
              </svg>
            </div>

            <h2
              style={{
                margin: 0,
                color: "#111827",
                textAlign: "center",
                fontSize: 27,
                fontWeight: 750,
              }}
            >
              Verify your email
            </h2>

            <p
              style={{
                margin: "10px 0 26px",
                color: "#64748b",
                textAlign: "center",
                fontSize: 13,
                lineHeight: 1.7,
                overflowWrap: "anywhere",
              }}
            >
              Enter the 6-digit verification code sent to
              <br />
              <strong style={{ color: "#334155" }}>
                {f.email}
              </strong>
            </p>

            <div style={fieldStyle}>
              <label htmlFor="otp" style={labelStyle}>
                Verification code
              </label>

              <input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                placeholder="000000"
                required
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                style={{
                  ...inputStyle,
                  height: 58,
                  fontSize: 25,
                  letterSpacing: 9,
                  textAlign: "center",
                  fontWeight: 700,
                }}
                onFocus={focusInput}
                onBlur={blurInput}
              />
            </div>

            {err && (
              <div
                role="alert"
                style={{
                  marginTop: 14,
                  padding: "11px 13px",
                  color: "#b91c1c",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: 10,
                  fontSize: 13,
                }}
              >
                {err}
              </div>
            )}

            <button
              type="submit"
              disabled={busy || otp.length !== 6}
              style={{
                ...primaryButton,
                opacity: busy || otp.length !== 6 ? 0.65 : 1,
              }}
            >
              {busy ? "Verifying..." : "Verify email  →"}
            </button>

            <button
              type="button"
              disabled={busy}
              onClick={() => post("/api/auth/register", f)}
              style={{
                ...primaryButton,
                marginTop: 10,
                color: "#4f46e5",
                background: "#eef2ff",
                boxShadow: "none",
                border: "1px solid #e0e7ff",
              }}
            >
              {busy ? "Sending..." : "↻  Resend verification code"}
            </button>

            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setErr("");
                setOtp("");
                setStep("form");
              }}
              style={{
                display: "block",
                width: "100%",
                marginTop: 16,
                padding: 8,
                border: "none",
                background: "transparent",
                color: "#64748b",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              ← Back to registration
            </button>
          </form>
        )}

        {/* Registration Complete */}
        {step === "done" && (
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 68,
                height: 68,
                margin: "0 auto 20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#15803d",
                background: "#dcfce7",
                border: "1px solid #bbf7d0",
                borderRadius: 22,
              }}
            >
              <svg
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m5 12 4 4L19 6" />
              </svg>
            </div>

            <h2
              style={{
                margin: 0,
                color: "#111827",
                fontSize: 27,
                fontWeight: 750,
              }}
            >
              Email verified!
            </h2>

            <p
              style={{
                margin: "14px 0 0",
                padding: 16,
                color: "#166534",
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: 13,
                fontSize: 13,
                lineHeight: 1.8,
              }}
            >
              Your account is now pending coordinator approval.
              You will be able to log in once it is approved.
            </p>

            <a
              href="/login"
              style={{
                ...primaryButton,
                marginTop: 22,
              }}
            >
              Back to login  →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}