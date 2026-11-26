import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { categoryLabel, fuzzyScore, type CategoryId, type OrbitData, type OrbitNode } from "@/lib/vault-data";
import { Highlight } from "./Highlight";

export function SearchGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function OrbitSearch({ nodes, onSelect }: { nodes: OrbitNode[]; onSelect: (n: OrbitNode) => void }) {
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useRef<HTMLInputElement>(null);

  // Press "/" anywhere to jump into the search box.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (e.key === "/" && !(t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable))) {
        e.preventDefault();
        ref.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const query = q.trim();
    if (!query) return [];
    return nodes
      .map((n) => ({ n, s: Math.max(fuzzyScore(query, n.code) + 2, fuzzyScore(query, n.title), fuzzyScore(query, categoryLabel(n.category))) }))
      .filter((x) => x.s >= 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 8)
      .map((x) => x.n);
  }, [q, nodes]);
  const open = focused && q.trim().length > 0;

  function pick(n: OrbitNode) {
    onSelect(n);
    setQ("");
    setFocused(false);
    ref.current?.blur();
  }

  return (
    <div className="relative w-full">
      <div className="relative">
        <SearchGlyph className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-fg/40" />
        <input
          ref={ref}
          value={q}
          onChange={(e) => { setQ(e.target.value); setActive(0); }}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 120)}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
            else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
            else if (e.key === "Enter" && results[active]) { e.preventDefault(); pick(results[active]); }
            else if (e.key === "Escape") { setFocused(false); ref.current?.blur(); }
          }}
          role="combobox"
          aria-expanded={open}
          aria-controls="orbit-search-list"
          aria-label="Search courses by code, name or category"
          placeholder="Find a course: CSE 221, Algorithms, Core…"
          className="glass-strong w-full rounded-2xl py-3.5 pl-12 pr-16 text-sm text-fg shadow-glow outline-none transition placeholder:text-fg/35 focus:ring-1 focus:ring-accent/50"
        />
        <kbd className="absolute right-4 top-1/2 -translate-y-1/2 rounded-md border border-fg/15 px-1.5 py-0.5 text-[10px] text-fg/40">/</kbd>
      </div>
      <AnimatePresence>
        {open && (
          <motion.ul id="orbit-search-list" role="listbox" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }} className="glass-strong absolute z-30 mt-2 max-h-[50vh] w-full overflow-auto rounded-2xl p-2 shadow-glow">
            {results.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-fg/40">No course matches “{q}”.</li>
            ) : (
              results.map((n, i) => (
                <li key={n.code} role="option" aria-selected={i === active}>
                  <button onMouseEnter={() => setActive(i)} onMouseDown={(e) => e.preventDefault()} onClick={() => pick(n)} className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors", i === active ? "bg-fg/[0.07]" : "hover:bg-fg/[0.04]")}>
                    <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ background: n.color, boxShadow: `0 0 8px ${n.color}` }} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-fg"><Highlight text={`${n.code} · ${n.title}`} query={q} /></span>
                      <span className="block text-xs text-fg/45">{categoryLabel(n.category)} · {n.fileCount} files</span>
                    </span>
                    {i === active && <span className="text-[10px] text-fg/40">↵</span>}
                  </button>
                </li>
              ))
            )}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export interface PanelGroup { category: CategoryId; label: string; color: string; nodes: OrbitNode[] }

