"use client";

import React, { useMemo } from 'react';
import { useApp } from '@/store/AppContext';
import { Clock, CheckCircle, CalendarCheck, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
};

export default function StatsCards() {
  const { state, getOverallAttendance } = useApp();

  const studyHours = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const sessions = state.pomodoroSessions || [];
    const minutes = sessions
      .filter(s => s && s.completed && new Date(s.startedAt) >= sevenDaysAgo)
      .reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
      
    return (minutes / 60).toFixed(1);
  }, [state.pomodoroSessions]);

  const tasksDone = useMemo(() => {
    return (state.tasks || []).filter(t => t && t.status === 'submitted').length;
  }, [state.tasks]);

  const attendance = useMemo(() => {
    return (getOverallAttendance()?.percentage || 0).toFixed(0);
  }, [getOverallAttendance]);

  const streak = state.user?.streak || 0;

  const cards = [
    {
      id: 1,
      label: 'Study Hours (7d)',
      value: `${studyHours}h`,
      subtext: 'Logged focus time',
      icon: Clock,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      id: 2,
      label: 'Tasks Completed',
      value: tasksDone,
      subtext: 'Submitted deliverables',
      icon: CheckCircle,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10'
    },
    {
      id: 3,
      label: 'Overall Attendance',
      value: `${attendance}%`,
      subtext: Number(attendance) >= 75 ? 'Criteria met (≥75%)' : 'Needs attention',
      icon: CalendarCheck,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10'
    },
    {
      id: 4,
      label: 'Current Streak',
      value: `${streak} ${streak === 1 ? 'Day' : 'Days'}`,
      subtext: `Best: ${state.user?.longestStreak || streak} days`,
      icon: Flame,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.id}
            variants={cardVariants}
            whileHover={{ y: -2 }}
            className="glass rounded-[24px] p-5 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">{card.label}</span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${card.bgColor} ${card.color}`}>
                <Icon size={18} />
              </div>
            </div>
            <div>
              <div suppressHydrationWarning className="text-2xl sm:text-3xl font-black text-foreground">
                {card.value}
              </div>
              <span suppressHydrationWarning className="text-[11px] font-semibold text-muted mt-0.5 block">
                {card.subtext}
              </span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
