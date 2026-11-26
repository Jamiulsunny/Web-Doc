import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { RING_COLOR, type VaultFile } from "@/lib/vault-data";
import { useSaved } from "@/lib/vault-store";
import { Highlight } from "./Highlight";

export function BookmarkButton({ id }: { id: string }) {
  const { isSaved, toggle } = useSaved();
  const on = isSaved(id);
  return (
    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(id); }} aria-label={on ? "Remove from saved" : "Save file"} aria-pressed={on} className={cn("grid h-8 w-8 flex-shrink-0 place-items-center rounded-full transition-colors hover:bg-fg/5", on ? "text-accent" : "text-fg/35 hover:text-fg")}>
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill={on ? "currentColor" : "none"}>
        <path d="M6 4h12v16l-6-4-6 4V4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export function FormatBadge({ format }: { format: string }) {
  return (
    <span className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl border border-fg/10 bg-fg/[0.03] text-[10px] font-semibold uppercase tracking-wider text-fg/60">
      {format === "code" ? "</>" : format}
    </span>
  );
}

export function FileRow({ file, query = "", highlighted = false, showCourse = false }: { file: VaultFile; query?: string; highlighted?: boolean; showCourse?: boolean }) {
  return (
    <div id={`file-${file.id}`} className={cn("group flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-fg/[0.04]", highlighted && "bg-accent/10 ring-1 ring-accent/40")}>
      <FormatBadge format={file.format} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-fg"><Highlight text={file.title} query={query} /></div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-xs text-fg/45">
          {showCourse && (
            <Link to="/course/$code" params={{ code: file.course }} className="inline-flex items-center gap-1 font-medium text-fg/60 hover:text-fg">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: RING_COLOR[file.category] }} />
              {file.course}
            </Link>
          )}
          <span>{file.type}</span>
          <span>·</span>
          <span>{file.semester} {file.year}</span>
          <span>·</span>
          <span>{file.size}</span>
        </div>
      </div>
      <div className="hidden gap-1.5 lg:flex">
        {file.tags.slice(1).map((t) => (
          <span key={t} className="rounded-full border border-fg/10 px-2 py-0.5 text-[10px] text-fg/50">{t}</span>
        ))}
      </div>
      <BookmarkButton id={file.id} />
    </div>
  );
}
