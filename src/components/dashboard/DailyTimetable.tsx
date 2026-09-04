'use client';

import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { motion } from 'framer-motion';
import { Clock, MapPin, Check, X, Minus, Calendar, Plus } from 'lucide-react';
import { AttendanceStatus, DayOfWeek } from '@/types';
import TimetableModal from './TimetableModal';

export default function DailyTimetable() {
  const { state, getTodayTimetable, getSubject, setAttendance } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const todayClasses = getTodayTimetable();
  const todayStr = new Date().toISOString().split('T')[0];

  const days: DayOfWeek[] = ['sunday' as DayOfWeek, 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const todayDayName = days[new Date().getDay()];

  const handleAttendance = (entryId: string, subjectId: string, status: AttendanceStatus) => {
    setAttendance(entryId, subjectId, todayStr, status);
  };

  return (
    <>
      <div className="glass p-6 rounded-[26px]">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-zinc-900 text-foreground flex items-center justify-center font-bold border border-border">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-foreground leading-tight">Today&apos;s Lecture Schedule</h2>
              <span className="text-[11px] text-muted font-medium">Log attendance and track lecture rooms</span>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-foreground font-bold text-xs border border-border transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manage Schedule</span>
          </button>
        </div>

        {todayClasses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-muted">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-zinc-900 flex items-center justify-center text-muted mb-2 border border-border">
              <Calendar className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold">No classes scheduled for today.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs text-foreground font-bold hover:underline mt-1 cursor-pointer"
            >
              + Add a class to your timetable
            </button>
          </div>
        ) : (
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
            {todayClasses.map((entry, i) => {
              const subject = getSubject(entry.subjectId);
              if (!subject) return null;

              const attendanceRecord = state.attendance.find(
                (a) => a.entryId === entry.id && a.date === todayStr
              );
              const status = attendanceRecord?.status;

              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-stretch bg-surface-hover/70 rounded-[20px] overflow-hidden border border-border transition-all hover:border-slate-300 dark:hover:border-zinc-600 group shadow-2xs"
                >
                  <div 
                    className="w-1.5 flex-shrink-0 bg-slate-900 dark:bg-white" 
                  />
                  <div className="p-4 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-sm text-foreground">{subject.name}</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface text-muted font-extrabold uppercase tracking-wide border border-border">
                          {entry.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-3.5 text-xs text-muted font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-muted" />
                          {entry.startTime} - {entry.endTime}
                        </span>
                        {entry.room && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-muted" />
                            {entry.room}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Attendance Action Buttons */}
                    <div suppressHydrationWarning className="flex items-center gap-1.5 self-start sm:self-auto bg-slate-100 dark:bg-black p-1 rounded-xl border border-border shadow-2xs">
                      <button
                        suppressHydrationWarning
                        onClick={() => handleAttendance(entry.id, entry.subjectId, 'present')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                          status === 'present'
                            ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white hover:bg-white/60 dark:hover:bg-zinc-900'
                        }`}
                        title="Present"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Present</span>
                      </button>
                      <button
                        suppressHydrationWarning
                        onClick={() => handleAttendance(entry.id, entry.subjectId, 'absent')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                          status === 'absent'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white hover:bg-white/60 dark:hover:bg-zinc-900'
                        }`}
                        title="Absent"
                      >
                        <X className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Absent</span>
                      </button>
                      <button
                        suppressHydrationWarning
                        onClick={() => handleAttendance(entry.id, entry.subjectId, 'cancelled')}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          status === 'cancelled'
                            ? 'bg-slate-300 text-slate-800 dark:bg-zinc-800 dark:text-zinc-300 shadow-xs'
                            : 'text-slate-500 hover:bg-white/60 dark:hover:bg-zinc-900 hover:text-slate-900 dark:hover:text-white'
                        }`}
                        title="Class Cancelled"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <TimetableModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialDay={todayDayName === ('sunday' as DayOfWeek) ? 'monday' : todayDayName}
      />
    </>
  );
}
