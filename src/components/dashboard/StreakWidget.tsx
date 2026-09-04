'use client';

import { useApp } from '@/store/AppContext';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

export default function StreakWidget() {
  const { state } = useApp();
  const streak = state.user.streak;
  const longest = state.user.longestStreak;

  return (
    <div className="glass p-6 rounded-[26px] relative overflow-hidden group">
      {/* Accent top stripe */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
      
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-muted uppercase tracking-wider block mb-1">
            Active Study Streak
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-foreground tracking-tight">{streak}</span>
            <span className="text-xs font-bold text-muted">days running</span>
          </div>
          <p className="text-[11px] text-muted font-medium mt-1">
            Personal record: <span className="font-bold text-foreground">{longest} days</span>
          </p>
        </div>
        
        <motion.div
          animate={{ 
            scale: [1, 1.12, 1],
          }}
          transition={{ 
            duration: 2.2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="w-14 h-14 bg-amber-50 dark:bg-zinc-900 rounded-2xl text-amber-500 flex items-center justify-center border border-amber-100 dark:border-zinc-800 shadow-xs"
        >
          <Flame className="w-8 h-8 fill-amber-500" />
        </motion.div>
      </div>
    </div>
  );
}
