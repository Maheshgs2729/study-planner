'use client';

import { useApp } from '@/store/AppContext';
import PageTransition from '@/components/PageTransition';
import DailyTimetable from '@/components/dashboard/DailyTimetable';
import WeeklySchedule from '@/components/dashboard/WeeklySchedule';
import StreakWidget from '@/components/dashboard/StreakWidget';
import AttendanceRing from '@/components/dashboard/AttendanceRing';
import UpcomingTasks from '@/components/dashboard/UpcomingTasks';
import DailyQuoteBar from '@/components/DailyQuoteBar';
import { motion } from 'framer-motion';
import {
  Sparkles,
  BookOpen,
  Clock,
  ArrowRight,
  Play,
  GraduationCap,
  CheckCircle2,
  TrendingUp,
  Layers,
  Flame,
} from 'lucide-react';
import Link from 'next/link';

export default function Dashboard() {
  const { state, getTodayTimetable, getUpcomingTasks, getUpcomingExams, getOverallAttendance, getTodayStudyMinutes } = useApp();

  const todayClasses = getTodayTimetable();
  const upcomingTasks = getUpcomingTasks(4);
  const upcomingExams = getUpcomingExams(1);
  const overallAttendance = getOverallAttendance();
  const todayStudyMins = getTodayStudyMinutes();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
  };

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Apple / Notion Signature Hero Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="hero-gradient-card p-6 sm:p-8 rounded-[28px] relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          {/* Subtle Ambient Vignette */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-slate-200/40 dark:bg-white/5 blur-3xl pointer-events-none" />

          <div className="space-y-3 z-10">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-slate-100 dark:bg-zinc-900 text-slate-900 dark:text-white border border-slate-200 dark:border-zinc-700 backdrop-blur-md shadow-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-slate-900 dark:text-white" />
                Study Planner Pro • {today}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground leading-tight">
              {getGreeting()}, {state.user.name.split(' ')[0]}
            </h1>

            <p className="text-xs sm:text-sm font-medium text-muted max-w-xl leading-relaxed">
              Track course timetables, attendance thresholds, assignments, and exam schedules seamlessly.
            </p>

            {/* Micro Highlights */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-semibold text-foreground">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface/80 border border-border backdrop-blur-md shadow-xs">
                <BookOpen className="w-3.5 h-3.5 text-slate-700 dark:text-zinc-300" />
                {todayClasses.length} lectures today
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface/80 border border-border backdrop-blur-md shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-700 dark:text-zinc-300" />
                {upcomingTasks.length} pending tasks
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface/80 border border-border backdrop-blur-md shadow-xs">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                {state.user.streak} days active
              </span>
            </div>
          </div>

          {/* Right Action CTA Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-start sm:items-center gap-3 z-10 flex-shrink-0">
            <Link href="/focus">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 8px 25px -4px rgba(0, 0, 0, 0.15)' }}
                whileTap={{ scale: 0.96 }}
                className="px-5 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-black text-xs font-black shadow-lg flex items-center gap-2 transition-all hover:bg-slate-800 dark:hover:bg-zinc-200 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Focus Session</span>
              </motion.button>
            </Link>

            {upcomingExams[0] && (
              <Link href="/exams">
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  className="px-4 py-3 rounded-2xl bg-surface hover:bg-surface-hover backdrop-blur-md border border-border text-foreground text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <GraduationCap className="w-4 h-4 opacity-80" />
                  <span className="truncate max-w-[150px]">Next: {upcomingExams[0].title}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                </motion.div>
              </Link>
            )}
          </div>
        </motion.div>

        {/* Stat Summary Metrics (Clean 4-Card Responsive Grid) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stat 1 */}
          <div className="glass p-5 rounded-[24px] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-muted uppercase tracking-wider">Overall Attendance</span>
              <div suppressHydrationWarning className="text-2xl sm:text-3xl font-black text-foreground mt-1">
                {overallAttendance.percentage.toFixed(0)}%
              </div>
              <span suppressHydrationWarning className={`text-[11px] font-bold mt-0.5 inline-block ${
                overallAttendance.percentage >= 75 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}>
                {overallAttendance.percentage >= 75 ? '✓ Above criteria (75%)' : '⚠ Below 75%'}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-zinc-900 border border-emerald-100 dark:border-zinc-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          {/* Stat 2 */}
          <div className="glass p-5 rounded-[24px] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-muted uppercase tracking-wider">Today&apos;s Focus</span>
              <div className="text-2xl sm:text-3xl font-black text-foreground mt-1">
                {todayStudyMins} <span className="text-xs text-muted font-bold">mins</span>
              </div>
              <span className="text-[11px] font-bold text-muted mt-0.5 inline-block">
                Deep work logged
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-zinc-900 border border-indigo-100 dark:border-zinc-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Clock className="w-6 h-6" />
            </div>
          </div>

          {/* Stat 3 */}
          <div className="glass p-5 rounded-[24px] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-muted uppercase tracking-wider">Subjects Enrolled</span>
              <div className="text-2xl sm:text-3xl font-black text-foreground mt-1">
                {state.subjects.length}
              </div>
              <span className="text-[11px] font-bold text-muted mt-0.5 inline-block">
                Active courses
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-zinc-900 border border-blue-100 dark:border-zinc-800 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <Layers className="w-6 h-6" />
            </div>
          </div>

          {/* Stat 4 */}
          <div className="glass p-5 rounded-[24px] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-muted uppercase tracking-wider">Current Streak</span>
              <div className="text-2xl sm:text-3xl font-black text-foreground mt-1 flex items-center gap-1.5">
                {state.user.streak} <span className="text-xs text-muted font-bold">days</span>
              </div>
              <span className="text-[11px] font-bold text-muted mt-0.5 inline-block">
                Personal record: {state.user.longestStreak}d
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-zinc-900 border border-amber-100 dark:border-zinc-800 text-amber-500 flex items-center justify-center font-bold">
              <Flame className="w-6 h-6 fill-amber-500" />
            </div>
          </div>
        </div>

        {/* Main 2-Column Dashboard Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Left Column (2 Cols) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <motion.div variants={itemVariants}>
              <DailyTimetable />
            </motion.div>
            <motion.div variants={itemVariants}>
              <WeeklySchedule />
            </motion.div>
          </div>

          {/* Right Column (1 Col) */}
          <div className="flex flex-col gap-6">
            <motion.div variants={itemVariants}>
              <StreakWidget />
            </motion.div>
            <motion.div variants={itemVariants}>
              <AttendanceRing />
            </motion.div>
            <motion.div variants={itemVariants}>
              <UpcomingTasks />
            </motion.div>
          </div>
        </motion.div>

        {/* Daily Inspiring Study Quotes Banner */}
        <div className="pt-2">
          <DailyQuoteBar />
        </div>
      </div>
    </PageTransition>
  );
}
