export default function MockCardArt({
  label,
  tone = "soft",
}: {
  label?: string;
  tone?: "soft" | "vivid";
}) {
  const vivid = tone === "vivid";
  return (
    <div className="relative h-full w-full">
      <div
        className={[
          "absolute inset-0",
          vivid
            ? "bg-[radial-gradient(140px_160px_at_50%_26%,rgba(139,92,246,0.38),transparent_60%),linear-gradient(180deg,rgba(255,255,255,0.10),rgba(255,255,255,0.03))]"
            : "bg-[radial-gradient(140px_160px_at_50%_26%,rgba(139,92,246,0.18),transparent_62%),linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))]",
        ].join(" ")}
      />
      <div className="absolute inset-0 opacity-70 [background-image:radial-gradient(1px_1px_at_20%_30%,rgba(255,255,255,0.22),transparent_55%),radial-gradient(1px_1px_at_70%_55%,rgba(255,255,255,0.16),transparent_55%),radial-gradient(1px_1px_at_36%_74%,rgba(255,255,255,0.12),transparent_55%)]" />

      <div className="absolute left-1/2 top-[38%] h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/5" />
      {label ? (
        <div className="absolute inset-x-2 bottom-2 text-center text-[10px] tracking-[0.20em] uppercase text-white/70">
          {label}
        </div>
      ) : null}
    </div>
  );
}

