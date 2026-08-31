'use client';

import { useState } from 'react';
import { useApp } from '@/store/AppContext';
import { motion } from 'framer-motion';
import { Calendar, Plus } from 'lucide-react';
import { DayOfWeek } from '@/types';
import TimetableModal from './TimetableModal';

export default function WeeklySchedule() {
  const { state, getSubject } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDay, setModalDay] = useState<DayOfWeek>('monday');
  
  const days: { label: string; key: DayOfWeek }[] = [
    { label: 'Monday', key: 'monday' },
    { label: 'Tuesday', key: 'tuesday' },
    { label: 'Wednesday', key: 'wednesday' },
    { label: 'Thursday', key: 'thursday' },
    { label: 'Friday', key: 'friday' },
    { label: 'Saturday', key: 'saturday' },
  ];
  const currentDayIndex = new Date().getDay() - 1; // 0 for Monday
  
  // Group timetable by day
  const grouped = days.map((dayObj, index) => {
    const dayEntries = state.timetable
      .filter((t) => t.dayOfWeek === dayObj.key)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
    return { day: dayObj.label, key: dayObj.key, entries: dayEntries, isToday: index === currentDayIndex };
  });

  const openDayModal = (dayKey: DayOfWeek) => {
    setModalDay(dayKey);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="glass p-6 rounded-[26px] overflow-hidden">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-foreground leading-tight">Weekly Course Distribution</h2>
              <span className="text-[11px] text-muted font-medium">Click any day to view or edit lectures</span>
            </div>
          </div>
          <button
            onClick={() => {
              setModalDay('monday');
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Customize</span>
          </button>
        </div>
        
        <div className="overflow-x-auto pb-2 custom-scrollbar">
          <div className="min-w-[650px] flex gap-3">
          {grouped.map((dayData, i) => (
            <div 
              key={dayData.day} 
              onClick={() => openDayModal(dayData.key)}
              className={`flex-1 min-w-[100px] rounded-[20px] p-3 cursor-pointer hover:scale-[1.02] transition-all border ${
                dayData.isToday 
                  ? 'bg-primary/10 border-primary/40 ring-2 ring-primary/20 shadow-xs' 
                  : 'bg-surface-hover/70 dark:bg-slate-800/40 border-border hover:border-primary/30'
              }`}
            >
              <div className={`text-xs font-black mb-3 text-center flex items-center justify-center gap-1 uppercase tracking-wider ${
                dayData.isToday ? 'text-primary' : 'text-muted'
              }`}>
                <span>{dayData.day.substring(0, 3)}</span>
                {dayData.isToday && <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
              </div>
              
              <div className="space-y-2">
                {dayData.entries.map((entry, j) => {
                  const subject = getSubject(entry.subjectId);
                  if (!subject) return null;
                  
                  return (
                    <motion.div
                      key={entry.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 + j * 0.03 }}
                      className="p-2 rounded-xl text-xs border border-white/20 dark:border-white/5 shadow-xs"
                      style={{ 
                        backgroundColor: `${subject.color || '#5451ff'}18`,
                        borderLeft: `3px solid ${subject.color || '#5451ff'}`
                      }}
                    >
                      <div className="font-bold text-foreground truncate" title={subject.name}>
                        {subject.name.substring(0, 3).toUpperCase()}
                      </div>
                      <div className="text-muted text-[10px] font-semibold mt-0.5">
                        {entry.startTime}
                      </div>
                    </motion.div>
                  );
                })}
                {dayData.entries.length === 0 && (
                  <div className="text-center text-[10px] text-muted py-4 font-semibold opacity-60">
                    Free day
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    <TimetableModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      initialDay={modalDay}
    />
  </>
  );
}
