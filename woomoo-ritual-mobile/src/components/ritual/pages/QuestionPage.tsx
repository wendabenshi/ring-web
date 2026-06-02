"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useRouter } from "next/navigation";
import RitualTopBar from "../ui/RitualTopBar";
import { SUGGESTION_CHIPS } from "../mock";
import CardFan from "../ui/CardFan";
import { useRitual } from "../shell/RitualProvider";

export default function QuestionPage() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const { question, setQuestion } = useRitual();

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
      <RitualTopBar backHref="/" title="LOVE ENERGY" />

      <motion.div
        initial={reduceMotion ? undefined : "hidden"}
        animate={reduceMotion ? undefined : "show"}
        variants={sectionVariants}
        className="text-center"
      >
        <h2 className="serif mt-2 text-[30px] leading-[1.2]">
          Close your eyes.
          <br />
          Bring your question to mind.
        </h2>
        <div className="mt-4 text-[12px] muted2">The cards are listening</div>

        <div className="mt-7 panel soft-glow rounded-full px-4 py-3 flex items-center gap-3">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full bg-transparent text-[13px] outline-none placeholder:text-white/35"
            placeholder="Ask your question..."
          />
          <button
            type="button"
            onClick={() => router.push("/select")}
            className="shrink-0 rounded-full bg-white/90 px-4 py-2 text-[12px] font-medium text-[#0b0711]"
          >
            Send
          </button>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {SUGGESTION_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setQuestion(chip)}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] muted hover:bg-white/8"
            >
              {chip}
            </button>
          ))}
        </div>

        <div className="mt-6 text-[12px] muted2">Ask your question to begin</div>
      </motion.div>

      <div className="relative mt-10 h-[220px] overflow-hidden">
        <div className="absolute inset-x-[-14%] bottom-[-86px] scale-[1.06]">
          <CardFan />
        </div>
      </div>
    </section>
  );
}

