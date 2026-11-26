import { highlightParts } from "@/lib/vault-data";

export function Highlight({ text, query = "" }: { text: string; query?: string }) {
  return (
    <>
      {highlightParts(text, query).map((p, i) =>
        p.match ? (
          <mark key={i} className="rounded bg-accent/20 px-0.5 text-accent">{p.text}</mark>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </>
  );
}
