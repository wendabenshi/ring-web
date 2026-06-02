"use client";

import type { ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Starfield from "../background/Starfield";
import FloatingCards from "../background/FloatingCards";
import AmbientParticles from "../background/AmbientParticles";
import RitualProvider from "./RitualProvider";

export default function RitualShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, reduceMotion]);

  return (
    <RitualProvider>
      <div className="relative min-h-dvh ritual-bg overflow-x-hidden">
        <div className="absolute inset-0 grain" />
        <AmbientParticles />
        <Starfield />
        <FloatingCards />

        <main className="relative h5-container">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={pathname}
              initial={reduceMotion ? undefined : { opacity: 0, x: 24 }}
              animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, x: -24 }}
              transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </RitualProvider>
  );
}
