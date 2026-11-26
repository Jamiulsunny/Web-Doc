// Fixed decorative layers behind every page: paper grid, ink washes, vignette, grain, floating glass fragments.
export function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="grid-paper absolute inset-0" />
      <div className="ink-wash-1 animate-aurora absolute -left-[15%] -top-[20%] h-[80vh] w-[70vw] blur-3xl" />
      <div className="ink-wash-2 animate-aurora absolute -bottom-[25%] -right-[15%] h-[85vh] w-[70vw] blur-3xl [animation-delay:-8s]" />
      <div className="fragment glass animate-float absolute left-[8%] top-[15%] h-40 w-32 rounded-3xl" />
      <div className="fragment glass animate-float-slow absolute bottom-[8%] left-[14%] h-32 w-24 rounded-3xl" />
      <div className="fragment glass animate-float-slow absolute right-[14%] top-[58%] h-36 w-28 rounded-3xl [animation-delay:-3s]" />
      <div className="vignette absolute inset-0" />
      <div className="paper-grain animate-grain absolute -inset-[10%]" />
    </div>
  );
}
