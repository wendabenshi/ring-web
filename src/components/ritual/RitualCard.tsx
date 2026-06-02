"use client";

import { motion } from "framer-motion";
import type { TarotCard } from "@/lib/mockTarot";

function CardBack() {
  return (
    <div className="absolute inset-0 rounded-[18px] bg-[#0b0a12] [backface-visibility:hidden] overflow-hidden">
      <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]" />
      <div className="absolute inset-[6px] rounded-[14px] shadow-[inset_0_0_0_1px_rgba(124,58,237,0.20)]" />
      <div className="absolute inset-[10px] rounded-[12px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]" />

      <div className="absolute inset-0 opacity-[0.55]">
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-glow-600/18 blur-2xl animate-breath" />
        <div className="absolute -left-12 -bottom-12 h-52 w-52 rounded-full bg-glow-500/10 blur-2xl animate-breath [animation-delay:0.8s]" />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="h-[92px] w-[92px] rounded-full"
          style={{
            background:
              "radial-gradient(circle at center, rgba(124,58,237,0.22), rgba(124,58,237,0.00) 62%)",
          }}
        />
        <div className="absolute h-[92px] w-[92px] rounded-full shadow-[inset_0_0_0_1px_rgba(124,58,237,0.28)]" />
        <div className="absolute h-[66px] w-[66px] rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]" />
        <div className="absolute text-glow-500 text-xl leading-none">☾</div>
      </div>

      <div className="absolute inset-x-0 bottom-3 text-center text-[10px] tracking-ritual uppercase text-zinc-500">
        Tap to reveal
      </div>
    </div>
  );
}

function CardFace({ card }: { card: TarotCard }) {
  return (
    <div className="absolute inset-0 rounded-[18px] bg-[#07070B] [transform:rotateY(180deg)] [backface-visibility:hidden] overflow-hidden">
      <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]" />
      <div className="absolute inset-[6px] rounded-[14px] shadow-[inset_0_0_0_1px_rgba(124,58,237,0.22)]" />
      <div className="absolute inset-[10px] rounded-[12px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]" />

      <div className="absolute inset-0 opacity-[0.7]">
        <div className="absolute -left-10 -bottom-10 h-44 w-44 rounded-full bg-glow-500/10 blur-2xl animate-breath [animation-delay:0.9s]" />
      </div>

      <div className="relative h-full w-full px-3 pt-3 pb-4 flex flex-col">
        <div className="flex items-start justify-between">
          <div className="text-[10px] tracking-ritual uppercase text-zinc-500">IX</div>
          <div className="text-[10px] tracking-ritual uppercase text-glow-500/70">Arcana</div>
        </div>

        <div className="mt-3 flex-1 rounded-xl bg-white/[0.02] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] flex items-center justify-center">
          <div className="text-glow-500/80 text-2xl leading-none">✶</div>
        </div>

        <div className="mt-3 text-center">
          <div className="font-serif text-[12px] leading-4 text-zinc-50">{card.name}</div>
          <div className="mt-1 text-[10px] tracking-ritual uppercase text-zinc-500">
            {card.keyword}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RitualCard({
  card,
  flipped,
  onFlip,
}: {
  card: TarotCard;
  flipped: boolean;
  onFlip: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onFlip}
      className="group relative h-[176px] w-full max-w-[112px] rounded-[18px] [perspective:900px]"
      aria-label={flipped ? `Hide ${card.name}` : "Reveal card"}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="relative h-full w-full rounded-[18px] [transform-style:preserve-3d]"
      >
        <CardBack />
        <CardFace card={card} />
      </motion.div>
    </button>
  );
}
