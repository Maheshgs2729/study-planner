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
      <div className="glass p-6 rounded-[26px] border border-zinc-800 bg-zinc-950">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold border border-zinc-800">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white leading-tight">Today&apos;s Lecture Schedule</h2>
              <span className="text-[11px] text-zinc-400 font-medium">Log attendance and track lecture rooms</span>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs border border-zinc-800 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manage Schedule</span>
          </button>
        </div>

        {todayClasses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-zinc-500">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-400 mb-2 border border-zinc-800">
              <Calendar className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold">No classes scheduled for today.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-xs text-white font-bold hover:underline mt-1"
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
                  className="flex items-stretch bg-zinc-900/60 rounded-[20px] overflow-hidden border border-zinc-800 transition-all hover:border-zinc-600 group"
                >
                  <div 
                    className="w-1.5 flex-shrink-0 bg-white" 
                  />
                  <div className="p-4 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-sm text-white">{subject.name}</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 font-extrabold uppercase tracking-wide border border-zinc-700">
                          {entry.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-3.5 text-xs text-zinc-400 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-zinc-400" />
                          {entry.startTime} - {entry.endTime}
                        </span>
                        {entry.room && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                            {entry.room}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Attendance Action Buttons */}
                    <div suppressHydrationWarning className="flex items-center gap-1.5 self-start sm:self-auto bg-black p-1 rounded-xl border border-zinc-800 shadow-xs">
                      <button
                        suppressHydrationWarning
                        onClick={() => handleAttendance(entry.id, entry.subjectId, 'present')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                          status === 'present'
                            ? 'bg-white text-black shadow-xs'
                            : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                        }`}
                        title="Present"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Present</span>
                      </button>
                      <button
                        suppressHydrationWarning
                        onClick={() => handleAttendance(entry.id, entry.subjectId, 'absent')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                          status === 'absent'
                            ? 'bg-zinc-800 text-white border border-zinc-700 shadow-xs'
                            : 'text-zinc-500 hover:text-white hover:bg-zinc-900'
                        }`}
                        title="Absent"
                      >
                        <X className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Absent</span>
                      </button>
                      <button
                        suppressHydrationWarning
                        onClick={() => handleAttendance(entry.id, entry.subjectId, 'cancelled')}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                          status === 'cancelled'
                            ? 'bg-zinc-800 text-zinc-300 border border-zinc-700 shadow-xs'
                            : 'text-zinc-500 hover:bg-zinc-900 hover:text-white'
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
