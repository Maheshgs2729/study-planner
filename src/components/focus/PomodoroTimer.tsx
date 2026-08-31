'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Coffee,
  Flame,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { useApp } from '@/store/AppContext';

type TimerMode = 'focus' | 'break';
type TimerState = 'idle' | 'running' | 'paused' | 'complete';

const FOCUS_PRESETS = [15, 25, 45, 60];
const BREAK_PRESETS = [5, 10, 15, 20];

export default function PomodoroTimer() {
  const { state, getSubjectTasks, logPomodoroSession, updatePomodoroSettings } = useApp();

  const [mode, setMode] = useState<TimerMode>('focus');
  const [timerState, setTimerState] = useState<TimerState>('idle');
  
  const [focusDuration, setFocusDuration] = useState(state.pomodoroSettings?.focusMinutes || 25);
  const [breakDuration, setBreakDuration] = useState(state.pomodoroSettings?.breakMinutes || 5);
  const [showSettings, setShowSettings] = useState(false);

  const [timeLeft, setTimeLeft] = useState(focusDuration * 60);

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize selected subject if empty
  useEffect(() => {
    if (!selectedSubjectId && state.subjects.length > 0) {
      setSelectedSubjectId(state.subjects[0].id);
    }
  }, [state.subjects, selectedSubjectId]);

  const tasks = selectedSubjectId ? getSubjectTasks(selectedSubjectId) : [];

  const playBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = mode === 'focus' ? 880 : 520;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      osc.start();
      setTimeout(() => {
        osc.stop();
        ctx.close().catch(() => {});
      }, 300);
    } catch {
      // Audio autoplay restrictions
    }
  };

  const handleTimerComplete = () => {
    playBeep();
    if (mode === 'focus') {
      if (selectedSubjectId) {
        logPomodoroSession(selectedSubjectId, selectedTaskId || undefined);
      }
      setMode('break');
      setTimeLeft(breakDuration * 60);
      setTimerState('idle');
    } else {
      setMode('focus');
      setTimeLeft(focusDuration * 60);
      setTimerState('idle');
    }
  };

  // Reset timer if duration setting changes while idle
  useEffect(() => {
    if (timerState === 'idle') {
      setTimeLeft(mode === 'focus' ? focusDuration * 60 : breakDuration * 60);
    }
  }, [focusDuration, breakDuration, mode, timerState]);

  useEffect(() => {
    if (timerState === 'running') {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerState, mode]);

  const toggleTimer = () => {
    if (timerState === 'running') {
      setTimerState('paused');
    } else {
      setTimerState('running');
    }
  };

  const resetTimer = () => {
    setTimerState('idle');
    setTimeLeft(mode === 'focus' ? focusDuration * 60 : breakDuration * 60);
  };

  const skipBreak = () => {
    setMode('focus');
    setTimeLeft(focusDuration * 60);
    setTimerState('idle');
  };

  const handleSelectFocusPreset = (mins: number) => {
    setFocusDuration(mins);
    updatePomodoroSettings({ ...state.pomodoroSettings, focusMinutes: mins });
    if (timerState === 'idle' && mode === 'focus') {
      setTimeLeft(mins * 60);
    }
  };

  const handleSelectBreakPreset = (mins: number) => {
    setBreakDuration(mins);
    updatePomodoroSettings({ ...state.pomodoroSettings, breakMinutes: mins });
    if (timerState === 'idle' && mode === 'break') {
      setTimeLeft(mins * 60);
    }
  };

  const totalTime = mode === 'focus' ? focusDuration * 60 : breakDuration * 60;
  const progress = (totalTime - timeLeft) / totalTime;

  // Formatting
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // SVG parameters
  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  const colorFocus = '#6366f1';
  const colorBreak = '#10b981';
  const currentColor = mode === 'focus' ? colorFocus : colorBreak;

  return (
    <div className="glass rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center max-w-xl mx-auto shadow-2xl relative overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border border-white/20">
      {/* Background Accent Aura */}
      <div
        className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: currentColor }}
      />

      {/* Header Selector & Mode Tabs */}
      <div className="w-full flex items-center justify-between gap-4 mb-6 z-10">
        <div className="flex p-1 rounded-2xl bg-gray-100 dark:bg-gray-800 border border-border">
          <button
            onClick={() => {
              setMode('focus');
              setTimerState('idle');
              setTimeLeft(focusDuration * 60);
            }}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              mode === 'focus'
                ? 'bg-primary text-white shadow-xs'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Focus ({focusDuration}m)</span>
          </button>
          <button
            onClick={() => {
              setMode('break');
              setTimerState('idle');
              setTimeLeft(breakDuration * 60);
            }}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              mode === 'break'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Break ({breakDuration}m)</span>
          </button>
        </div>

        {/* Settings Toggle */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className={`p-2 rounded-xl border transition-colors ${
            showSettings
              ? 'bg-primary text-white border-primary'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-primary border-border'
          }`}
          title="Customize Focus & Break Times"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>

      {/* Settings Drawer (Custom Durations) */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full mb-6 p-4 rounded-2xl bg-gray-50/80 dark:bg-gray-800/60 border border-border space-y-3 overflow-hidden text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" /> Customize Cycle Lengths
              </span>
              <button
                onClick={() => setShowSettings(false)}
                className="text-[11px] text-gray-400 hover:text-gray-600"
              >
                Close
              </button>
            </div>

            {/* Focus Duration Presets */}
            <div className="space-y-1.5">
              <span className="font-semibold text-gray-600 dark:text-gray-300">
                Focus Session Length:
              </span>
              <div className="flex gap-2">
                {FOCUS_PRESETS.map((m) => (
                  <button
                    key={m}
                    onClick={() => handleSelectFocusPreset(m)}
                    className={`flex-1 py-1.5 rounded-xl font-bold transition-all ${
                      focusDuration === m
                        ? 'bg-primary text-white shadow-xs'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-border'
                    }`}
                  >
                    {m} min
                  </button>
                ))}
              </div>
            </div>

            {/* Break Duration Presets */}
            <div className="space-y-1.5">
              <span className="font-semibold text-gray-600 dark:text-gray-300">
                Break Duration:
              </span>
              <div className="flex gap-2">
                {BREAK_PRESETS.map((m) => (
                  <button
                    key={m}
                    onClick={() => handleSelectBreakPreset(m)}
                    className={`flex-1 py-1.5 rounded-xl font-bold transition-all ${
                      breakDuration === m
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-border'
                    }`}
                  >
                    {m} min
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Subject / Task Selector */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 z-10">
        <div>
          <label className="block text-[11px] font-bold text-gray-500 mb-1">
            Focus Subject
          </label>
          <select
            value={selectedSubjectId}
            onChange={(e) => {
              setSelectedSubjectId(e.target.value);
              setSelectedTaskId('');
            }}
            className="w-full px-3 py-2 text-xs rounded-xl bg-gray-100 dark:bg-gray-800 border border-border outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white"
          >
            {state.subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-500 mb-1">
            Target Task (Optional)
          </label>
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl bg-gray-100 dark:bg-gray-800 border border-border outline-none focus:ring-2 focus:ring-primary text-gray-900 dark:text-white"
          >
            <option value="">-- General Study Session --</option>
            {tasks.map((task) => (
              <option key={task.id} value={task.id}>
                {task.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Large Circular Countdown Timer */}
      <div className="relative w-64 h-64 flex items-center justify-center my-4 z-10">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 240 240">
          {/* Background Track */}
          <circle
            cx="120"
            cy="120"
            r={radius}
            className="text-gray-200 dark:text-gray-800"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
          />
          {/* Active Progress Ring */}
          <motion.circle
            cx="120"
            cy="120"
            r={radius}
            stroke={currentColor}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </svg>

        {/* Center Display */}
        <div className="absolute flex flex-col items-center justify-center select-none">
          <motion.span
            key={timeString}
            initial={{ scale: 0.96 }}
            animate={{ scale: 1 }}
            className="text-5xl font-black text-gray-900 dark:text-white tracking-tight"
          >
            {timeString}
          </motion.span>
          <span className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider flex items-center gap-1">
            {mode === 'focus' ? <Flame className="w-3.5 h-3.5 text-primary" /> : <Coffee className="w-3.5 h-3.5 text-emerald-500" />}
            {mode === 'focus' ? 'Deep Work' : 'Rest Break'}
          </span>
        </div>
      </div>

      {/* Timer Controls */}
      <div className="flex items-center gap-4 mt-4 z-10">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetTimer}
          className="p-3.5 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-xs"
          title="Reset Timer"
        >
          <RotateCcw className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTimer}
          className="px-8 py-3.5 rounded-2xl text-white font-bold text-sm shadow-xl flex items-center gap-2 transition-all"
          style={{
            backgroundColor: currentColor,
            boxShadow: `0 10px 25px -5px ${currentColor}50`,
          }}
        >
          {timerState === 'running' ? (
            <>
              <Pause className="w-5 h-5" />
              <span>Pause</span>
            </>
          ) : (
            <>
              <Play className="w-5 h-5 fill-white" />
              <span>{timerState === 'paused' ? 'Resume' : 'Start Focus'}</span>
            </>
          )}
        </motion.button>

        {mode === 'break' && (
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={skipBreak}
            className="p-3.5 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-xs"
            title="Skip Break"
          >
            <SkipForward className="w-5 h-5" />
          </motion.button>
        )}
      </div>
    </div>
  );
}
