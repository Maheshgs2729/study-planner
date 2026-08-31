'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Timer, ClipboardList, GraduationCap, Calendar, X } from 'lucide-react';
import Link from 'next/link';

const actions = [
  { href: '/focus', label: 'Focus Timer', icon: Timer, color: 'from-teal-400 to-emerald-500' },
  { href: '/assignments', label: 'Assignments', icon: ClipboardList, color: 'from-indigo-400 to-violet-500' },
  { href: '/exams', label: 'Schedule Exam', icon: GraduationCap, color: 'from-rose-400 to-pink-600' },
  { href: '/calendar', label: 'Calendar', icon: Calendar, color: 'from-amber-400 to-orange-500' },
];

export default function QuickActionFAB() {
  const [isOpen, setIsOpen] = useState(false);
  const isDraggingRef = useRef(false);

  const handleButtonClick = () => {
    if (isDraggingRef.current) return;
    setIsOpen(!isOpen);
  };

  return (
    <motion.div
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
      whileDrag={{ scale: 1.06, cursor: 'grabbing' }}
      className="fixed bottom-24 right-6 z-40 flex flex-col-reverse items-end gap-3 cursor-grab active:cursor-grabbing select-none"
    >
      {/* Action Items */}
      <AnimatePresence>
        {isOpen &&
          actions.map((action, i) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, scale: 0.3, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.3, y: 20 }}
              transition={{ delay: i * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
              className="flex items-center gap-3"
            >
              {/* Label */}
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: i * 0.05 + 0.1 }}
                className="px-3 py-1.5 rounded-xl glass text-xs font-bold text-foreground whitespace-nowrap shadow-lg pointer-events-none"
              >
                {action.label}
              </motion.span>

              {/* Button */}
              <Link href={action.href} onClick={() => setIsOpen(false)}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg shadow-black/20 cursor-pointer text-white`}
                >
                  <action.icon className="w-5 h-5" />
                </motion.div>
              </Link>
            </motion.div>
          ))}
      </AnimatePresence>

      {/* Main FAB Button */}
      <div className="relative group">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleButtonClick}
          className="w-13 h-13 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-600 to-cyan-500 flex items-center justify-center shadow-xl shadow-indigo-500/30 text-white border border-white/20 relative overflow-hidden"
          aria-label="Quick Actions Menu"
          title="Drag to move • Click for Quick Actions (+)"
        >
          <motion.div
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Plus className="w-6 h-6 stroke-[2.5]" />
            )}
          </motion.div>
        </motion.button>
      </div>
    </motion.div>
  );
}
