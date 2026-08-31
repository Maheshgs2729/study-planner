'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Clock,
  MapPin,
  Calendar,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { DayOfWeek, TimetableEntry } from '@/types';

interface TimetableModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDay?: DayOfWeek;
}

const DAYS: { key: DayOfWeek; label: string; short: string }[] = [
  { key: 'monday', label: 'Monday', short: 'Mon' },
  { key: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { key: 'thursday', label: 'Thursday', short: 'Thu' },
  { key: 'friday', label: 'Friday', short: 'Fri' },
  { key: 'saturday', label: 'Saturday', short: 'Sat' },
];

const CLASS_TYPES = [
  { id: 'lecture', label: 'Lecture', color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20' },
  { id: 'lab', label: 'Lab', color: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20' },
  { id: 'tutorial', label: 'Tutorial', color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
] as const;

export default function TimetableModal({
  isOpen,
  onClose,
  initialDay,
}: TimetableModalProps) {
  const { state, addTimetableEntry, updateTimetableEntry, deleteTimetableEntry, getSubject } = useApp();

  const [selectedDay, setSelectedDay] = useState<DayOfWeek | 'all'>(initialDay || 'all');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [subjectId, setSubjectId] = useState(state.subjects[0]?.id || '');
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>(initialDay || 'monday');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [room, setRoom] = useState('');
  const [classType, setClassType] = useState<'lecture' | 'lab' | 'tutorial'>('lecture');
  const [formError, setFormError] = useState('');

  const filteredEntries = state.timetable
    .filter((entry) => (selectedDay === 'all' ? true : entry.dayOfWeek === selectedDay))
    .sort((a, b) => {
      if (selectedDay === 'all') {
        const dayOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayDiff = dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek);
        if (dayDiff !== 0) return dayDiff;
      }
      return a.startTime.localeCompare(b.startTime);
    });

  const resetForm = () => {
    setSubjectId(state.subjects[0]?.id || '');
    setDayOfWeek(selectedDay !== 'all' ? selectedDay : 'monday');
    setStartTime('09:00');
    setEndTime('10:00');
    setRoom('');
    setClassType('lecture');
    setEditingId(null);
    setIsEditing(false);
    setFormError('');
  };

  const handleStartEdit = (entry: TimetableEntry) => {
    setEditingId(entry.id);
    setSubjectId(entry.subjectId);
    setDayOfWeek(entry.dayOfWeek);
    setStartTime(entry.startTime);
    setEndTime(entry.endTime);
    setRoom(entry.room || '');
    setClassType(entry.type);
    setIsEditing(true);
    setFormError('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId) {
      setFormError('Please select a subject.');
      return;
    }
    if (startTime >= endTime) {
      setFormError('End time must be after start time.');
      return;
    }

    if (editingId) {
      updateTimetableEntry({
        id: editingId,
        subjectId,
        dayOfWeek,
        startTime,
        endTime,
        room: room.trim() || undefined,
        type: classType,
      });
    } else {
      addTimetableEntry({
        subjectId,
        dayOfWeek,
        startTime,
        endTime,
        room: room.trim() || undefined,
        type: classType,
      });
    }

    resetForm();
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

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl max-h-[90vh] flex flex-col glass rounded-3xl border border-white/20 shadow-2xl overflow-hidden bg-white/90 dark:bg-gray-900/90"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Manage Class Timetable
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Add, modify, or remove scheduled classes and lectures
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

          {/* Day Selector Pills */}
          <div className="flex items-center gap-1.5 px-6 py-3 border-b border-border/50 overflow-x-auto custom-scrollbar bg-gray-50/50 dark:bg-gray-800/30">
            <button
              onClick={() => setSelectedDay('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                selectedDay === 'all'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              All Days ({state.timetable.length})
            </button>
            {DAYS.map((d) => {
              const count = state.timetable.filter((t) => t.dayOfWeek === d.key).length;
              return (
                <button
                  key={d.key}
                  onClick={() => setSelectedDay(d.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    selectedDay === d.key
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <span>{d.label}</span>
                  <span className="opacity-70 text-[10px]">({count})</span>
                </button>
              );
            })}
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {/* Add / Edit Form */}
            <form onSubmit={handleSave} className="p-4 rounded-2xl bg-gray-50/75 dark:bg-gray-800/50 border border-border space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {isEditing ? <Edit2 className="w-4 h-4 text-indigo-500" /> : <Plus className="w-4 h-4 text-indigo-500" />}
                  {isEditing ? 'Edit Class Slot' : 'Add New Class Slot'}
                </span>
                {isEditing && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 underline"
                  >
                    Cancel Editing
                  </button>
                )}
              </div>

              {formError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 text-xs border border-red-500/20">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Subject Selector */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    Subject
                  </label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-gray-800 border border-border focus:ring-2 focus:ring-primary outline-none"
                    required
                  >
                    {state.subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Day of Week */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    Day of Week
                  </label>
                  <select
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(e.target.value as DayOfWeek)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-gray-800 border border-border focus:ring-2 focus:ring-primary outline-none"
                  >
                    {DAYS.map((d) => (
                      <option key={d.key} value={d.key}>
                        {d.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Class Type */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    Class Type
                  </label>
                  <select
                    value={classType}
                    onChange={(e) => setClassType(e.target.value as 'lecture' | 'lab' | 'tutorial')}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-gray-800 border border-border focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="lecture">Lecture</option>
                    <option value="lab">Lab / Practical</option>
                    <option value="tutorial">Tutorial / Discussion</option>
                  </select>
                </div>

                {/* Start Time */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    Start Time (24h)
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-gray-800 border border-border focus:ring-2 focus:ring-primary outline-none"
                    required
                  />
                </div>

                {/* End Time */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    End Time (24h)
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-gray-800 border border-border focus:ring-2 focus:ring-primary outline-none"
                    required
                  />
                </div>

                {/* Room / Location */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    Room / Hall (Optional)
                  </label>
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="e.g. Room 301, Hall B"
                    className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-gray-800 border border-border focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold shadow-md hover:opacity-95 transition-opacity flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isEditing ? 'Save Changes' : 'Add to Timetable'}</span>
                </button>
              </div>
            </form>

            {/* List of Entries */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Scheduled Classes ({filteredEntries.length})
              </h3>

              {filteredEntries.length === 0 ? (
                <div className="p-8 rounded-2xl border border-dashed border-border text-center text-gray-500 dark:text-gray-400 text-sm">
                  No classes scheduled for {selectedDay === 'all' ? 'the entire week' : selectedDay}.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredEntries.map((entry) => {
                    const subject = getSubject(entry.subjectId);
                    const typeConfig = CLASS_TYPES.find((t) => t.id === entry.type);
                    return (
                      <motion.div
                        key={entry.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-stretch rounded-2xl bg-white dark:bg-gray-800/80 border border-border shadow-sm overflow-hidden group hover:border-primary/40 transition-colors"
                      >
                        {/* Subject color bar */}
                        <div
                          className="w-2 flex-shrink-0"
                          style={{ backgroundColor: subject?.color || '#6366f1' }}
                        />

                        <div className="p-3.5 flex-1 flex flex-col justify-between">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h4 className="font-bold text-sm text-gray-900 dark:text-white leading-snug">
                                {subject?.name || 'Unknown Subject'}
                              </h4>
                              {selectedDay === 'all' && (
                                <span className="text-[11px] font-semibold text-primary capitalize">
                                  {entry.dayOfWeek}
                                </span>
                              )}
                            </div>

                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${typeConfig?.color}`}>
                              {entry.type}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-border/40">
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1 font-medium">
                                <Clock className="w-3.5 h-3.5 text-primary" />
                                {entry.startTime} - {entry.endTime}
                              </span>
                              {entry.room && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3.5 h-3.5" />
                                  {entry.room}
                                </span>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleStartEdit(entry)}
                                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 hover:text-indigo-600 transition-colors"
                                title="Edit Class"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteTimetableEntry(entry.id)}
                                className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-500 hover:text-red-500 transition-colors"
                                title="Delete Class"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
