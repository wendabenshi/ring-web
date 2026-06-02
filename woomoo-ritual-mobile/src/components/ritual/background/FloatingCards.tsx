"use client";

import { motion, useReducedMotion } from "framer-motion";

function FloatCard({
  className,
  delay = 0,
  rotate = 0,
}: {
  className: string;
  delay?: number;
  rotate?: number;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      className={className}
      initial={reduceMotion ? undefined : { opacity: 0 }}
      animate={
        reduceMotion
          ? undefined
          : {
              opacity: 1,
              y: [0, -10, 0],
              rotate: [rotate, rotate + 1.6, rotate],
            }
      }
      transition={
        reduceMotion
          ? undefined
          : { duration: 8.5, repeat: Infinity, ease: "easeInOut", delay }
      }
    >
      <div className="h-full w-full rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] backdrop-blur-md shadow-[0_28px_70px_rgba(0,0,0,0.65)]" />
      <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(160px_160px_at_50%_40%,rgba(139,92,246,0.20),transparent_60%)]" />
      <div className="absolute left-1/2 top-[44%] h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/5" />
    </motion.div>
  );
}

export default function FloatingCards() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <FloatCard
        className="absolute -left-6 top-[84px] h-[140px] w-[96px] opacity-90"
        delay={0.3}
        rotate={-14}
      />
      <FloatCard
        className="absolute -right-8 top-[92px] h-[150px] w-[102px] opacity-80"
        delay={1.2}
        rotate={16}
      />
      <FloatCard
        className="absolute -left-8 bottom-[96px] h-[158px] w-[110px] opacity-80"
        delay={0.9}
        rotate={-18}
      />
      <FloatCard
        className="absolute -right-10 bottom-[92px] h-[176px] w-[122px] opacity-90"
        delay={1.8}
        rotate={14}
      />
      <div className="absolute inset-x-[-15%] top-[22%] h-[320px] bg-[radial-gradient(closest-side,rgba(59,7,100,0.24),transparent)] blur-2xl opacity-70" />
      <div className="absolute inset-x-[-20%] top-[48%] h-[360px] bg-[radial-gradient(closest-side,rgba(139,92,246,0.12),transparent)] blur-2xl opacity-60" />
    </div>
  );
}

