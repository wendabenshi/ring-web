"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

type Particle = {
  x: number;
  y: number;
  r: number;
  a: number;
  vx: number;
  vy: number;
  tw: number;
  ph: number;
  kind: "dot" | "streak";
};

function rand(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export default function AmbientParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let disposed = false;
    let ro: ResizeObserver | null = null;
    let visible = true;
    let acc = 0;
    let last = performance.now();

    const particles: Particle[] = [];
    let w = 0;
    let h = 0;
    let dpr = 1;

    const lowPower = (() => {
      const coarse = window.matchMedia?.("(pointer: coarse)")?.matches;
      const cores = navigator.hardwareConcurrency ?? 4;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mem = (navigator as any).deviceMemory as number | undefined;
      return Boolean(coarse) || cores <= 4 || (typeof mem === "number" && mem <= 4);
    })();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(0, Math.floor(rect.width));
      h = Math.max(0, Math.floor(rect.height));
      if (w < 2 || h < 2) return;
      dpr = Math.min(lowPower ? 1.15 : 1.35, Math.max(1, window.devicePixelRatio || 1));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seedBase = 17.132;
    const populate = () => {
      particles.length = 0;
      const count = Math.round(
        Math.min(lowPower ? 220 : 320, Math.max(lowPower ? 120 : 160, (w * h) / (lowPower ? 3200 : 2600))),
      );
      for (let i = 0; i < count; i += 1) {
        const s = seedBase + i * 0.71;
        const px = rand(s) * w;
        const py = rand(s + 9.3) * h;
        const isStreak = rand(s + 2.2) > 0.82;
        const r = isStreak ? 0.55 + rand(s + 3.8) * 0.8 : 0.6 + rand(s + 3.8) * 1.5;
        const a = isStreak ? 0.10 + rand(s + 5.2) * 0.16 : 0.12 + rand(s + 5.2) * 0.26;

        const speed = isStreak ? 0.060 : 0.040;
        const vx = (rand(s + 6.1) - 0.5) * speed;
        const vy = (rand(s + 7.7) - 0.5) * (speed * 0.78);

        const tw = isStreak ? 0.22 + rand(s + 11.1) * 0.55 : 0.28 + rand(s + 11.1) * 0.85;
        const ph = rand(s + 12.4) * Math.PI * 2;
        particles.push({ x: px, y: py, r, a, vx, vy, tw, ph, kind: isStreak ? "streak" : "dot" });
      }
    };

    resize();
    if (w >= 2 && h >= 2) populate();

    const onResize = () => {
      resize();
      if (w >= 2 && h >= 2) populate();
    };
    window.addEventListener("resize", onResize, { passive: true });
    try {
      ro = new ResizeObserver(() => onResize());
      ro.observe(canvas);
    } catch {
      // ignore
    }

    const draw = (tms: number) => {
      if (disposed) return;
      if (!visible) {
        raf = requestAnimationFrame(draw);
        return;
      }
      if (w < 2 || h < 2) {
        resize();
        raf = requestAnimationFrame(draw);
        return;
      }
      const t = tms / 1000;
      const dt = Math.min(0.05, (tms - last) / 1000);
      last = tms;
      if (lowPower) {
        acc += dt;
        if (acc < 1 / 30) {
          raf = requestAnimationFrame(draw);
          return;
        }
        acc = 0;
      }

      // Keep a gentle trail: fade previous frame instead of clearing hard.
      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = lowPower ? "rgba(5,3,6,0.22)" : "rgba(5,3,6,0.18)";
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      // Very subtle "cosmic flow" wash — restrained purple, no cyber.
      const g1 = ctx.createRadialGradient(w * 0.72, h * 0.18, 0, w * 0.72, h * 0.18, w * 0.9);
      g1.addColorStop(0, `rgba(139,92,246,${0.10 + 0.02 * Math.sin(t * 0.18)})`);
      g1.addColorStop(1, "rgba(139,92,246,0)");
      ctx.fillStyle = g1;
      ctx.fillRect(0, 0, w, h);

      const g2 = ctx.createRadialGradient(w * 0.18, h * 0.52, 0, w * 0.18, h * 0.52, w * 0.95);
      g2.addColorStop(0, `rgba(59,7,100,${0.13 + 0.03 * Math.cos(t * 0.15)})`);
      g2.addColorStop(1, "rgba(59,7,100,0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, 0, w, h);

      // Stars / dust (use lighter blend so it's visible but still soft)
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i]!;
        const layer = p.kind === "streak" ? 1.55 : 1;
        p.x += p.vx * layer * (1 + 0.22 * Math.sin(t * 0.25 + p.ph));
        p.y += p.vy * layer * (1 + 0.22 * Math.cos(t * 0.23 + p.ph));

        // Wrap
        if (p.x < -8) p.x = w + 8;
        if (p.x > w + 8) p.x = -8;
        if (p.y < -8) p.y = h + 8;
        if (p.y > h + 8) p.y = -8;

        const twinkle = 0.55 + 0.45 * Math.sin(t * p.tw + p.ph);
        const alpha = Math.min(0.52, p.a * twinkle);
        if (p.kind === "streak") {
          const len = 10 + 18 * (0.5 + 0.5 * Math.sin(t * 0.2 + p.ph));
          const dx = p.vx * 700;
          const dy = p.vy * 700;
          const mag = Math.max(0.0001, Math.hypot(dx, dy));
          const ux = dx / mag;
          const uy = dy / mag;
          const x2 = p.x - ux * len;
          const y2 = p.y - uy * len;

          const lg = ctx.createLinearGradient(p.x, p.y, x2, y2);
          lg.addColorStop(0, `rgba(245,241,255,${alpha * 0.75})`);
          lg.addColorStop(1, "rgba(245,241,255,0)");
          ctx.strokeStyle = lg;
          ctx.lineWidth = Math.max(1, p.r * 1.2);
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(245,241,255,${alpha})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();

      // A few long, ultra-soft drifting streaks (kept minimal)
      ctx.save();
      ctx.globalAlpha = lowPower ? 0.22 : 0.28;
      ctx.globalCompositeOperation = "screen";
      for (let k = 0; k < (lowPower ? 3 : 5); k += 1) {
        const phase = t * (0.018 + k * 0.006);
        const cx = w * (0.18 + 0.32 * k) + Math.sin(phase + k) * w * 0.12;
        const cy = h * (0.24 + 0.22 * k) + Math.cos(phase + 1.7 * k) * h * 0.10;
        const grd = ctx.createLinearGradient(cx - w * 0.32, cy - h * 0.12, cx + w * 0.32, cy + h * 0.12);
        grd.addColorStop(0, "rgba(139,92,246,0)");
        grd.addColorStop(0.5, "rgba(139,92,246,0.14)");
        grd.addColorStop(1, "rgba(139,92,246,0)");
        ctx.strokeStyle = grd;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(cx - w * 0.38, cy - h * 0.16);
        ctx.lineTo(cx + w * 0.38, cy + h * 0.16);
        ctx.stroke();
      }
      ctx.restore();

      raf = requestAnimationFrame(draw);
    };

    const onVis = () => {
      visible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVis);

    raf = requestAnimationFrame(draw);

    return () => {
      disposed = true;
      window.removeEventListener("resize", onResize);
      ro?.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      cancelAnimationFrame(raf);
    };
  }, [reduceMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.95] mix-blend-screen"
      style={{ contain: "strict" }}
    />
  );
}
