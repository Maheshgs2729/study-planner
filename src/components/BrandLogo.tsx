'use client';

import { motion } from 'framer-motion';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  animate?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { icon: 28, text: 'text-base', sub: 'text-[9px]' },
  md: { icon: 36, text: 'text-lg', sub: 'text-[10px]' },
  lg: { icon: 48, text: 'text-2xl', sub: 'text-xs' },
  xl: { icon: 64, text: 'text-3xl', sub: 'text-sm' },
};

export default function BrandLogo({
  size = 'md',
  showText = true,
  animate = true,
  className = '',
}: BrandLogoProps) {
  const { icon, text, sub } = sizeMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Unique SVG Emblem */}
      <motion.div
        whileHover={animate ? { scale: 1.08, rotate: [0, -3, 3, 0] } : undefined}
        whileTap={animate ? { scale: 0.95 } : undefined}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className="relative flex-shrink-0 cursor-pointer"
        style={{ width: icon, height: icon }}
      >
        {/* Ambient Solar Glow */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-orange-600 via-amber-500 to-yellow-400 opacity-70 blur-md group-hover:opacity-100 transition-opacity" />

        <svg
          viewBox="0 0 100 100"
          className="relative w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="logoPrimaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff6b00" />
              <stop offset="50%" stopColor="#ffa726" />
              <stop offset="100%" stopColor="#ff4500" />
            </linearGradient>
            <linearGradient id="logoGlowGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff5500" />
              <stop offset="100%" stopColor="#fbbf24" />
            </linearGradient>
            <linearGradient id="bookPageGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#ffedd5" stopOpacity="0.8" />
            </linearGradient>
            <filter id="logoShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#4338ca" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Background Shield / Rounded Squircle */}
          <rect
            x="4"
            y="4"
            width="92"
            height="92"
            rx="26"
            fill="url(#logoPrimaryGrad)"
            filter="url(#logoShadow)"
          />

          {/* Subtle Inner Border */}
          <rect
            x="6"
            y="6"
            width="88"
            height="88"
            rx="24"
            stroke="rgba(255, 255, 255, 0.35)"
            strokeWidth="1.5"
            fill="none"
          />

          {/* Orbital Focus Ring */}
          <ellipse
            cx="50"
            cy="52"
            rx="34"
            ry="18"
            stroke="url(#bookPageGrad)"
            strokeWidth="2.2"
            strokeDasharray="4 3"
            strokeOpacity="0.8"
            transform="rotate(-18 50 52)"
          />

          {/* Satellite Focus Nodes */}
          <circle cx="78" cy="42" r="3.5" fill="#38bdf8" />
          <circle cx="22" cy="62" r="2.5" fill="#a78bfa" />

          {/* Stylized Open Book Wings (Geometric Wisdom) */}
          {/* Left Page */}
          <path
            d="M 50 68 C 42 62, 28 62, 22 66 L 22 42 C 28 38, 42 38, 50 44 Z"
            fill="url(#bookPageGrad)"
            stroke="rgba(255, 255, 255, 0.6)"
            strokeWidth="1.2"
          />
          {/* Right Page */}
          <path
            d="M 50 68 C 58 62, 72 62, 78 66 L 78 42 C 72 38, 58 38, 50 44 Z"
            fill="url(#bookPageGrad)"
            stroke="rgba(255, 255, 255, 0.6)"
            strokeWidth="1.2"
          />
          {/* Book Spine Center Line */}
          <line
            x1="50"
            y1="44"
            x2="50"
            y2="70"
            stroke="#4338ca"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Radiant Apex Star / Spark of Intelligence */}
          <path
            d="M 50 18 Q 50 26 44 26 Q 50 26 50 34 Q 50 26 56 26 Q 50 26 50 18 Z"
            fill="#ffffff"
            filter="drop-shadow(0 0 3px rgba(255,255,255,0.9))"
          />
        </svg>
      </motion.div>

      {/* Typography */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight text-gray-900 dark:text-white ${text}`}>
              Study<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-cyan-400">Planner</span>
            </span>
            <span className="px-1.5 py-0.5 rounded-md bg-gradient-to-r from-indigo-500/15 to-violet-500/15 dark:from-indigo-500/30 dark:to-cyan-500/30 text-indigo-600 dark:text-cyan-400 font-extrabold text-[10px] uppercase tracking-wider border border-indigo-500/20">
              PRO
            </span>
          </div>
          <span className={`font-medium text-gray-500 dark:text-gray-400 ${sub} tracking-wide`}>
            Intelligent Study Companion
          </span>
        </div>
      )}
    </div>
  );
}
