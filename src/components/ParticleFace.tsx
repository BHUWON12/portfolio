import { useEffect, useRef, useState } from "react";

/*
 * Particle-hologram portrait: the photo rebuilt as an ink-halftone field of
 * accent-colored dots (darker photo regions → larger dots), with mouse-tilt
 * parallax and a slow scanline shimmer. Canvas 2D only, no dependencies.
 *
 * Sampling constants below are tuned to public/portrait.jpg — an outdoor
 * shot with foliage/sky behind and a red shirt. The head is isolated by
 * color: skin and hair are warm-to-neutral, while foliage reads green
 * (G > R), sky reads bright-neutral/blue, and the shirt reads saturated
 * pink-red — all three are rejected, plus an elliptical head mask.
 */

const WORK = 360; // working resolution the image is sampled at
const STEP = 2; // sample grid spacing (working px) → ~15-18k particles
const ELLIPSE = { cx: 0.5, cy: 0.5, rx: 0.47, ry: 0.5 }; // head mask, fractions of WORK
const TILT_X = 14; // parallax amplitude, working px
const TILT_Y = 10;
const DRIFT = 0.5; // idle vertical drift amplitude, working px
const TILT_EASE = 0.06;

interface Particle {
  x: number;
  y: number;
  rad: number; // rest radius, working px
  alpha: number; // rest opacity
  depth: number; // -0.4..0.6, brighter photo regions sit "closer"
  phase: number;
}

interface ParticleFaceProps {
  src?: string;
  size?: number; // CSS px, square
  accent?: string;
}

export default function ParticleFace({
  src = "/portrait.jpg",
  size = 210,
  accent = "#2E4FE0",
}: ParticleFaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const scale = size / WORK;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");

    const particles: Particle[] = [];
    let raf = 0;
    let running = false;
    let visible = true;
    let inView = true;
    let disposed = false;
    const tilt = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

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
          tone = Math.min(1, Math.max(0, (tone - 0.18) / 0.78)) ** 0.95;
          if (tone <= 0.02) continue;

          particles.push({
            x,
            y,
            rad: 0.12 + tone * 0.8,
            alpha: 0.28 + tone * 0.6,
            depth: lum - 0.4,
            phase: ((x * 7919 + y * 104729) % 628) / 100, // deterministic 0..2π
          });
        }
      }
    };

    const drawFrame = (time: number, motion: boolean) => {
      ctx.clearRect(0, 0, size, size);
      ctx.fillStyle = accent;
      for (const p of particles) {
        let x = p.x;
        let y = p.y;
        let a = p.alpha;
        if (motion) {
          x += p.depth * tilt.x * TILT_X;
          y += p.depth * tilt.y * TILT_Y;
          y += Math.sin(time * 1.4 + p.x * 0.04 + p.phase) * DRIFT;
          a *= 1 + 0.12 * Math.sin(time * 2.2 - p.y * 0.09);
        }
        ctx.globalAlpha = a < 0 ? 0 : a > 0.95 ? 0.95 : a;
        const r = p.rad * scale;
        ctx.fillRect(x * scale - r, y * scale - r, r * 2, r * 2);
      }
      ctx.globalAlpha = 1;
    };

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      tilt.x += (target.x - tilt.x) * TILT_EASE;
      tilt.y += (target.y - tilt.y) * TILT_EASE;
      drawFrame(t * 0.001, true);
    };

    const syncRunning = () => {
      const shouldRun =
        !disposed &&
        particles.length > 0 &&
        visible &&
        inView &&
        !mq.matches;
      if (shouldRun && !running) {
        running = true;
        raf = requestAnimationFrame(frame);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(raf);
        if (mq.matches && particles.length) drawFrame(0, false);
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
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
    document.addEventListener("visibilitychange", onVisibility);
    mq.addEventListener("change", onMotionPref);

    const img = new Image();
    img.onload = () => {
      if (disposed) return;
      sample(img);
      setLoaded(true);
      if (mq.matches) drawFrame(0, false);
      else syncRunning();
    };
    img.src = src;

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("visibilitychange", onVisibility);
      mq.removeEventListener("change", onMotionPref);
      observer.disconnect();
    };
  }, [src, size, accent]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        opacity: loaded ? 1 : 0,
        transition: "opacity .6s ease",
      }}
    />
  );
}
