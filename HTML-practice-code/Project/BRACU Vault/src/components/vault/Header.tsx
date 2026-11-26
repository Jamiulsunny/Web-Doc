import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { openSearch } from "@/lib/vault-store";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { label: "Orbit", to: "/orbit" as const },
  { label: "Dashboard", to: "/dashboard" as const },
];

function SearchIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="m20 20-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header id="top" className="fixed inset-x-0 top-0 z-50">
      <motion.div style={{ scaleX }} className="absolute left-0 top-0 h-0.5 w-full origin-left bg-progress-gradient" />
      <nav className={cn("mx-auto flex max-w-[76rem] items-center justify-between px-5 py-3.5 transition-all duration-500 sm:px-8", scrolled ? "mt-2 sm:mt-3" : "mt-0")}>
        <div className={cn("flex w-full items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-500 sm:px-5", scrolled ? "glass-strong shadow-glow" : "bg-transparent")}>
          <Link to="/orbit" aria-label="BRACU Vault" className="group inline-flex flex-shrink-0">
            <Logo animated />
          </Link>
          <div className="hidden items-center gap-1 md:flex">
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} className="rounded-full px-4 py-2 text-sm text-fg/65 transition-colors hover:bg-fg/5 hover:text-fg" activeProps={{ className: "text-fg" }}>
                {n.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-shrink-0 items-center gap-2">
            <button onClick={openSearch} aria-label="Search the vault" className="glass hidden items-center gap-2 rounded-full px-3 py-2 text-sm text-fg/60 transition-colors hover:text-fg sm:inline-flex">
              <SearchIcon />
              <span className="hidden lg:inline">Search</span>
              <kbd className="rounded border border-fg/15 px-1 text-[10px] text-fg/40">⌘K</kbd>
            </button>
            <ThemeToggle />
            <button onClick={() => setMenu((m) => !m)} aria-label="Toggle menu" aria-expanded={menu} className="glass grid h-9 w-9 place-items-center rounded-xl md:hidden">
              <div className="space-y-1.5">
                <motion.span animate={menu ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }} className="block h-0.5 w-5 bg-fg" />
                <motion.span animate={menu ? { opacity: 0 } : { opacity: 1 }} className="block h-0.5 w-5 bg-fg" />
                <motion.span animate={menu ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} className="block h-0.5 w-5 bg-fg" />
              </div>
            </button>
          </div>
        </div>
      </nav>
      <AnimatePresence>
        {menu && (
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }} className="glass-strong mx-5 mt-2 overflow-hidden rounded-2xl p-2 md:hidden">
            <button onClick={() => { setMenu(false); openSearch(); }} className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-left text-base text-fg/75 transition-colors hover:bg-fg/5 hover:text-fg">
              <SearchIcon /> Search
            </button>
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setMenu(false)} className="block rounded-xl px-4 py-3 text-base text-fg/75 transition-colors hover:bg-fg/5 hover:text-fg">
                {n.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
