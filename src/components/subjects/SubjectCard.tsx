'use client';

import { Subject } from '@/types';
import { useApp } from '@/store/AppContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Clock, CheckCircle2, ClipboardList, ArrowRight, User } from 'lucide-react';

interface SubjectCardProps {
  subject: Subject;
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } },
};

export default function SubjectCard({ subject }: SubjectCardProps) {
  const { getSubjectAttendance, getSubjectTasks } = useApp();
  
  const attendance = getSubjectAttendance(subject.id);
  const tasks = getSubjectTasks(subject.id);
  
  const pendingTasks = tasks.filter((task) => task.status !== 'submitted');
  const studyHours = (subject.totalStudyMinutes / 60).toFixed(1);

  return (
    <motion.div variants={itemVariants}>
      <Link href={`/subjects/${subject.id}`}>
        <motion.div
          whileHover={{ y: -3, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="glass glass-hover rounded-[26px] overflow-hidden relative flex flex-col h-full cursor-pointer group"
        >
          {/* Top Color Accent Line */}
          <div
            className="h-1.5 w-full"
            style={{ backgroundColor: subject.color || '#5451ff' }}
          />

          <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between mb-3">
                <span
                  className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide text-white shadow-xs"
                  style={{ backgroundColor: subject.color || '#5451ff' }}
                >
                  {subject.code || 'Course'}
                </span>
                <span className="text-[11px] font-bold text-muted flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  {studyHours}h studied
                </span>
              </div>

              <h3 className="text-lg font-black text-foreground mb-1 group-hover:text-primary transition-colors leading-tight">
                {subject.name}
              </h3>

              {subject.instructor && (
                <p className="text-xs text-muted font-medium flex items-center gap-1.5 mt-1">
                  <User className="w-3.5 h-3.5" />
                  {subject.instructor}
                </p>
              )}
            </div>
            
            {/* Progress Section */}
            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                  <span className="text-muted flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Attendance Criteria
                  </span>
                  <span style={{ color: subject.color || '#5451ff' }}>
                    {attendance.percentage.toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 w-full bg-surface-hover rounded-full overflow-hidden border border-border/50">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${attendance.percentage}%`,
                      backgroundColor: subject.color || '#5451ff',
                    }}
                  />
                </div>
              </div>
              
              {/* Footer Meta */}
              <div className="flex justify-between items-center pt-3 border-t border-border text-xs font-semibold text-muted">
                <div className="flex items-center gap-1.5">
                  <ClipboardList className="w-3.5 h-3.5 text-orange-500" />
                  <span>{pendingTasks.length} pending task{pendingTasks.length === 1 ? '' : 's'}</span>
                </div>
                <div className="flex items-center gap-1 text-primary font-bold group-hover:translate-x-0.5 transition-transform">
                  <span>Enter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
