"use client";

import { useEffect, useImperativeHandle, useRef, type CSSProperties, type Ref } from "react";
import { type BitsLoaderElement, type BitsLoaderPalette, defineBitsLoader, DEFAULT_MIN_DURATION, DONE_EVENT } from "./element";

// Defined when this module loads in the browser, before hydration, so the intro starts as early as possible.
defineBitsLoader();

type BitsLoaderAttributes = {
  ref?: Ref<BitsLoaderElement>;
  palette?: string;
  label?: string;
  fullscreen?: string;
  "min-duration"?: string;
  demo?: string;
  className?: string;
  style?: CSSProperties;
  suppressHydrationWarning?: boolean;
};

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "bits-loader": BitsLoaderAttributes;
    }
  }
}

export type BitsLoaderProps = {
  palette?: BitsLoaderPalette;
  /** Empty string hides the label row. */
  label?: string;
  fullscreen?: boolean;
  /** Seconds before the fade-out may start, even if complete() is called sooner. */
  minDuration?: number;
  /** Showcase only: auto-completes after the reveal and restarts forever. */
  demo?: boolean;
  /** Flip to true when the app is ready; calls complete(). */
  done?: boolean;
  /** Called after the fade-out ends. */
  onDone?: () => void;
  className?: string;
  /** Use this to set --bits-loader-bg, --bits-loader-size, --bits-loader-font or --bits-loader-z. */
  style?: CSSProperties;
  ref?: Ref<BitsLoaderHandle>;
};

export type BitsLoaderHandle = { complete: () => void; restart: () => void };

// Until the custom element upgrades, the server-rendered tag has no shadow styles.
// This keeps the fullscreen overlay covering the page from the first paint.
const PRE_UPGRADE_FULLSCREEN: CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: "var(--bits-loader-z, 9999)" as unknown as number,
  background: "var(--bits-loader-bg, #07040F)",
};

export function BitsLoader({
  palette = "holographic",
  label = "Loading",
  fullscreen = false,
  minDuration = DEFAULT_MIN_DURATION,
  demo = false,
  done = false,
  onDone,
  className,
  style,
  ref,
}: BitsLoaderProps) {
  const el = useRef<BitsLoaderElement>(null);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useImperativeHandle(ref, () => ({
    complete: () => el.current?.complete(),
    restart: () => el.current?.restart(),
  }));

  useEffect(() => {
    const node = el.current;
    if (!node) return;
    const handle = () => onDoneRef.current?.();
    node.addEventListener(DONE_EVENT, handle);
    return () => node.removeEventListener(DONE_EVENT, handle);
  }, []);

  useEffect(() => {
    if (done) el.current?.complete();
  }, [done]);

  return (
    <bits-loader
      ref={el}
      palette={palette}
      label={label}
      fullscreen={fullscreen ? "" : undefined}
      min-duration={String(minDuration)}
      demo={demo ? "" : undefined}
      className={className}
      style={fullscreen ? { ...PRE_UPGRADE_FULLSCREEN, ...style } : style}
      // The element sets `hidden` on itself when it finishes.
      suppressHydrationWarning
    />
  );
}
