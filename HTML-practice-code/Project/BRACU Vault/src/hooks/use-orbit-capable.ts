import { useEffect, useState } from "react";

// null until checked in the browser; true when the device can run the 3D orbit (WebGL, wide screen, motion allowed).
export function useOrbitCapable() {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => {
    const check = () => {
      let webgl = false;
      try {
        const c = document.createElement("canvas");
        webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
      } catch {
        webgl = false;
      }
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const wide = window.matchMedia("(min-width: 768px)").matches;
      setOk(webgl && !reduced && wide);
    };
    check();
    const mq = window.matchMedia("(min-width: 768px)");
    mq.addEventListener("change", check);
    return () => mq.removeEventListener("change", check);
  }, []);
  return ok;
}
