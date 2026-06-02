"use client";

import { motion } from "framer-motion";

function Starfield() {
  const stars = [
    { a: 8, r: 210, s: 1.4, o: 0.22 },
    { a: 22, r: 230, s: 1.0, o: 0.18 },
    { a: 44, r: 200, s: 1.2, o: 0.16 },
    { a: 66, r: 242, s: 1.6, o: 0.18 },
    { a: 88, r: 218, s: 1.1, o: 0.2 },
    { a: 114, r: 236, s: 1.3, o: 0.16 },
    { a: 138, r: 206, s: 1.0, o: 0.16 },
    { a: 160, r: 248, s: 1.7, o: 0.16 },
    { a: 186, r: 224, s: 1.1, o: 0.22 },
    { a: 208, r: 244, s: 1.5, o: 0.16 },
    { a: 232, r: 208, s: 1.2, o: 0.18 },
    { a: 256, r: 238, s: 1.0, o: 0.16 },
    { a: 282, r: 214, s: 1.2, o: 0.2 },
    { a: 306, r: 246, s: 1.6, o: 0.16 },
    { a: 332, r: 206, s: 1.1, o: 0.18 },
    { a: 354, r: 234, s: 1.3, o: 0.16 },
  ];

  return (
    <motion.g
      aria-hidden="true"
      initial={{ opacity: 0.0, rotate: 0 }}
      animate={{ opacity: 1.0, rotate: 360 }}
      transition={{
        opacity: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
        rotate: { duration: 56, ease: "linear", repeat: Infinity },
      }}
      style={{ transformOrigin: "256px 256px" }}
    >
      {stars.map((st, i) => {
        const rad = (st.a * Math.PI) / 180;
        const x = 256 + Math.cos(rad) * st.r;
        const y = 256 + Math.sin(rad) * st.r;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={st.s}
            fill={i % 3 === 0 ? "#C084FC" : "#F5F1FF"}
            fillOpacity={st.o}
          />
        );
      })}
    </motion.g>
  );
}

export default function PortalRingHero({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={["relative mx-auto w-[260px] h-[260px]", className].join(" ")}>
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 rounded-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.0, 0.35, 0.18, 0.28], scale: [0.98, 1.02, 1.0, 1.015] }}
        transition={{ duration: 7.5, ease: "easeInOut", repeat: Infinity }}
        style={{
          background:
            "radial-gradient(circle at center, rgba(139,92,246,0.18), rgba(59,7,100,0.08) 45%, rgba(5,3,6,0.0) 72%)",
          filter: "blur(16px)",
        }}
      />

      <motion.svg
        viewBox="0 0 512 512"
        className="relative h-full w-full"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <defs>
          <radialGradient id="core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0B0612" stopOpacity="1" />
            <stop offset="55%" stopColor="#12051F" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <filter id="purpleGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="0 0 0 0 0.55
                      0 0 0 0 0.20
                      0 0 0 0 1
                      0 0 0 1 0"
            />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="18" />
          </filter>
        </defs>

        <circle cx="256" cy="256" r="250" fill="url(#core)" />

        <Starfield />

        <motion.g
          aria-hidden="true"
          initial={{ opacity: 0.78, scale: 0.995 }}
          animate={{ opacity: [0.78, 0.95, 0.8], scale: [0.995, 1.012, 0.995] }}
          transition={{ duration: 7.5, ease: "easeInOut", repeat: Infinity }}
          style={{ transformOrigin: "256px 256px" }}
        >
          <circle cx="256" cy="256" r="105" stroke="#8B5CF6" strokeOpacity="0.16" strokeWidth="2" />
          <circle
            cx="256"
            cy="256"
            r="91"
            stroke="#A855F7"
            strokeOpacity="0.6"
            strokeWidth="3"
            filter="url(#purpleGlow)"
          />
          <circle cx="256" cy="256" r="72" stroke="#7C3AED" strokeOpacity="0.18" strokeWidth="1" />

          <circle
            cx="256"
            cy="256"
            r="122"
            stroke="#8B5CF6"
            strokeOpacity="0.12"
            strokeWidth="1"
            strokeDasharray="2 16"
          />
          <circle
            cx="256"
            cy="256"
            r="148"
            stroke="#8B5CF6"
            strokeOpacity="0.07"
            strokeWidth="1"
            strokeDasharray="1 20"
          />

          <circle
            cx="256"
            cy="256"
            r="94"
            stroke="#C084FC"
            strokeOpacity="0.22"
            strokeWidth="14"
            filter="url(#softGlow)"
          />
        </motion.g>

        <motion.g
          initial={{ y: 0 }}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4.8, ease: "easeInOut", repeat: Infinity }}
        >
          <path
            d="M278.2 221.5C264.1 218.1 248.9 222.4 238.6 233.3C222.7 250.2 223.4 276.7 240.3 292.6C252.4 304 269.6 307 284.3 301.6C276.9 315.1 262.6 324 246.4 324C222.1 324 202.4 304.3 202.4 280C202.4 255.7 222.1 236 246.4 236C260.1 236 272.4 242.3 280.5 252.1C283.5 241.7 282.4 231 278.2 221.5Z"
            fill="#C084FC"
            fillOpacity="0.88"
            filter="url(#purpleGlow)"
          />
        </motion.g>
      </motion.svg>
    </div>
  );
}
