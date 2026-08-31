"use client";

import React from 'react';
import PageTransition from '@/components/PageTransition';
import StatsCards from '@/components/analytics/StatsCards';
import AttendanceChart from '@/components/analytics/AttendanceChart';
import StudyHoursChart from '@/components/analytics/StudyHoursChart';
import TaskCompletionChart from '@/components/analytics/TaskCompletionChart';

export default function AnalyticsPage() {
  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track your progress and study habits</p>
        </div>

        <StatsCards />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <StudyHoursChart />
          <AttendanceChart />
          <div className="xl:col-span-2">
            <TaskCompletionChart />
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
