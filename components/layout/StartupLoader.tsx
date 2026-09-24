"use client";

import { useEffect, useState } from "react";
import { BitsLoader } from "@/components/BitsLoader";

declare global {
  interface Window {
    /** Set once the startup loader has finished, so hot reloads never show it again. */
    __bitsLoaderShown?: boolean;
  }
}

/**
 * The BITS loading screen, shown on the initial page load only (cold start or hard refresh).
 * It lives in the root layout, which persists across client navigations, so it never shows
 * on route changes. It completes on the first ready signal: the app has hydrated and the
 * window has loaded. The loader itself holds the fade until at least minDuration (5.2s).
 */
export function StartupLoader() {
  const [mounted, setMounted] = useState(() => typeof window === "undefined" || !window.__bitsLoaderShown);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!mounted) return;
    if (document.readyState === "complete") {
      setReady(true);
      return;
    }
    const onLoad = () => setReady(true);
    window.addEventListener("load", onLoad, { once: true });
    return () => window.removeEventListener("load", onLoad);
  }, [mounted]);

  if (!mounted) return null;

  return (
    <BitsLoader
      fullscreen
      done={ready}
      onDone={() => {
        window.__bitsLoaderShown = true;
        setMounted(false);
      }}
    />
  );
}
