'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GraduationCap,
  Award,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { Exam, ExamStatus } from '@/types';

interface ExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  examToEdit?: Exam | null;
}

const GRADES = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'];

export default function ExamModal({ isOpen, onClose, examToEdit }: ExamModalProps) {
  const { state, addExam, updateExam } = useApp();

  const [subjectId, setSubjectId] = useState(examToEdit?.subjectId || state.subjects[0]?.id || '');
  const [title, setTitle] = useState(examToEdit?.title || '');
  const [date, setDate] = useState(examToEdit?.date || new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(examToEdit?.time || '10:00');
  const [location, setLocation] = useState(examToEdit?.location || '');
  const [totalMarks, setTotalMarks] = useState<number>(examToEdit?.totalMarks || 100);
  const [obtainedMarks, setObtainedMarks] = useState<number | undefined>(examToEdit?.obtainedMarks);
  const [grade, setGrade] = useState<string>(examToEdit?.grade || 'A');
  const [weightage, setWeightage] = useState<number>(examToEdit?.weightage || 20);
  const [status, setStatus] = useState<ExamStatus>(examToEdit?.status || 'upcoming');
  const [notes, setNotes] = useState(examToEdit?.notes || '');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter an exam title.');
      return;
    }
    if (!subjectId) {
      setError('Please select a subject.');
      return;
    }

    if (examToEdit) {
      updateExam({
        ...examToEdit,
        subjectId,
        title: title.trim(),
        date,
        time,
        location: location.trim() || undefined,
        totalMarks: Number(totalMarks),
        obtainedMarks: status === 'completed' && obtainedMarks !== undefined ? Number(obtainedMarks) : undefined,
        grade: status === 'completed' ? grade : undefined,
        weightage: Number(weightage),
        status,
        notes: notes.trim() || undefined,
      });
    } else {
      addExam({
        subjectId,
        title: title.trim(),
        date,
        time,
        location: location.trim() || undefined,
        totalMarks: Number(totalMarks),
        obtainedMarks: status === 'completed' && obtainedMarks !== undefined ? Number(obtainedMarks) : undefined,
        grade: status === 'completed' ? grade : undefined,
        weightage: Number(weightage),
        status,
        notes: notes.trim() || undefined,
      });
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl max-h-[90vh] flex flex-col glass rounded-3xl border border-white/20 shadow-2xl overflow-hidden bg-white/95 dark:bg-gray-900/95"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {examToEdit ? 'Edit Exam & Grade' : 'Schedule New Exam'}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Set exam dates, locations, and record final marks & grades
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 text-xs border border-red-500/20">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Subject & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Subject
                </label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-gray-100 dark:bg-gray-800 border border-border focus:ring-2 focus:ring-primary outline-none"
                  required
                >
                  {state.subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name} ({sub.code || 'Course'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Exam Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ExamStatus)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-gray-100 dark:bg-gray-800 border border-border focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">Completed & Graded</option>
                </select>
              </div>
            </div>

            {/* Exam Title */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Exam Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Midterm: Trees & Graphs, Final Practical"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-gray-100 dark:bg-gray-800 border border-border focus:ring-2 focus:ring-primary outline-none"
                required
              />
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Exam Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-gray-100 dark:bg-gray-800 border border-border focus:ring-2 focus:ring-primary outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Exam Time (24h)
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-gray-100 dark:bg-gray-800 border border-border focus:ring-2 focus:ring-primary outline-none"
                  required
                />
              </div>
            </div>

            {/* Location & Weightage */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Location / Room
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Auditorium Hall B, Room 304"
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-gray-100 dark:bg-gray-800 border border-border focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Grade Weightage (%)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={weightage}
                  onChange={(e) => setWeightage(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-gray-100 dark:bg-gray-800 border border-border focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>

            {/* Completed Marks & Grade Section (Visible if Completed) */}
            {status === 'completed' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-3"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                  <Award className="w-4 h-4 text-emerald-500" />
                  <span>Obtained Score & Grade</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Total Marks
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={totalMarks}
                      onChange={(e) => setTotalMarks(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-gray-800 border border-border outline-none font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Marks Obtained
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={totalMarks}
                      value={obtainedMarks !== undefined ? obtainedMarks : ''}
                      onChange={(e) => setObtainedMarks(Number(e.target.value))}
                      placeholder="e.g. 92"
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-gray-800 border border-border outline-none font-bold text-emerald-600 dark:text-emerald-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Letter Grade
                    </label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-gray-800 border border-border outline-none font-bold text-emerald-600 dark:text-emerald-400"
                    >
                      {GRADES.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Notes / Prep guidelines */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Study Notes & Syllabus Topics
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Important chapters, formulas to memorize, materials to bring..."
                rows={3}
                className="w-full p-3 text-xs rounded-xl bg-gray-100 dark:bg-gray-800 border border-border focus:ring-2 focus:ring-primary outline-none resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:opacity-95 transition-opacity flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{examToEdit ? 'Save Changes' : 'Schedule Exam'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
