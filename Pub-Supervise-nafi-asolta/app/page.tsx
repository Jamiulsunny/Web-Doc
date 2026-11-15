import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getUser } from "@/lib/auth";
export const dynamic = "force-dynamic";

const ICONS: Record<string, string[]> = {
  file: [
    "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z",
    "M14 2v6h6",
    "M16 13H8",
    "M16 17H8",
  ],
  flag: [
    "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z",
    "M4 22v-7",
  ],
  check: ["M22 11.08V12a10 10 0 1 1-5.93-9.14", "M22 4 12 14.01l-3-3"],
  book: [
    "M4 19.5A2.5 2.5 0 0 1 6.5 17H20",
    "M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z",
  ],
  users: [
    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2",
    "M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8",
    "M23 21v-2a4 4 0 0 0-3-3.87",
    "M16 3.13a4 4 0 0 1 0 7.75",
  ],
  grid: ["M3 3h7v9H3z", "M14 3h7v5h-7z", "M14 12h7v9h-7z", "M3 16h7v5H3z"],
  clipboard: [
    "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
    "M9 2h6v4H9z",
  ],
  cap: ["M22 10 12 5 2 10l10 5 10-5z", "M6 12v5c3 3 9 3 12 0v-5"],
  arrow: ["M5 12h14", "M12 5l7 7-7 7"],
  chat: ["M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"],
  layers: ["M12 2 2 7l10 5 10-5-10-5z", "M2 17l10 5 10-5", "M2 12l10 5 10-5"],
  clock: ["M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0", "M12 6v6l4 2"],
  pulse: ["M22 12h-4l-3 9L9 3l-3 9H2"],
  award: [
    "M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z",
    "M8.21 13.89 7 23l5-3 5 3-1.21-9.12",
  ],
  globe: [
    "M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
    "M2 12h20",
    "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  ],
};
function Icon({ name, size = 22 }: { name: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name].map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

const orbit = [
  ["file", "Propose", "#93c5fd", "0deg"],
  ["flag", "Build", "#fcd34d", "90deg"],
  ["check", "Defend", "#6ee7b7", "180deg"],
  ["book", "Publish", "#c4b5fd", "270deg"],
];
const steps = [
  ["file", "Propose", "Submit your idea"],
  ["flag", "Build", "Track milestones"],
  ["check", "Defend", "Score by rubric"],
  ["book", "Publish", "Share your research"],
];
const roles = [
  ["#2563eb", "cap", "Student", "Submit, track, collaborate"],
  ["#059669", "users", "Supervisor", "Review, guide, approve"],
  ["#b91c1c", "grid", "Coordinator", "Assign, monitor, publish"],
  ["#d97706", "clipboard", "Board Member", "Evaluate with rubric"],
];
const feats = [
  ["chat", "Real-time chat", "Private and encrypted"],
  ["layers", "Versioned proposals", "Every change saved"],
  ["clock", "Overdue alerts", "Never miss a deadline"],
  ["pulse", "Risk dashboard", "Spot problems early"],
  ["award", "Rubric scoring", "Fair, structured marks"],
  ["globe", "Public journal", "Share finished work"],
];
const PANEL: Record<string, string> = {
  COORDINATOR: "/coordinator",
  SUPERVISOR: "/supervisor",
  BOARD_MEMBER: "/board",
  STUDENT: "/student",
};

export default async function Home() {
  const u = await getUser();
  const roleList = (u?.roles || []) as string[];
  const first = ["COORDINATOR", "SUPERVISOR", "BOARD_MEMBER", "STUDENT"].find(
    (r) => roleList.includes(r),
  );
  const dash =
    roleList.length > 1 ? "/dashboard" : first ? PANEL[first] : "/dashboard";

  let stats = { journal: 0, projects: 0, supervisors: 0 },
    latest: any[] = [];
  try {
    const [journal, projects, supervisors, l] = await Promise.all([
      prisma.journalSubmission.count({ where: { status: "PUBLISHED" } }),
      prisma.projectGroup.count(),
      prisma.user.count({
        where: { roles: { has: "SUPERVISOR" }, status: "ACTIVE" },
      }),
      prisma.journalSubmission.findMany({
        where: { status: "PUBLISHED" },
        include: { group: { select: { title: true } } },
        orderBy: { publishedAt: "desc" },
        take: 3,
      }),
    ]);
    stats = { journal, projects, supervisors };
    latest = l;
  } catch {}

  return (
    <div className="lp">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <section className="lp-hero">
        <div className="lp-wrap lp-hgrid">
          <div className="lp-copy">
            <span className="lp-tag">
              <img src="/logo.png" alt="" />
              Pundra University of Science &amp; Technology
            </span>
            <h1>
              Research supervision, <span>simplified.</span>
            </h1>
            <p className="lp-sub">
              From proposal to defense to publication, in one platform.
            </p>
            <div className="lp-cta">
              {u ? (
                <Link href={dash} className="lp-btn p">
                  Open dashboard <Icon name="arrow" size={18} />
                </Link>
              ) : (
                <>
                  <Link href="/register" className="lp-btn p">
                    Get started <Icon name="arrow" size={18} />
                  </Link>
                  <Link href="/login" className="lp-btn g">
                    Log in
                  </Link>
                </>
              )}
              <Link href="/journal" className="lp-btn g">
                Browse journal
              </Link>
            </div>
          </div>

          <div className="lp-orbit" aria-hidden="true">
            <div className="lp-glow" />
            <div className="lp-ring r2" />
            <div className="lp-spin">
              <div className="lp-ring r1" />
              {orbit.map(([ic, t, c, a]) => (
                <div className="lp-arm" key={t} style={{ ["--a" as any]: a }}>
                  <div className="lp-sat">
                    <div className="lp-up">
                      <div className="lp-rev">
                        <span className="lp-chipo" style={{ color: c }}>
                          <Icon name={ic} size={24} />
                        </span>
                        <em>{t}</em>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="lp-core">
              <img src="/logo.png" alt="" />
            </div>
          </div>
        </div>
      </section>

      <div className="lp-wrap">
        <div className="lp-stats">
          <div>
            <b>{stats.projects}</b>
            <span>Projects</span>
          </div>
          <div>
            <b>{stats.supervisors}</b>
            <span>Supervisors</span>
          </div>
          <div>
            <b>{stats.journal}</b>
            <span>Published papers</span>
          </div>
        </div>
      </div>

      <section className="lp-sec">
        <div className="lp-wrap">
          <div className="lp-head">
            <h2>How it works</h2>
          </div>
          <div className="lp-grid4">
            {steps.map(([ic, t, d], i) => (
              <div className="lp-step" key={t}>
                <span className="lp-num">0{i + 1}</span>
                <span className="lp-ico">
                  <Icon name={ic} />
                </span>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-sec alt">
        <div className="lp-wrap">
          <div className="lp-head">
            <h2>Built for every role</h2>
          </div>
          <div className="lp-grid4">
            {roles.map(([c, ic, t, d]) => (
              <div className="lp-role" key={t} style={{ ["--c" as any]: c }}>
                <span className="lp-ico c">
                  <Icon name={ic} />
                </span>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-sec">
        <div className="lp-wrap">
          <div className="lp-head">
            <h2>Everything you need</h2>
          </div>
          <div className="lp-grid3">
            {feats.map(([ic, t, d]) => (
              <div className="lp-feat" key={t}>
                <span className="lp-ico">
                  <Icon name={ic} />
                </span>
                <div>
                  <h3>{t}</h3>
                  <p>{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="lp-sec alt">
        <div className="lp-wrap">
          <div className="lp-head row">
            <h2>Departmental Journal</h2>
            <Link href="/journal" className="lp-link">
              View all <Icon name="arrow" size={16} />
            </Link>
          </div>
          <div className="lp-grid3">
            {latest.length === 0 ? (
              <div className="lp-empty">
                Published research will appear here.
              </div>
            ) : (
              latest.map((j) => (
                <Link key={j.id} href={`/journal/${j.id}`} className="lp-paper">
                  <span className="lp-code">{j.citationCode}</span>
                  <h3>{j.group.title}</h3>
                  <p>{j.abstract}</p>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {!u && (
        <div className="lp-wrap">
          <div className="lp-banner">
            <h2>Start your project today</h2>
            <Link href="/register" className="lp-btn w">
              Create student account <Icon name="arrow" size={18} />
            </Link>
          </div>
        </div>
      )}

      <footer className="lp-foot">
        <div className="lp-wrap">
          <div className="lp-brand">
            <img src="/logo.png" alt="PUB" />
            <span>
              PubSupervise
              <small>
                Pundra University of Science &amp; Technology, Bogura
              </small>
            </span>
          </div>
          <div className="lp-flinks">
            <Link href="/journal">Journal</Link>
            {!u && (
              <>
                <Link href="/login">Log in</Link>
                <Link href="/register">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

const css = `
.lp{--b:#2e3192;--bd:#1d2070;--ink:#0f172a;--mut:#64748b;--line:#e5e7eb;color:var(--ink)}
.lp a{text-decoration:none}.lp h1,.lp h2,.lp h3,.lp p{margin:0}
.lp-wrap{max-width:1160px;margin:0 auto;padding:0 24px}

/* hero */
.lp-hero{position:relative;overflow:hidden;color:#fff;padding:84px 0 130px;background:radial-gradient(700px 420px at 80% 20%,rgba(99,102,241,.55),transparent 65%),radial-gradient(600px 400px at 0% 100%,rgba(0,166,81,.28),transparent 60%),linear-gradient(135deg,#1d2070 0%,#2e3192 50%,#141746 100%)}
.lp-hero::before{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px);background-size:44px 44px;-webkit-mask-image:radial-gradient(ellipse at 70% 40%,#000 0%,transparent 70%);mask-image:radial-gradient(ellipse at 70% 40%,#000 0%,transparent 70%)}
.lp-hgrid{position:relative;display:grid;grid-template-columns:1.05fr .95fr;gap:40px;align-items:center}
.lp-tag{display:inline-flex;align-items:center;gap:8px;padding:6px 14px 6px 8px;border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.1);backdrop-filter:blur(6px);border-radius:99px;font-size:13px;font-weight:600}
.lp-tag img{width:22px;height:22px;border-radius:50%;background:#fff}
.lp h1{font-size:60px;line-height:1.03;letter-spacing:-.035em;margin:22px 0 18px;font-weight:800}
.lp h1 span{background:linear-gradient(90deg,#a5b4fc,#6ee7b7);-webkit-background-clip:text;background-clip:text;color:transparent}
.lp-sub{font-size:19px;color:rgba(255,255,255,.78);max-width:440px;line-height:1.55;margin-bottom:32px}
.lp-cta{display:flex;gap:12px;flex-wrap:wrap}
.lp-btn{display:inline-flex;align-items:center;gap:8px;padding:14px 26px;border-radius:12px;font-weight:700;font-size:15px;transition:.15s}
.lp-btn.p{background:#fff;color:var(--b);box-shadow:0 12px 30px rgba(0,0,0,.25)}.lp-btn.p:hover{transform:translateY(-2px);background:#f4f5ff}
.lp-btn.g{background:rgba(255,255,255,.08);color:#fff;border:1px solid rgba(255,255,255,.35)}.lp-btn.g:hover{background:rgba(255,255,255,.16)}
.lp-btn.w{background:#fff;color:var(--b)}.lp-btn.w:hover{background:#eef0ff}

/* orbit */
.lp-orbit{position:relative;width:min(460px,100%);aspect-ratio:1;margin:0 auto}
.lp-glow{position:absolute;inset:12%;border-radius:50%;background:radial-gradient(circle,rgba(129,140,248,.55),transparent 68%);filter:blur(10px)}
.lp-ring{position:absolute;border-radius:50%;border:1.5px dashed rgba(255,255,255,.3)}
.lp-ring.r1{inset:0}.lp-ring.r2{inset:19%;border-style:solid;border-color:rgba(255,255,255,.14)}
.lp-spin{position:absolute;inset:0;animation:lp-spin 60s linear infinite}
.lp-arm{position:absolute;inset:0;transform:rotate(var(--a))}
.lp-sat{position:absolute;left:50%;top:0;transform:translate(-50%,-50%)}
.lp-up{transform:rotate(calc(-1 * var(--a)))}
.lp-rev{display:flex;flex-direction:column;align-items:center;gap:6px;animation:lp-spin 60s linear infinite reverse}
.lp-chipo{display:grid;place-items:center;width:58px;height:58px;border-radius:18px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.3);backdrop-filter:blur(8px);box-shadow:0 12px 30px rgba(0,0,0,.25)}
.lp-rev em{font-style:normal;font-size:12px;font-weight:700;letter-spacing:.04em;color:rgba(255,255,255,.9)}
.lp-core{position:absolute;inset:34%;border-radius:50%;background:#fff;display:grid;place-items:center;box-shadow:0 0 0 12px rgba(255,255,255,.1),0 0 0 26px rgba(255,255,255,.06),0 24px 60px rgba(0,0,0,.35)}
.lp-core img{width:82%;height:82%;object-fit:contain}
@keyframes lp-spin{to{transform:rotate(360deg)}}
@media(prefers-reduced-motion:reduce){.lp-spin,.lp-rev{animation:none}}

/* stats */
.lp-stats{display:grid;grid-template-columns:repeat(3,1fr);background:#fff;border:1px solid var(--line);border-radius:18px;box-shadow:0 20px 50px rgba(30,32,100,.14);margin-top:-52px;position:relative}
.lp-stats div{padding:24px;text-align:center}.lp-stats div+div{border-left:1px solid var(--line)}
.lp-stats b{display:block;font-size:34px;letter-spacing:-.02em;color:var(--b)}.lp-stats span{color:var(--mut);font-size:14px}

/* sections */
.lp-sec{padding:88px 0 0}.lp-sec.alt{background:#f8f9ff;margin-top:88px;padding:80px 0}
.lp-head{text-align:center;margin-bottom:40px}.lp-head h2{font-size:34px;letter-spacing:-.025em;font-weight:800}
.lp-head.row{display:flex;justify-content:space-between;align-items:center;text-align:left}
.lp-link{display:inline-flex;align-items:center;gap:6px;color:var(--b);font-weight:700;font-size:15px}
.lp-grid4{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}.lp-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.lp-step,.lp-role,.lp-feat{position:relative;background:#fff;border:1px solid var(--line);border-radius:18px;padding:28px 24px;transition:.2s}
.lp-step:hover,.lp-role:hover,.lp-feat:hover,.lp-paper:hover{transform:translateY(-4px);box-shadow:0 18px 40px rgba(30,32,100,.12)}
.lp-num{position:absolute;top:20px;right:22px;font-size:13px;font-weight:800;color:#c7cbe8;letter-spacing:.05em}
.lp-ico{display:inline-grid;place-items:center;width:48px;height:48px;border-radius:14px;background:#eef0ff;color:var(--b);flex:none}
.lp-step .lp-ico,.lp-role .lp-ico{margin-bottom:18px}
.lp-ico.c{background:color-mix(in srgb,var(--c) 12%,#fff);color:var(--c)}
.lp-role{border-top:3px solid var(--c)}
.lp-step h3,.lp-role h3,.lp-feat h3{font-size:18px;margin-bottom:4px}.lp-step p,.lp-role p,.lp-feat p{color:var(--mut);font-size:15px}
.lp-feat{display:flex;gap:16px;align-items:center;padding:22px}
.lp-paper{display:block;background:#fff;border:1px solid var(--line);border-radius:18px;padding:24px;color:inherit;transition:.2s}
.lp-code{display:inline-block;font-size:12px;font-weight:700;color:var(--b);background:#eef0ff;padding:4px 10px;border-radius:99px;margin-bottom:14px}
.lp-paper h3{font-size:18px;line-height:1.3;margin-bottom:8px;color:var(--ink)}
.lp-paper p{color:var(--mut);font-size:14px;line-height:1.55;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.lp-empty{grid-column:1/-1;text-align:center;color:var(--mut);padding:40px;border:1px dashed #cfd4ea;border-radius:18px;background:#fff}
.lp-banner{margin-top:88px;border-radius:24px;padding:54px 24px;text-align:center;color:#fff;background:radial-gradient(600px 240px at 80% 0,#4a4fd0 0%,transparent 70%),linear-gradient(135deg,var(--b),#171a52)}
.lp-banner h2{font-size:34px;letter-spacing:-.02em;margin-bottom:22px}
.lp-foot{margin-top:88px;border-top:1px solid var(--line);padding:28px 0;background:#fff}
.lp-foot .lp-wrap{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap}
.lp-brand{display:flex;align-items:center;gap:12px;font-weight:700;color:var(--b)}.lp-brand img{width:40px;height:40px}.lp-brand small{display:block;font-weight:500;color:var(--mut);font-size:12px}
.lp-flinks{display:flex;gap:22px}.lp-flinks a{color:var(--mut);font-size:14px;font-weight:600}.lp-flinks a:hover{color:var(--b)}

@media(max-width:960px){.lp-hgrid{grid-template-columns:1fr;text-align:center}.lp-sub{margin-left:auto;margin-right:auto}.lp-cta{justify-content:center}.lp h1{font-size:42px}.lp-orbit{width:min(380px,100%)}.lp-grid4{grid-template-columns:repeat(2,1fr)}.lp-grid3{grid-template-columns:repeat(2,1fr)}}
@media(max-width:560px){.lp-hero{padding:56px 0 110px}.lp-grid4,.lp-grid3{grid-template-columns:1fr}.lp-stats{grid-template-columns:1fr}.lp-stats div+div{border-left:0;border-top:1px solid var(--line)}.lp h1{font-size:36px}.lp-head h2,.lp-banner h2{font-size:28px}.lp-chipo{width:48px;height:48px}}
`;