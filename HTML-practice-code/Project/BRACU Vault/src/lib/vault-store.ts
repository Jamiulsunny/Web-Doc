import { useCallback, useSyncExternalStore } from "react";

// Personal data (recent courses, saved files, theme) lives only in this browser.
const RECENT_KEY = "bracu-recent";
const SAVED_KEY = "bracu-saved";
export const THEME_KEY = "bracu-theme";

type Listener = () => void;
const listeners = new Set<Listener>();
const cache = new Map<string, string[]>();

function read(key: string): string[] {
  if (cache.has(key)) return cache.get(key)!;
  let v: string[] = [];
  try {
    const raw = localStorage.getItem(key);
    v = raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    v = [];
  }
  cache.set(key, v);
  return v;
}
function write(key: string, v: string[]) {
  cache.set(key, v);
  try {
    localStorage.setItem(key, JSON.stringify(v));
  } catch {
    /* storage unavailable */
  }
  listeners.forEach((l) => l());
}
function subscribe(l: Listener) {
  listeners.add(l);
  const onStorage = (e: StorageEvent) => {
    if (e.key === RECENT_KEY || e.key === SAVED_KEY) {
      cache.delete(e.key);
      l();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(l);
    window.removeEventListener("storage", onStorage);
  };
}
const EMPTY: string[] = [];

export function addRecent(code: string) {
  const next = [code, ...read(RECENT_KEY).filter((c) => c !== code)].slice(0, 8);
  write(RECENT_KEY, next);
}
export function clearRecent() {
  write(RECENT_KEY, []);
}
export function useRecent() {
  return useSyncExternalStore(subscribe, () => read(RECENT_KEY), () => EMPTY);
}

export function useSaved() {
  const saved = useSyncExternalStore(subscribe, () => read(SAVED_KEY), () => EMPTY);
  const toggle = useCallback((id: string) => {
    const cur = read(SAVED_KEY);
    write(SAVED_KEY, cur.includes(id) ? cur.filter((x) => x !== id) : [id, ...cur]);
  }, []);
  return { saved, toggle, isSaved: (id: string) => saved.includes(id) };
}

export function openSearch() {
  window.dispatchEvent(new CustomEvent("bracu:search-open"));
}
