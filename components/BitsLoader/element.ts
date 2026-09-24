/*
 * <bits-loader>: BITS (Business Intelligence & Transformation Solutions) loading screen.
 * TypeScript port of design_handoff_bits_loader/bits-loader.js. Geometry, timings, easings
 * and palettes are unchanged. Framework-agnostic: no imports, styles scoped in a shadow root.
 *
 * Attributes: palette, label, fullscreen, min-duration, demo (see README.md).
 * Methods: complete(), restart(). Event: "bits-loader:done" (bubbles, composed).
 */

export type BitsLoaderPalette = "holographic" | "purple" | "cyan";

type Palette = { chip: string[]; accent: string; glowA: string; glowB: string; ray: string };

export const PALETTES: Record<BitsLoaderPalette, Palette> = {
  holographic: { chip: ["#2EE6E4", "#44B8F3", "#9A78FF", "#C1A0FD"], accent: "#7FDBFF", glowA: "#6F1DF4", glowB: "#00BBBA", ray: "#794CFF" },
  purple: { chip: ["#E6D9FE", "#C1A0FD", "#9A78FF", "#CDB3FD"], accent: "#FFFFFF", glowA: "#5009B5", glowB: "#794CFF", ray: "#6F1DF4" },
  cyan: { chip: ["#7FDBFF", "#E1EDFF", "#44B8F3", "#2EE6E4"], accent: "#2EE6E4", glowA: "#0C7DB6", glowB: "#44B8F3", ray: "#5009B5" },
};

export const DEFAULT_MIN_DURATION = 5.2;
export const DONE_EVENT = "bits-loader:done";

// Timeline (seconds)
const CUE = { ignite: 0, draw: 1.2, reveal: 3.4, fade: 1.0 /* duration */ };
const WORDS = ["Business", "Intelligence", "&", "Transformation", "Solutions"];
const FULL_NAME = "Business Intelligence and Transformation Solutions";

// Logo geometry, 100x100 box
const CHIP = "M24 18 H76 A6 6 0 0 1 82 24 V76 A6 6 0 0 1 76 82 H24 A6 6 0 0 1 18 76 V24 A6 6 0 0 1 24 18 Z";
const INNER = "M28 58 V30 A2 2 0 0 1 30 28 H58";
const HEAD = "M52 82 V72 C44 68 41 57 44 47 C47 37 56 32 64 33 C71 34 75 40 75 46 L79 53 L75 55 V61 C75 64 72 65 68 65 V82";
const CHART = "M31 60 L40 50 L46 55 L60 39";
const PINS: [number, number, number, number][] = [
  [34, 18, 34, 5], [50, 18, 50, 5], [66, 18, 66, 5], [34, 82, 34, 95], [50, 82, 50, 95], [66, 82, 66, 95],
  [18, 34, 5, 34], [18, 50, 5, 50], [18, 66, 5, 66], [82, 34, 95, 34], [82, 50, 95, 50], [82, 66, 95, 66],
];

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const outCubic = (x: number) => 1 - Math.pow(1 - x, 3);
const inOutCubic = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const outBack = (x: number) => {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};
const M = {
  enter: (s: number, e: number, T: number) => outCubic(clamp((T - s) / (e - s), 0, 1)),
  draw: (s: number, e: number, T: number) => inOutCubic(clamp((T - s) / (e - s), 0, 1)),
  pop: (s: number, e: number, T: number) => outBack(clamp((T - s) / (e - s), 0, 1)),
};

const NS = "http://www.w3.org/2000/svg";
let uid = 0;

type Layer = {
  chip: SVGPathElement;
  pins: SVGLineElement[];
  head: SVGPathElement;
  acc: SVGGElement;
  inner: SVGPathElement;
  chart: SVGPathElement;
  arrow: SVGGElement;
  dot: SVGCircleElement;
};

type Parts = {
  wrap: HTMLElement;
  glow: SVGGElement;
  cA: SVGCircleElement;
  cB: SVGCircleElement;
  rays: SVGGElement;
  rayEls: { el: SVGEllipseElement; angle: number; dir: number }[];
  spark: SVGCircleElement;
  shade: SVGCircleElement;
  logo: SVGGElement;
  chipG: SVGLinearGradientElement;
  label: HTMLElement;
  lt: HTMLElement;
  dots: HTMLElement[];
  words: HTMLElement[];
  layers: Layer[];
};

