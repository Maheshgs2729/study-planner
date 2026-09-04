'use client';

import { useApp } from '@/store/AppContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Calendar, ChevronRight, ClipboardList, CheckCircle2 } from 'lucide-react';
import { differenceInDays, isPast, isToday, isTomorrow } from 'date-fns';

export default function UpcomingTasks() {
  const { getUpcomingTasks, getSubject } = useApp();
  const tasks = getUpcomingTasks(5);

  const getDueDateInfo = (dateStr: string) => {
    const date = new Date(dateStr);
    
    if (isPast(date) && !isToday(date)) {
      return { text: 'Overdue', className: 'bg-zinc-800 text-white border border-zinc-600 font-black' };
    }
    if (isToday(date)) {
      return { text: 'Due today', className: 'bg-white text-black font-black shadow-xs' };
    }
    if (isTomorrow(date)) {
      return { text: 'Due tomorrow', className: 'bg-zinc-900 text-zinc-200 border border-zinc-700 font-bold' };
    }
    
    const days = differenceInDays(date, new Date());
    return { text: `In ${days}d`, className: 'bg-zinc-900 text-zinc-400 border border-zinc-800 font-medium' };
  };

  return (
    <div className="glass p-6 rounded-[26px] border border-zinc-800 bg-zinc-950">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-zinc-900 text-white flex items-center justify-center font-bold border border-zinc-800">
            <ClipboardList className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-white leading-tight">Tasks & Milestones</h2>
            <span className="text-[11px] text-zinc-400 font-medium">Upcoming course deliverables</span>
          </div>
        </div>

        <Link
          href="/assignments"
          className="text-xs font-bold text-white hover:text-zinc-300 flex items-center gap-0.5"
        >
          View all <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-8 text-zinc-500 text-xs font-medium">
          <CheckCircle2 className="w-8 h-8 text-white mx-auto mb-2 opacity-80" />
          No upcoming tasks. You&apos;re all caught up!
        </div>
      ) : (
        <div className="space-y-2.5">
          {tasks.map((task, i) => {
            const subject = getSubject(task.subjectId);
            const dueInfo = getDueDateInfo(task.dueDate);
            
            return (
              <Link href="/assignments" key={task.id}>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-3.5 rounded-[20px] bg-zinc-900/60 border border-zinc-800 hover:border-zinc-600 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div 
                      className="w-1.5 h-8 rounded-full flex-shrink-0 bg-white"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-white truncate group-hover:text-zinc-300 transition-colors">
                        {task.title}
                      </h4>
                      <p className="text-[11px] text-zinc-400 truncate font-medium">
                        {subject?.name}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <span className={`text-[10px] px-2.5 py-1 rounded-full whitespace-nowrap flex items-center gap-1 ${dueInfo.className}`}>
                      <Calendar className="w-3 h-3" />
                      {dueInfo.text}
                    </span>
                  </div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
