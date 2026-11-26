import { useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ALL_FILES, COURSES, RING_COLOR, categoryLabel, fuzzyScore } from "@/lib/vault-data";
import { Highlight } from "./Highlight";

type Result =
  | { kind: "course"; code: string; title: string; sub: string; color: string }
  | { kind: "file"; id: string; code: string; title: string; sub: string; color: string };

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("bracu:search-open", onOpen);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("bracu:search-open", onOpen);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const results = useMemo<Result[]>(() => {
    const query = q.trim();
    if (!query) {
      return COURSES.slice(0, 8).map((c) => ({ kind: "course", code: c.code, title: `${c.code} · ${c.title}`, sub: `${categoryLabel(c.category)} · ${c.fileCount} files`, color: RING_COLOR[c.category] }));
    }
    const courses = COURSES.map((c) => ({ c, s: Math.max(fuzzyScore(query, c.code) + 2, fuzzyScore(query, c.title), fuzzyScore(query, categoryLabel(c.category))) }))
      .filter((x) => x.s >= 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 6)
      .map(({ c }): Result => ({ kind: "course", code: c.code, title: `${c.code} · ${c.title}`, sub: `${categoryLabel(c.category)} · ${c.fileCount} files`, color: RING_COLOR[c.category] }));
    const files = ALL_FILES.map((f) => ({ f, s: Math.max(fuzzyScore(query, `${f.course} ${f.title}`), fuzzyScore(query, f.title)) }))
      .filter((x) => x.s >= 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 8)
      .map(({ f }): Result => ({ kind: "file", id: f.id, code: f.course, title: f.title, sub: `${f.course} · ${f.type} · ${f.format.toUpperCase()} · ${f.size}`, color: RING_COLOR[f.category] }));
    return [...courses, ...files];
  }, [q]);

  function choose(r: Result) {
    setOpen(false);
    navigate({ to: "/course/$code", params: { code: r.code }, search: r.kind === "file" ? { file: r.id } : {} });
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[100] flex items-start justify-center bg-fg/20 px-4 pt-[14vh] backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setOpen(false)}>
          <motion.div role="dialog" aria-label="Search the vault" initial={{ opacity: 0, y: -12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12, scale: 0.98 }} transition={{ duration: 0.18 }} onMouseDown={(e) => e.stopPropagation()} className="glass-strong w-full max-w-xl overflow-hidden rounded-3xl shadow-glow">
            <div className="relative border-b border-fg/10">
              <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-fg/40" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="m20 20-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => { setQ(e.target.value); setActive(0); }}
                onKeyDown={(e) => {
                  if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
                  else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
                  else if (e.key === "Enter" && results[active]) { e.preventDefault(); choose(results[active]); }
                  else if (e.key === "Escape") setOpen(false);
                }}
                placeholder="Search courses, notes, past questions…"
                aria-label="Search courses and files"
                className="w-full bg-transparent py-4 pl-14 pr-16 text-base text-fg outline-none placeholder:text-fg/35"
              />
              <kbd className="absolute right-5 top-1/2 -translate-y-1/2 rounded-md border border-fg/15 px-1.5 py-0.5 text-[10px] text-fg/40">esc</kbd>
            </div>
            <ul className="max-h-[52vh] overflow-auto p-2">
              {results.length === 0 && <li className="px-3 py-8 text-center text-sm text-fg/40">Nothing matches “{q}”.</li>}
              {results.map((r, i) => (
                <li key={r.kind === "course" ? r.code : r.id}>
                  <button onMouseEnter={() => setActive(i)} onClick={() => choose(r)} className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors", i === active ? "bg-fg/[0.07]" : "hover:bg-fg/[0.04]")}>
                    <span className={cn("flex-shrink-0", r.kind === "course" ? "h-2.5 w-2.5 rounded-full" : "h-2.5 w-2.5 rounded-[3px]")} style={{ background: r.color, boxShadow: `0 0 8px ${r.color}` }} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-fg"><Highlight text={r.title} query={q} /></span>
                      <span className="block truncate text-xs text-fg/45">{r.sub}</span>
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-fg/35">{r.kind}</span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
