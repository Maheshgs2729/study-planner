'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import {
  AppState,
  Subject,
  TimetableEntry,
  AttendanceRecord,
  Task,
  Note,
  Exam,
  ResourceFile,
  StickyNote,
  PomodoroSession,
  PomodoroSettings,
  WallpaperConfig,
  AttendanceStatus,
  TaskStatus,
} from '@/types';
import { seedData } from './seed-data';

// ============================================================
// Actions
// ============================================================
type Action =
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'UPDATE_STREAK' }
  // Subject
  | { type: 'ADD_SUBJECT'; payload: Subject }
  | { type: 'UPDATE_SUBJECT'; payload: Subject }
  | { type: 'ADD_STUDY_TIME'; payload: { subjectId: string; minutes: number } }
  // Attendance
  | { type: 'SET_ATTENDANCE'; payload: AttendanceRecord }
  // Tasks
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'MOVE_TASK'; payload: { taskId: string; status: TaskStatus } }
  | { type: 'DELETE_TASK'; payload: string }
  // Notes
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: Note }
  | { type: 'DELETE_NOTE'; payload: string }
  // Pomodoro
  | { type: 'ADD_POMODORO_SESSION'; payload: PomodoroSession }
  | { type: 'UPDATE_POMODORO_SETTINGS'; payload: PomodoroSettings }
  // Timetable
  | { type: 'ADD_TIMETABLE_ENTRY'; payload: TimetableEntry }
  | { type: 'UPDATE_TIMETABLE_ENTRY'; payload: TimetableEntry }
  | { type: 'DELETE_TIMETABLE_ENTRY'; payload: string }
  // Exams & Grades
  | { type: 'ADD_EXAM'; payload: Exam }
  | { type: 'UPDATE_EXAM'; payload: Exam }
  | { type: 'DELETE_EXAM'; payload: string }
  // Resources Hub
  | { type: 'ADD_RESOURCE'; payload: ResourceFile }
  | { type: 'DELETE_RESOURCE'; payload: string }
  // Sticky Notes
  | { type: 'ADD_STICKY_NOTE'; payload: StickyNote }
  | { type: 'UPDATE_STICKY_NOTE'; payload: StickyNote }
  | { type: 'DELETE_STICKY_NOTE'; payload: string }
  // Wallpaper
  | { type: 'SET_WALLPAPER'; payload: WallpaperConfig };

