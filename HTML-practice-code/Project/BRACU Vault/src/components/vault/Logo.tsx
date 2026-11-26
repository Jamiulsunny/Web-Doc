import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function LogoMark({ className, animated = false }: { className?: string; animated?: boolean }) {
  const t = (i: number) => ({ duration: 0.85, delay: 0.1 + 0.28 * i, ease: [0.4, 0, 0.2, 1] as const });
  const draw = (i: number) => (animated ? { initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 }, transition: t(i) } : {});
  const common = { fill: "none", strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 48 48" className={cn("text-bg", className)} aria-hidden {...common}>
      <motion.path d="M24 6 L39.6 15 L39.6 33 L24 42 L8.4 33 L8.4 15 Z" stroke="currentColor" strokeWidth={2.4} {...draw(0)} />
      <motion.path d="M13 17 L24 28 L35 17" stroke="currentColor" strokeWidth={2.2} {...draw(1)} />
      <motion.path d="M17.5 15 L24 22 L30.5 15" stroke="currentColor" strokeWidth={2.2} {...draw(2)} />
      <motion.circle cx={24} cy={28} r={2.6} fill="currentColor" style={{ transformOrigin: "24px 28px" }} {...(animated ? { initial: { scale: 0, opacity: 0 }, animate: { scale: 1, opacity: 1 }, transition: { delay: 1, type: "spring" as const, stiffness: 320, damping: 13 } } : {})} />
    </svg>
  );
}

export function Logo({ animated = false, size = 36 }: { animated?: boolean; size?: number }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="relative grid flex-shrink-0 place-items-center rounded-xl bg-brand-gradient shadow-glow" style={{ width: size, height: size }}>
        <LogoMark animated={animated} className="h-[66%] w-[66%]" />
      </span>
      <span className="font-display text-lg leading-none whitespace-nowrap">
        <span className="font-semibold tracking-[0.045em] text-fg">BRACU</span>
        <span className="font-medium tracking-[0.02em] text-fg/55"> Vault</span>
      </span>
    </span>
  );
}
