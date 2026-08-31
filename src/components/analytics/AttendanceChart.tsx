"use client";

import React, { useMemo } from 'react';
import { useApp } from '@/store/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';

export default function AttendanceChart() {
  const { state, getSubjectAttendance } = useApp();

  const data = useMemo(() => {
    return state.subjects.map(subject => {
      const attendance = getSubjectAttendance(subject.id);
      return {
        name: subject.name.length > 10 ? subject.name.substring(0, 10) + '...' : subject.name,
        percentage: attendance.percentage,
        color: subject.color
      };
    });
  }, [state.subjects, getSubjectAttendance]);

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border border-white/20 dark:border-gray-800 shadow-lg shadow-black/5 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Attendance by Subject</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
            <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip
              cursor={{ fill: 'rgba(0,0,0,0.05)' }}
              contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '0.5rem', color: '#F9FAFB' }}
              itemStyle={{ color: '#F9FAFB' }}
              formatter={((value: number) => [`${value.toFixed(1)}%`, 'Attendance']) as never}
            />
            <ReferenceLine y={75} stroke="#EF4444" strokeDasharray="3 3" label={{ position: 'top', value: 'Minimum Required', fill: '#EF4444', fontSize: 12 }} />
            <Bar dataKey="percentage" radius={[4, 4, 0, 0]} maxBarSize={50}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
