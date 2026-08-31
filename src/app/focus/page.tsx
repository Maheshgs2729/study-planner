'use client';

import PageTransition from '@/components/PageTransition';
import PomodoroTimer from '@/components/focus/PomodoroTimer';
import SessionHistory from '@/components/focus/SessionHistory';

export default function FocusPage() {
  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto space-y-8 pb-12 pt-6 px-4 md:px-0">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Focus Mode</h1>
          <p className="text-gray-500 dark:text-gray-400">Stay in the zone and manage your study time effectively</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PomodoroTimer />
          </div>
          <div className="lg:col-span-1">
            <SessionHistory />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
