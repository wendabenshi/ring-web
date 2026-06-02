export default function CardFan() {
  const cards = Array.from({ length: 18 }).map((_, i) => i);
  return (
    <div className="relative h-[240px]">
      {cards.map((i) => {
        const t = i / (cards.length - 1);
        const rotate = -28 + t * 56;
        const x = -160 + t * 320;
        const y = 62 + Math.pow(t - 0.5, 2) * 64;
        const scale = 1 - Math.abs(t - 0.5) * 0.07;
        return (
          <div
            key={i}
            className="absolute left-1/2 top-1/2"
            style={{
              transform: `translate(${x}px, ${y}px) rotate(${rotate}deg) translate(-50%, -50%) scale(${scale})`,
            }}
          >
            <div className="h-[150px] w-[95px] rounded-[18px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] shadow-[0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-md">
              <div className="absolute inset-0 rounded-[18px] bg-[radial-gradient(120px_120px_at_50%_46%,rgba(139,92,246,0.20),transparent_60%)]" />
              <div className="absolute left-1/2 top-[38%] h-9 w-9 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}

