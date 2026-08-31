"use client";

import React, { useMemo } from 'react';
import { useApp } from '@/store/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function TaskCompletionChart() {
  const { state, getSubjectTasks } = useApp();

  const data = useMemo(() => {
    return state.subjects.map(subject => {
      const tasks = getSubjectTasks(subject.id);
      
      const todo = tasks.filter(t => t.status === 'todo').length;
      const inProgress = tasks.filter(t => t.status === 'in-progress').length;
      const submitted = tasks.filter(t => t.status === 'submitted').length;

      return {
        name: subject.name.length > 10 ? subject.name.substring(0, 10) + '...' : subject.name,
        'To-Do': todo,
        'In Progress': inProgress,
        'Submitted': submitted
      };
    });
  }, [state.subjects, getSubjectTasks]);

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border border-white/20 dark:border-gray-800 shadow-lg shadow-black/5 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Task Progress by Subject</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
            <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip
              cursor={{ fill: 'rgba(0,0,0,0.05)' }}
              contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '0.5rem', color: '#F9FAFB' }}
              itemStyle={{ color: '#F9FAFB' }}
            />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar dataKey="To-Do" stackId="a" fill="#9CA3AF" radius={[0, 0, 4, 4]} maxBarSize={50} />
            <Bar dataKey="In Progress" stackId="a" fill="#F59E0B" maxBarSize={50} />
            <Bar dataKey="Submitted" stackId="a" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={50} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