// ============================================================
// Reducer
// ============================================================
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD_STATE':
      return action.payload;

    case 'UPDATE_STREAK': {
      const today = new Date().toISOString().split('T')[0];
      const lastLogin = state.user.lastLoginDate;
      if (lastLogin === today) return state;

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      const newStreak = lastLogin === yesterdayStr ? state.user.streak + 1 : 1;
      return {
        ...state,
        user: {
          ...state.user,
          streak: newStreak,
          longestStreak: Math.max(state.user.longestStreak, newStreak),
          lastLoginDate: today,
        },
      };
    }

    case 'ADD_SUBJECT':
      return { ...state, subjects: [...state.subjects, action.payload] };

    case 'UPDATE_SUBJECT':
      return {
        ...state,
        subjects: state.subjects.map((s) =>
          s.id === action.payload.id ? action.payload : s
        ),
      };

    case 'ADD_STUDY_TIME':
      return {
        ...state,
        subjects: state.subjects.map((s) =>
          s.id === action.payload.subjectId
            ? { ...s, totalStudyMinutes: s.totalStudyMinutes + action.payload.minutes }
            : s
        ),
      };

    case 'SET_ATTENDANCE': {
      const existing = state.attendance.findIndex(
        (a) => a.entryId === action.payload.entryId && a.date === action.payload.date
      );
      if (existing >= 0) {
        const updated = [...state.attendance];
        updated[existing] = action.payload;
        return { ...state, attendance: updated };
      }
      return { ...state, attendance: [...state.attendance, action.payload] };
    }

    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };

    case 'MOVE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.taskId
            ? { ...t, status: action.payload.status, updatedAt: new Date().toISOString() }
            : t
        ),
      };

    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
      };

    case 'ADD_NOTE':
      return { ...state, notes: [...state.notes, action.payload] };

    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map((n) =>
          n.id === action.payload.id ? action.payload : n
        ),
      };

    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter((n) => n.id !== action.payload),
      };

    case 'ADD_POMODORO_SESSION':
      return {
        ...state,
        pomodoroSessions: [...state.pomodoroSessions, action.payload],
      };

    case 'UPDATE_POMODORO_SETTINGS':
      return {
        ...state,
        pomodoroSettings: action.payload,
      };

    case 'ADD_TIMETABLE_ENTRY':
      return {
        ...state,
        timetable: [...state.timetable, action.payload],
      };

    case 'UPDATE_TIMETABLE_ENTRY':
      return {
        ...state,
        timetable: state.timetable.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
      };

    case 'DELETE_TIMETABLE_ENTRY':
      return {
        ...state,
        timetable: state.timetable.filter((t) => t.id !== action.payload),
        attendance: state.attendance.filter((a) => a.entryId !== action.payload),
      };

    case 'ADD_EXAM':
      return {
        ...state,
        exams: [...state.exams, action.payload],
      };

    case 'UPDATE_EXAM':
      return {
        ...state,
        exams: state.exams.map((e) =>
          e.id === action.payload.id ? action.payload : e
        ),
      };

    case 'DELETE_EXAM':
      return {
        ...state,
        exams: state.exams.filter((e) => e.id !== action.payload),
      };

    case 'ADD_RESOURCE':
      return {
        ...state,
        resources: [action.payload, ...state.resources],
      };

    case 'DELETE_RESOURCE':
      return {
        ...state,
        resources: state.resources.filter((r) => r.id !== action.payload),
      };

    case 'ADD_STICKY_NOTE':
      return {
        ...state,
        stickyNotes: [action.payload, ...state.stickyNotes],
      };

    case 'UPDATE_STICKY_NOTE':
      return {
        ...state,
        stickyNotes: state.stickyNotes.map((n) =>
          n.id === action.payload.id ? action.payload : n
        ),
      };

    case 'DELETE_STICKY_NOTE':
      return {
        ...state,
        stickyNotes: state.stickyNotes.filter((n) => n.id !== action.payload),
      };

    case 'SET_WALLPAPER':
      return {
        ...state,
        wallpaper: action.payload,
      };

    default:
      return state;
  }
}

