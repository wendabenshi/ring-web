"use client";

import Image from "next/image";

export default function PortalRingPngHero({
  size = 260,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      className={["relative mx-auto", className].join(" ")}
      style={{ width: size, height: size }}
    >
      {/* Outer glow lives outside the crop so it’s clearly visible */}
      <div
        className="pointer-events-none absolute -inset-10 rounded-full portal-glow-pulse"
        aria-hidden="true"
        style={{ zIndex: 0 }}
      />

      <div
        className="relative h-full w-full overflow-hidden rounded-full portal-image-breathe"
        style={{ zIndex: 1 }}
      >
        <Image
          src="/portal_ring_exact_style.png"
          alt="Portal ring"
          fill
          priority
          sizes={`${size}px`}
          className="object-cover"
        />
        <div className="pointer-events-none absolute inset-0 portal-glow-breath" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 portal-glow-sheen" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 portal-glow-vignette" aria-hidden="true" />
      </div>
    </div>
  );
}
