"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import RitualCard from "@/components/ritual/RitualCard";
import PortalRingPngHero from "@/components/ritual/PortalRingPngHero";
import PortalRitualRing from "@/components/ritual/PortalRitualRing";
import { type RitualTopic, ritualTopics } from "@/lib/ritualCopy";
import { drawThreeCards, type TarotCard } from "@/lib/mockTarot";

type Step = "intro" | "topic" | "spread" | "reading" | "subscribe";

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Back"
      className={[
        "h-9 w-9 rounded-full",
        "bg-white/[0.02] hover:bg-white/[0.04] transition",
        "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]",
        "flex items-center justify-center",
      ].join(" ")}
    >
      <span className="text-zinc-200 text-sm leading-none">←</span>
    </button>
  );
}

function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className = "", ...rest } = props;
  return (
    <button
      {...rest}
      className={[
        "h-12 w-full rounded-2xl px-5",
        "text-zinc-50 font-medium tracking-ritual uppercase text-[12px]",
        "bg-gradient-to-b from-glow-600/55 to-glow-600/25",
        "shadow-[0_14px_50px_rgba(124,58,237,0.18)]",
        "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]",
        "transition active:scale-[0.99] disabled:opacity-60",
        className,
      ].join(" ")}
    />
  );
}

function IntroCtaButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className = "", children, ...rest } = props;
  return (
    <button
      {...rest}
      className={[
        "relative h-14 w-full rounded-2xl px-6 overflow-hidden",
        "text-[12px] tracking-ritual uppercase font-medium text-[#F5F1FF]",
        "bg-gradient-to-b from-[#3B0764]/70 via-[#2A0E48]/65 to-[#14081F]/55",
        "shadow-[0_18px_60px_rgba(124,58,237,0.16)]",
        "shadow-[inset_0_0_0_1px_rgba(245,241,255,0.16)]",
        "transition active:scale-[0.99]",
        className,
      ].join(" ")}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 20%, rgba(139,92,246,0.22), rgba(139,92,246,0.0) 55%)",
          mixBlendMode: "screen",
          opacity: 0.9,
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          background:
            "linear-gradient(90deg, rgba(139,92,246,0.0), rgba(139,92,246,0.18), rgba(139,92,246,0.0))",
          filter: "blur(10px)",
        }}
      />
      <span className="relative drop-shadow-[0_1px_12px_rgba(139,92,246,0.18)]">
        {children}
      </span>
    </button>
  );
}

function GhostButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className = "", ...rest } = props;
  return (
    <button
      {...rest}
      className={[
        "h-12 w-full rounded-full px-5",
        "bg-white/0 text-zinc-100",
        "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]",
        "transition hover:bg-white/[0.03] active:scale-[0.99]",
        className,
      ].join(" ")}
    />
  );
}

function StepLabel({ current, total }: { current: number; total: number }) {
  return (
    <div className="text-[11px] tracking-ritual uppercase text-glow-500/70">
      Step {current} of {total}
    </div>
  );
}

function OptionIcon({ id }: { id: RitualTopic }) {
  const base = "h-[18px] w-[18px] text-zinc-200/90";
  switch (id) {
    case "love":
      return <span className={base}>♡</span>;
    case "career":
      return <span className={base}>⌁</span>;
    case "self":
      return <span className={base}>◌</span>;
    case "random":
      return <span className={base}>✶</span>;
  }
}

function TopicRow({
  id,
  label,
  active,
  onClick,
}: {
  id: RitualTopic;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "h-14 w-full rounded-2xl px-5",
        "flex items-center gap-4",
        "bg-white/[0.02] hover:bg-white/[0.04] transition",
        "shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]",
        active ? "shadow-[0_0_0_1px_rgba(124,58,237,0.35),0_16px_60px_rgba(124,58,237,0.10)]" : "",
      ].join(" ")}
    >
      <div className="h-9 w-9 rounded-xl bg-white/[0.02] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)] flex items-center justify-center">
        <OptionIcon id={id} />
      </div>
      <div className="flex-1 text-left text-[14px] text-zinc-100">{label}</div>
    </button>
  );
}

