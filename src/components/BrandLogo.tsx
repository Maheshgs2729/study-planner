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
        whileHover={animate ? { scale: 1.05 } : undefined}
        whileTap={animate ? { scale: 0.95 } : undefined}
        transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        className="relative flex-shrink-0 cursor-pointer"
        style={{ width: icon, height: icon }}
      >
        <svg
          viewBox="0 0 100 100"
          className="relative w-full h-full drop-shadow-md"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Shield / Rounded Squircle */}
          <rect
            x="4"
            y="4"
            width="92"
            height="92"
            rx="26"
            fill="#ffffff"
          />

          {/* Minimalist Graduation Cap & Book Emblem */}
          <path
            d="M50 26L22 40L50 54L78 40L50 26Z"
            fill="#000000"
          />
          <path
            d="M32 46.5V62C32 68 40 73 50 73C60 73 68 68 68 62V46.5L50 55.5L32 46.5Z"
            fill="#000000"
          />
          <path
            d="M78 40V58"
            stroke="#000000"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      </motion.div>

      {/* Typography */}
      {showText && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight text-white ${text}`}>
              Study Planner
            </span>
            <span className="px-1.5 py-0.5 rounded-md bg-white text-black font-black text-[9px] uppercase tracking-wider">
              PRO
            </span>
          </div>
          <span className={`text-zinc-500 font-semibold tracking-wider uppercase mt-0.5 ${sub}`}>
            Academic Manager
          </span>
        </div>
      )}
    </div>
  );
}
