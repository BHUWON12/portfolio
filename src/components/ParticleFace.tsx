import { useEffect, useRef, useState } from "react";

/*
 * Particle-hologram portrait, styled as a model training run: the dots start
 * as random noise and "learn" the face — springs pull each particle to its
 * home pixel while an annealing jitter decays, and a tiny mono caption shows
 * the real loss (mean particle distance from home) ticking down until it
 * converges. Click/tap re-initializes and retrains. Canvas 2D only.
 *
 * While training it reads like a miniature tensorboard: sparse "network"
 * edges wire nearby particles together, a sparkline under the portrait plots
 * the loss curve (log scale), and dots sharpen as they lock onto their home
 * pixel. All of it fades out on convergence, leaving the clean portrait.
 *
 * Extras: cursor pushes dots aside (they spring back), whole-head parallax
 * follows the mouse, idle shimmer when converged. prefers-reduced-motion →
 * one static frame, no listeners.
 *
 * Sampling constants are tuned to public/portrait.jpg — an outdoor shot with
 * foliage/sky behind and a red shirt. The head is isolated by color: skin and
 * hair are warm-to-neutral, while foliage reads green (G > R), sky reads
 * bright-neutral, and the shirt reads saturated pink-red — all rejected,
 * plus an elliptical head mask.
 */

const WORK = 300; // working resolution the image is sampled at
const STEP = 3; // sample grid spacing (working px) → ~5-6k particles
const ELLIPSE = { cx: 0.5, cy: 0.5, rx: 0.47, ry: 0.5 }; // head mask, fractions of WORK

const SPRING = 0.06; // pull toward home per frame
const DAMP = 0.88; // velocity damping per frame
const ANNEAL_MS = 2600; // how long training noise takes to die out
const CONVERGE_MS = 1400; // earliest the run may report convergence
const REPEL_R = 48; // cursor repulsion radius, CSS px
const REPEL_F = 1.6; // cursor repulsion strength
const TILT_X = 6; // parallax amplitude, CSS px
const TILT_Y = 5;
const TILT_EASE = 0.06;
const DRIFT = 0.3; // idle vertical drift amplitude, CSS px
const SPARK_H = 14; // loss sparkline strip height, CSS px
const SPARK_PTS = 90; // sparkline history length

const MONO = "'IBM Plex Mono', ui-monospace, Menlo, monospace";

const hash = (k: number) => {
  const s = Math.sin(k * 12.9898) * 43758.5453;
  return s - Math.floor(s);
};

interface ParticleFaceProps {
  src?: string;
  size?: number; // CSS px, square
  accent?: string;
  dim?: string; // caption color
}

