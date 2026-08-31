'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  MapPin,
  GraduationCap,
  ClipboardList,
  Plus,
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { useApp } from '@/store/AppContext';
import { DayOfWeek } from '@/types';
import TimetableModal from '@/components/dashboard/TimetableModal';
import ExamModal from '@/components/exams/ExamModal';

export default function CalendarPage() {
  const { state, getSubject } = useApp();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'classes' | 'assignments' | 'exams'>('all');
  const [isTimetableModalOpen, setIsTimetableModalOpen] = useState(false);
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Calendar Math
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const totalDaysInPrevMonth = new Date(year, month, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today.toISOString().split('T')[0]);
  };

  const dayOfWeekNames: DayOfWeek[] = ['sunday' as DayOfWeek, 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  // Helper to get events for a given ISO date YYYY-MM-DD
  const getEventsForDate = (dateStr: string) => {
    const dateObj = new Date(dateStr);
    const dayOfWeek = dayOfWeekNames[dateObj.getDay()];

    const classes = state.timetable.filter((t) => t.dayOfWeek === dayOfWeek);
    const tasks = state.tasks.filter((t) => t.dueDate === dateStr);
    const exams = state.exams.filter((e) => e.date === dateStr);

    return { classes, tasks, exams };
  };

  const selectedEvents = getEventsForDate(selectedDate);

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2.5">
              Academic Calendar
              <CalendarIcon className="w-7 h-7 text-indigo-500" />
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Unified monthly schedule of timetable classes, assignment deadlines, and exam dates
            </p>
          </div>

          {/* Action Modals */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setIsTimetableModalOpen(true)}
              className="px-3.5 py-2 rounded-2xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-cyan-400 border border-indigo-500/20 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Class</span>
            </button>
            <button
              onClick={() => setIsExamModalOpen(true)}
              className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-xs font-bold shadow-md hover:opacity-95 transition-opacity flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule Exam</span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {(['all', 'classes', 'assignments', 'exams'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all capitalize ${
                activeFilter === filter
                  ? 'bg-primary text-white shadow-xs'
                  : 'glass text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Calendar & Agenda Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Month Grid (2 Columns) */}
          <div className="lg:col-span-2 glass rounded-3xl p-6 border border-white/20 shadow-xl space-y-4">
            {/* Calendar Controls */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={goToToday}
                  className="px-3 py-1 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border border-border"
                >
                  Today
                </button>
                <button
                  onClick={prevMonth}
                  className="p-1.5 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-1.5 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 text-center text-xs font-bold text-gray-400 border-b border-border/50 pb-2">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-7 gap-1.5">
              {/* Prev Month Days */}
              {Array.from({ length: firstDayIndex }).map((_, i) => {
                const dayNum = totalDaysInPrevMonth - firstDayIndex + i + 1;
                return (
                  <div
                    key={`prev-${i}`}
                    className="h-20 sm:h-24 p-1.5 rounded-2xl bg-gray-50/30 dark:bg-gray-800/10 text-gray-300 dark:text-gray-700 opacity-40 text-xs font-semibold"
                  >
                    {dayNum}
                  </div>
                );
              })}

              {/* Current Month Days */}
              {Array.from({ length: totalDaysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                const isSelected = selectedDate === formattedDate;
                const isToday = new Date().toISOString().split('T')[0] === formattedDate;
                const events = getEventsForDate(formattedDate);

                const hasClasses = events.classes.length > 0 && (activeFilter === 'all' || activeFilter === 'classes');
                const hasTasks = events.tasks.length > 0 && (activeFilter === 'all' || activeFilter === 'assignments');
                const hasExams = events.exams.length > 0 && (activeFilter === 'all' || activeFilter === 'exams');

                return (
                  <motion.div
                    key={`curr-${dayNum}`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedDate(formattedDate)}
                    className={`h-20 sm:h-24 p-1.5 sm:p-2 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/40 bg-primary/10 shadow-md'
                        : isToday
                        ? 'border-indigo-500/50 bg-indigo-50/40 dark:bg-indigo-950/20'
                        : 'border-border/60 hover:border-border bg-white/40 dark:bg-gray-800/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-bold ${
                          isToday
                            ? 'w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {dayNum}
                      </span>
                    </div>

                    {/* Event Dots / Badges */}
                    <div className="space-y-1 overflow-hidden">
                      {hasExams && (
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-rose-500 text-white text-[9px] font-bold truncate">
                          <GraduationCap className="w-2.5 h-2.5 flex-shrink-0" />
                          <span className="truncate">{events.exams[0].title}</span>
                        </div>
                      )}
                      {hasTasks && (
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500 text-white text-[9px] font-bold truncate">
                          <ClipboardList className="w-2.5 h-2.5 flex-shrink-0" />
                          <span className="truncate">{events.tasks[0].title}</span>
                        </div>
                      )}
                      {hasClasses && (
                        <div className="text-[9px] font-semibold text-indigo-600 dark:text-cyan-400 truncate">
                          {events.classes.length} class{events.classes.length > 1 ? 'es' : ''}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Agenda Sidebar for Selected Day (1 Column) */}
          <div className="glass rounded-3xl p-6 border border-white/20 shadow-xl space-y-4 flex flex-col">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                  Selected Date Agenda
                </span>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">
                  {new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                  })}
                </h3>
              </div>
            </div>

            {/* Agenda List */}
            <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1 max-h-[440px]">
              {/* Exams on this day */}
              {selectedEvents.exams.map((exam) => {
                const sub = getSubject(exam.subjectId);
                return (
                  <div
                    key={exam.id}
                    className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-rose-500 text-white text-[10px] font-extrabold uppercase">
                        Exam
                      </span>
                      <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                        {exam.time}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                      {exam.title}
                    </h4>
                    <div className="flex items-center gap-3 text-[11px] text-gray-500">
                      <span>{sub?.name}</span>
                      {exam.location && <span>• {exam.location}</span>}
                    </div>
                  </div>
                );
              })}

              {/* Tasks due on this day */}
              {selectedEvents.tasks.map((task) => {
                const sub = getSubject(task.subjectId);
                return (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[10px] font-extrabold uppercase">
                        Assignment Due
                      </span>
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 capitalize">
                        {task.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-gray-900 dark:text-white">
                      {task.title}
                    </h4>
                    <span className="text-[11px] text-gray-500">{sub?.name}</span>
                  </div>
                );
              })}

              {/* Classes on this day */}
              {selectedEvents.classes.map((cls) => {
                const sub = getSubject(cls.subjectId);
                return (
                  <div
                    key={cls.id}
                    className="p-3.5 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-border space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="px-2 py-0.5 rounded-md text-white text-[10px] font-bold"
                        style={{ backgroundColor: sub?.color || '#6366f1' }}
                      >
                        {sub?.name || 'Class'}
                      </span>
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                        {cls.startTime} - {cls.endTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                      <span className="capitalize">{cls.type}</span>
                      {cls.room && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {cls.room}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {selectedEvents.exams.length === 0 &&
                selectedEvents.tasks.length === 0 &&
                selectedEvents.classes.length === 0 && (
                  <div className="py-12 text-center text-xs text-gray-400">
                    No scheduled classes, exams, or assignment deadlines for this date.
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Modals */}
        <TimetableModal
          isOpen={isTimetableModalOpen}
          onClose={() => setIsTimetableModalOpen(false)}
        />
        <ExamModal
          isOpen={isExamModalOpen}
          onClose={() => setIsExamModalOpen(false)}
        />
      </div>
    </PageTransition>
  );
}
