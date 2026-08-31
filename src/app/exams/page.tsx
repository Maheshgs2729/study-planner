'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Calendar,
  Clock,
  MapPin,
  Award,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Percent,
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { useApp } from '@/store/AppContext';
import { Exam } from '@/types';
import ExamModal from '@/components/exams/ExamModal';

export default function ExamsPage() {
  const { state, getSubject, deleteExam, getOverallGPA } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [examToEdit, setExamToEdit] = useState<Exam | null>(null);

  const gpaStats = getOverallGPA();

  const filteredExams = state.exams
    .filter((exam) => {
      if (activeFilter === 'upcoming') return exam.status === 'upcoming';
      if (activeFilter === 'completed') return exam.status === 'completed';
      return true;
    })
    .sort((a, b) => {
      if (a.status === 'upcoming' && b.status === 'completed') return -1;
      if (a.status === 'completed' && b.status === 'upcoming') return 1;
      return `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`);
    });

  const getDaysUntil = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const examDate = new Date(dateStr);
    examDate.setHours(0, 0, 0, 0);
    const diff = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diff === 0) return { label: 'Today!', color: 'bg-rose-500 text-white animate-pulse' };
    if (diff === 1) return { label: 'Tomorrow', color: 'bg-amber-500 text-white' };
    if (diff > 1) return { label: `In ${diff} days`, color: 'bg-indigo-500/15 text-indigo-600 dark:text-cyan-400 border border-indigo-500/20' };
    return { label: `${Math.abs(diff)} days ago`, color: 'bg-gray-100 dark:bg-gray-800 text-gray-500' };
  };

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2.5">
              Exams & Academic Grades
              <GraduationCap className="w-7 h-7 text-indigo-500" />
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Track upcoming exam schedules, set countdowns, and record customized grades
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setExamToEdit(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-opacity self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Exam</span>
          </motion.button>
        </div>

        {/* GPA & Performance Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Card 1: GPA */}
          <div className="glass p-5 rounded-3xl border border-white/20 shadow-md relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Overall GPA
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
                {gpaStats.gpa.toFixed(2)}
              </span>
              <span className="text-xs text-gray-400 font-bold">/ 4.0</span>
            </div>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold mt-1">
              Based on {gpaStats.gradedCount} graded exams
            </span>
          </div>

          {/* Card 2: Average Score */}
          <div className="glass p-5 rounded-3xl border border-white/20 shadow-md relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Average Score
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                <Percent className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
                {gpaStats.averagePercentage}%
              </span>
            </div>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
              High performance tier
            </span>
          </div>

          {/* Card 3: Upcoming Exams */}
          <div className="glass p-5 rounded-3xl border border-white/20 shadow-md relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Upcoming
              </span>
              <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-500 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <span className="text-3xl sm:text-4xl font-black text-indigo-600 dark:text-indigo-400">
              {state.exams.filter((e) => e.status === 'upcoming').length}
            </span>
            <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1">
              Exams scheduled
            </span>
          </div>

          {/* Card 4: Graded Tests */}
          <div className="glass p-5 rounded-3xl border border-white/20 shadow-md relative overflow-hidden flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Completed
              </span>
              <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-500 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <span className="text-3xl sm:text-4xl font-black text-cyan-600 dark:text-cyan-400">
              {state.exams.filter((e) => e.status === 'completed').length}
            </span>
            <span className="text-[11px] text-cyan-600 dark:text-cyan-400 font-semibold mt-1">
              Grades recorded
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {(['all', 'upcoming', 'completed'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
                activeFilter === filter
                  ? 'bg-primary text-white shadow-md'
                  : 'glass text-gray-600 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-gray-800'
              }`}
            >
              {filter === 'all'
                ? `All Exams (${state.exams.length})`
                : filter === 'upcoming'
                ? `Upcoming (${state.exams.filter((e) => e.status === 'upcoming').length})`
                : `Graded & Completed (${state.exams.filter((e) => e.status === 'completed').length})`}
            </button>
          ))}
        </div>

        {/* Exams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredExams.length === 0 ? (
            <div className="col-span-full p-12 glass rounded-3xl text-center text-gray-500 dark:text-gray-400">
              No exams found under this filter. Click &quot;+ Schedule Exam&quot; to add one.
            </div>
          ) : (
            filteredExams.map((exam) => {
              const subject = getSubject(exam.subjectId);
              const countdown = getDaysUntil(exam.date);
              const isCompleted = exam.status === 'completed';

              return (
                <motion.div
                  key={exam.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-3xl p-5 border border-white/20 shadow-md relative overflow-hidden flex flex-col justify-between group hover:border-primary/40 transition-all"
                >
                  {/* Left Accent Bar */}
                  <div
                    className="absolute top-0 left-0 bottom-0 w-2"
                    style={{ backgroundColor: subject?.color || '#6366f1' }}
                  />

                  <div className="pl-3">
                    {/* Top Row: Subject & Countdown / Grade Badge */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="px-2.5 py-0.5 rounded-md text-[11px] font-bold text-white shadow-xs"
                          style={{ backgroundColor: subject?.color || '#6366f1' }}
                        >
                          {subject?.name || 'Subject'}
                        </span>
                        {subject?.code && (
                          <span className="text-xs text-gray-400 font-semibold">
                            {subject.code}
                          </span>
                        )}
                      </div>

                      {/* Badge: Grade if completed, Countdown if upcoming */}
                      {isCompleted ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 font-black text-xs">
                          <Award className="w-3.5 h-3.5" />
                          <span>Grade: {exam.grade || 'A'}</span>
                          <span className="text-[10px] opacity-80">
                            ({exam.obtainedMarks}/{exam.totalMarks})
                          </span>
                        </div>
                      ) : (
                        <span className={`px-2.5 py-1 rounded-xl text-[11px] font-bold ${countdown.color}`}>
                          {countdown.label}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 leading-snug">
                      {exam.title}
                    </h3>

                    {/* Date, Time & Location */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 dark:text-gray-300 mb-3">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        {new Date(exam.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        {exam.time}
                      </span>
                      {exam.location && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-rose-500" />
                          {exam.location}
                        </span>
                      )}
                    </div>

                    {/* Notes if available */}
                    {exam.notes && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 p-2.5 rounded-xl border border-border/50 mb-3 italic">
                        {exam.notes}
                      </p>
                    )}

                    {/* Score Bar if Completed */}
                    {isCompleted && exam.obtainedMarks !== undefined && (
                      <div className="space-y-1 mb-3">
                        <div className="flex justify-between text-[11px] font-semibold text-gray-500">
                          <span>Performance Score</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">
                            {((exam.obtainedMarks / exam.totalMarks) * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full"
                            style={{ width: `${(exam.obtainedMarks / exam.totalMarks) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Footer */}
                  <div className="pl-3 pt-3 border-t border-border/40 flex items-center justify-between">
                    <span className="text-[11px] text-gray-400 font-medium">
                      Weightage: {exam.weightage || 20}% of total course
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          setExamToEdit(exam);
                          setIsModalOpen(true);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>{isCompleted ? 'Edit Grade' : 'Edit Exam'}</span>
                      </button>
                      <button
                        onClick={() => deleteExam(exam.id)}
                        className="p-1.5 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                        title="Delete Exam"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* Modal */}
        <ExamModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setExamToEdit(null);
          }}
          examToEdit={examToEdit}
        />
      </div>
    </PageTransition>
  );
}
