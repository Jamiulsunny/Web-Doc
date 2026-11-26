import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { FileRow } from "@/components/vault/FileRow";
import { SearchGlyph } from "@/components/vault/OrbitPanels";
import { cn } from "@/lib/utils";
import { categoryLabel, findCourse, fuzzyScore, FILE_TYPES, type FileType } from "@/lib/vault-data";
import { addRecent } from "@/lib/vault-store";

export const Route = createFileRoute("/course/$code")({
  validateSearch: (s: Record<string, unknown>): { file?: string } => (typeof s["file"] === "string" ? { file: s["file"] } : {}),
  loader: ({ params }) => {
    const course = findCourse(params.code);
    if (!course) throw notFound();
    return { code: course.code, title: course.title };
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `${loaderData.code} ${loaderData.title} · BRACU Vault` : "Course · BRACU Vault";
    const d = loaderData ? `Notes, slides, past questions, labs and projects for ${loaderData.code} ${loaderData.title} at BRAC University.` : "BRACU course materials.";
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-6 pt-40 text-center">
      <h1 className="font-display text-3xl font-semibold text-fg">Course not found</h1>
      <p className="mt-2 text-sm text-fg/55">That course isn't in the vault yet.</p>
      <Link to="/orbit" className="mt-6 inline-flex rounded-full bg-fg px-5 py-2.5 text-sm font-semibold text-bg">Back to Orbit</Link>
    </div>
  ),
  component: CoursePage,
});

const LANGS = [
  { id: "python", name: "Python", desc: "Python implementation - notes, labs, assignments and solutions" },
  { id: "java", name: "Java", desc: "Java implementation - notes, labs, assignments and solutions" },
] as const;

function PythonIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
      <path fill="#3776AB" d="M15.9 3c-6.6 0-6.2 2.9-6.2 2.9v3h6.3v.9H7.2S3 9.3 3 16s3.7 6.4 3.7 6.4h2.2v-3.1s-.1-3.7 3.6-3.7h6.2s3.5.1 3.5-3.4V6.5S22.7 3 15.9 3Zm-3.4 2a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z" />
      <path fill="#FFD43B" d="M16.1 29c6.6 0 6.2-2.9 6.2-2.9v-3H16v-.9h8.8S29 22.7 29 16s-3.7-6.4-3.7-6.4h-2.2v3.1s.1 3.7-3.6 3.7h-6.2s-3.5-.1-3.5 3.4v5.7S9.3 29 16.1 29Zm3.4-2a1.1 1.1 0 1 1 0-2.2 1.1 1.1 0 0 1 0 2.2Z" />
    </svg>
  );
}
function JavaIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden>
      <path fill="#E76F00" d="M17.6 4c1.6 3.7-4.6 5.4-2 9 .9 1.2 2.5 2 .9 4 1.7-2.2 2.5-3.3 1-5.2-1.6-2.1 2.6-4 .1-7.8Zm2.6 4.5c-3.9 2.9-1.6 4.7-.2 6.2-2.4-2-1.9-3.5.2-6.2Z" />
      <path fill="#5382A1" d="M11.6 19.3s-1 .6.7.8c2 .2 3.1.2 5.3-.2.4.3 1 .5 1.4.6-5.1 2.2-11.6-.1-7.4-1.2Zm-.6-2.8s-1.1.8.6 1c2.2.2 4 .3 7-.3.4.4 1 .6 1 .6-6.3 1.8-13.2.1-8.6-1.3Zm11.1 5.4s.7.6-.8 1.1c-2.9.9-12.2 1.2-14.8 0-.9-.4.8-1 1.4-1.1.6-.1.9-.1.9-.1-1-.7-6.6 1.4-2.8 2 10.2 1.7 18.6-.7 16.1-1.9ZM13 15.3s-4.6 1.1-1.6 1.5c1.3.2 3.8.1 6.2-.1 1.9-.2 3.9-.5 3.9-.5s-.7.3-1.2.6c-4.8 1.3-14 .7-11.4-.6 2.2-1.1 4.1-.9 4.1-.9Zm8.4 4.7c4.9-2.5 2.6-5 1-4.7-.4.1-.6.2-.6.2s.1-.2.4-.3c3.1-1.1 5.5 3.2-1 4.9 0 0 .1-.1.2-.1Zm-7.1 6.6c4.7.3 11.9-.2 12.1-2.4 0 0-.3.8-3.9 1.5-4 .8-9 .7-11.9.2 0 0 .6.5 3.7.7Z" />
    </svg>
  );
}

