import { META_PIXEL_ID } from "./config";

type Fbq = ((...args: unknown[]) => void) & { queue?: unknown[][]; callMethod?: (...a: unknown[]) => void; loaded?: boolean; version?: string; push?: unknown };

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

let started = false;

/** Creates the fbq queue immediately and loads the script lazily (idle or first interaction). */
export function initPixel() {
  if (typeof window === "undefined" || started) return;
  started = true;
  if (!window.fbq) {
    const q: Fbq = function (...args: unknown[]) {
      if (q.callMethod) q.callMethod(...args);
      else q.queue!.push(args);
    } as Fbq;
    q.queue = [];
    q.loaded = true;
    q.version = "2.0";
    q.push = q;
    window.fbq = q;
    window._fbq = q;
  }
  window.fbq("init", META_PIXEL_ID);
  window.fbq("track", "PageView");

  const load = () => {
    if (document.getElementById("fb-pixel")) return;
    const s = document.createElement("script");
    s.id = "fb-pixel";
    s.async = true;
    s.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(s);
  };
  const events = ["pointerdown", "scroll", "keydown", "touchstart"];
  const once = () => {
    events.forEach((e) => window.removeEventListener(e, once));
    load();
  };
  events.forEach((e) => window.addEventListener(e, once, { passive: true }));
  const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, o?: object) => void }).requestIdleCallback;
  if (ric) ric(once, { timeout: 4000 });
  else setTimeout(once, 3000);
}

export function track(event: string, custom = false) {
  try {
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq(custom ? "trackCustom" : "track", event);
    }
  } catch {
    /* ignore */
  }
}
