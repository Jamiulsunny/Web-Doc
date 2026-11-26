import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { CurriculumPanel, OrbitSearch, Radar, SearchGlyph } from "@/components/vault/OrbitPanels";
import { Highlight } from "@/components/vault/Highlight";
import { useOrbitCapable } from "@/hooks/use-orbit-capable";
import { cn } from "@/lib/utils";
import { buildOrbit, fuzzyScore, RING_ORDER, type CategoryId, type OrbitData, type OrbitNode } from "@/lib/vault-data";

const OrbitScene = lazy(() => import("@/components/vault/OrbitScene"));

export const Route = createFileRoute("/orbit")({
  head: () => ({
    meta: [
      { title: "Orbit · BRACU Vault" },
      { name: "description", content: "Navigate the BRAC University CSE curriculum as a 3D orbital knowledge system: categories as rings, courses as nodes." },
      { property: "og:title", content: "Orbit · BRACU Vault" },
      { property: "og:description", content: "Explore all 40 BRACU CSE courses as planets orbiting a glowing core." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OrbitPage,
});

const SIZES = [
  { v: 0, l: "Any size" },
  { v: 10, l: "10+ files" },
  { v: 20, l: "20+ files" },
];

function Spinner() {
  return (
    <div className="grid h-full w-full place-items-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-fg/20 border-t-accent" />
    </div>
  );
}

function OrbitPage() {
  const data = useMemo(() => buildOrbit(), []);
  const capable = useOrbitCapable();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<OrbitNode | null>(null);
  const [cats, setCats] = useState<Set<CategoryId>>(() => new Set(RING_ORDER));
  const [minFiles, setMinFiles] = useState(0);
  const [panelOpen, setPanelOpen] = useState(true);

  const filtering = cats.size < RING_ORDER.length || minFiles > 0;
  const passes = (n: OrbitNode) => cats.has(n.category) && n.fileCount >= minFiles;
  const visibleNodes = useMemo(() => data.nodes.filter(passes), [data.nodes, cats, minFiles]); // eslint-disable-line react-hooks/exhaustive-deps
  const visibleCodes = filtering ? new Set(visibleNodes.map((n) => n.code)) : null;
  const groups = data.rings.map((r) => ({ category: r.category, label: r.label, color: r.color, nodes: visibleNodes.filter((n) => n.category === r.category) }));
  const selectedCode = selected?.code ?? null;

  useEffect(() => {
    if (selected && !passes(selected)) setSelected(null);
  }, [cats, minFiles]); // eslint-disable-line react-hooks/exhaustive-deps

  function toggleCat(c: CategoryId) {
    setCats((s) => {
      const n = new Set(s);
      if (n.has(c)) n.delete(c);
      else n.add(c);
      return n.size === 0 ? new Set(RING_ORDER) : n;
    });
  }

  if (capable === null) return <div className="h-[100svh]"><Spinner /></div>;
  if (!capable) return <OrbitList data={data} />;

  return (
    <section className="relative h-[100svh] w-full overflow-hidden">
      <div className="absolute inset-0">
        <Suspense fallback={<Spinner />}>
          <OrbitScene data={data} selectedCode={selectedCode} highlightCode={selectedCode} visibleCodes={visibleCodes} onSelect={setSelected} />
        </Suspense>
      </div>

      <div className="pointer-events-none absolute top-24 z-20 flex flex-col items-center transition-[left] duration-300" style={{ left: panelOpen ? "20rem" : "1.5rem", right: "1.5rem" }}>
        <div className="pointer-events-auto w-[min(92vw,34rem)]">
          <OrbitSearch nodes={visibleNodes} onSelect={setSelected} />
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            {data.rings.map((r) => {
              const on = cats.has(r.category);
              return (
                <button key={r.category} onClick={() => toggleCat(r.category)} aria-pressed={on} className={cn("flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition", on ? "glass-strong text-fg" : "glass text-fg/40")}>
                  <span className="h-2 w-2 rounded-full" style={{ background: r.color, opacity: on ? 1 : 0.4 }} />
                  {r.label.split(" ")[0]}
                </button>
              );
            })}
            <span className="mx-1 h-4 w-px bg-fg/10" />
            {SIZES.map((s) => (
              <button key={s.v} onClick={() => setMinFiles(s.v)} aria-pressed={minFiles === s.v} className={cn("rounded-full px-3 py-1.5 text-xs font-medium transition", minFiles === s.v ? "glass-strong text-fg" : "glass text-fg/40")}>
                {s.l}
              </button>
            ))}
          </div>
          <p className="mt-3 text-center text-xs text-fg/40">
            Search, pick from the list, or explore the map · press <kbd className="rounded border border-fg/15 px-1">/</kbd> anywhere
          </p>
        </div>
      </div>

      <div className="absolute left-5 top-24 z-20">
        <CurriculumPanel groups={groups} selectedCode={selectedCode} onSelect={setSelected} open={panelOpen} onToggle={() => setPanelOpen((o) => !o)} />
      </div>

      <div className="absolute bottom-5 right-5 z-20 hidden md:block">
        <Radar data={data} selectedCode={selectedCode} visibleCodes={visibleCodes} onSelect={setSelected} />
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div key="detail" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} transition={{ type: "spring", stiffness: 280, damping: 28 }} className="glass-strong absolute bottom-5 left-1/2 z-30 w-[min(92vw,22rem)] -translate-x-1/2 overflow-hidden rounded-3xl p-6 shadow-glow">
            <span className="absolute inset-x-0 top-0 h-1" style={{ background: `linear-gradient(90deg, ${selected.color}, transparent)` }} />
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="font-display text-2xl font-semibold text-fg">{selected.code}</div>
                <div className="truncate text-sm text-fg/55">{selected.title}</div>
              </div>
              <button onClick={() => setSelected(null)} aria-label="Close" className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full text-fg/45 transition-colors hover:bg-fg/5 hover:text-fg">✕</button>
            </div>
            {selected.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {selected.tags.map((t) => (
                  <span key={t} className="rounded-full border border-fg/10 bg-fg/[0.03] px-2.5 py-1 text-[11px] text-fg/60">{t}</span>
                ))}
              </div>
            )}
            <div className="mt-5 flex items-center justify-between">
              <span className="text-sm text-fg/50"><span className="font-semibold text-fg">{selected.fileCount}</span> files</span>
              <button onClick={() => navigate({ to: "/course/$code", params: { code: selected.code } })} className="inline-flex items-center gap-1.5 rounded-full bg-fg px-4 py-2 text-sm font-semibold text-bg transition-transform hover:scale-[1.03]">
                Open course →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

// Phone / no-3D fallback: searchable list of every course.
function OrbitList({ data }: { data: OrbitData }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<"all" | CategoryId>("all");
  const chips = [{ id: "all" as const, label: "All", color: "#C17A2B" }, ...data.rings.map((r) => ({ id: r.category, label: r.label.split(" ")[0], color: r.color }))];
  const list = useMemo(() => {
    const query = q.trim();
    const base = data.nodes.filter((n) => cat === "all" || n.category === cat);
    if (!query) return [...base].sort((a, b) => a.ringIndex - b.ringIndex);
    return base
      .map((n) => ({ n, s: Math.max(fuzzyScore(query, n.code) + 2, fuzzyScore(query, n.title)) }))
      .filter((x) => x.s >= 0)
      .sort((a, b) => b.s - a.s)
      .map((x) => x.n);
  }, [q, cat, data.nodes]);

  return (
    <div className="mx-auto w-full max-w-2xl px-5 pb-24 pt-28 sm:px-8">
      <span className="text-xs font-medium uppercase tracking-[0.22em] text-accent">Knowledge System</span>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-fg">Find a course</h1>
      <div className="relative mt-6">
        <SearchGlyph className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-fg/40" />
        <input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search courses" placeholder="CSE 221, Algorithms, Core…" className="glass w-full rounded-2xl py-3.5 pl-12 pr-4 text-sm text-fg outline-none placeholder:text-fg/35 focus:ring-1 focus:ring-accent/50" />
      </div>
      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
        {chips.map((c) => (
          <button key={c.id} onClick={() => setCat(c.id)} aria-pressed={cat === c.id} className={cn("flex flex-shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition", cat === c.id ? "glass-strong text-fg" : "glass text-fg/45")}>
            <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
            {c.label}
          </button>
        ))}
      </div>
      <ul className="mt-5 space-y-2">
        {list.map((n) => (
          <li key={n.code}>
            <Link to="/course/$code" params={{ code: n.code }} className="glass flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-colors hover:bg-fg/[0.04]">
              <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ background: n.color, boxShadow: `0 0 8px ${n.color}` }} />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-fg">
                  <Highlight text={n.code} query={q} /> · <span className="font-normal text-fg/55"><Highlight text={n.title} query={q} /></span>
                </span>
              </span>
              <span className="flex-shrink-0 text-xs text-fg/40">{n.fileCount}</span>
            </Link>
          </li>
        ))}
      </ul>
      {list.length === 0 && <p className="mt-10 text-center text-sm text-fg/45">No course matches “{q}”.</p>}
    </div>
  );
}