function CoursePage() {
  const { code } = Route.useParams();
  const { file: focusFile } = Route.useSearch();
  const course = findCourse(code)!;
  const [lang, setLang] = useState<"python" | "java">("python");
  const [type, setType] = useState<"All" | FileType>("All");
  const [q, setQ] = useState("");

  useEffect(() => {
    addRecent(course.code);
  }, [course.code]);

  useEffect(() => {
    if (!focusFile) return;
    const t = setTimeout(() => document.getElementById(`file-${focusFile}`)?.scrollIntoView({ behavior: "smooth", block: "center" }), 250);
    return () => clearTimeout(t);
  }, [focusFile]);

  const files = useMemo(() => {
    const query = q.trim();
    let list = course.files.filter((f) => type === "All" || f.type === type);
    if (query) {
      list = list
        .map((f) => ({ f, s: Math.max(fuzzyScore(query, f.title), fuzzyScore(query, f.tags.join(" "))) }))
        .filter((x) => x.s >= 0)
        .sort((a, b) => b.s - a.s)
        .map((x) => x.f);
    }
    return list;
  }, [course.files, type, q]);

  const contribute = () => toast("Contributions open soon", { description: "Uploading your own notes will be available once sign-in is set up." });

  return (
    <div className="mx-auto w-full max-w-[76rem] px-5 pb-24 pt-28 sm:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <nav className="flex items-center gap-2 text-sm">
          <Link to="/orbit" className="text-fg/50 transition-colors hover:text-fg">Orbit</Link>
          <span className="text-fg/25">/</span>
          <span className="font-medium text-fg">{course.code}</span>
        </nav>
        <div className="flex items-center gap-3">
          <button onClick={contribute} className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-4 py-2 text-sm font-semibold text-bg shadow-accent transition-transform hover:scale-[1.03]">
            <UploadIcon /> Upload
          </button>
          <div className="relative w-full sm:w-72">
            <SearchGlyph className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-fg/35" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search in ${course.code}…`} aria-label={`Search in ${course.code}`} className="glass-strong w-full rounded-full py-2.5 pl-10 pr-4 text-sm text-fg outline-none placeholder:text-fg/35 focus:ring-1 focus:ring-accent/50" />
          </div>
        </div>
      </div>

      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }} className="glass-strong relative mt-5 overflow-hidden rounded-[2rem] p-8 shadow-glow">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex rounded-full border border-fg/10 bg-fg/[0.03] px-3 py-1 text-xs text-fg/60">{categoryLabel(course.category)}</span>
            <h1 className="mt-3 font-display text-5xl font-bold tracking-tight text-fg">{course.code}</h1>
            <p className="mt-2 text-base text-fg/55">{course.title}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-4xl font-semibold text-fg">{course.fileCount}</span>
              <span className="text-sm text-fg/45">files</span>
            </div>
            <button onClick={contribute} className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-4 py-2 text-sm font-semibold text-bg shadow-accent transition-transform hover:scale-[1.03]">
              <UploadIcon /> Contribute
            </button>
          </div>
        </div>
      </motion.section>

      <h2 className="mt-10 text-xs font-semibold uppercase tracking-[0.2em] text-fg/50">Choose language</h2>
      <div className="mt-3 grid gap-4 md:grid-cols-2">
        {LANGS.map((l, i) => {
          const active = lang === l.id;
          return (
            <motion.button key={l.id} onClick={() => setLang(l.id)} aria-pressed={active} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 * (i + 1), duration: 0.45 }} className={cn("glass-strong group relative overflow-hidden rounded-[2rem] p-7 text-left transition-shadow hover:shadow-glow", active && "shadow-glow ring-1 ring-accent/40")}>
              <span className="grid h-14 w-14 place-items-center rounded-2xl border border-fg/10 bg-bg">{l.id === "python" ? <PythonIcon /> : <JavaIcon />}</span>
              <h3 className="mt-5 font-display text-2xl font-semibold text-fg">{l.name}</h3>
              <p className="mt-1.5 text-sm text-fg/55">{l.desc}</p>
              {l.id === "python" ? (
                <p className="mt-1 text-xs text-fg/40">{course.fileCount} files · 2 folders</p>
              ) : (
                <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-accent"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> Initial folders ready · Contributions open</p>
              )}
              <div className="mt-5 flex gap-2">
                {["Lab", "Theory"].map((t) => (
                  <span key={t} className="rounded-full border border-fg/15 px-3 py-1 text-xs text-fg/55">{t}</span>
                ))}
              </div>
            </motion.button>
          );
        })}
      </div>

      <section className="mt-10">
        <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          {(["All", ...FILE_TYPES] as const).map((t) => {
            const count = t === "All" ? course.fileCount : course.counts[t];
            return (
              <button key={t} onClick={() => setType(t)} aria-pressed={type === t} className={cn("flex flex-shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition", type === t ? "glass-strong text-fg" : "glass text-fg/45")}>
                {t} <span className="text-fg/35">{count}</span>
              </button>
            );
          })}
        </div>
        <div className="glass-strong mt-4 rounded-3xl p-2 shadow-soft">
          {lang === "java" ? (
            <div className="px-6 py-14 text-center">
              <p className="font-display text-lg font-semibold text-fg">Java folders are ready</p>
              <p className="mt-1 text-sm text-fg/50">No files yet. Be the first to contribute notes or lab solutions.</p>
              <button onClick={contribute} className="mt-5 inline-flex items-center gap-2 rounded-full bg-fg px-4 py-2 text-sm font-semibold text-bg">Contribute →</button>
            </div>
          ) : files.length === 0 ? (
            <p className="px-6 py-14 text-center text-sm text-fg/45">No files match{q ? ` “${q}”` : ""}.</p>
          ) : (
            files.map((f) => <FileRow key={f.id} file={f} query={q} highlighted={focusFile === f.id} />)
          )}
        </div>
      </section>
    </div>
  );
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
      <path d="M12 16V4m0 0-5 5m5-5 5 5M5 20h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
