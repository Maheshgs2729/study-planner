'use client';

import { useApp } from '@/store/AppContext';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export default function AttendanceRing() {
  const { getOverallAttendance } = useApp();
  const { percentage, attended, total } = getOverallAttendance();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const size = 160;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const isEligible = percentage >= 75;
  const color = isEligible ? '#ffffff' : '#71717a';
  
  const strokeDashoffset = mounted ? circumference - (percentage / 100) * circumference : circumference;

  return (
    <div className="glass p-6 rounded-[26px] flex flex-col items-center border border-zinc-800 bg-zinc-950">
      <div className="flex items-center justify-between w-full mb-3">
        <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Attendance Status</span>
        <span suppressHydrationWarning className="text-[11px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 bg-zinc-900 text-white border border-zinc-700">
          {isEligible ? <ShieldCheck className="w-3 h-3 text-white" /> : <AlertTriangle className="w-3 h-3 text-zinc-400" />}
          {isEligible ? 'Eligible (≥75%)' : 'At Risk (<75%)'}
        </span>
      </div>
      
      <div className="relative w-[150px] h-[150px] flex items-center justify-center my-2">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#27272a"
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            strokeDasharray={circumference}
          />
        </svg>
        
        <div className="absolute flex flex-col items-center justify-center">
          <span suppressHydrationWarning className="text-3xl font-black text-foreground">
            {Math.round(percentage)}%
          </span>
          <span className="text-[10px] font-bold text-muted uppercase tracking-wide">
            Attendance
          </span>
        </div>
      </div>
      
      <div suppressHydrationWarning className="mt-2 text-xs font-medium text-muted">
        <span suppressHydrationWarning className="font-black text-foreground">{attended}</span> of <span suppressHydrationWarning>{total}</span> scheduled classes attended
      </div>
    </div>
  );
}
