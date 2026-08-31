'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/store/AppContext';
import PageTransition from '@/components/PageTransition';
import NotesEditor from '@/components/subjects/NotesEditor';
import KanbanBoard from '@/components/subjects/KanbanBoard';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, Layout, PieChart } from 'lucide-react';

export default function SubjectDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { state, getSubjectAttendance, getSubjectTasks } = useApp();
  
  const subject = state.subjects.find((s) => s.id === id);
  const [activeTab, setActiveTab] = useState<'notes' | 'assignments' | 'stats'>('notes');

  if (!subject) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-gray-500">Subject not found.</p>
      </div>
    );
  }

  const attendance = getSubjectAttendance(subject.id);
  const tasks = getSubjectTasks(subject.id);
  const pendingTasks = tasks.filter((t) => t.status !== 'submitted');
  const studyHours = (subject.totalStudyMinutes / 60).toFixed(1);

  return (
    <PageTransition>
      <div className="space-y-6 h-full flex flex-col min-h-[calc(100vh-8rem)]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/subjects')}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full shadow-sm"
                style={{ backgroundColor: subject.color }}
              />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {subject.name}
              </h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mt-1 ml-7">
              Manage your notes and assignments.
            </p>
          </div>
        </div>

        <div className="flex space-x-1 glass p-1 rounded-xl w-fit mb-4">
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'notes'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <BookOpen className="w-4 h-4" /> Notes
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'assignments'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <Layout className="w-4 h-4" /> Assignments
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'stats'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            <PieChart className="w-4 h-4" /> Stats
          </button>
        </div>

        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            {activeTab === 'notes' && (
              <motion.div
                key="notes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 h-full"
              >
                <NotesEditor subjectId={subject.id} />
              </motion.div>
            )}

            {activeTab === 'assignments' && (
              <motion.div
                key="assignments"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 h-full overflow-x-auto"
              >
                <KanbanBoard subjectId={subject.id} />
              </motion.div>
            )}

            {activeTab === 'stats' && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 h-full grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-max"
              >
                <div className="glass p-6 rounded-2xl flex flex-col items-center justify-center">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Attendance</h3>
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        className="stroke-current text-gray-200 dark:text-gray-700"
                        strokeWidth="12"
                        fill="transparent"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        className="transition-all duration-1000 ease-out"
                        stroke={subject.color}
                        strokeWidth="12"
                        strokeDasharray={351.86}
                        strokeDashoffset={351.86 - (351.86 * attendance.percentage) / 100}
                        strokeLinecap="round"
                        fill="transparent"
                      />
                    </svg>
                    <span className="absolute text-2xl font-bold" style={{ color: subject.color }}>{attendance.percentage.toFixed(0)}%</span>
                  </div>
                </div>

                <div className="glass p-6 rounded-2xl flex flex-col items-center justify-center">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Study Hours</h3>
                  <p className="text-5xl font-bold text-teal-400">{studyHours}</p>
                  <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Total hours studied</p>
                </div>

                <div className="glass p-6 rounded-2xl flex flex-col items-center justify-center">
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Pending Tasks</h3>
                  <p className="text-5xl font-bold text-indigo-400">{pendingTasks.length}</p>
                  <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Tasks remaining</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}
