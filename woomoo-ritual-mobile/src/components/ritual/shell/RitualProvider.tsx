"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type RitualState = {
  question: string;
  selected: number[];
  revealed: boolean;
};

type RitualActions = {
  setQuestion: (v: string) => void;
  togglePick: (index: number) => void;
  resetPicks: () => void;
  setRevealed: (v: boolean) => void;
};

type RitualStore = RitualState & RitualActions;

const STORAGE_KEY = "ritual.mobile.v1";

const RitualContext = createContext<RitualStore | null>(null);

function clampPicks(picks: number[]) {
  const unique = Array.from(new Set(picks)).filter((n) => Number.isFinite(n) && n >= 0);
  return unique.slice(0, 3);
}

export default function RitualProvider({ children }: { children: ReactNode }) {
  // Must match SSR output to avoid hydration mismatch; load sessionStorage after mount.
  const [question, setQuestion] = useState("When will real love show up?");
  const [selected, setSelected] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<RitualState>;
      /* eslint-disable react-hooks/set-state-in-effect */
      if (typeof parsed.question === "string") setQuestion(parsed.question);
      if (Array.isArray(parsed.selected)) setSelected(clampPicks(parsed.selected as number[]));
      if (typeof parsed.revealed === "boolean") setRevealed(parsed.revealed);
      /* eslint-enable react-hooks/set-state-in-effect */
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      const snapshot: RitualState = { question, selected, revealed };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
    } catch {
      // ignore
    }
  }, [question, selected, revealed]);

  const store = useMemo<RitualStore>(() => {
    return {
      question,
      selected,
      revealed,
      setQuestion,
      setRevealed,
      resetPicks: () => {
        setSelected([]);
        setRevealed(false);
      },
      togglePick: (index: number) => {
        setSelected((prev) => {
          if (prev.includes(index)) return prev.filter((x) => x !== index);
          if (prev.length >= 3) return prev;
          return [...prev, index];
        });
      },
    };
  }, [question, selected, revealed]);

  return <RitualContext.Provider value={store}>{children}</RitualContext.Provider>;
}

export function useRitual() {
  const ctx = useContext(RitualContext);
  if (!ctx) throw new Error("useRitual must be used within RitualProvider");
  return ctx;
}
