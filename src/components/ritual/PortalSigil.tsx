"use client";

import { motion } from "framer-motion";

function MoonIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
    >
      <path
        d="M15.8 2.9c-4.3 1.2-7.4 5.1-7.4 9.7 0 5.6 4.6 10.2 10.2 10.2 1.3 0 2.6-.3 3.8-.7-1.6 1.2-3.5 1.9-5.7 1.9C11 24 6 19 6 12.7 6 8.1 8.7 4 12.8 2.1c1-.4 2-.6 3-.6Z"
        className="fill-current"
        opacity="0.92"
      />
    </svg>
  );
}

export default function PortalSigil() {
  return (
    <div className="relative mx-auto h-[240px] w-[240px]">
      <div className="absolute inset-0 rounded-full bg-glow-600/15 blur-3xl animate-breath" />
      <div className="absolute inset-0 rounded-full bg-glow-500/10 blur-2xl animate-breath [animation-delay:1.2s]" />

      <motion.div
        aria-hidden="true"
        className="absolute inset-0 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 36, ease: "linear", repeat: Infinity }}
        style={{
          background:
            "conic-gradient(from 180deg, rgba(124,58,237,0.0), rgba(124,58,237,0.55), rgba(124,58,237,0.0))",
          maskImage:
            "radial-gradient(circle at center, transparent 54%, black 58%, black 66%, transparent 70%)",
          WebkitMaskImage:
            "radial-gradient(circle at center, transparent 54%, black 58%, black 66%, transparent 70%)",
        }}
      />

      <div className="absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]" />
      <div className="absolute inset-[18px] rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]" />

      <motion.div
        className="absolute inset-[42px] rounded-full"
        animate={{ opacity: [0.35, 0.65, 0.35] }}
        transition={{ duration: 6.5, ease: "easeInOut", repeat: Infinity }}
        style={{
          background:
            "radial-gradient(circle at center, rgba(124,58,237,0.24), rgba(124,58,237,0.00) 62%)",
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-[74px] w-[74px] rounded-full bg-ink-950/60 shadow-[0_0_0_1px_rgba(255,255,255,0.08)] flex items-center justify-center">
          <MoonIcon className="h-8 w-8 text-glow-500" />
        </div>
      </div>
    </div>
  );
}
