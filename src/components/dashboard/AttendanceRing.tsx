'use client';

import { useApp } from '@/store/AppContext';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { useTheme } from '../ThemeProvider';

export default function AttendanceRing() {
  const { getOverallAttendance } = useApp();
  const { theme } = useTheme();
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
  
  const strokeColor = isEligible ? '#10b981' : '#ef4444';
  const trackColor = theme === 'dark' ? '#27272a' : '#e2e8f0';
  
  const strokeDashoffset = mounted ? circumference - (percentage / 100) * circumference : circumference;

  return (
    <div className="glass p-6 rounded-[26px] flex flex-col items-center">
      <div className="flex items-center justify-between w-full mb-3">
        <span className="text-xs font-bold text-muted uppercase tracking-wider">Attendance Status</span>
        <span suppressHydrationWarning className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
          isEligible 
            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' 
            : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
        }`}>
          {isEligible ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <AlertTriangle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />}
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
            stroke={trackColor}
            strokeWidth={strokeWidth}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke={strokeColor}
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
