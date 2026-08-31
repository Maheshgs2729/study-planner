"use client";

import React, { useMemo } from 'react';
import { useApp } from '@/store/AppContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function StudyHoursChart() {
  const { state } = useApp();

  const data = useMemo(() => {
    const days = 28;
    const result = [];
    const now = new Date();
    
    // Set to start of day for consistent grouping
    now.setHours(0, 0, 0, 0);

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateString = date.toISOString().split('T')[0];
      const shortDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      const daySessions = state.pomodoroSessions.filter(s => {
        if (!s.completed) return false;
        const sessionDate = new Date(s.startedAt);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === date.getTime();
      });

      const minutes = daySessions.reduce((sum, s) => sum + s.durationMinutes, 0);
      
      result.push({
        date: shortDate,
        fullDate: dateString,
        hours: Number((minutes / 60).toFixed(2))
      });
    }
    
    return result;
  }, [state.pomodoroSessions]);

  return (
    <div className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/70 border border-white/20 dark:border-gray-800 shadow-lg shadow-black/5 rounded-2xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Study Hours Trend (Last 28 Days)</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#6B7280', fontSize: 12 }} 
              axisLine={false} 
              tickLine={false} 
              minTickGap={20}
            />
            <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', borderRadius: '0.5rem', color: '#F9FAFB' }}
              itemStyle={{ color: '#F9FAFB' }}
              formatter={((value: number) => [`${value} hrs`, 'Study Hours']) as never}
            />
            <Area 
              type="monotone" 
              dataKey="hours" 
              stroke="#6366f1" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorHours)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
