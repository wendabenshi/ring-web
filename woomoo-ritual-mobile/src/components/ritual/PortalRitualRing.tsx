"use client";

import { useEffect, useMemo, useRef } from "react";

type Particle = {
  spread: number; // angular spread around band center
  drift: number; // slow drift factor
  radial: number; // radial offset inside band
  w: number; // noise seed
  s: number; // size
  o: number; // opacity
  b: number; // brightness multiplier
};

type RadialParticle = {
  a: number; // angle
  r: number; // radius
  v: number; // velocity (px/s)
  s: number; // size
  o: number; // opacity
  life: number; // 0..1
  w: number; // seed
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashNoise(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return s - Math.floor(s);
}

function valueNoise2D(x: number, y: number) {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const xf = x - x0;
  const yf = y - y0;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const n00 = hashNoise(x0, y0);
  const n10 = hashNoise(x0 + 1, y0);
  const n01 = hashNoise(x0, y0 + 1);
  const n11 = hashNoise(x0 + 1, y0 + 1);
  const nx0 = lerp(n00, n10, u);
  const nx1 = lerp(n01, n11, u);
  return lerp(nx0, nx1, v);
}

function fbm(x: number, y: number) {
  let sum = 0;
  let amp = 0.55;
  let freq = 0.012;
  for (let i = 0; i < 4; i += 1) {
    sum += amp * valueNoise2D(x * freq, y * freq);
    amp *= 0.52;
    freq *= 2.05;
  }
  return sum;
}

function isLikelyLowPowerDevice() {
  if (typeof navigator === "undefined") return false;
  // Heuristics: coarse pointer + limited cores/memory tends to be mobile/low power.
  const coarse = typeof window !== "undefined" && window.matchMedia?.("(pointer: coarse)")?.matches;
  const cores = navigator.hardwareConcurrency ?? 4;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mem = (navigator as any).deviceMemory as number | undefined;
  return Boolean(coarse) || cores <= 4 || (typeof mem === "number" && mem <= 4);
}

function useParticles(seed = 7, count = 220) {
  return useMemo(() => {
    const rand = mulberry32(seed);
    const parts: Particle[] = [];
    for (let i = 0; i < count; i += 1) {
      const u1 = Math.max(1e-6, rand());
      const u2 = Math.max(1e-6, rand());
      const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      const spread = z0 * 0.55;
      parts.push({
        spread,
        drift: rand() * 0.8 + 0.2,
        radial: (rand() - 0.5) * 10,
        w: rand() * 1000,
        s: rand() * 0.9 + 0.55,
        o: rand() * 0.12 + 0.04,
        b: rand() * 0.6 + 0.7,
      });
    }
    return parts;
  }, [seed, count]);
}

function useRadialParticles(seed = 23, count = 200) {
  return useMemo(() => {
    const rand = mulberry32(seed);
    const parts: RadialParticle[] = [];
    for (let i = 0; i < count; i += 1) {
      parts.push({
        a: rand() * Math.PI * 2,
        r: rand() * 30,
        v: rand() * 34 + 24,
        s: rand() * 1.1 + 0.6,
        o: rand() * 0.14 + 0.04,
        life: rand(),
        w: rand() * 1000,
      });
    }
    return parts;
  }, [seed, count]);
}

export default function PortalRitualRing({
  size = 260,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lowPower = useMemo(() => isLikelyLowPowerDevice(), []);
  const particles = useParticles(11, lowPower ? 170 : 240);
  const radialParticles = useRadialParticles(29, lowPower ? 160 : 220);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let running = true;
    let visible = true;

    const resize = () => {
      // Clamp DPR hard for mobile perf; the glow hides minor aliasing.
      const dpr = Math.max(1, Math.min(lowPower ? 1.15 : 1.35, window.devicePixelRatio || 1));
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(() => resize());
    ro.observe(canvas);

    const start = performance.now();
    let last = start;
    let acc = 0;

    const draw = (now: number) => {
      if (!running) return;
      if (!visible) {
        rafRef.current = window.requestAnimationFrame(draw);
        return;
      }
      const t = (now - start) / 1000;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      // Cap to ~30fps on low-power devices.
      if (lowPower) {
        acc += dt;
        if (acc < 1 / 30) {
          rafRef.current = window.requestAnimationFrame(draw);
          return;
        }
        acc = 0;
      }
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w < 2 || h < 2) {
        rafRef.current = window.requestAnimationFrame(draw);
        return;
      }
      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(w, h) * 0.265;
      const ringOuter = r * 1.16;
      const ringInner = r * 0.86;
      const breath = (Math.sin((t * Math.PI * 2) / 5) + 1) / 2; // 5s
      const bandCenter = t * 0.13 + Math.sin(t * 0.22) * 0.09 + Math.PI * 0.45;
      const bandCenter2 = bandCenter + Math.PI;
      const innerCenter = -t * 0.16 + Math.sin(t * 0.18) * 0.07 + Math.PI * 0.18;
      const maxR = Math.min(w, h) * 1.15;

      ctx.clearRect(0, 0, w, h);

      const nebulaSteps = lowPower ? 6 : 10;
      const drawNebulaArc = (center: number, alphaMul: number) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.globalCompositeOperation = "screen";
        ctx.globalAlpha = (0.26 + breath * 0.16) * alphaMul;
        ctx.filter = lowPower ? "blur(8px)" : "blur(10px)";
        for (let i = 0; i < nebulaSteps; i += 1) {
          const local = (i - (nebulaSteps - 1) / 2) / ((nebulaSteps - 1) / 2);
          const span = 1.35 + Math.abs(local) * 0.25;
          const a0 = center - span * 0.55 + local * 0.22;
          const width = 14 - Math.abs(local) * 2.2;
          const jitter = (fbm(i * 80 + 20, t * 90) - 0.5) * 10;
          const rr = lerp(ringInner, ringOuter, 0.70) + jitter;
          const r0 = Math.max(0.1, rr - 44);
          const r1 = Math.max(r0 + 0.1, rr + 44);
          const g = ctx.createRadialGradient(0, 0, r0, 0, 0, r1);
          g.addColorStop(0, "rgba(59,7,100,0)");
          g.addColorStop(0.44, "rgba(59,7,100,0.14)");
          g.addColorStop(0.62, "rgba(139,92,246,0.26)");
          g.addColorStop(1, "rgba(139,92,246,0)");
          ctx.strokeStyle = g;
          ctx.lineWidth = width;
          ctx.beginPath();
          ctx.arc(0, 0, rr, a0, a0 + span);
          ctx.stroke();
        }
        ctx.restore();
        ctx.filter = "none";
      };

      drawNebulaArc(bandCenter, 1.0);
      drawNebulaArc(bandCenter2, 0.9);

      // Outer ring
      ctx.save();
      ctx.translate(cx, cy);
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = 0.34 + breath * 0.30;
      ctx.shadowColor = "rgba(139,92,246,0.42)";
      ctx.shadowBlur = (lowPower ? 22 : 28) + breath * (lowPower ? 12 : 18);
      ctx.lineWidth = 4.5;
      const grad = ctx.createLinearGradient(-ringOuter, -ringOuter, ringOuter, ringOuter);
      grad.addColorStop(0, "rgba(192,132,252,0.24)");
      grad.addColorStop(0.35, "rgba(139,92,246,0.72)");
      grad.addColorStop(1, "rgba(59,7,100,0.18)");
      ctx.strokeStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.stroke();

      // Highlights
      ctx.globalAlpha = 0.12 + breath * 0.14;
      ctx.shadowBlur = (lowPower ? 28 : 40) + breath * (lowPower ? 14 : 20);
      ctx.lineWidth = 6.5;
      ctx.strokeStyle = "rgba(192,132,252,0.34)";
      ctx.beginPath();
      ctx.arc(0, 0, r, bandCenter - 0.55, bandCenter + 0.55);
      ctx.stroke();
      ctx.globalAlpha = (0.10 + breath * 0.12) * 0.9;
      ctx.beginPath();
      ctx.arc(0, 0, r, bandCenter2 - 0.55, bandCenter2 + 0.55);
      ctx.stroke();
      ctx.restore();

      // Inner ring (counter)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = 0.18 + breath * 0.16;
      ctx.shadowColor = "rgba(139,92,246,0.26)";
      ctx.shadowBlur = (lowPower ? 16 : 22) + breath * (lowPower ? 8 : 12);
      ctx.lineWidth = 3.2;
      const innerR = r * 0.78;
      const innerGrad = ctx.createLinearGradient(-innerR, innerR, innerR, -innerR);
      innerGrad.addColorStop(0, "rgba(192,132,252,0.16)");
      innerGrad.addColorStop(0.4, "rgba(139,92,246,0.46)");
      innerGrad.addColorStop(1, "rgba(59,7,100,0.12)");
      ctx.strokeStyle = innerGrad;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(0, 0, innerR, 0, Math.PI * 2);
      ctx.stroke();

      ctx.globalAlpha = 0.10 + breath * 0.10;
      ctx.shadowBlur = (lowPower ? 22 : 30) + breath * (lowPower ? 10 : 16);
      ctx.lineWidth = 5.4;
      ctx.strokeStyle = "rgba(192,132,252,0.22)";
      ctx.beginPath();
      ctx.arc(0, 0, innerR, innerCenter - 0.5, innerCenter + 0.5);
      ctx.stroke();

      ctx.globalAlpha = 0.08 + breath * 0.06;
      ctx.shadowBlur = 0;
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = "rgba(139,92,246,0.16)";
      ctx.setLineDash([2, 14]);
      ctx.lineDashOffset = t * 18;
      ctx.beginPath();
      ctx.arc(0, 0, innerR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // Radial expanding particles
      ctx.save();
      ctx.translate(cx, cy);
      ctx.globalCompositeOperation = "screen";
      ctx.filter = lowPower ? "blur(0.3px)" : "blur(0.4px)";
      for (let i = 0; i < radialParticles.length; i += 1) {
        const p = radialParticles[i];
        p.life += dt * (0.22 + (fbm(p.w, t * 52) - 0.5) * 0.03);
        if (p.life >= 1) {
          p.life = 0;
          p.r = 0;
          p.a = (bandCenter + (Math.random() - 0.5) * 1.3) % (Math.PI * 2);
        }
        const speed = p.v * (0.85 + breath * 0.70);
        p.r += speed * dt;
        if (p.r > maxR) {
          p.r = 0;
          p.life = 0;
        }

        const wobble = (fbm(p.w + t * 70, p.w * 0.12) - 0.5) * 9;
        const rr = p.r + wobble;
        const x = Math.cos(p.a) * rr;
        const y = Math.sin(p.a) * rr;
        const fade = Math.pow(1 - p.life, 1.65);
        const outsideFactor = rr > ringOuter * 1.05 ? 0.86 : 1.0;
        const alpha = p.o * fade * outsideFactor;
        const cool = rr < ringInner ? "245,241,255" : "192,132,252";
        ctx.shadowBlur = 14 + p.s * 12;
        ctx.shadowColor = "rgba(139,92,246,0.16)";
        ctx.fillStyle = `rgba(${cool},${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, p.s, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      ctx.filter = "none";

      const drawBandParticles = (center: number, alphaMul: number) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.globalCompositeOperation = "screen";
        for (let i = 0; i < particles.length; i += 1) {
          const p = particles[i];
          const drift = (fbm(p.w + t * 90, p.w * 0.23) - 0.5) * 10;
          const ringBand = lerp(ringInner, ringOuter, 0.64) + drift + p.radial;
          const a = center + p.spread + Math.sin(t * 0.22 * p.drift + p.w) * 0.02;
          const x = Math.cos(a) * ringBand;
          const y = Math.sin(a) * ringBand;
          const halo = 6 + p.s * 8;
          const falloff = Math.exp(-(p.spread * p.spread) / (2 * 0.48 * 0.48));
          const alpha = p.o * falloff * (0.70 + breath * 0.62) * alphaMul;
          ctx.shadowBlur = halo;
          ctx.shadowColor = `rgba(139,92,246,${0.18 * p.b})`;
          ctx.fillStyle = `rgba(245,241,255,${alpha})`;
          ctx.beginPath();
          ctx.arc(x, y, p.s, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      };

      drawBandParticles(bandCenter, 1.0);
      drawBandParticles(bandCenter2, 0.95);

      const drawFilaments = (center: number, alphaMul: number) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.globalCompositeOperation = "screen";
        ctx.globalAlpha = (0.12 + breath * 0.08) * alphaMul;
        ctx.filter = lowPower ? "blur(0.45px)" : "blur(0.6px)";
        const filamentCount = lowPower ? 4 : 6;
        for (let i = 0; i < filamentCount; i += 1) {
          const base = center + (i - 2.5) * 0.18;
          const rr = lerp(ringInner, ringOuter, 0.76) + (fbm(i * 120, t * 40) - 0.5) * 8;
          const span = 0.55 + (i % 2) * 0.22;
          ctx.lineWidth = 1.0 + i * 0.12;
          ctx.strokeStyle = "rgba(192,132,252,0.24)";
          ctx.beginPath();
          ctx.arc(0, 0, rr, base - span * 0.5, base + span * 0.5);
          ctx.stroke();
        }
        ctx.restore();
      };

      drawFilaments(bandCenter, 1.0);
      drawFilaments(bandCenter2, 0.9);
      ctx.filter = "none";

      rafRef.current = window.requestAnimationFrame(draw);
    };

    const onVis = () => {
      visible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVis);

    rafRef.current = window.requestAnimationFrame(draw);

    return () => {
      running = false;
      document.removeEventListener("visibilitychange", onVis);
      ro.disconnect();
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, [particles, radialParticles, lowPower]);

  return (
    <div className={["relative mx-auto", className].join(" ")} style={{ width: size, height: size }}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-10 rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(139,92,246,0.14), rgba(59,7,100,0.07) 50%, rgba(5,3,6,0) 76%)",
          filter: "blur(22px)",
          opacity: 0.9,
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
