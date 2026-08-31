'use client';

import React, { useState } from 'react';
import { useApp } from '@/store/AppContext';
import PageTransition from '@/components/PageTransition';
import SubjectCard from '@/components/subjects/SubjectCard';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Plus, X, Check } from 'lucide-react';

const COLOR_PRESETS = [
  '#5451ff', '#00d2ff', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444',
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

export default function SubjectsPage() {
  const { state, addSubject } = useApp();
  const subjects = state.subjects;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Subject Form
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [instructor, setInstructor] = useState('');
  const [color, setColor] = useState(COLOR_PRESETS[0]);
  const [credits, setCredits] = useState(3);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addSubject(name.trim(), color, code.trim() || undefined, instructor.trim() || undefined, credits);
    setName('');
    setCode('');
    setInstructor('');
    setIsAddModalOpen(false);
  };

  return (
    <PageTransition>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-foreground flex items-center gap-2.5">
              Course Workspaces
              <BookOpen className="w-7 h-7 text-primary" />
            </h1>
            <p className="text-xs sm:text-sm text-muted mt-1 font-medium">
              Manage semester courses, notes, assignments Kanban boards, and attendance criteria
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-primary text-white text-xs font-bold shadow-lg shadow-indigo-500/25 hover:bg-primary/95 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Course</span>
          </motion.button>
        </div>

        {/* Subjects Grid */}
        {subjects.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {subjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 glass rounded-[28px] text-center">
            <BookOpen className="w-12 h-12 text-muted mb-3 opacity-60" />
            <p className="text-sm font-bold text-foreground">No subjects added yet.</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="text-xs text-primary font-bold hover:underline mt-1"
            >
              + Create your first course workspace
            </button>
          </div>
        )}

        {/* Add Course Modal */}
        <AnimatePresence>
          {isAddModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAddModalOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-md glass rounded-[28px] border border-border shadow-2xl overflow-hidden p-6 bg-surface space-y-4"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
                    <Plus className="w-4 h-4 text-primary" /> Create New Course Workspace
                  </h3>
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="p-1 rounded-lg text-muted hover:text-foreground"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAdd} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-muted mb-1">
                      Course / Subject Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Artificial Intelligence, Linear Algebra"
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-surface-hover border border-border outline-none focus:ring-2 focus:ring-primary font-medium"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-muted mb-1">
                        Course Code
                      </label>
                      <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="e.g. CS-401"
                        className="w-full px-3 py-2 text-xs rounded-xl bg-surface-hover border border-border outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-muted mb-1">
                        Credit Hours
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="6"
                        value={credits}
                        onChange={(e) => setCredits(Number(e.target.value))}
                        className="w-full px-3 py-2 text-xs rounded-xl bg-surface-hover border border-border outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-muted mb-1">
                      Instructor Name
                    </label>
                    <input
                      type="text"
                      value={instructor}
                      onChange={(e) => setInstructor(e.target.value)}
                      placeholder="e.g. Dr. Emily Watson"
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-surface-hover border border-border outline-none"
                    />
                  </div>

                  {/* Color Selector */}
                  <div>
                    <label className="block text-xs font-bold text-muted mb-1.5">
                      Theme Accent Color
                    </label>
                    <div className="flex items-center gap-2">
                      {COLOR_PRESETS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setColor(c)}
                          className={`w-7 h-7 rounded-full transition-transform flex items-center justify-center text-white ${
                            color === c ? 'scale-110 ring-2 ring-offset-2 ring-primary' : 'opacity-80 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: c }}
                        >
                          {color === c && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddModalOpen(false)}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold text-muted hover:text-foreground"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-full bg-primary text-white text-xs font-bold shadow-md hover:opacity-95"
                    >
                      Create Workspace
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
