import type { ReactNode } from "react";
import RitualShell from "@/components/ritual/shell/RitualShell";

export default function RitualLayout({ children }: { children: ReactNode }) {
  return <RitualShell>{children}</RitualShell>;
}

