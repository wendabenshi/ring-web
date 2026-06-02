export default function Starfield() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.55]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(1px_1px_at_20%_18%,rgba(255,255,255,0.30),transparent_60%),radial-gradient(1px_1px_at_72%_24%,rgba(255,255,255,0.22),transparent_60%),radial-gradient(1px_1px_at_40%_62%,rgba(255,255,255,0.20),transparent_60%),radial-gradient(1px_1px_at_82%_72%,rgba(255,255,255,0.18),transparent_60%)]" />
      <div className="absolute -inset-[40%] animate-[starDrift_18s_linear_infinite] bg-[radial-gradient(1px_1px_at_10%_10%,rgba(255,255,255,0.18),transparent_55%),radial-gradient(1px_1px_at_40%_22%,rgba(255,255,255,0.14),transparent_55%),radial-gradient(1px_1px_at_72%_18%,rgba(255,255,255,0.14),transparent_55%),radial-gradient(1px_1px_at_30%_64%,rgba(255,255,255,0.12),transparent_55%),radial-gradient(1px_1px_at_86%_66%,rgba(255,255,255,0.12),transparent_55%)] [background-size:520px_520px]" />
      <style jsx>{`
        @keyframes starDrift {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-8%, -10%, 0);
          }
        }
      `}</style>
    </div>
  );
}

