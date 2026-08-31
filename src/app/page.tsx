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
        {/* Cosmic Solar Eclipse Signature Hero Overview Card */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="hero-gradient-card p-6 sm:p-8 rounded-[28px] relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 border border-orange-500/30"
        >
          {/* Glowing Solar Flare Horizon Arc */}
          <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-t-full bg-gradient-to-t from-orange-600/30 via-amber-500/20 to-transparent blur-2xl pointer-events-none" />
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-orange-500/10 blur-3xl pointer-events-none" />

          <div className="space-y-3 z-10">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/30 backdrop-blur-md shadow-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Cosmic Command Center • {today}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white leading-tight">
              {getGreeting()}, {state.user.name.split(' ')[0]} 🚀
            </h1>

            <p className="text-xs sm:text-sm font-medium text-white/80 max-w-xl leading-relaxed">
              Accelerate your study workflow with lightning-fast AI assistance, attendance tracking, and exam readiness.
            </p>

            {/* Micro Highlights */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-semibold text-white/90">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md">
                <BookOpen className="w-3.5 h-3.5 text-orange-400" />
                {todayClasses.length} lectures today
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {upcomingTasks.length} pending tasks
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                {state.user.streak} days active
              </span>
            </div>
          </div>

          {/* Right Action CTA Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row items-start sm:items-center gap-3 z-10 flex-shrink-0">
            <Link href="/focus">
              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(255, 107, 0, 0.5)' }}
                whileTap={{ scale: 0.96 }}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-black shadow-xl shadow-orange-500/30 flex items-center gap-2 transition-all border border-orange-400/40 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white text-white" />
                <span>Start Focus Session</span>
              </motion.button>
            </Link>

            {upcomingExams[0] && (
              <Link href="/exams">
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4 text-amber-400" />
                  <span className="truncate max-w-[150px]">Next: {upcomingExams[0].title}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-80" />
                </motion.div>
              </Link>
            )}
          </div>
        </motion.div>

        {/* Stat Summary Metrics (Nur Alam 4-Card Grid) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stat 1 */}
          <div className="glass p-5 rounded-[24px] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-muted uppercase tracking-wider">Overall Attendance</span>
              <div suppressHydrationWarning className="text-2xl sm:text-3xl font-black text-foreground mt-1">
                {overallAttendance.percentage.toFixed(0)}%
              </div>
              <span suppressHydrationWarning className={`text-[11px] font-bold mt-0.5 inline-block ${overallAttendance.percentage >= 75 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {overallAttendance.percentage >= 75 ? '✓ Above criteria' : '⚠ Below 75%'}
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
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
              <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400 mt-0.5 inline-block">
                Deep work logged
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-bold">
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
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 inline-block">
                Active courses
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
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
              <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400 mt-0.5 inline-block">
                Best: {state.user.longestStreak} days
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
              <Flame className="w-6 h-6 fill-orange-500" />
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