// ============================================================
// Context Interface
// ============================================================
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  // Computed helpers
  getSubject: (id: string) => Subject | undefined;
  getSubjectAttendance: (subjectId: string) => { attended: number; total: number; percentage: number };
  getOverallAttendance: () => { attended: number; total: number; percentage: number };
  getSubjectTasks: (subjectId: string) => Task[];
  getSubjectNotes: (subjectId: string) => Note[];
  getSubjectExams: (subjectId: string) => Exam[];
  getSubjectResources: (subjectId?: string) => ResourceFile[];
  getTodayTimetable: () => TimetableEntry[];
  getUpcomingTasks: (limit?: number) => Task[];
  getUpcomingExams: (limit?: number) => Exam[];
  getOverallGPA: () => { gpa: number; averagePercentage: number; gradedCount: number };
  getTodayStudyMinutes: () => number;
  getWeeklyStudyData: () => { day: string; minutes: number }[];
  // Action helpers
  setAttendance: (entryId: string, subjectId: string, date: string, status: AttendanceStatus) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  moveTask: (taskId: string, status: TaskStatus) => void;
  deleteTask: (taskId: string) => void;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNoteContent: (noteId: string, title: string, content: string) => void;
  deleteNote: (noteId: string) => void;
  logPomodoroSession: (subjectId: string, taskId?: string) => void;
  updatePomodoroSettings: (settings: PomodoroSettings) => void;
  addSubject: (name: string, color: string, code?: string, instructor?: string, credits?: number) => void;
  addTimetableEntry: (entry: Omit<TimetableEntry, 'id'>) => void;
  updateTimetableEntry: (entry: TimetableEntry) => void;
  deleteTimetableEntry: (id: string) => void;
  // Exams & Grades
  addExam: (exam: Omit<Exam, 'id' | 'createdAt'>) => void;
  updateExam: (exam: Exam) => void;
  deleteExam: (id: string) => void;
  // Resources
  addResource: (resource: Omit<ResourceFile, 'id' | 'uploadedAt'>) => void;
  deleteResource: (id: string) => void;
  // Sticky Notes
  addStickyNote: (content: string, color?: StickyNote['color']) => void;
  updateStickyNote: (note: StickyNote) => void;
  deleteStickyNote: (id: string) => void;
  // Wallpaper
  setWallpaper: (config: WallpaperConfig) => void;
  isHydrated: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'study-planner-pro-state-v2';

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ============================================================
// Provider
// ============================================================
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, seedData);
  const [isHydrated, setIsHydrated] = React.useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AppState;
        dispatch({ type: 'LOAD_STATE', payload: { ...seedData, ...parsed } });
      }
    } catch {
      // Use seed data if parse fails
    }
    dispatch({ type: 'UPDATE_STREAK' });
    setIsHydrated(true);
  }, []);

  // Persist to localStorage on state change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage full
    }
  }, [state]);

  // ---------- Computed helpers ----------
  const getSubject = useCallback(
    (id: string) => state.subjects.find((s) => s.id === id),
    [state.subjects]
  );

  const getSubjectAttendance = useCallback(
    (subjectId: string) => {
      const records = state.attendance.filter((a) => a.subjectId === subjectId && a.status !== 'cancelled');
      const attended = records.filter((a) => a.status === 'present').length;
      const total = records.length;
      return { attended, total, percentage: total > 0 ? (attended / total) * 100 : 100 };
    },
    [state.attendance]
  );

  const getOverallAttendance = useCallback(() => {
    const records = state.attendance.filter((a) => a.status !== 'cancelled');
    const attended = records.filter((a) => a.status === 'present').length;
    const total = records.length;
    return { attended, total, percentage: total > 0 ? (attended / total) * 100 : 100 };
  }, [state.attendance]);

  const getSubjectTasks = useCallback(
    (subjectId: string) => state.tasks.filter((t) => t.subjectId === subjectId),
    [state.tasks]
  );

  const getSubjectNotes = useCallback(
    (subjectId: string) => state.notes.filter((n) => n.subjectId === subjectId),
    [state.notes]
  );

  const getSubjectExams = useCallback(
    (subjectId: string) => state.exams.filter((e) => e.subjectId === subjectId),
    [state.exams]
  );

  const getSubjectResources = useCallback(
    (subjectId?: string) => {
      if (!subjectId) return state.resources;
      return state.resources.filter((r) => r.subjectId === subjectId);
    },
    [state.resources]
  );

  const getTodayTimetable = useCallback(() => {
    const days: string[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = days[new Date().getDay()];
    return state.timetable
      .filter((e) => e.dayOfWeek === today)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [state.timetable]);

  const getUpcomingTasks = useCallback(
    (limit = 5) => {
      return state.tasks
        .filter((t) => t.status !== 'submitted')
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
        .slice(0, limit);
    },
    [state.tasks]
  );

  const getUpcomingExams = useCallback(
    (limit = 5) => {
      return state.exams
        .filter((e) => e.status === 'upcoming')
        .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))
        .slice(0, limit);
    },
    [state.exams]
  );

  const getOverallGPA = useCallback(() => {
    const graded = state.exams.filter((e) => e.status === 'completed' && e.obtainedMarks !== undefined);
    if (graded.length === 0) return { gpa: 4.0, averagePercentage: 100, gradedCount: 0 };

    const gradePoints: Record<string, number> = {
      'A+': 4.0, 'A': 4.0, 'A-': 3.7,
      'B+': 3.3, 'B': 3.0, 'B-': 2.7,
      'C+': 2.3, 'C': 2.0, 'C-': 1.7,
      'D': 1.0, 'F': 0.0,
    };

    let totalPoints = 0;
    let totalPct = 0;

    graded.forEach((e) => {
      const pct = (e.obtainedMarks! / e.totalMarks) * 100;
      totalPct += pct;
      const pts = e.grade && gradePoints[e.grade] !== undefined
        ? gradePoints[e.grade]
        : pct >= 90 ? 4.0 : pct >= 80 ? 3.0 : pct >= 70 ? 2.0 : pct >= 60 ? 1.0 : 0.0;
      totalPoints += pts;
    });

    return {
      gpa: Number((totalPoints / graded.length).toFixed(2)),
      averagePercentage: Number((totalPct / graded.length).toFixed(1)),
      gradedCount: graded.length,
    };
  }, [state.exams]);

  const getTodayStudyMinutes = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return state.pomodoroSessions
      .filter((s) => s.completed && s.startedAt.startsWith(today))
      .reduce((sum, s) => sum + s.durationMinutes, 0);
  }, [state.pomodoroSessions]);

  const getWeeklyStudyData = useCallback(() => {
    const data: { day: string; minutes: number }[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const mins = state.pomodoroSessions
        .filter((s) => s.completed && s.startedAt.startsWith(dateStr))
        .reduce((sum, s) => sum + s.durationMinutes, 0);
      data.push({ day: dayNames[d.getDay()], minutes: mins });
    }
    return data;
  }, [state.pomodoroSessions]);

  // ---------- Action helpers ----------
  const setAttendance = useCallback(
    (entryId: string, subjectId: string, date: string, status: AttendanceStatus) => {
      dispatch({
        type: 'SET_ATTENDANCE',
        payload: { id: generateId(), entryId, subjectId, date, status },
      });
    },
    []
  );

  const addTask = useCallback(
    (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString();
      dispatch({
        type: 'ADD_TASK',
        payload: { ...task, id: generateId(), createdAt: now, updatedAt: now },
      });
    },
    []
  );

  const moveTask = useCallback((taskId: string, status: TaskStatus) => {
    dispatch({ type: 'MOVE_TASK', payload: { taskId, status } });
  }, []);

  const deleteTask = useCallback((taskId: string) => {
    dispatch({ type: 'DELETE_TASK', payload: taskId });
  }, []);

  const addNote = useCallback(
    (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString();
      dispatch({
        type: 'ADD_NOTE',
        payload: { ...note, id: generateId(), createdAt: now, updatedAt: now },
      });
    },
    []
  );

  const updateNoteContent = useCallback(
    (noteId: string, title: string, content: string) => {
      const note = state.notes.find((n) => n.id === noteId);
      if (note) {
        dispatch({
          type: 'UPDATE_NOTE',
          payload: { ...note, title, content, updatedAt: new Date().toISOString() },
        });
      }
    },
    [state.notes]
  );

  const deleteNote = useCallback((noteId: string) => {
    dispatch({ type: 'DELETE_NOTE', payload: noteId });
  }, []);

  const logPomodoroSession = useCallback(
    (subjectId: string, taskId?: string) => {
      const duration = state.pomodoroSettings?.focusMinutes || 25;
      dispatch({
        type: 'ADD_POMODORO_SESSION',
        payload: {
          id: generateId(),
          subjectId,
          taskId,
          startedAt: new Date().toISOString(),
          durationMinutes: duration,
          completed: true,
        },
      });
      dispatch({
        type: 'ADD_STUDY_TIME',
        payload: { subjectId, minutes: duration },
      });
    },
    [state.pomodoroSettings]
  );

  const updatePomodoroSettings = useCallback((settings: PomodoroSettings) => {
    dispatch({ type: 'UPDATE_POMODORO_SETTINGS', payload: settings });
  }, []);

  const addSubject = useCallback(
    (name: string, color: string, code?: string, instructor?: string, credits = 3) => {
      dispatch({
        type: 'ADD_SUBJECT',
        payload: {
          id: generateId(),
          userId: state.user.id,
          name,
          code,
          instructor,
          credits,
          color,
          totalStudyMinutes: 0,
          createdAt: new Date().toISOString(),
        },
      });
    },
    [state.user.id]
  );

  const addTimetableEntry = useCallback((entry: Omit<TimetableEntry, 'id'>) => {
    dispatch({
      type: 'ADD_TIMETABLE_ENTRY',
      payload: { ...entry, id: generateId() },
    });
  }, []);

  const updateTimetableEntry = useCallback((entry: TimetableEntry) => {
    dispatch({ type: 'UPDATE_TIMETABLE_ENTRY', payload: entry });
  }, []);

  const deleteTimetableEntry = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TIMETABLE_ENTRY', payload: id });
  }, []);

  // Exams & Grades
  const addExam = useCallback((exam: Omit<Exam, 'id' | 'createdAt'>) => {
    dispatch({
      type: 'ADD_EXAM',
      payload: { ...exam, id: generateId(), createdAt: new Date().toISOString() },
    });
  }, []);

  const updateExam = useCallback((exam: Exam) => {
    dispatch({ type: 'UPDATE_EXAM', payload: exam });
  }, []);

  const deleteExam = useCallback((id: string) => {
    dispatch({ type: 'DELETE_EXAM', payload: id });
  }, []);

  // Resources
  const addResource = useCallback((resource: Omit<ResourceFile, 'id' | 'uploadedAt'>) => {
    dispatch({
      type: 'ADD_RESOURCE',
      payload: { ...resource, id: generateId(), uploadedAt: new Date().toISOString() },
    });
  }, []);

  const deleteResource = useCallback((id: string) => {
    dispatch({ type: 'DELETE_RESOURCE', payload: id });
  }, []);

  // Sticky Notes
  const addStickyNote = useCallback((content: string, color: StickyNote['color'] = 'yellow') => {
    const now = new Date().toISOString();
    dispatch({
      type: 'ADD_STICKY_NOTE',
      payload: { id: generateId(), content, color, pinned: false, createdAt: now, updatedAt: now },
    });
  }, []);

  const updateStickyNote = useCallback((note: StickyNote) => {
    dispatch({
      type: 'UPDATE_STICKY_NOTE',
      payload: { ...note, updatedAt: new Date().toISOString() },
    });
  }, []);

  const deleteStickyNote = useCallback((id: string) => {
    dispatch({ type: 'DELETE_STICKY_NOTE', payload: id });
  }, []);

  // Wallpaper
  const setWallpaper = useCallback((config: WallpaperConfig) => {
    dispatch({ type: 'SET_WALLPAPER', payload: config });
  }, []);

  const value: AppContextType = {
    state,
    dispatch,
    getSubject,
    getSubjectAttendance,
    getOverallAttendance,
    getSubjectTasks,
    getSubjectNotes,
    getSubjectExams,
    getSubjectResources,
    getTodayTimetable,
    getUpcomingTasks,
    getUpcomingExams,
    getOverallGPA,
    getTodayStudyMinutes,
    getWeeklyStudyData,
    setAttendance,
    addTask,
    moveTask,
    deleteTask,
    addNote,
    updateNoteContent,
    deleteNote,
    logPomodoroSession,
    updatePomodoroSettings,
    addSubject,
    addTimetableEntry,
    updateTimetableEntry,
    deleteTimetableEntry,
    addExam,
    updateExam,
    deleteExam,
    addResource,
    deleteResource,
    addStickyNote,
    updateStickyNote,
    deleteStickyNote,
    setWallpaper,
    isHydrated,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ============================================================
// Hook
// ============================================================
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
