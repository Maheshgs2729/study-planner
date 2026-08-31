'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  StickyNote as StickyIcon,
  Plus,
  Trash2,
  Pin,
  X,
  GripHorizontal,
} from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { StickyColor } from '@/types';

const COLOR_MAP: Record<StickyColor, { bg: string; text: string; border: string; dot: string }> = {
  yellow: { bg: 'bg-amber-100 dark:bg-amber-950/80', text: 'text-amber-950 dark:text-amber-100', border: 'border-amber-300 dark:border-amber-800', dot: 'bg-amber-400' },
  pink: { bg: 'bg-pink-100 dark:bg-pink-950/80', text: 'text-pink-950 dark:text-pink-100', border: 'border-pink-300 dark:border-pink-800', dot: 'bg-pink-400' },
  mint: { bg: 'bg-emerald-100 dark:bg-emerald-950/80', text: 'text-emerald-950 dark:text-emerald-100', border: 'border-emerald-300 dark:border-emerald-800', dot: 'bg-emerald-400' },
  blue: { bg: 'bg-sky-100 dark:bg-sky-950/80', text: 'text-sky-950 dark:text-sky-100', border: 'border-sky-300 dark:border-sky-800', dot: 'bg-sky-400' },
  purple: { bg: 'bg-purple-100 dark:bg-purple-950/80', text: 'text-purple-950 dark:text-purple-100', border: 'border-purple-300 dark:border-purple-800', dot: 'bg-purple-400' },
};

export default function StickyNotesWidget() {
  const { state, addStickyNote, updateStickyNote, deleteStickyNote } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [activeColor, setActiveColor] = useState<StickyColor>('yellow');
  const [newContent, setNewContent] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const isDraggingRef = useRef(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    addStickyNote(newContent.trim(), activeColor);
    setNewContent('');
    setIsAdding(false);
  };

  const handlePillClick = () => {
    if (isDraggingRef.current) return;
    setIsOpen(true);
  };

  return (
    <motion.aside
      drag
      dragMomentum={false}
      dragElastic={0.08}
      onDragStart={() => {
        isDraggingRef.current = true;
      }}
      onDragEnd={() => {
        setTimeout(() => {
          isDraggingRef.current = false;
        }, 120);
      }}
      whileDrag={{ scale: 1.02, cursor: 'grabbing' }}
      aria-label="Quick Sticky Notes Scratchpad"
      className="fixed bottom-4 right-32 sm:right-36 md:bottom-6 md:right-44 z-40 select-none cursor-grab active:cursor-grabbing"
    >
      <AnimatePresence>
        {isOpen ? (
          <motion.div
            key="sticky-panel"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="w-[calc(100vw-2rem)] sm:w-[380px] rounded-[28px] border border-black/[0.08] dark:border-white/[0.12] shadow-2xl overflow-hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl flex flex-col max-h-[500px] cursor-default"
          >
            {/* Header (Drag handle) */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-amber-500/10 cursor-grab active:cursor-grabbing">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-xs">
                  <StickyIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white leading-none">
                    Study Scratchpad
                  </h3>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">
                    Sticky Notes • Drag to move
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsAdding(!isAdding)}
                  className="p-1.5 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Note</span>
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add New Note Box */}
            <AnimatePresence>
              {isAdding && (
                <motion.form
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  onSubmit={handleCreate}
                  className="p-4 border-b border-border bg-gray-50/70 dark:bg-gray-800/40 space-y-3 overflow-hidden"
                >
                  <textarea
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Type quick thought, formula, or reminder..."
                    rows={3}
                    className="w-full p-2.5 text-xs rounded-xl bg-white dark:bg-gray-800 border border-border outline-none focus:ring-2 focus:ring-amber-400 resize-none font-sans"
                    autoFocus
                  />

                  <div className="flex items-center justify-between">
                    {/* Color Picker */}
                    <div className="flex items-center gap-1.5">
                      {(Object.keys(COLOR_MAP) as StickyColor[]).map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setActiveColor(c)}
                          className={`w-5 h-5 rounded-full ${COLOR_MAP[c].dot} transition-transform ${
                            activeColor === c ? 'scale-125 ring-2 ring-offset-1 ring-gray-600' : 'opacity-70 hover:opacity-100'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAdding(false)}
                        className="px-2.5 py-1 text-xs text-gray-500 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 rounded-lg bg-amber-500 text-amber-950 text-xs font-bold shadow-xs hover:bg-amber-400"
                      >
                        Stick It
                      </button>
                    </div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Notes List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {state.stickyNotes.length === 0 ? (
                <div className="py-8 text-center text-xs text-gray-400">
                  No sticky notes yet. Click &quot;+ New Note&quot; to jot down thoughts!
                </div>
              ) : (
                state.stickyNotes.map((note) => {
                  const style = COLOR_MAP[note.color] || COLOR_MAP.yellow;
                  return (
                    <motion.div
                      key={note.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3.5 rounded-2xl border ${style.bg} ${style.border} ${style.text} shadow-sm relative group`}
                    >
                      {/* Top Bar inside note */}
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="w-2 h-2 rounded-full bg-black/20 dark:bg-white/20" />
                        <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => updateStickyNote({ ...note, pinned: !note.pinned })}
                            className={`p-1 rounded-md hover:bg-black/10 transition-colors ${
                              note.pinned ? 'text-amber-600 font-bold' : ''
                            }`}
                            title={note.pinned ? 'Unpin' : 'Pin to top'}
                          >
                            <Pin className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => deleteStickyNote(note.id)}
                            className="p-1 rounded-md hover:bg-black/10 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs whitespace-pre-wrap leading-relaxed font-medium">
                        {note.content}
                      </p>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        ) : (
          /* Minimized Floating Draggable Pill */
          <motion.div
            key="sticky-pill"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePillClick}
            className="flex items-center gap-2 px-3 py-2 rounded-full glass border border-amber-300/40 shadow-xl bg-amber-100/90 dark:bg-amber-950/90 text-amber-900 dark:text-amber-100 backdrop-blur-xl group hover:border-amber-400 transition-colors cursor-grab active:cursor-grabbing"
            title="Drag to move • Click to open Stickies"
          >
            <StickyIcon className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold">
              Stickies ({state.stickyNotes.length})
            </span>
            <GripHorizontal className="w-3 h-3 text-amber-600/50 group-hover:text-amber-700 ml-0.5" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