const STYLE = `
  :host{display:block;position:relative;overflow:hidden;background:var(--bits-loader-bg,#07040F);
    font-family:var(--bits-loader-font,'Geist',system-ui,sans-serif);min-height:320px;height:100%}
  :host([fullscreen]){position:fixed;inset:0;z-index:var(--bits-loader-z,9999);height:auto}
  :host([hidden]){display:none}
  .wrap{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:clamp(16px,3vmin,40px)}
  svg{width:var(--bits-loader-size,min(42vmin,360px));height:auto;overflow:visible;display:block}
  .name{display:flex;flex-wrap:wrap;justify-content:center;column-gap:.32em;row-gap:.1em;max-width:92vw;
    font-size:clamp(18px,2.9vw,56px);font-weight:500;letter-spacing:-0.02em;line-height:1.15;color:#F3ECFF;text-align:center}
  .name span{display:inline-block;will-change:opacity,transform,filter}
  .name .sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0}
  .label{display:flex;align-items:baseline;gap:2px;font-size:clamp(14px,1.4vw,28px);font-weight:500;color:#C1A0FD}
`;

// HTMLElement does not exist during server rendering; the class is only defined in the browser.
const Base = (typeof HTMLElement === "undefined" ? class {} : HTMLElement) as unknown as typeof HTMLElement;

export class BitsLoaderElement extends Base {
  static get observedAttributes() {
    return ["palette", "label"];
  }

  private parts?: Parts;
  private idBase = "";
  private pal: Palette = PALETTES.holographic;
  private raf = 0;
  private t0 = 0;
  private fadeAt: number | null = null;
  private reduced = false;

  connectedCallback() {
    if (!this.parts) this.build();
    this.restart();
  }

  disconnectedCallback() {
    cancelAnimationFrame(this.raf);
  }

  attributeChangedCallback() {
    if (this.parts) {
      this.applyPalette();
      this.applyLabel();
    }
  }

