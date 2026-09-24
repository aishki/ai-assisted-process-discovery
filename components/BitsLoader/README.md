# @bits/loader

The BITS (Business Intelligence & Transformation Solutions) loading screen. A glow blooms, the BITS mark draws itself in, the team name fades in word by word, and the screen idles until the app says it is ready.

It lives in this app as `components/BitsLoader/` for now. The folder has no imports from the rest of the app, so it can move into a shared `@bits/loader` package as it is.

| File | What it is |
|---|---|
| `element.ts` | `<bits-loader>` custom element. Framework-agnostic, styles scoped in a shadow root. |
| `BitsLoader.tsx` | React wrapper. |
| `index.ts` | Public exports. |

The design spec is in `design_handoff_bits_loader/README.md`. Try it at `/dev/bits-loader`.

## Usage

### React

```tsx
import { BitsLoader } from "@/components/BitsLoader";

<BitsLoader fullscreen done={isReady} onDone={() => setShowLoader(false)} />
```

| Prop | Type | Default | Notes |
|---|---|---|---|
| `palette` | `"holographic" \| "purple" \| "cyan"` | `"holographic"` | Logo and glow colours. |
| `label` | string | `"Loading"` | Empty string hides the label row. |
| `fullscreen` | boolean | `false` | Fixed overlay. Otherwise it fills its parent (min-height 320px). |
| `minDuration` | number (s) | `5.2` | The fade-out starts at `max(complete time, minDuration)`. |
| `done` | boolean | `false` | Flip to `true` when the app is ready; calls `complete()`. |
| `onDone` | `() => void` | | Called after the 1s fade-out. Unmount the loader here. |
| `demo` | boolean | `false` | Showcase only: auto-completes and restarts forever. |
| `ref` | `BitsLoaderHandle` | | `complete()` and `restart()`. |

### Any other framework, or plain HTML

Call `defineBitsLoader()` once (or import the module and call it), then use the element:

```html
<bits-loader fullscreen palette="holographic"></bits-loader>
<script>
  const loader = document.querySelector("bits-loader");
  loader.addEventListener("bits-loader:done", () => loader.remove());
  // when the app is ready:
  loader.complete();
</script>
```

Attributes: `palette`, `label`, `fullscreen`, `min-duration`, `demo`. Methods: `complete()`, `restart()`. Event: `bits-loader:done` (bubbles, composed).

### Styling

Set these CSS custom properties on the element or any ancestor:

| Property | Default |
|---|---|
| `--bits-loader-bg` | `#07040F` |
| `--bits-loader-size` | `min(42vmin, 360px)` |
| `--bits-loader-font` | `'Geist', system-ui, sans-serif` |
| `--bits-loader-z` | `9999` |

### Font

The component uses Geist 500 but does not load it. A font declared inside a shadow root is not applied, so the host app self-hosts it and points `--bits-loader-font` at it. In Next.js:

```tsx
// app/layout.tsx
const geist = Geist({ weight: "500", subsets: ["latin"], variable: "--font-geist" });
```

```css
/* globals.css */
:root { --bits-loader-font: var(--font-geist), system-ui, sans-serif; }
```

Without it, the name renders in `system-ui`.

## Handoff: using it in another BITS app

The folder is self-contained, so another app copies it as-is. Nothing else from this repo is needed.

### 1. Copy the files

| App type | Copy |
|---|---|
| React (Next.js, Vite, CRA) | The whole `components/BitsLoader/` folder: `element.ts`, `BitsLoader.tsx`, `index.ts`, `README.md`. |
| Vue, Angular, Svelte or plain HTML | `element.ts` only. For an app without TypeScript, compile it to a plain JS module first: `npx esbuild element.ts --format=esm --outfile=bits-loader.js` |

In a React app outside Next.js, the `"use client"` line at the top of `BitsLoader.tsx` is harmless and can stay.

### 2. Self-host Geist 500

The loader needs Geist 500 served by the app itself, so it never waits on the network for its own font. See [Font](#font) above.

- **Next.js:** use `next/font/google` as shown there.
- **Other bundlers:** `npm install @fontsource/geist`, import `@fontsource/geist/500.css` once in the app entry, and set `--bits-loader-font: 'Geist', system-ui, sans-serif`.
- **Plain HTML:** host the `.woff2` next to the page with an `@font-face` rule in the page's global CSS, not inside the component.

### 3. Mount it once, at initial load

Put it in the app root, above the rest of the app, and remove it when it is done.

**Next.js (App Router):** copy `components/layout/StartupLoader.tsx` and render `<StartupLoader />` first inside `<body>` in `app/layout.tsx`. The root layout persists across client navigations, so it only shows on a cold start or hard refresh.

**React SPA (Vite, CRA):**

```tsx
import { useEffect, useState } from "react";
import { BitsLoader } from "./BitsLoader";

export function App() {
  const [showLoader, setShowLoader] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Replace with the app's real first ready signal if it has one (e.g. first data loaded).
    if (document.readyState === "complete") setReady(true);
    else window.addEventListener("load", () => setReady(true), { once: true });
  }, []);

  return (
    <>
      {showLoader && <BitsLoader fullscreen done={ready} onDone={() => setShowLoader(false)} />}
      <Routes />
    </>
  );
}
```

Keep it outside the router, so route changes never remount it.

**Plain HTML, or any other framework:** put the tag in `index.html` so it paints before the app bundle loads.

```html
<body>
  <bits-loader fullscreen style="position:fixed;inset:0;background:#07040F"></bits-loader>
  <div id="app"></div>
  <script type="module">
    import { defineBitsLoader } from "./bits-loader.js";
    defineBitsLoader();
    const loader = document.querySelector("bits-loader");
    loader.addEventListener("bits-loader:done", () => loader.remove(), { once: true });
    // Call from the app's first ready signal:
    window.addEventListener("load", () => loader.complete(), { once: true });
  </script>
</body>
```

The inline `style` covers the page until the element's script runs.

- **Vue:** tell the compiler it is a custom element: `compilerOptions.isCustomElement = (tag) => tag === "bits-loader"`.
- **Angular:** add `CUSTOM_ELEMENTS_SCHEMA` to the component or module that uses the tag.

### 4. Check before shipping

- [ ] The loader shows on a hard refresh and stays up at least 5.2 seconds.
- [ ] It does not show on route changes, refetches or hot reloads.
- [ ] It is removed from the page after `bits-loader:done`.
- [ ] The name renders in Geist, not the fallback (check the computed font in dev tools).
- [ ] With reduced motion turned on in the OS, the logo appears already drawn.
- [ ] Two loaders on one page, such as a demo page, get different gradient ids (`bl1…`, `bl2…`).

### Updating it

Treat this folder as the source of truth until it moves into a shared `@bits/loader` package. Copy changes to other apps from here, and keep the geometry, timings and palettes in `element.ts` matched to the design handoff.

## Rules

- **Initial page load only.** Mount it once at the root, complete it on the first ready signal, unmount it on done. Never show it for route changes or refetches. See `components/layout/StartupLoader.tsx` for this app's wiring.
- **At least 5.2 seconds on screen**, so the full name has appeared. `minDuration` handles this; don't work around it.
- With `prefers-reduced-motion: reduce`, it shows the settled final frame with no draw-on. Only the dots and the fade animate.
