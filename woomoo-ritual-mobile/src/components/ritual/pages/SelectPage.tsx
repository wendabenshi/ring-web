"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import RitualTopBar from "../ui/RitualTopBar";
import MockCardArt from "../ui/MockCardArt";
import { useRitual } from "../shell/RitualProvider";

export default function SelectPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const { question, selected, togglePick, resetPicks, setRevealed } = useRitual();

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
      <RitualTopBar backHref="/question" title="STEP 2 OF 4" />

      <motion.div
        initial={reduceMotion ? undefined : "hidden"}
        animate={reduceMotion ? undefined : "show"}
        variants={sectionVariants}
        className="text-center"
      >
        <h2 className="serif mt-2 text-[30px] leading-[1.2]">Choose your spread</h2>
        <p className="mt-4 text-[12px] muted2 max-w-[36ch] mx-auto">
          Trust your intuition. Tap three cards. We&apos;ll reveal what you need to know.
        </p>
        <div className="mt-5 text-[12px] muted2">“{question}”</div>

        <div className="mt-8 grid grid-cols-3 gap-4 px-3">
          {Array.from({ length: 3 }).map((_, slotIndex) => {
            const pickedIndex = selected[slotIndex];
            return (
              <div
                key={slotIndex}
                className="panel rounded-[18px] border border-white/10 h-[130px] flex items-center justify-center"
              >
                {pickedIndex === undefined ? (
                  <div className="text-[22px] text-white/18">{slotIndex + 1}</div>
                ) : (
                  <MockCardArt tone="vivid" label={`Pick ${pickedIndex + 1}`} />
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-7 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => resetPicks()}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[12px] muted"
          >
            Reset
          </button>
          <button
            type="button"
            disabled={selected.length !== 3}
            onClick={() => {
              setRevealed(true);
              router.push("/reveal");
            }}
            className="rounded-full bg-white/90 px-5 py-2 text-[12px] font-medium text-[#0b0711] disabled:opacity-40"
          >
            Reveal (3)
          </button>
        </div>
      </motion.div>

      <div className="mt-10 panel rounded-2xl p-4">
        <div className="text-[11px] tracking-[0.22em] uppercase muted2">Card pool (mock)</div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {Array.from({ length: 12 }).map((_, index) => {
            const active = selected.includes(index);
            return (
              <button
                key={index}
                type="button"
                onClick={() => togglePick(index)}
                className={[
                  "relative aspect-[3/4] rounded-[14px] border transition",
                  active ? "border-[rgba(139,92,246,0.48)]" : "border-white/10",
                ].join(" ")}
              >
                <MockCardArt tone={active ? "vivid" : "soft"} label={`${index + 1}`} />
                {active ? (
                  <div className="absolute inset-0 rounded-[14px] ring-1 ring-[rgba(139,92,246,0.26)]" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

