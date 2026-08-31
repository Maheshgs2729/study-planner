'use client';

import { motion } from 'framer-motion';
import { Clock, Flame } from 'lucide-react';
import { useApp } from '@/store/AppContext';

export default function SessionHistory() {
  const { state, getSubject, getTodayStudyMinutes } = useApp();

  const todayStr = new Date().toISOString().split('T')[0];
  const todaySessions = state.pomodoroSessions.filter(s => s.completed && s.startedAt.startsWith(todayStr));
  const totalMinutes = getTodayStudyMinutes();

  return (
    <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border border-white/20 dark:border-gray-800 rounded-3xl p-6 shadow-lg shadow-black/5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Clock className="text-indigo-500" />
          Today&apos;s Activity
        </h2>
      </div>

      <div className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl p-4 text-white mb-6 flex items-center justify-between shadow-lg shadow-indigo-500/20">
        <div>
          <p className="text-indigo-100 text-sm font-medium">Focus Time</p>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-3xl font-bold">{totalMinutes}</span>
            <span className="text-indigo-100 text-sm">min</span>
          </div>
        </div>
        <Flame size={32} className="text-indigo-200" />
      </div>

      <div className="flex-1 overflow-y-auto pr-2 -mr-2">
        {todaySessions.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 py-8">
            <Clock size={32} className="mb-3 text-gray-300 dark:text-gray-600" />
            <p>No sessions yet today.</p>
            <p className="text-sm mt-1">Start your first session!</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {todaySessions.map((session, index) => {
              const subject = getSubject(session.subjectId);
              const task = session.taskId ? state.tasks.find(t => t.id === session.taskId) : null;
              
              return (
                <motion.li
                  key={session.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700/50 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                      {subject ? (
                        <>
                          <div 
                            className="w-2.5 h-2.5 rounded-full" 
                            style={{ backgroundColor: subject.color }} 
                          />
                          {subject.name}
                        </>
                      ) : (
                        'Unknown Subject'
                      )}
                    </div>
                    {task && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                        {task.title}
                      </p>
                    )}
                  </div>
                  <div className="text-xs font-semibold px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-md whitespace-nowrap">
                    25 min
                  </div>
                </motion.li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};
