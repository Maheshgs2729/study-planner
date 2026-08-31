'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardList,
  Plus,
  Trash2,
  Search,
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { useApp } from '@/store/AppContext';
import { TaskStatus, TaskPriority } from '@/types';

export default function AssignmentsPage() {
  const { state, addTask, moveTask, deleteTask, getSubject } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | TaskStatus>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // New task form
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState(state.subjects[0]?.id || '');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [priority, setPriority] = useState<TaskPriority>('medium');

  const filteredTasks = state.tasks
    .filter((task) => {
      if (statusFilter !== 'all' && task.status !== statusFilter) return false;
      if (selectedSubject !== 'all' && task.subjectId !== selectedSubject) return false;
      if (searchQuery.trim() && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      subjectId,
      title: title.trim(),
      description: description.trim(),
      dueDate,
      status: 'todo',
      priority,
    });

    setTitle('');
    setDescription('');
    setIsAdding(false);
  };

  const getDueBadge = (dueDateStr: string, status: TaskStatus) => {
    if (status === 'submitted') {
      return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Submitted ✓</span>;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDateStr);
    due.setHours(0, 0, 0, 0);
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diff < 0) return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20">Overdue ({Math.abs(diff)}d)</span>;
    if (diff === 0) return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">Due Today!</span>;
    if (diff === 1) return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">Due Tomorrow</span>;
    return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-600 dark:text-cyan-400 border border-indigo-500/20">Due in {diff} days</span>;
  };

  const getPriorityBadge = (p: TaskPriority) => {
    switch (p) {
      case 'high':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/10 text-rose-500 uppercase">High</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-500 uppercase">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-500 uppercase">Low</span>;
    }
  };

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2.5">
              Course Assignments & Homework
              <ClipboardList className="w-7 h-7 text-indigo-500" />
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Cross-course assignment tracker, submission milestones, and deadlines
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-opacity self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>New Assignment</span>
          </motion.button>
        </div>

        {/* Filter Controls Bar */}
        <div className="glass p-4 rounded-3xl border border-white/20 shadow-md flex flex-wrap items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
            {(['all', 'todo', 'in-progress', 'submitted'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {st === 'all' ? 'All' : st === 'todo' ? 'To-Do' : st === 'in-progress' ? 'In Progress' : 'Submitted'}
              </button>
            ))}
          </div>

          {/* Search & Subject Filters */}
          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-gray-100 dark:bg-gray-800 border border-border outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl bg-gray-100 dark:bg-gray-800 border border-border outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Subjects</option>
              {state.subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Assignment Modal/Form */}
        <AnimatePresence>
          {isAdding && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleCreateTask}
              className="glass p-6 rounded-3xl border border-primary/30 shadow-xl space-y-4 overflow-hidden bg-white/95 dark:bg-gray-900/95"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-primary" /> Create New Assignment
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Assignment Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Implement Binary Search Tree in C++"
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-gray-100 dark:bg-gray-800 border border-border outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Subject
                  </label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-gray-100 dark:bg-gray-800 border border-border outline-none"
                  >
                    {state.subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-gray-100 dark:bg-gray-800 border border-border outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-gray-100 dark:bg-gray-800 border border-border outline-none"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                  Description / Instructions
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details, submission format, links to repository..."
                  rows={2}
                  className="w-full p-3 text-xs rounded-xl bg-gray-100 dark:bg-gray-800 border border-border outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:opacity-95"
                >
                  Save Assignment
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Tasks List */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="p-12 glass rounded-3xl text-center text-gray-500 dark:text-gray-400">
              No assignments found matching your filter criteria.
            </div>
          ) : (
            filteredTasks.map((task) => {
              const subject = getSubject(task.subjectId);
              return (
                <motion.div
                  key={task.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass rounded-3xl p-4 sm:p-5 border border-white/20 shadow-md relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-primary/40 transition-all"
                >
                  {/* Left Color Pill */}
                  <div
                    className="absolute top-0 left-0 bottom-0 w-2"
                    style={{ backgroundColor: subject?.color || '#6366f1' }}
                  />

                  <div className="pl-3 flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span
                        className="px-2.5 py-0.5 rounded-md text-[10px] font-bold text-white shadow-xs"
                        style={{ backgroundColor: subject?.color || '#6366f1' }}
                      >
                        {subject?.name || 'Subject'}
                      </span>
                      {getPriorityBadge(task.priority)}
                      {getDueBadge(task.dueDate, task.status)}
                    </div>

                    <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug">
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                        {task.description}
                      </p>
                    )}
                  </div>

                  {/* Status & Actions */}
                  <div className="pl-3 sm:pl-0 flex items-center gap-3">
                    <select
                      value={task.status}
                      onChange={(e) => moveTask(task.id, e.target.value as TaskStatus)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-xl border outline-none transition-colors ${
                        task.status === 'submitted'
                          ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                          : task.status === 'in-progress'
                          ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-border'
                      }`}
                    >
                      <option value="todo">To-Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="submitted">Submitted ✓</option>
                    </select>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                      title="Delete Assignment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </PageTransition>
  );
}
