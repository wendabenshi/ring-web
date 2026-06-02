"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RitualTopBar({
  backHref,
  title,
}: {
  backHref?: string;
  title?: string;
}) {
  const pathname = usePathname();
  const showBack = Boolean(backHref) && pathname !== "/";

  return (
    <div className="mb-5 flex items-center justify-between">
      <div className="w-10">
        {showBack ? (
          <Link
            href={backHref!}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70"
            aria-label="Back"
          >
            ←
          </Link>
        ) : null}
      </div>
      {title ? (
        <div className="text-[11px] tracking-[0.28em] uppercase muted2">{title}</div>
      ) : (
        <div />
      )}
      <div className="w-10" />
    </div>
  );
}

