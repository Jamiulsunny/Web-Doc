import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import CoordinatorClient from "./client";

export default async function Page() {
  const u = await requireRole("COORDINATOR"); 
  if (!u) redirect("/login");

  return (
    <>
      <style>{`
        :root {
          --primary: #2f2c7e;
          --secondary: #159641;
          --bg-main: #F8FAFC;
          --bg-card: #FFFFFF;
          --text-main: #0F172A;
          --text-muted: #64748B;
          --border-color: #E2E8F0;
          
          --shadow-sm: 0 1px 2px 0 rgba(15, 23, 42, 0.05);
          --shadow-md: 0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.07);
          --shadow-lg: 0 20px 25px -5px rgba(47, 44, 126, 0.08), 0 8px 10px -6px rgba(47, 44, 126, 0.08);
          
          --radius-lg: 16px;
          --transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        body {
          background-color: var(--bg-main);
          color: var(--text-main);
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          margin: 0;
          padding: 0;
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
        }

        .coordinator-portal-container {
          width: 100%;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background-color: var(--bg-main);
          padding: 24px 16px;
          box-sizing: border-box;
        }

        @media (min-width: 768px) {
          .coordinator-portal-container {
            padding: 40px 32px;
          }
        }

        @media (min-width: 1280px) {
          .coordinator-portal-container {
            padding: 48px 64px;
          }
        }

        .portal-shell {
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 24px;
          flex-grow: 1;
        }
      `}</style>

      <main className="coordinator-portal-container">
        <div className="portal-shell">
          <CoordinatorClient />
        </div>
      </main>
    </>
  );
}