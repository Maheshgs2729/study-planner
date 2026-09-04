'use client';

import { useApp } from '@/store/AppContext';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

export default function StreakWidget() {
  const { state } = useApp();
  const streak = state.user.streak;
  const longest = state.user.longestStreak;

  return (
    <div className="glass p-6 rounded-[26px] relative overflow-hidden group border border-zinc-800 bg-zinc-950">
      {/* Accent top stripe */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white" />
      
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">
            Active Study Streak
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white tracking-tight">{streak}</span>
            <span className="text-xs font-bold text-zinc-400">days running</span>
          </div>
          <p className="text-[11px] text-zinc-400 font-medium mt-1">
            Personal record: <span className="font-bold text-white">{longest} days</span>
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
          className="w-14 h-14 bg-zinc-900 rounded-2xl text-white flex items-center justify-center border border-zinc-700 shadow-sm"
        >
          <Flame className="w-8 h-8 fill-white text-white" />
        </motion.div>
      </div>
    </div>
  );
}
