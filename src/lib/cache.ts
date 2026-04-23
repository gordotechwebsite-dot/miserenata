const VERSION = "v1";

function storage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

export function readCache<T>(key: string): T | null {
  const s = storage();
  if (!s) return null;
  try {
    const raw = s.getItem(`me:${VERSION}:${key}`);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function writeCache<T>(key: string, value: T): void {
  const s = storage();
  if (!s) return;
  try {
    s.setItem(`me:${VERSION}:${key}`, JSON.stringify(value));
  } catch {
    /* quota exceeded or blocked; ignore */
  }
}
