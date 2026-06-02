"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import RitualTopBar from "../ui/RitualTopBar";
import PortalRitualRing from "../PortalRitualRing";

export default function HeroPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section className="pt-2 pb-10">
      <RitualTopBar title="RITUAL PORTAL" />

      <motion.div
        initial={reduceMotion ? undefined : "hidden"}
        animate={reduceMotion ? undefined : "show"}
        variants={sectionVariants}
        className="text-center"
      >
        <div className="relative mx-auto mt-2 mb-7 w-full max-w-[320px]">
          <PortalRitualRing size={300} className="opacity-[0.98]" />
        </div>

        <div className="text-[11px] tracking-[0.28em] uppercase muted2">
          TAROT, ATTUNED TO YOU
        </div>
        <h1 className="serif mt-5 text-[40px] leading-[1.04]">
          Bring the question
          <br />
          <span className="text-[rgba(139,92,246,0.86)] italic">We&apos;ll sit with it</span>
        </h1>
        <p className="mt-5 text-[14px] leading-[1.7] muted max-w-[32ch] mx-auto">
          An emotional companion in the language of tarot, grounded in psychology. For love,
          self-knowing, and the questions that don&apos;t sleep.
        </p>

        <div className="mt-9 flex justify-center">
          <button
            type="button"
            onClick={() => router.push("/question")}
            className="inline-flex items-center gap-2 rounded-full bg-white/95 px-5 py-3 text-[14px] font-medium text-[#0b0711] shadow-[0_16px_40px_rgba(0,0,0,0.45)] active:scale-[0.99]"
          >
            Try for free <span aria-hidden>→</span>
          </button>
        </div>

        <div className="mt-10" />
      </motion.div>
    </section>
  );
}
