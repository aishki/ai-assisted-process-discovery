"use client";

import { useRef, useState } from "react";
import { BitsLoader, type BitsLoaderHandle, type BitsLoaderPalette } from "@/components/BitsLoader";
import styles from "./page.module.css";

const PALETTES: { key: BitsLoaderPalette; label: string }[] = [
  { key: "holographic", label: "Holographic" },
  { key: "purple", label: "Purple" },
  { key: "cyan", label: "Cyan" },
];

/** Showcase for the BITS loader: switch palettes and drive complete() / restart() by hand. */
export function BitsLoaderDemo() {
  const loader = useRef<BitsLoaderHandle>(null);
  const [palette, setPalette] = useState<BitsLoaderPalette>("holographic");
  const [log, setLog] = useState("");

  return (
    <main className={styles.page}>
      <BitsLoader
        ref={loader}
        palette={palette}
        className={styles.loader}
        onDone={() => setLog(`bits-loader:done at ${new Date().toLocaleTimeString()}`)}
      />
      <div className={styles.bar} role="group" aria-label="Loader controls">
        {PALETTES.map((p) => (
          <button key={p.key} type="button" aria-pressed={palette === p.key} onClick={() => setPalette(p.key)}>
            {p.label}
          </button>
        ))}
        <button type="button" onClick={() => loader.current?.complete()}>
          complete()
        </button>
        <button
          type="button"
          onClick={() => {
            setLog("");
            loader.current?.restart();
          }}
        >
          restart()
        </button>
        <span className={styles.log} aria-live="polite">
          {log}
        </span>
      </div>
    </main>
  );
}
