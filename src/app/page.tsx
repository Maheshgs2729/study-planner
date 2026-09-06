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
      <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-6 overflow-x-hidden">
        {/* Apple / Notion Signature Hero Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="hero-gradient-card p-5 sm:p-7 md:p-8 rounded-[24px] sm:rounded-[28px] relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6 w-full max-w-full"
        >
          {/* Subtle Ambient Vignette */}
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-slate-200/40 dark:bg-white/5 blur-3xl pointer-events-none" />

          <div className="space-y-3 z-10 w-full md:max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider bg-slate-100 dark:bg-zinc-900 text-slate-900 dark:text-white border border-slate-200 dark:border-zinc-700 backdrop-blur-md shadow-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-slate-900 dark:text-white" />
                Study Planner Pro • {today}
              </span>
            </div>

            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight text-foreground leading-tight">
              {getGreeting()}, {state.user.name.split(' ')[0]}
            </h1>

            <p className="text-xs sm:text-sm font-medium text-muted max-w-xl leading-relaxed">
              Track course timetables, attendance thresholds, assignments, and exam schedules seamlessly.
            </p>

            {/* Micro Highlights */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1 text-xs font-semibold text-foreground">
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
          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 z-10 flex-shrink-0 w-full sm:w-auto">
            <Link href="/focus" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 8px 25px -4px rgba(0, 0, 0, 0.15)' }}
                whileTap={{ scale: 0.96 }}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-black text-xs font-black shadow-lg flex items-center justify-center gap-2 transition-all hover:bg-slate-800 dark:hover:bg-zinc-200 cursor-pointer min-h-[44px]"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Start Focus Session</span>
              </motion.button>
            </Link>

            {upcomingExams[0] && (
              <Link href="/exams" className="w-full sm:w-auto">
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-surface hover:bg-surface-hover backdrop-blur-md border border-border text-foreground text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs min-h-[44px]"
                >
                  <GraduationCap className="w-4 h-4 opacity-80" />
                  <span className="truncate max-w-[150px]">Next: {upcomingExams[0].title}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                </motion.div>
              </Link>
            )}
          </div>
        </motion.div>

        {/* Stat Summary Metrics (Clean Responsive Grid) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full">
          {/* Stat 1 */}
          <div className="glass p-4 sm:p-5 rounded-[20px] sm:rounded-[24px] flex items-center justify-between min-w-0">
            <div className="min-w-0">
              <span className="text-[10px] sm:text-xs font-bold text-muted uppercase tracking-wider block truncate">Overall Attendance</span>
              <div suppressHydrationWarning className="text-xl sm:text-3xl font-black text-foreground mt-0.5 sm:mt-1">
                {overallAttendance.percentage.toFixed(0)}%
              </div>
              <span suppressHydrationWarning className={`text-[10px] sm:text-[11px] font-bold mt-0.5 inline-block truncate max-w-full ${
                overallAttendance.percentage >= 75 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
              }`}>
                {overallAttendance.percentage >= 75 ? '✓ Above 75%' : '⚠ Below 75%'}
              </span>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-emerald-50 dark:bg-zinc-900 border border-emerald-100 dark:border-zinc-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold flex-shrink-0">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>

          {/* Stat 2 */}
          <div className="glass p-4 sm:p-5 rounded-[20px] sm:rounded-[24px] flex items-center justify-between min-w-0">
            <div className="min-w-0">
              <span className="text-[10px] sm:text-xs font-bold text-muted uppercase tracking-wider block truncate">Today&apos;s Focus</span>
              <div className="text-xl sm:text-3xl font-black text-foreground mt-0.5 sm:mt-1">
                {todayStudyMins} <span className="text-xs text-muted font-bold">mins</span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-muted mt-0.5 inline-block truncate max-w-full">
                Deep work logged
              </span>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-indigo-50 dark:bg-zinc-900 border border-indigo-100 dark:border-zinc-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold flex-shrink-0">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>

          {/* Stat 3 */}
          <div className="glass p-4 sm:p-5 rounded-[20px] sm:rounded-[24px] flex items-center justify-between min-w-0">
            <div className="min-w-0">
              <span className="text-[10px] sm:text-xs font-bold text-muted uppercase tracking-wider block truncate">Subjects Enrolled</span>
              <div className="text-xl sm:text-3xl font-black text-foreground mt-0.5 sm:mt-1">
                {state.subjects.length}
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-muted mt-0.5 inline-block truncate max-w-full">
                Active courses
              </span>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-blue-50 dark:bg-zinc-900 border border-blue-100 dark:border-zinc-800 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold flex-shrink-0">
              <Layers className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>

          {/* Stat 4 */}
          <div className="glass p-4 sm:p-5 rounded-[20px] sm:rounded-[24px] flex items-center justify-between min-w-0">
            <div className="min-w-0">
              <span className="text-[10px] sm:text-xs font-bold text-muted uppercase tracking-wider block truncate">Current Streak</span>
              <div className="text-xl sm:text-3xl font-black text-foreground mt-0.5 sm:mt-1 flex items-center gap-1.5">
                {state.user.streak} <span className="text-xs text-muted font-bold">days</span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold text-muted mt-0.5 inline-block truncate max-w-full">
                Best: {state.user.longestStreak}d
              </span>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-amber-50 dark:bg-zinc-900 border border-amber-100 dark:border-zinc-800 text-amber-500 flex items-center justify-center font-bold flex-shrink-0">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 fill-amber-500" />
            </div>
          </div>
        </div>

        {/* Main 2-Column Dashboard Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 w-full max-w-full overflow-x-hidden"
        >
          {/* Left Column (2 Cols) */}
          <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-6 w-full max-w-full overflow-x-hidden">
            <motion.div variants={itemVariants} className="w-full max-w-full">
              <DailyTimetable />
            </motion.div>
            <motion.div variants={itemVariants} className="w-full max-w-full">
              <WeeklySchedule />
            </motion.div>
          </div>

          {/* Right Column (1 Col) */}
          <div className="flex flex-col gap-4 sm:gap-6 w-full max-w-full overflow-x-hidden">
            <motion.div variants={itemVariants} className="w-full max-w-full">
              <StreakWidget />
            </motion.div>
            <motion.div variants={itemVariants} className="w-full max-w-full">
              <AttendanceRing />
            </motion.div>
            <motion.div variants={itemVariants} className="w-full max-w-full">
              <UpcomingTasks />
            </motion.div>
          </div>
        </motion.div>

        {/* Daily Inspiring Study Quotes Banner */}
        <div className="pt-2 w-full max-w-full">
          <DailyQuoteBar />
        </div>
      </div>
    </PageTransition>
  );
}
