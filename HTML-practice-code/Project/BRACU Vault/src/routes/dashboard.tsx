import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { FileRow } from "@/components/vault/FileRow";
import { ALL_FILES, categoryLabel, findCourse, findFile, FILE_TYPES, RING_COLOR, type FileType } from "@/lib/vault-data";
import { clearRecent, useRecent, useSaved } from "@/lib/vault-store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Command Center · BRACU Vault" },
      { name: "description", content: "Your recent courses, saved files and a live overview of everything in the BRACU Vault." },
      { property: "og:title", content: "Command Center · BRACU Vault" },
      { property: "og:description", content: "Pick up where you left off and keep your saved BRACU files close." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const TYPE_COLOR: Record<FileType, string> = {
  Notes: "var(--accent)",
  Questions: "var(--highlight)",
  Slides: "var(--accent-2)",
  Assignments: "var(--accent-3)",
  Projects: "color-mix(in oklab, var(--accent-2) 80%, var(--fg))",
  Solutions: "var(--accent-4)",
};
const LEGEND_ORDER: FileType[] = ["Notes", "Questions", "Slides", "Assignments", "Projects", "Solutions"];

function Donut() {
  const total = ALL_FILES.length;
  const counts = FILE_TYPES.map((t) => ({ t, n: ALL_FILES.filter((f) => f.type === t).length }));
  const r = 40;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="relative mx-auto h-48 w-48">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        {counts.map(({ t, n }) => {
          const len = (n / total) * c;
          const el = (
            <motion.circle key={t} cx="50" cy="50" r={r} fill="none" stroke={TYPE_COLOR[t]} strokeWidth="10" strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }} />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="font-display text-3xl font-semibold text-fg">{total}</div>
          <div className="text-xs text-fg/45">files</div>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const recent = useRecent();
  const { saved } = useSaved();
  const recentCourses = recent.map((c) => findCourse(c)).filter((c): c is NonNullable<typeof c> => !!c);
  const savedFiles = saved.map((id) => findFile(id)).filter((f): f is NonNullable<typeof f> => !!f);

  return (
    <div className="mx-auto w-full max-w-[80rem] px-5 pb-24 pt-32 sm:px-8 lg:px-[7.5rem]">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-accent"><span className="h-2 w-2 rounded-full bg-accent" /> Your space</span>
        <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight text-fg">Command Center</h1>
        <p className="mt-3 max-w-xl text-base text-fg/55">Everything you've touched and everything you should see next, stored locally, just for you.</p>
      </motion.div>

      <section className="mt-14">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-fg">Continue where you left off</h2>
          <div className="flex items-center gap-3 text-xs text-fg/45">
            {recentCourses.length > 0 && <button onClick={clearRecent} className="hover:text-fg">Clear</button>}
            <span>{recentCourses.length} recent</span>
          </div>
        </div>
        {recentCourses.length === 0 ? (
          <div className="mt-5 rounded-3xl border border-dashed border-fg/15 px-6 py-10 text-center text-sm text-fg/50">
            Open any course and it'll float up here. <Link to="/orbit" className="text-accent hover:underline">Start exploring →</Link>
          </div>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recentCourses.map((c, i) => (
              <motion.div key={c.code} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
                <Link to="/course/$code" params={{ code: c.code }} className="glass-strong group relative block overflow-hidden rounded-3xl p-5 transition-shadow hover:shadow-glow">
                  <span className="absolute inset-x-0 top-0 h-1" style={{ background: `linear-gradient(90deg, ${RING_COLOR[c.category]}, transparent)` }} />
                  <div className="text-xs text-fg/45">{categoryLabel(c.category)}</div>
                  <div className="mt-2 font-display text-2xl font-semibold text-fg">{c.code}</div>
                  <div className="truncate text-sm text-fg/55">{c.title}</div>
                  <div className="mt-4 text-xs text-fg/45"><span className="font-semibold text-fg">{c.fileCount}</span> files · Open →</div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <section>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-semibold text-fg">Saved files</h2>
            <span className="text-xs text-fg/45">{savedFiles.length} saved</span>
          </div>
          {savedFiles.length === 0 ? (
            <div className="mt-5 rounded-3xl border border-dashed border-fg/15 px-6 py-10 text-center text-sm text-fg/50">Tap the bookmark on any file to keep it floating here for later.</div>
          ) : (
            <div className="glass-strong mt-5 rounded-3xl p-2 shadow-soft">
              {savedFiles.map((f) => <FileRow key={f.id} file={f} showCourse />)}
            </div>
          )}
        </section>

        <aside className="glass-strong self-start rounded-3xl p-6 shadow-glow">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-fg/50">Vault at a glance</h2>
          <div className="mt-6"><Donut /></div>
          <ul className="mt-6 grid grid-cols-2 gap-x-5 gap-y-3">
            {LEGEND_ORDER.map((t) => (
              <li key={t} className="flex items-center gap-2 text-xs">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: TYPE_COLOR[t] }} />
                <span className="flex-1 text-fg/60">{t}</span>
                <span className="font-semibold text-fg/80">{ALL_FILES.filter((f) => f.type === t).length}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
