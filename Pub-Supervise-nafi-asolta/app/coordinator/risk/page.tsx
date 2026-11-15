import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";
const DAY = 86400000;

export default async function Risk() {
  if (!(await requireRole("COORDINATOR"))) redirect("/login");
  
  const now = Date.now();
  const groups = await prisma.projectGroup.findMany({ 
    include: { 
      supervisor: { select: { name: true } }, 
      members: { include: { user: { select: { name: true } } } }, 
      milestones: { include: { submissions: { select: { createdAt: true } } } }, 
      meetings: { select: { scheduledAt: true } }, 
      proposals: { select: { status: true } } 
    } 
  });

  const rows = groups.map((g) => {
    const reasons: string[] = []; 
    let score = 0;
    const od = g.milestones.filter((m) => m.dueDate.getTime() < now && ["PENDING", "REVISION_REQUESTED"].includes(m.status)).length;
    
    if (od) { 
      reasons.push(`${od} overdue milestone${od > 1 ? "s" : ""}`); 
      score += od * 2; 
    }
    if (!g.supervisorId) { 
      reasons.push("No supervisor assigned"); 
      score += 3; 
    } else {
      const lastMeet = Math.max(0, ...g.meetings.filter((m) => m.scheduledAt.getTime() < now).map((m) => m.scheduledAt.getTime()));
      if (now - lastMeet > 30 * DAY) { 
        reasons.push("No meeting in the last 30 days"); 
        score += 1; 
      }
      if (!g.milestones.length) { 
        reasons.push("No milestones defined"); 
        score += 1; 
      }
    }
    
    const waiting = g.milestones.filter((m) => m.status === "SUBMITTED" && m.submissions[0] && now - m.submissions[0].createdAt.getTime() > 7 * DAY).length;
    if (waiting) { 
      reasons.push(`${waiting} submission${waiting > 1 ? "s" : ""} awaiting review for over 7 days`); 
      score += waiting; 
    }
    if (g.proposals[0]?.status === "REVISION_REQUESTED") { 
      reasons.push("Proposal revision pending"); 
      score += 1; 
    }
    
    return { g, reasons, score, level: score >= 4 ? "High" : score >= 2 ? "Medium" : "Low" };
  }).filter((r) => r.score > 0).sort((a, b) => b.score - a.score);

  const count = (l: string) => rows.filter((r) => r.level === l).length;

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
          
          --danger-color: #DC2626;
          --warning-color: #D97706;
          --success-color: #159641;
          
          --shadow-sm: 0 1px 2px 0 rgba(15, 23, 42, 0.05);
          --shadow-md: 0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.07);
          --shadow-lg: 0 20px 25px -5px rgba(47, 44, 126, 0.08), 0 8px 10px -6px rgba(47, 44, 126, 0.08);
          
          --radius-lg: 16px;
          --radius-md: 12px;
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

        .wrap.risk-dashboard {
          max-width: 1280px;
          margin: 0 auto;
          padding: 32px 20px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        @media (min-width: 768px) {
          .wrap.risk-dashboard {
            padding: 48px 32px;
            gap: 40px;
          }
        }

        .dashboard-header {
          display: flex;
          flex-direction: column;
          gap: 8px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 24px;
        }

        .portal-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 12px;
          background-color: rgba(47, 44, 126, 0.08);
          color: var(--primary);
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          width: fit-content;
        }

        .dashboard-header h1 {
          font-size: clamp(1.75rem, 3vw, 2.25rem);
          font-weight: 800;
          color: var(--primary);
          margin: 0;
          letter-spacing: -0.02em;
        }

        .muted {
          font-size: 0.9375rem;
          color: var(--text-muted);
          margin: 0;
          line-height: 1.5;
        }

        .muted strong {
          color: var(--text-main);
        }

        .risk-metrics-grid .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 20px;
          margin: 0;
          padding: 0;
        }

        .card {
          background-color: var(--bg-card);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          border: 1px solid var(--border-color);
          transition: var(--transition);
        }

        .card:hover {
          box-shadow: var(--shadow-lg);
          border-color: rgba(47, 44, 126, 0.15);
        }

        .card-body {
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .risk-metric-card h3 {
          font-size: 0.875rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0;
          color: var(--text-muted);
        }

        .risk-count {
          font-size: 2.25rem;
          font-weight: 800;
          color: var(--primary);
          line-height: 1;
        }

        .risk-high { border-top: 4px solid var(--danger-color); }
        .risk-medium { border-top: 4px solid var(--warning-color); }
        .risk-low { border-top: 4px solid var(--secondary); }

        .risk-listings {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .ok-banner {
          background-color: rgba(21, 150, 65, 0.08);
          border: 1px solid rgba(21, 150, 65, 0.2);
          color: var(--secondary);
          padding: 20px 24px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          gap: 16px;
          font-weight: 600;
        }

        .ok-icon {
          font-size: 1.25rem;
          background-color: var(--secondary);
          color: #fff;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }

        .risk-cards-stack {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .risk-item-card {
          margin-bottom: 0 !important;
        }

        .row.risk-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
        }

        .risk-item-card h3 {
          font-size: 1.125rem;
          font-weight: 700;
          margin: 0;
          color: var(--primary);
        }

        .badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.03em;
          text-transform: uppercase;
          background-color: var(--secondary);
          color: #ffffff;
        }

        .badge.REJECTED {
          background-color: rgba(220, 38, 38, 0.1);
          color: var(--danger-color);
          border: 1px solid rgba(220, 38, 38, 0.2);
        }

        .badge.PENDING_APPROVAL {
          background-color: rgba(217, 119, 6, 0.1);
          color: var(--warning-color);
          border: 1px solid rgba(217, 119, 6, 0.2);
        }

        .project-meta {
          font-size: 0.875rem;
        }

        .reasons-list {
          margin: 4px 0 0 18px;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .reasons-list li {
          font-size: 0.875rem;
          color: var(--danger-color);
          font-weight: 500;
          line-height: 1.4;
        }
      `}</style>

      <main className="wrap risk-dashboard">
        <header className="dashboard-header">
          <span className="portal-badge">PUB Supervise • Risk & Compliance Monitor</span>
          <h1>Risky projects</h1>
          <p className="muted">
            Projects that need attention, ranked by risk. <strong>{groups.length}</strong> projects in total tracked.
          </p>
        </header>

        <section className="risk-metrics-grid">
          <div className="grid">
            {["High", "Medium", "Low"].map((l) => (
              <article key={l} className={`card risk-metric-card risk-${l.toLowerCase()}`}>
                <div className="card-body">
                  <h3>{l} risk</h3>
                  <span className="risk-count">{count(l)}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="risk-listings" aria-label="Risky Project List">
          {rows.length === 0 && (
            <div className="ok-banner">
              <span className="ok-icon">&#10003;</span>
              <p>All projects are on track. No current compliance or timeline risks detected.</p>
            </div>
          )}

          <div className="risk-cards-stack">
            {rows.map(({ g, reasons, level }) => (
              <article className="card risk-item-card" key={g.id}>
                <div className="card-body">
                  <header className="row risk-card-header">
                    <h3>{g.title}</h3>
                    <span className={"badge " + (level === "High" ? "REJECTED" : level === "Medium" ? "PENDING_APPROVAL" : "")}>
                      {level} risk
                    </span>
                  </header>
                  
                  <p className="muted project-meta">
                    <strong>Supervisor:</strong> {g.supervisor?.name || "None"} &bull; <strong>Team:</strong> {g.members.map((m) => m.user.name).join(", ")}
                  </p>

                  <ul className="reasons-list">
                    {reasons.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}