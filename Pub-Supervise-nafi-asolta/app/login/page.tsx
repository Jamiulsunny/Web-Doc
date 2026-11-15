"use client";

import { useState } from "react";

export default function Login() {
  const [f, setF] = useState({
    email: "",
    password: "",
  });

  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErr("");

    try {
      const r = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });

      const d = await r.json();

      if (r.ok) {
        window.location.href = d.redirect;
      } else {
        setErr(d.error || "Login failed. Please try again.");
        setBusy(false);
      }
    } catch {
      setErr("Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: 50,
    padding: "0 15px",
    boxSizing: "border-box",
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    background: "#f8fafc",
    color: "#0f172a",
    fontSize: 14,
    outline: "none",
    transition: "all 0.2s ease",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    marginBottom: 9,
    fontSize: 13,
    fontWeight: 600,
    color: "#334155",
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
      <form
        onSubmit={submit}
        style={{
          width: "100%",
          maxWidth: 420,
          boxSizing: "border-box",
          padding: "36px 32px 28px",
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
            marginBottom: 22,
          }}
        >
          <div
            style={{
              width: 76,
              height: 76,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#eef2ff",
              borderRadius: 20,
              border: "1px solid #e0e7ff",
            }}
          >
            <img
              src="/logo.png"
              alt="PUB"
              style={{
                width: 62,
                height: 62,
                objectFit: "contain",
              }}
            />
          </div>
        </div>

        {/* Heading */}
        <h2
          style={{
            margin: 0,
            textAlign: "center",
            fontSize: 29,
            fontWeight: 750,
            letterSpacing: "-0.8px",
            color: "#111827",
          }}
        >
          Welcome back
        </h2>

        <p
          style={{
            margin: "9px 0 30px",
            textAlign: "center",
            fontSize: 14,
            color: "#64748b",
          }}
        >
          Log in to PubSupervise
        </p>

        {/* Email */}
        <div style={{ marginBottom: 21 }}>
          <label htmlFor="email" style={labelStyle}>
            Email or username
          </label>

          <input
            id="email"
            type="text"
            autoComplete="username"
            placeholder="Enter your email or username"
            required
            value={f.email}
            onChange={(e) =>
              setF({ ...f, email: e.target.value })
            }
            style={inputStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#6366f1";
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.boxShadow =
                "0 0 0 4px rgba(99,102,241,0.12)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#e2e8f0";
              e.currentTarget.style.background = "#f8fafc";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
        </div>

        {/* Password */}
        <div style={{ marginBottom: 8 }}>
          <label htmlFor="password" style={labelStyle}>
            Password
          </label>

          <div style={{ position: "relative" }}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              required
              value={f.password}
              onChange={(e) =>
                setF({ ...f, password: e.target.value })
              }
              style={{
                ...inputStyle,
                paddingRight: 50,
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#6366f1";
                e.currentTarget.style.background = "#fff";
                e.currentTarget.style.boxShadow =
                  "0 0 0 4px rgba(99,102,241,0.12)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.background = "#f8fafc";
                e.currentTarget.style.boxShadow = "none";
              }}
            />

            {/* Eye / Eye Off Button */}
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
              style={{
                position: "absolute",
                right: 9,
                top: "50%",
                transform: "translateY(-50%)",
                width: 34,
                height: 34,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "none",
                borderRadius: 8,
                background: "transparent",
                color: "#64748b",
                cursor: "pointer",
                padding: 0,
              }}
            >
              {showPassword ? (
                /* Eye Off icon */
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
                /* Eye icon */
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

        {/* Error */}
        {err && (
          <div
            role="alert"
            style={{
              marginTop: 16,
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

        {/* Login button */}
        <button
          type="submit"
          disabled={busy}
          style={{
            width: "100%",
            height: 51,
            marginTop: 23,
            padding: "0 18px",
            color: "#fff",
            background: busy
              ? "#818cf8"
              : "linear-gradient(135deg, #4f46e5, #6366f1)",
            border: "none",
            borderRadius: 12,
            boxShadow: "0 7px 18px rgba(79,70,229,0.23)",
            fontSize: 15,
            fontWeight: 700,
            cursor: busy ? "not-allowed" : "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            if (!busy) {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 11px 24px rgba(79,70,229,0.3)";
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 7px 18px rgba(79,70,229,0.23)";
          }}
        >
          {busy ? "Signing in..." : "Log in  →"}
        </button>

        {/* Footer */}
        <p
          style={{
            margin: "24px 0 0",
            textAlign: "center",
            fontSize: 12,
            lineHeight: 2,
            color: "#64748b",
          }}
        >
          <a
            href="/forgot"
            style={{
              color: "#4f46e5",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Forgot password?
          </a>

          <span style={{ margin: "0 8px", color: "#cbd5e1" }}>
            |
          </span>

          New student?{" "}
          <a
            href="/register"
            style={{
              color: "#4f46e5",
              fontWeight: 650,
              textDecoration: "none",
            }}
          >
            Create an account
          </a>
        </p>
      </form>
    </div>
  );
}