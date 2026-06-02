"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import RitualTopBar from "../ui/RitualTopBar";
import { MOCK_READING } from "../mock";
import MockCardArt from "../ui/MockCardArt";
import CardFan from "../ui/CardFan";
import { useRitual } from "../shell/RitualProvider";

export default function RevealPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const { question, revealed, setRevealed } = useRitual();

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section className="pt-2 pb-10">
      <RitualTopBar backHref="/select" title="STEP 3 OF 4" />

      <motion.div
        initial={reduceMotion ? undefined : "hidden"}
        animate={reduceMotion ? undefined : "show"}
        variants={sectionVariants}
        className="text-center"
      >
        <h2 className="serif mt-2 text-[30px] leading-[1.2]">The cards have chosen you.</h2>
        <p className="mt-4 text-[12px] muted2 max-w-[36ch] mx-auto">
          Take a breath and receive your guidance.
        </p>
        <div className="mt-5 text-[12px] muted2">“{question}”</div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          {MOCK_READING.cards.map((c, idx) => {
            const shouldShow = revealed || idx === 0;
            return (
              <motion.div
                key={c.title}
                initial={reduceMotion ? undefined : { opacity: 0, y: 6 }}
                animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                className="text-center"
              >
                <div className="mx-auto aspect-[3/4] w-full rounded-[18px] border border-white/10 overflow-hidden panel">
                  <MockCardArt tone={shouldShow ? "vivid" : "soft"} label={shouldShow ? c.title : ""} />
                </div>
                <div className="mt-2 text-[10px] tracking-[0.22em] uppercase muted2">{c.caption}</div>
                <div className="mt-1 text-[12px]">{c.title}</div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-7 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              setRevealed(true);
              router.push("/reading");
            }}
            className="rounded-full bg-white/90 px-5 py-2 text-[12px] font-medium text-[#0b0711]"
          >
            View insight
          </button>
          {!revealed ? (
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[12px] muted"
            >
              Reveal all
            </button>
          ) : null}
        </div>
      </motion.div>

      <div className="relative mt-10 h-[220px] overflow-hidden">
        <div className="absolute inset-x-[-14%] bottom-[-90px] scale-[1.06] opacity-70">
          <CardFan />
        </div>
      </div>
    </section>
  );
}

