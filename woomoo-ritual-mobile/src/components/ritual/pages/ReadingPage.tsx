"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import RitualTopBar from "../ui/RitualTopBar";
import { MOCK_READING } from "../mock";
import MockCardArt from "../ui/MockCardArt";
import { useRitual } from "../shell/RitualProvider";

export default function ReadingPage() {
  const reduceMotion = useReducedMotion();
  const { question } = useRitual();

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
      <RitualTopBar backHref="/reveal" title="STEP 4 OF 4" />

      <motion.div
        initial={reduceMotion ? undefined : "hidden"}
        animate={reduceMotion ? undefined : "show"}
        variants={sectionVariants}
        className="text-center"
      >
        <div className="text-[11px] tracking-[0.28em] uppercase muted2">{MOCK_READING.pathLabel}</div>
        <div className="mt-2 text-[12px] muted2">“{question}”</div>

        <div className="mt-7 grid grid-cols-3 gap-3">
          {MOCK_READING.cards.map((c) => (
            <div key={c.title} className="text-center">
              <div className="mx-auto aspect-[3/4] w-full rounded-[18px] overflow-hidden border border-white/10 panel">
                <MockCardArt tone="vivid" label={c.title} />
              </div>
              <div className="mt-2 text-[10px] tracking-[0.22em] uppercase muted2">{c.caption}</div>
              <div className="mt-1 text-[12px]">{c.title}</div>
            </div>
          ))}
        </div>

        <h3 className="serif mt-9 text-[22px]">Your Three-Card Insight</h3>
        <p className="mt-4 text-[13px] leading-[1.75] muted max-w-[34ch] mx-auto">{MOCK_READING.summary}</p>
      </motion.div>

      <div className="mt-10 grid gap-4">
        {MOCK_READING.cards.map((c) => (
          <div key={c.title} className="panel rounded-2xl p-5">
            <div className="text-[10px] tracking-[0.22em] uppercase muted2">{c.panelLabel}</div>
            <div className="mt-2 text-[14px] font-semibold">{c.title}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {c.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] muted2"
                >
                  {t}
                </span>
              ))}
            </div>
            <p className="mt-3 text-[12px] leading-[1.75] muted">{c.meaning}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <div className="serif text-[18px]">What the cards see together.</div>
        <p className="mt-3 text-[13px] leading-[1.75] muted">{MOCK_READING.together}</p>
      </div>
    </section>
  );
}