export default function RitualApp() {
  const [step, setStep] = useState<Step>("intro");
  const [topic, setTopic] = useState<RitualTopic | null>(null);
  const [introPulseId, setIntroPulseId] = useState(0);
  const [flipped, setFlipped] = useState<Record<"past" | "present" | "future", boolean>>({
    past: false,
    present: false,
    future: false,
  });

  const cards = useMemo(() => {
    if (!topic) return null;
    return drawThreeCards(topic);
  }, [topic]);

  const allFlipped = flipped.past && flipped.present && flipped.future;
  const revealedCount = Number(flipped.past) + Number(flipped.present) + Number(flipped.future);
  const hasAnyReveal = revealedCount > 0;

  function resetForNewRitual(nextTopic?: RitualTopic) {
    setTopic(nextTopic ?? null);
    setFlipped({ past: false, present: false, future: false });
  }

  return (
    <div className="flex flex-1 items-stretch justify-center px-4 py-6">
      <div className="w-full max-w-[390px] min-h-dvh rounded-[28px] bg-ink-950/90 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] overflow-hidden ritual-noise">
        <div className="relative min-h-dvh px-5 pt-8 pb-8 flex flex-col">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-glow-600/20 blur-3xl animate-breath" />
            <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-glow-500/10 blur-3xl animate-breath [animation-delay:1.3s]" />
          </div>

          <header className="relative z-10 flex items-center justify-between">
            {step === "intro" ? (
              <div className="text-xs tracking-ritual uppercase text-zinc-400">Portal</div>
            ) : (
              <BackButton
                onClick={() => {
                  if (step === "topic") {
                    setIntroPulseId((v) => v + 1);
                    setStep("intro");
                  }
                  else if (step === "spread") setStep("topic");
                  else if (step === "reading") setStep("spread");
                  else if (step === "subscribe") setStep("reading");
                }}
              />
            )}
            <div className="text-xs tracking-ritual uppercase text-zinc-400">NFC Tarot Ring</div>
          </header>

          <main className="relative z-10 flex-1 flex flex-col justify-center">
            <AnimatePresence mode="wait" initial={false}>
              {step === "intro" && (
                <Screen key="intro">
                  <div className="relative flex flex-col items-center text-center">
                    <div className="mb-2 flex flex-col items-center gap-2">
                      <div className="text-zinc-200/70 drop-shadow-[0_0_18px_rgba(255,255,255,0.06)]">
                        <svg
                          width="22"
                          height="22"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                          fill="none"
                        >
                          <path
                            d="M15.8 2.9c-4.3 1.2-7.4 5.1-7.4 9.7 0 5.6 4.6 10.2 10.2 10.2 1.3 0 2.6-.3 3.8-.7-1.6 1.2-3.5 1.9-5.7 1.9C11 24 6 19 6 12.7 6 8.1 8.7 4 12.8 2.1c1-.4 2-.6 3-.6Z"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinejoin="round"
                            opacity="0.9"
                          />
                        </svg>
                      </div>
                      <div className="font-serif text-[13px] uppercase tracking-[0.55em] text-zinc-200/70">
                        PORTAL
                      </div>
                    </div>

                    <div className="mt-2">
                      <div className="relative">
                        <PortalPulse key={introPulseId} />
                        <IntroRingSequence />
                      </div>
                    </div>

                    {/* 2.5–3.0s: Home content fades in */}
                    <div className="w-full">
                      <div className="mt-6 text-[11px] uppercase tracking-[0.24em] text-[#8B5CF6]/85 drop-shadow-[0_0_18px_rgba(139,92,246,0.32)]">
                        YOUR PORTAL IS OPEN
                      </div>
                      <h1 className="mt-3 font-serif text-[42px] leading-[1.05] tracking-tight text-zinc-50">
                        Your ritual
                        <br />
                        begins with
                        <br />
                        one tap.
                      </h1>
                      <p className="mt-5 max-w-[26ch] text-[12px] leading-6 text-zinc-400">
                        Tap into your daily guidance and align with your path.
                      </p>

                      <div className="mt-9 w-full space-y-4">
                        <IntroCtaButton onClick={() => setStep("topic")}>BEGIN RITUAL</IntroCtaButton>
                        <div>
                          <button
                            type="button"
                            onClick={() => alert("Mock: Explain ritual steps here.")}
                            className="w-full text-[12px] text-zinc-400 hover:text-zinc-200 transition flex items-center justify-center gap-2"
                          >
                            <span className="h-5 w-5 rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)] flex items-center justify-center">
                              <span className="text-[10px] text-zinc-300">▶</span>
                            </span>
                            How it works
                          </button>
                          <div className="mt-3 text-center text-[11px] text-zinc-600">
                            Mock experience · No data is stored
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Screen>
              )}

              {step === "topic" && (
                <Screen key="topic">
                  <div className="text-center">
                    <StepLabel current={1} total={4} />
                    <h2 className="mt-4 font-serif text-[34px] leading-[1.08] tracking-tight text-zinc-50">
                      What do you seek
                      <br />
                      guidance on today?
                    </h2>
                    <p className="mt-4 text-sm text-zinc-400">Focus your energy.</p>
                  </div>

                  <div className="mt-10 space-y-3">
                    {ritualTopics.map((t, idx) => (
                      <TopicRow
                        key={t.id}
                        id={t.id}
                        label={t.label}
                        active={idx === 0}
                        onClick={() => {
                          resetForNewRitual(t.id);
                          setStep("spread");
                        }}
                      />
                    ))}
                  </div>
                </Screen>
              )}

              {step === "spread" && cards && topic && (
                <Screen key="spread">
                  <div className="text-center">
                    <StepLabel current={hasAnyReveal ? 3 : 2} total={4} />
                    {!hasAnyReveal ? (
                      <>
                        <h2 className="mt-4 font-serif text-[34px] leading-[1.08] tracking-tight text-zinc-50">
                          Choose your spread
                        </h2>
                        <p className="mt-4 text-sm leading-6 text-zinc-400">
                          Trust your intuition. The cards will reveal what you need to know.
                        </p>
                      </>
                    ) : (
                      <>
                        <h2 className="mt-4 font-serif text-[34px] leading-[1.08] tracking-tight text-zinc-50">
                          The cards have
                          <br />
                          chosen you.
                        </h2>
                        <p className="mt-4 text-sm leading-6 text-zinc-400">
                          Take a breath and receive your guidance.
                        </p>
                      </>
                    )}
                  </div>

                  <div className="mt-10 grid grid-cols-3 gap-3">
                    <SpreadCard
                      label="Past"
                      card={cards.past}
                      flipped={flipped.past}
                      onFlip={() => setFlipped((s) => ({ ...s, past: !s.past }))}
                    />
                    <SpreadCard
                      label="Present"
                      card={cards.present}
                      flipped={flipped.present}
                      onFlip={() => setFlipped((s) => ({ ...s, present: !s.present }))}
                    />
                    <SpreadCard
                      label="Future"
                      card={cards.future}
                      flipped={flipped.future}
                      onFlip={() => setFlipped((s) => ({ ...s, future: !s.future }))}
                    />
                  </div>

                  {!hasAnyReveal ? (
                    <div className="mt-8 text-center text-sm text-zinc-500">Tap a card to reveal</div>
                  ) : (
                    <div className="mt-8 text-center">
                      <div className="text-[12px] text-glow-500/70">
                        {revealedCount} of 3 revealed
                      </div>
                      <div className="mt-3 mx-auto h-[3px] w-[180px] rounded-full bg-white/[0.10] overflow-hidden">
                        <div
                          className="h-full bg-glow-600/70"
                          style={{ width: `${(revealedCount / 3) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-10 space-y-3">
                    <PrimaryButton disabled={!allFlipped} onClick={() => setStep("reading")}>
                      Continue
                    </PrimaryButton>
                    <GhostButton
                      onClick={() => {
                        resetForNewRitual();
                        setStep("topic");
                      }}
                    >
                      Choose another question
                    </GhostButton>
                  </div>
                </Screen>
              )}

              {step === "reading" && cards && topic && (
                <Screen key="reading">
                  <div className="text-center">
                    <StepLabel current={4} total={4} />
                    <h2 className="mt-4 font-serif text-[34px] leading-[1.08] tracking-tight text-zinc-50">
                      Your reading
                    </h2>
                    <p className="mt-2 text-sm text-zinc-400">Past · Present · Future</p>
                  </div>

                  <div className="mt-8 grid grid-cols-3 gap-3">
                    <MiniCard label="Past" card={cards.past} />
                    <MiniCard label="Present" card={cards.present} />
                    <MiniCard label="Future" card={cards.future} />
                  </div>

                  <div className="mt-8 space-y-5">
                    <ReadingRow label={cards.past.name} text={cards.past.meaning} icon="⌁" />
                    <ReadingRow label={cards.present.name} text={cards.present.meaning} icon="☾" />
                    <ReadingRow label={cards.future.name} text={cards.future.meaning} icon="✶" />
                  </div>

                  <div className="mt-10 space-y-3">
                    <PrimaryButton onClick={() => alert("Mock: Save to journal")}>
                      SAVE TO JOURNAL
                    </PrimaryButton>
                    <GhostButton onClick={() => setStep("subscribe")}>ASK DEEPER ✶</GhostButton>
                  </div>
                </Screen>
              )}

              {step === "subscribe" && (
                <Screen key="subscribe">
                  <div className="text-center">
                    <h2 className="mt-3 font-serif text-[34px] leading-[1.08] tracking-tight text-zinc-50">
                      Go deeper
                      <br />
                      with your ritual
                    </h2>
                    <p className="mt-4 text-sm leading-6 text-zinc-400">
                      Unlock full access to your spiritual journey.
                    </p>
                  </div>

                  <div className="mt-7">
                    <PortalRingPngHero size={240} />
                  </div>

                  <div className="mt-6 rounded-3xl bg-white/[0.02] p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
                    <FeatureRow icon="⌁" title="Three Card Ritual" desc="Full spreads with in-depth AI interpretations." />
                    <FeatureRow icon="✶" title="Daily Guidance" desc="Personalized readings every day." />
                    <FeatureRow icon="☾" title="AI Follow-up" desc="Ask unlimited questions." />
                    <FeatureRow icon="◌" title="Moon Rituals" desc="Align with lunar cycles." />
                    <FeatureRow icon="♡" title="Personal Journal" desc="Track your journey and growth." />
                  </div>

                  <div className="mt-7 text-center font-serif text-2xl text-glow-500/85">
                    $9.99 / month
                  </div>
                  <div className="mt-4 space-y-3">
                    <PrimaryButton onClick={() => alert("Mock checkout — connect payment later.")}>
                      UNLOCK FULL ACCESS
                    </PrimaryButton>
                    <div className="text-center text-[11px] text-zinc-600">
                      Mock pricing · No payment is processed
                    </div>
                  </div>
                </Screen>
              )}
            </AnimatePresence>
          </main>

          <footer className="relative z-10 pt-6 text-center text-[11px] text-zinc-600">
            Minimal mock UI · Designed at 390px
          </footer>
        </div>
      </div>
    </div>
  );
}

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="py-10"
    >
      {children}
    </motion.section>
  );
}

function PortalPulse() {
  return (
    <>
      {/* Purple pulse behind the sigil (no text obstruction) */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-full"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: [0, 0.75, 0], scale: [0.92, 1.08, 1.02] }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background:
            "radial-gradient(circle at center, rgba(139,92,246,0.22), rgba(59,7,100,0.10) 38%, rgba(5,3,6,0.00) 70%)",
          filter: "blur(10px)",
        }}
      />

      {/* Subtle vignette “inhale” */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.55, 0] }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        style={{
          background:
            "radial-gradient(circle at 50% 46%, rgba(5,3,6,0.00) 38%, rgba(5,3,6,0.82) 74%, rgba(5,3,6,0.95) 100%)",
        }}
      />
    </>
  );
}

function IntroRingSequence() {
  return (
    <div className="relative mx-auto h-[260px] w-[260px]">
      <PortalRitualRing />
    </div>
  );
}

function SpreadCard({
  label,
  card,
  flipped,
  onFlip,
}: {
  label: string;
  card: TarotCard;
  flipped: boolean;
  onFlip: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-[11px] tracking-ritual uppercase text-zinc-500">{label}</div>
      <RitualCard card={card} flipped={flipped} onFlip={onFlip} />
    </div>
  );
}

function MiniCard({ label, card }: { label: string; card: TarotCard }) {
  return (
    <div className="rounded-2xl bg-white/[0.02] p-3 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]">
      <div className="text-[10px] tracking-ritual uppercase text-zinc-500">{label}</div>
      <div className="mt-2 font-serif text-sm text-zinc-100">{card.name}</div>
      <div className="mt-1 text-[11px] text-zinc-500">{card.keyword}</div>
    </div>
  );
}

function ReadingRow({ icon, label, text }: { icon: string; label: string; text: string }) {
  return (
    <div className="flex gap-4">
      <div className="h-10 w-10 rounded-2xl bg-white/[0.02] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)] flex items-center justify-center text-glow-500/80">
        {icon}
      </div>
      <div className="flex-1">
        <div className="font-serif text-lg text-zinc-50">{label}</div>
        <div className="mt-1 text-sm leading-6 text-zinc-400">{text}</div>
      </div>
    </div>
  );
}

function FeatureRow({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="flex gap-4 py-3">
      <div className="mt-0.5 h-9 w-9 rounded-2xl bg-white/[0.02] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)] flex items-center justify-center text-glow-500/70">
        {icon}
      </div>
      <div className="flex-1">
        <div className="text-[13px] text-zinc-100">{title}</div>
        <div className="mt-0.5 text-[12px] leading-5 text-zinc-500">{desc}</div>
      </div>
    </div>
  );
}
