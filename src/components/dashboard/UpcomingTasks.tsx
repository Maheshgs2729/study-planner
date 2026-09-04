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
      return { text: 'Overdue', className: 'bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-bold' };
    }
    if (isToday(date)) {
      return { text: 'Due today', className: 'bg-slate-900 text-white dark:bg-white dark:text-black font-black shadow-xs' };
    }
    if (isTomorrow(date)) {
      return { text: 'Due tomorrow', className: 'bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold' };
    }
    
    const days = differenceInDays(date, new Date());
    return { text: `In ${days}d`, className: 'bg-slate-100 text-slate-700 dark:bg-zinc-900 dark:text-zinc-300 border border-border font-medium' };
  };

  return (
    <div className="glass p-6 rounded-[26px]">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-zinc-900 text-foreground flex items-center justify-center font-bold border border-border">
            <ClipboardList className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-foreground leading-tight">Tasks & Milestones</h2>
            <span className="text-[11px] text-muted font-medium">Upcoming course deliverables</span>
          </div>
        </div>

        <Link
          href="/assignments"
          className="text-xs font-bold text-foreground hover:text-muted flex items-center gap-0.5"
        >
          View all <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-8 text-muted text-xs font-medium">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
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
                  className="p-3.5 rounded-[20px] bg-surface-hover/70 border border-border hover:border-slate-300 dark:hover:border-zinc-600 transition-all flex items-center justify-between group cursor-pointer shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div 
                      className="w-1.5 h-8 rounded-full flex-shrink-0 bg-slate-900 dark:bg-white"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                        {task.title}
                      </h4>
                      <p className="text-[11px] text-muted truncate font-medium">
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