export default function ParticleFace({
  src = "/portrait.jpg",
  size = 160,
  accent = "#2E4FE0",
  dim = "#8B8F98",
}: ParticleFaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fullH = size + SPARK_H + 4; // face + loss sparkline strip
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = fullH * dpr;
    ctx.scale(dpr, dpr);

    const scale = size / WORK;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    // structure-of-arrays particle store (filled by sample())
    let N = 0;
    let hx: Float32Array; // home position, CSS px
    let hy: Float32Array;
    let px: Float32Array; // current position
    let py: Float32Array;
    let vx: Float32Array; // velocity
    let vy: Float32Array;
    let rad: Float32Array; // dot radius, CSS px
    let alp: Float32Array; // rest opacity
    let dep: Float32Array; // -0.4..0.6, brighter regions sit "closer"
    let phs: Float32Array; // deterministic phase 0..2π
    let edges: Int32Array; // sparse pairs of nearby particles ("network" wiring)

    let raf = 0;
    let running = false;
    let visible = true;
    let inView = true;
    let disposed = false;
    let trainStart = -1; // rAF timestamp the current run began
    let converged = false;
    let capTick = 0;
    let lastLoss = 1; // previous frame's loss, drives edge/sharpen fades
    let sparkA = 0; // sparkline visibility, eased
    let lossHist: number[] = [];
    const tilt = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    const mouse = { x: 0, y: 0, in: false };

    const setCaption = (text: string) => {
      if (captionRef.current) captionRef.current.textContent = text;
    };

    const sample = (img: HTMLImageElement) => {
      const off = document.createElement("canvas");
      off.width = WORK;
      off.height = WORK;
      const octx = off.getContext("2d");
      if (!octx) return;
      const side = Math.min(img.naturalWidth, img.naturalHeight);
      octx.drawImage(
        img,
        (img.naturalWidth - side) / 2,
        (img.naturalHeight - side) / 2,
        side,
        side,
        0,
        0,
        WORK,
        WORK,
      );
      const data = octx.getImageData(0, 0, WORK, WORK).data;

      const keep: number[] = [];
      for (let y = 0; y < WORK; y += STEP) {
        for (let x = 0; x < WORK; x += STEP) {
          const i = (y * WORK + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
          const warm = r - g;
          const gb = g - b;

          const nx = (x - ELLIPSE.cx * WORK) / (ELLIPSE.rx * WORK);
          const ny = (y - ELLIPSE.cy * WORK) / (ELLIPSE.ry * WORK);
          if (nx * nx + ny * ny > 1) continue;
          if (warm < -5) continue; // foliage / blue sky
          if (gb > 30 && warm < 15) continue; // yellow-green foliage
          if (lum > 0.8 && warm < 15) continue; // white sky
          if (warm > 100) continue; // bright red shirt
          if (warm > 40 && gb < -10) continue; // pink shirt / shirt shadow

          let tone = 1 - lum; // ink halftone: dark → big dot
          tone = Math.min(1, Math.max(0, (tone - 0.13) / 0.83)) ** 0.95;
          tone = Math.max(tone, 0.07); // faint floor keeps the silhouette solid
          keep.push(x, y, tone, lum);
        }
      }

      N = keep.length / 4;
      hx = new Float32Array(N);
      hy = new Float32Array(N);
      px = new Float32Array(N);
      py = new Float32Array(N);
      vx = new Float32Array(N);
      vy = new Float32Array(N);
      rad = new Float32Array(N);
      alp = new Float32Array(N);
      dep = new Float32Array(N);
      phs = new Float32Array(N);

      for (let k = 0; k < N; k++) {
        const x = keep[k * 4];
        const y = keep[k * 4 + 1];
        const tone = keep[k * 4 + 2];
        const lum = keep[k * 4 + 3];
        hx[k] = x * scale;
        hy[k] = y * scale;
        rad[k] = (0.24 + tone * 1.0) * scale;
        alp[k] = 0.22 + tone * 0.58;
        dep[k] = lum - 0.4;
        phs[k] = ((x * 7919 + y * 104729) % 628) / 100; // deterministic 0..2π
      }

      // sparse local pairs — the "network" wiring shown while training
      const ep: number[] = [];
      for (let k = 0; k < N; k += 17) {
        const j = k + 1 + ((k * 7) % 97);
        if (j >= N) continue;
        const dx = hx[k] - hx[j];
        const dy = hy[k] - hy[j];
        if (dx * dx + dy * dy < 900) ep.push(k, j); // within 30 CSS px
      }
      edges = new Int32Array(ep);
    };

    // random init — the state a "training run" starts from
    const scatter = () => {
      for (let k = 0; k < N; k++) {
        px[k] = hash(k) * size;
        py[k] = hash(k + 0.37) * size;
        vx[k] = 0;
        vy[k] = 0;
      }
      trainStart = -1; // stamped on the next frame
      converged = false;
      lastLoss = 1;
      lossHist = [];
    };

    const snapHome = () => {
      for (let k = 0; k < N; k++) {
        px[k] = hx[k];
        py[k] = hy[k];
        vx[k] = 0;
        vy[k] = 0;
      }
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, size, fullH);
      ctx.fillStyle = accent;
      for (let k = 0; k < N; k++) {
        ctx.globalAlpha = alp[k];
        const r = rad[k];
        ctx.fillRect(hx[k] - r, hy[k] - r, r * 2, r * 2);
      }
      ctx.globalAlpha = 1;
    };

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      const time = t * 0.001;

      if (trainStart < 0) trainStart = t;
      const elapsed = t - trainStart;
      const anneal = converged ? 0 : Math.max(0, 1 - elapsed / ANNEAL_MS);

      tilt.x += (target.x - tilt.x) * TILT_EASE;
      tilt.y += (target.y - tilt.y) * TILT_EASE;
      const tox = tilt.x * TILT_X;
      const toy = tilt.y * TILT_Y;
      const mIn = mouse.in;
      const r2 = REPEL_R * REPEL_R;

      ctx.clearRect(0, 0, size, fullH);

      // network wiring between neighbor dots — visible only while loss is high
      const edgeA = Math.min(0.22, (lastLoss - 0.006) * 1.4);
      if (edgeA > 0.005 && edges.length) {
        ctx.strokeStyle = accent;
        ctx.globalAlpha = edgeA;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        for (let e = 0; e < edges.length; e += 2) {
          const a = edges[e];
          const b = edges[e + 1];
          ctx.moveTo(px[a], py[a]);
          ctx.lineTo(px[b], py[b]);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
      }

      ctx.fillStyle = accent;

      let sumDist = 0;
      for (let k = 0; k < N; k++) {
        // spring toward home + parallax + idle drift
        const txp =
          hx[k] +
          dep[k] * tox +
          Math.sin(time * 1.4 + hx[k] * 0.08 + phs[k]) * DRIFT;
        const typ = hy[k] + dep[k] * toy;
        const ex = txp - px[k];
        const ey = typ - py[k];
        const dist = Math.sqrt(ex * ex + ey * ey);
        sumDist += dist;
        vx[k] = (vx[k] + ex * SPRING) * DAMP;
        vy[k] = (vy[k] + ey * SPRING) * DAMP;

        // stochastic "gradient noise", annealed away over the run
        if (anneal > 0) {
          vx[k] += Math.sin(time * 17 + phs[k] * 11) * 0.5 * anneal;
          vy[k] += Math.cos(time * 15 + phs[k] * 7) * 0.5 * anneal;
        }

        // cursor repulsion
        if (mIn) {
          const dx = px[k] - mouse.x;
          const dy = py[k] - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < r2 && d2 > 0.01) {
            const d = Math.sqrt(d2);
            const f = ((1 - d / REPEL_R) * (1 - d / REPEL_R) * REPEL_F) / d;
            vx[k] += dx * f;
            vy[k] += dy * f;
          }
        }

        px[k] += vx[k];
        py[k] += vy[k];

        // dots sharpen as they lock onto their home pixel
        let a = alp[k] * (0.45 + 0.55 * (1 - Math.min(dist * 0.02, 1)));
        if (converged) a *= 1 + 0.08 * Math.sin(time * 2.2 - hy[k] * 0.05);
        ctx.globalAlpha = a > 0.9 ? 0.9 : a;
        const r = rad[k];
        ctx.fillRect(px[k] - r, py[k] - r, r * 2, r * 2);
      }
      ctx.globalAlpha = 1;

      // loss = mean distance from target, normalized to canvas size
      const loss = sumDist / (N || 1) / size;
      lastLoss = loss;

      // loss-curve sparkline (log scale), fades out once converged
      if (capTick % 4 === 0 && !converged) {
        lossHist.push(loss);
        if (lossHist.length > SPARK_PTS) lossHist.shift();
      }
      sparkA += ((converged ? 0 : 1) - sparkA) * 0.04;
      if (sparkA > 0.01 && lossHist.length > 1) {
        ctx.strokeStyle = accent;
        ctx.globalAlpha = 0.45 * sparkA;
        ctx.lineWidth = 1;
        ctx.beginPath();
        let ex2 = 0;
        let ey2 = 0;
        for (let i = 0; i < lossHist.length; i++) {
          const v = Math.min(
            1,
            Math.max(0, (Math.log10(Math.max(lossHist[i], 1e-4)) + 4) / 4),
          );
          ex2 = (i / (lossHist.length - 1)) * size;
          ey2 = size + 3 + (1 - v) * SPARK_H;
          if (i === 0) ctx.moveTo(ex2, ey2);
          else ctx.lineTo(ex2, ey2);
        }
        ctx.stroke();
        ctx.globalAlpha = 0.8 * sparkA; // live endpoint marker
        ctx.fillRect(ex2 - 1.5, ey2 - 1.5, 3, 3);
        ctx.globalAlpha = 1;
      }

      if (!converged && elapsed > CONVERGE_MS && loss < 0.004) {
        converged = true;
        setCaption("converged · tap to retrain");
      }
      if (!converged && ++capTick % 8 === 0) {
        const epoch = Math.min(99, Math.floor(elapsed / 400) + 1);
        setCaption(
          `epoch ${String(epoch).padStart(2, "0")} · loss ${loss.toFixed(4)}`,
        );
      }
    };

    const syncRunning = () => {
      const shouldRun = !disposed && N > 0 && visible && inView && !mq.matches;
      if (shouldRun && !running) {
        running = true;
        raf = requestAnimationFrame(frame);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(raf);
        if (mq.matches && N) {
          snapHome();
          drawStatic();
          setCaption(`${(N / 1000).toFixed(1)}k pts`);
        }
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.in =
        mouse.x > -REPEL_R &&
        mouse.x < size + REPEL_R &&
        mouse.y > -REPEL_R &&
        mouse.y < size + REPEL_R;
    };

    const onClick = () => {
      if (mq.matches || N === 0) return;
      scatter();
    };

    const onVisibility = () => {
      visible = document.visibilityState === "visible";
      syncRunning();
    };
    const onMotionPref = () => syncRunning();

    const observer = new IntersectionObserver((entries) => {
      inView = entries[0]?.isIntersecting ?? true;
      syncRunning();
    });
    observer.observe(canvas);

    window.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("click", onClick);
    document.addEventListener("visibilitychange", onVisibility);
    mq.addEventListener("change", onMotionPref);

    const img = new Image();
    img.onload = () => {
      if (disposed) return;
      sample(img);
      setLoaded(true);
      if (mq.matches) {
        snapHome();
        drawStatic();
        setCaption(`${(N / 1000).toFixed(1)}k pts`);
      } else {
        scatter();
        setCaption("epoch 01 · loss —");
        syncRunning();
      }
    };
    img.src = src;

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("click", onClick);
      document.removeEventListener("visibilitychange", onVisibility);
      mq.removeEventListener("change", onMotionPref);
      observer.disconnect();
    };
  }, [src, size, accent]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        opacity: loaded ? 1 : 0,
        transition: "opacity .6s ease",
      }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          width: size,
          height: size + SPARK_H + 4,
          cursor: "pointer",
          touchAction: "manipulation",
        }}
      />
      <div
        ref={captionRef}
        aria-hidden="true"
        style={{
          fontFamily: MONO,
          fontSize: 9.5,
          letterSpacing: "0.14em",
          color: dim,
          whiteSpace: "nowrap",
          userSelect: "none",
        }}
      />
    </div>
  );
}