  /** Replays the intro from t = 0. */
  restart() {
    cancelAnimationFrame(this.raf);
    this.hidden = false;
    this.t0 = performance.now();
    this.fadeAt = null;
    this.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tick = (now: number) => {
      this.render((now - this.t0) / 1000);
      if (this.raf) this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  /** Starts the 1s fade-out at max(now, min-duration). Safe to call at any time. */
  complete() {
    if (this.fadeAt != null) return;
    const min = parseFloat(this.getAttribute("min-duration") ?? "");
    this.fadeAt = Math.max((performance.now() - this.t0) / 1000, isNaN(min) ? DEFAULT_MIN_DURATION : min);
  }

  private build() {
    const id = `bl${++uid}`;
    this.idBase = id;
    const root = this.attachShadow({ mode: "open" });
    root.innerHTML = `
<style>${STYLE}</style>
<div class="wrap" role="status" aria-live="polite">
  <svg viewBox="-230 -230 460 460" aria-hidden="true" focusable="false">
    <defs>
      <radialGradient id="${id}gA"><stop offset="0" stop-opacity=".4"/><stop offset="1" stop-opacity="0"/></radialGradient>
      <radialGradient id="${id}gB"><stop offset="0" stop-opacity=".22"/><stop offset="1" stop-opacity="0"/></radialGradient>
      <radialGradient id="${id}ray"><stop offset="0" stop-opacity=".9"/><stop offset=".5" stop-opacity=".25"/><stop offset="1" stop-opacity="0"/></radialGradient>
      <radialGradient id="${id}shade"><stop offset="0" stop-color="#07040F" stop-opacity=".85"/><stop offset=".6" stop-color="#07040F" stop-opacity=".6"/><stop offset="1" stop-color="#07040F" stop-opacity="0"/></radialGradient>
      <linearGradient id="${id}chip" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse"></linearGradient>
      <filter id="${id}bB" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>
      <filter id="${id}bS" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.4"/></filter>
    </defs>
    <g>
      <g class="glow"><circle class="cA" r="360" fill="url(#${id}gA)"/><circle class="cB" r="280" fill="url(#${id}gB)"/></g>
      <g class="rays" style="mix-blend-mode:screen"></g>
      <circle class="spark" r="0" fill="#E6D9FE" filter="url(#${id}bS)"/>
      <circle class="shade" r="230" fill="url(#${id}shade)"/>
      <g class="logo"></g>
    </g>
  </svg>
  <div class="name"><span class="sr">${FULL_NAME}</span></div>
  <div class="label"><span class="lt"></span><span class="d" aria-hidden="true">.</span><span class="d" aria-hidden="true">.</span><span class="d" aria-hidden="true">.</span></div>
</div>`;

    const q = <T extends Element>(s: string, from: ParentNode = root) => from.querySelector(s) as T;
    const rays = q<SVGGElement>(".rays");
    const logo = q<SVGGElement>(".logo");
    const name = q<HTMLElement>(".name");

    const rayEls = [0, 38, 90, 132].map((angle, i) => {
      const el = document.createElementNS(NS, "ellipse");
      el.setAttribute("rx", String(260 + i * 30));
      el.setAttribute("ry", String(10 + (i % 2) * 6));
      el.setAttribute("fill", `url(#${id}ray)`);
      rays.appendChild(el);
      return { el, angle, dir: i % 2 ? -1 : 1 };
    });

    // The logo is drawn three times: wide blur, small blur, crisp.
    const layers = ([["bB", 0.45], ["bS", 0.7], [null, 1]] as const).map(([f, op]) => {
      const g = document.createElementNS(NS, "g");
      if (f) g.setAttribute("filter", `url(#${id}${f})`);
      g.setAttribute("opacity", String(op));
      g.setAttribute("stroke", `url(#${id}chip)`);
      g.setAttribute("fill", "none");
      g.setAttribute("stroke-linecap", "round");
      g.setAttribute("stroke-linejoin", "round");
      g.innerHTML = `
        <path class="chip" d="${CHIP}" stroke-width="4.6" pathLength="1" stroke-dasharray="1"/>
        ${PINS.map(() => `<line class="pin" stroke-width="4.6"/>`).join("")}
        <path class="head" d="${HEAD}" stroke-width="3.6" pathLength="1" stroke-dasharray="1"/>
        <g class="acc">
          <path class="inner" d="${INNER}" stroke-width="3.2" pathLength="1" stroke-dasharray="1"/>
          <path class="chart" d="${CHART}" stroke-width="3.2" pathLength="1" stroke-dasharray="1"/>
          <g class="arrow"><path d="M-6 0 H0 V6" stroke-width="3.2"/></g>
          <circle class="dot" cx="31" cy="60" r="0" stroke="none"/>
        </g>`;
      logo.appendChild(g);
      return {
        chip: q<SVGPathElement>(".chip", g),
        pins: [...g.querySelectorAll<SVGLineElement>(".pin")],
        head: q<SVGPathElement>(".head", g),
        acc: q<SVGGElement>(".acc", g),
        inner: q<SVGPathElement>(".inner", g),
        chart: q<SVGPathElement>(".chart", g),
        arrow: q<SVGGElement>(".arrow", g),
        dot: q<SVGCircleElement>(".dot", g),
      };
    });

    // The words are visual only; the hidden span above reads the name once.
    const words = WORDS.map((w) => {
      const s = document.createElement("span");
      s.textContent = w;
      s.setAttribute("aria-hidden", "true");
      name.appendChild(s);
      return s;
    });

    this.parts = {
      wrap: q(".wrap"),
      glow: q(".glow"),
      cA: q(".cA"),
      cB: q(".cB"),
      rays,
      rayEls,
      spark: q(".spark"),
      shade: q(".shade"),
      logo,
      chipG: q(`#${id}chip`),
      label: q(".label"),
      lt: q(".lt"),
      dots: [...root.querySelectorAll<HTMLElement>(".d")],
      words,
      layers,
    };
    this.applyPalette();
    this.applyLabel();
  }

  private applyPalette() {
    const $ = this.parts!;
    const key = (this.getAttribute("palette") || "holographic").toLowerCase() as BitsLoaderPalette;
    const p = PALETTES[key] ?? PALETTES.holographic;
    this.pal = p;
    $.chipG.innerHTML = p.chip.map((c, i) => `<stop offset="${i / (p.chip.length - 1)}" stop-color="${c}"/>`).join("");
    const root = this.shadowRoot!;
    const tint = (grad: string, color: string) =>
      root.querySelectorAll(`#${this.idBase}${grad} stop`).forEach((s) => s.setAttribute("stop-color", color));
    tint("gA", p.glowA);
    tint("gB", p.glowB);
    tint("ray", p.ray);
    $.layers.forEach((L) => {
      L.acc.setAttribute("stroke", p.accent);
      L.dot.setAttribute("fill", p.accent);
    });
    $.words[2].style.color = p.accent;
  }

  private applyLabel() {
    const $ = this.parts!;
    const l = this.getAttribute("label");
    const text = l == null ? "Loading" : l;
    $.lt.textContent = text;
    $.label.style.display = text ? "" : "none";
    $.wrap.setAttribute("aria-label", text || "Loading");
  }

  private stop() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
  }

  private render(t: number) {
    const $ = this.parts!;
    const D = CUE.draw;
    const R = CUE.reveal;
    // Reduced motion: hold the settled frame (t = 5.4); only the dots and the fade stay live.
    const T = this.reduced ? R + 2 : t;
    const demo = this.hasAttribute("demo");
    // Demo mode: auto-complete once the reveal settles, restart after the fade.
    if (demo && this.fadeAt == null && t > R + 2.8) this.fadeAt = t;
    const out = this.fadeAt == null ? 0 : M.enter(this.fadeAt, this.fadeAt + CUE.fade, t);
    if (this.fadeAt != null && t > this.fadeAt + CUE.fade + 0.05) {
      if (demo) {
        this.t0 = performance.now();
        this.fadeAt = null;
        return;
      }
      this.stop();
      this.hidden = true;
      this.dispatchEvent(new CustomEvent(DONE_EVENT, { bubbles: true, composed: true }));
      return;
    }

    const ignite = M.enter(CUE.ignite, CUE.ignite + 1.4, T);
    const breathe = 1 + 0.04 * Math.sin((T - R) * 2.4) * M.enter(R, R + 0.6, T);
    const logoScale = (0.86 + 0.14 * M.enter(D, R, T)) * (1 + 0.06 * out);
    const set = (el: Element, attr: string, v: number | string) => el.setAttribute(attr, String(v));

    $.wrap.style.opacity = String(1 - out);
    set($.glow, "transform", `scale(${(0.3 + 0.7 * ignite) * breathe})`);
    set($.glow, "opacity", ignite);
    set($.cA, "transform", `translate(${Math.sin(T * 0.9) * 40} ${Math.cos(T * 0.7) * 30})`);
    set($.cB, "transform", `translate(${Math.cos(T * 1.1) * 50} ${Math.sin(T * 0.8) * 36})`);
    set($.rays, "opacity", 0.35 * ignite * (0.7 + 0.3 * breathe));
    $.rayEls.forEach((r) => set(r.el, "transform", `rotate(${r.angle + T * 9 * r.dir})`));
    set($.spark, "r", 14 * ignite * (1 - M.enter(D, D + 0.8, T)));
    set($.shade, "opacity", M.enter(D - 0.3, D + 0.6, T));
    set($.logo, "transform", `scale(${logoScale * 3.4}) translate(-50 -50)`);
    set($.chipG, "gradientTransform", `rotate(${T * 45} 50 50)`);

    const chip = M.draw(D, D + 1.0, T);
    const inner = M.draw(D + 0.5, D + 1.1, T);
    const head = M.draw(D + 0.7, D + 1.8, T);
    const chart = M.draw(D + 1.1, D + 1.9, T);
    const arrow = M.pop(D + 1.75, D + 2.1, T);
    const dot = M.pop(D + 1.0, D + 1.3, T);
    // A stroke at zero progress is hidden, or its round cap paints a stray dot.
    const stroke = (el: Element, p: number) => {
      set(el, "stroke-dashoffset", 1 - p);
      set(el, "opacity", p > 0.001 ? 1 : 0);
    };
    $.layers.forEach((L) => {
      stroke(L.chip, chip);
      stroke(L.inner, inner);
      stroke(L.head, head);
      stroke(L.chart, chart);
      L.pins.forEach((ln, i) => {
        const [x1, y1, x2, y2] = PINS[i];
        const p = M.enter(D + 0.35 + i * 0.045, D + 0.75 + i * 0.045, T);
        set(ln, "x1", x1);
        set(ln, "y1", y1);
        set(ln, "x2", x1 + (x2 - x1) * p);
        set(ln, "y2", y1 + (y2 - y1) * p);
        set(ln, "opacity", p > 0.01 ? 1 : 0);
      });
      set(L.arrow, "transform", `translate(60 39) scale(${Math.max(0, arrow)})`);
      set(L.arrow, "opacity", arrow > 0.01 ? 1 : 0);
      set(L.dot, "r", Math.max(0, 2.6 * dot));
    });

    $.words.forEach((w, i) => {
      const p = M.enter(R + 0.15 + i * 0.16, R + 0.95 + i * 0.16, T);
      w.style.opacity = String(p);
      w.style.transform = `translateY(${(1 - p) * 18}px)`;
      w.style.filter = `blur(${(1 - p) * 8}px)`;
    });
    const loadIn = M.enter(D + 0.4, D + 1.0, T);
    $.label.style.opacity = String(loadIn * (1 - 0.35 * M.enter(R + 0.8, R + 1.4, T)));
    $.dots.forEach((d, i) => {
      const ph = (((t * 1.6 - i * 0.22) % 1) + 1) % 1;
      d.style.opacity = String(0.25 + 0.75 * Math.max(0, Math.sin(ph * Math.PI)));
    });
  }
}

/** Registers <bits-loader> once. Safe to call on the server, where it does nothing. */
export function defineBitsLoader() {
  if (typeof window === "undefined" || customElements.get("bits-loader")) return;
  customElements.define("bits-loader", BitsLoaderElement);
}
