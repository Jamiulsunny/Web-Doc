"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function NavLinks({ links, color }: { links: [string, string][]; color: string }) {
  const p = usePathname();
  const best = links.map((l) => l[1]).filter((h) => p === h || p.startsWith(h + "/")).sort((a, b) => b.length - a.length)[0];
  return (<nav className="navlinks">{links.map(([t, h]) => <Link key={h} href={h} className={"navlink" + (h === best ? " on" : "")} style={h === best ? { color, borderColor: color } : undefined}>{t}</Link>)}</nav>);
}