export function CurriculumPanel({ groups, selectedCode, onSelect, open, onToggle }: {
  groups: PanelGroup[]; selectedCode: string | null; onSelect: (n: OrbitNode) => void; open: boolean; onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(groups.map((g) => g.category)));
  useEffect(() => {
    if (!selectedCode) return;
    const g = groups.find((g) => g.nodes.some((n) => n.code === selectedCode));
    if (g) setExpanded((s) => new Set(s).add(g.category));
  }, [selectedCode, groups]);

  if (!open) {
    return (
      <button onClick={onToggle} aria-label="Open curriculum panel" className="glass-strong pointer-events-auto grid h-11 w-11 place-items-center rounded-2xl text-fg/70 shadow-glow transition-colors hover:text-fg">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none"><path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
      </button>
    );
  }
  return (
    <div className="glass-strong pointer-events-auto flex max-h-[calc(100svh-9rem)] w-72 flex-col overflow-hidden rounded-3xl shadow-glow">
      <div className="flex items-center justify-between border-b border-fg/10 px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-fg/55">Curriculum</span>
        <button onClick={onToggle} aria-label="Collapse curriculum panel" className="grid h-7 w-7 place-items-center rounded-lg text-fg/45 transition-colors hover:bg-fg/5 hover:text-fg">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none"><path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2">
        {groups.map((g) => {
          const isOpen = expanded.has(g.category);
          return (
            <div key={g.category} className="mb-1">
              <button
                onClick={() => setExpanded((s) => { const n = new Set(s); if (n.has(g.category)) n.delete(g.category); else n.add(g.category); return n; })}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-fg/[0.04]"
              >
                <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ background: g.color, boxShadow: `0 0 8px ${g.color}` }} />
                <span className="flex-1 text-sm font-semibold text-fg">{g.label}</span>
                <span className="text-xs text-fg/40">{g.nodes.length}</span>
                <svg viewBox="0 0 24 24" className={cn("h-3.5 w-3.5 text-fg/40 transition-transform", isOpen && "rotate-90")} fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: [0.21, 0.47, 0.32, 0.98] }} className="overflow-hidden pl-3">
                    {g.nodes.map((n) => {
                      const sel = selectedCode === n.code;
                      return (
                        <li key={n.code}>
                          <button onClick={() => onSelect(n)} aria-current={sel} className={cn("group flex w-full items-center gap-2 rounded-lg py-1.5 pl-3 pr-2 text-left text-sm transition-colors", sel ? "bg-fg/[0.08] text-fg" : "text-fg/55 hover:bg-fg/[0.04] hover:text-fg")}>
                            <span className={cn("h-3 w-0.5 flex-shrink-0 rounded-full transition-opacity", sel ? "opacity-100" : "opacity-0")} style={{ background: g.color }} />
                            <span className="font-medium">{n.code}</span>
                            <span className="truncate text-xs text-fg/40">{n.title}</span>
                          </button>
                        </li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Radar({ data, selectedCode, visibleCodes, onSelect }: { data: OrbitData; selectedCode: string | null; visibleCodes: Set<string> | null; onSelect: (n: OrbitNode) => void }) {
  const max = data.maxRadius;
  const pos = (v: number) => 50 + (v / max) * 46;
  return (
    <div className="glass-strong pointer-events-auto rounded-2xl p-3 shadow-glow">
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-fg/45">Radar</div>
      <div className="relative h-32 w-32">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
          {data.rings.map((r) => (
            <circle key={r.category} cx="50" cy="50" r={(r.radius / max) * 46} fill="none" stroke={r.color} strokeOpacity="0.25" strokeWidth="0.4" />
          ))}
          <line x1="50" y1="4" x2="50" y2="96" className="text-fg/10" stroke="currentColor" strokeWidth="0.3" />
          <line x1="4" y1="50" x2="96" y2="50" className="text-fg/10" stroke="currentColor" strokeWidth="0.3" />
          <circle cx="50" cy="50" r="2.6" fill="#C17A2B" />
        </svg>
        {data.nodes.map((n) => {
          const vis = !visibleCodes || visibleCodes.has(n.code);
          const sel = selectedCode === n.code;
          return (
            <button key={n.code} onClick={() => vis && onSelect(n)} aria-label={`${n.code} on radar`} style={{ left: `${pos(n.x)}%`, top: `${pos(n.z)}%`, background: n.color, opacity: vis ? 1 : 0.2 }} className={cn("absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform hover:scale-150", sel && "scale-[1.9] ring-2 ring-fg")} />
          );
        })}
      </div>
    </div>
  );
}
