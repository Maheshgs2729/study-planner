// ============================================================
// Study Planner Pro — Domain Types
// Structured for easy migration to Supabase / Firebase
// ============================================================

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday';

export type AttendanceStatus = 'present' | 'absent' | 'cancelled';

export type TaskStatus = 'todo' | 'in-progress' | 'submitted';

export type TaskPriority = 'low' | 'medium' | 'high';

export type ExamStatus = 'upcoming' | 'completed';

export type ResourceFileType = 'pdf' | 'image' | 'audio' | 'video' | 'doc';

export type StickyColor = 'yellow' | 'pink' | 'mint' | 'blue' | 'purple';

// ---------- Custom Spotify Playlist ----------
export interface CustomPlaylist {
  id: string;
  name: string;
  url: string;
  embedUri: string;
  createdAt: string;
}

// ---------- User ----------
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  university?: string;
  major?: string;
  semester?: string;
  googleLinked?: boolean;
  googleEmail?: string;
  spotifyLinked?: boolean;
  spotifyUser?: string;
  customPlaylists?: CustomPlaylist[];
  isAuthenticated?: boolean;
  streak: number;
  longestStreak: number;
  lastLoginDate: string; // ISO date string
  createdAt: string;
}

// ---------- Subject ----------
export interface Subject {
  id: string;
  userId: string;
  name: string;
  code?: string; // e.g. "CS-301"
  instructor?: string; // e.g. "Dr. Sarah Jenkins"
  credits?: number; // e.g. 4
  color: string; // hex color
  totalStudyMinutes: number;
  createdAt: string;
}

// ---------- Timetable ----------
export interface TimetableEntry {
  id: string;
  subjectId: string;
  dayOfWeek: DayOfWeek;
  startTime: string; // "HH:mm" 24h format
  endTime: string;   // "HH:mm" 24h format
  room?: string;
  type: 'lecture' | 'lab' | 'tutorial';
}

// ---------- Attendance ----------
export interface AttendanceRecord {
  id: string;
  entryId: string;    // references TimetableEntry.id
  subjectId: string;  // denormalized for easy queries
  date: string;       // ISO date string
  status: AttendanceStatus;
}

// ---------- Task / Assignment ----------
export interface Task {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  dueDate: string;  // ISO date string
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
}

// ---------- Exam & Grades ----------
export interface Exam {
  id: string;
  subjectId: string;
  title: string; // e.g. "Midterm Exam", "Final Practical"
  date: string; // ISO date string "YYYY-MM-DD"
  time: string; // "HH:mm" 24h format
  location?: string; // e.g. "Hall A - Room 402"
  totalMarks: number; // e.g. 100
  obtainedMarks?: number; // e.g. 92
  grade?: string; // e.g. "A+", "A", "B", "C", "F"
  weightage?: number; // percentage of course grade (e.g. 30%)
  notes?: string;
  status: ExamStatus;
  createdAt: string;
}

// ---------- Resource Files (PDF, Image, Audio, Video) ----------
export interface ResourceFile {
  id: string;
  subjectId?: string; // Optional: can be subject-specific or general
  title: string;
  fileType: ResourceFileType;
  fileName: string;
  fileSize: number; // in bytes
  dataUrl?: string; // Data URL or object URL
  uploadedAt: string;
  tags?: string[];
}

// ---------- Sticky Note ----------
export interface StickyNote {
  id: string;
  content: string;
  color: StickyColor;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

// ---------- YouTube Study Recommendation ----------
export interface YouTubeVideo {
  id: string;
  subjectId: string;
  title: string;
  channel: string;
  thumbnailUrl: string;
  embedUrl: string;
  duration: string;
}

// ---------- Wallpaper Configuration ----------
export interface WallpaperConfig {
  id: string;
  name: string;
  url: string;
  blur: number; // 0 to 20 px
  opacity: number; // 0.1 to 1.0
  isCustom: boolean;
}

// ---------- Copilot Chat Message ----------
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  subjectId?: string;
}

// ---------- Note ----------
export interface Note {
  id: string;
  subjectId: string;
  title: string;
  content: string; // Markdown
  createdAt: string;
  updatedAt: string;
}

// ---------- Pomodoro ----------
export interface PomodoroSession {
  id: string;
  subjectId: string;
  taskId?: string;
  startedAt: string;   // ISO datetime string
  durationMinutes: number;
  completed: boolean;
}

export interface PomodoroSettings {
  focusMinutes: number;
  breakMinutes: number;
  longBreakMinutes: number;
}

// ---------- App State ----------
export interface AppState {
  user: User;
  subjects: Subject[];
  timetable: TimetableEntry[];
  attendance: AttendanceRecord[];
  tasks: Task[];
  exams: Exam[];
  resources: ResourceFile[];
  stickyNotes: StickyNote[];
  notes: Note[];
  pomodoroSessions: PomodoroSession[];
  pomodoroSettings: PomodoroSettings;
  wallpaper: WallpaperConfig;
}

// ---------- Subject colors palette (Monochrome Black & White Theme) ----------
export const SUBJECT_COLORS = [
  '#ffffff', // Pure Chalk White
  '#e4e4e7', // Platinum Zinc
  '#d4d4d8', // Light Slate
  '#a1a1aa', // Medium Gray
  '#71717a', // Deep Graphite
  '#52525b', // Charcoal Zinc
  '#f4f4f5', // Snow White
  '#3f3f46', // Dark Onyx
] as const;

// ---------- Curated Wallpaper Presets ----------
export const WALLPAPER_PRESETS: WallpaperConfig[] = [
  {
    id: 'none',
    name: 'Clean Minimal (No Wallpaper)',
    url: '',
    blur: 0,
    opacity: 0,
    isCustom: false,
  },
  {
    id: 'lofi-desk',
    name: 'Cozy Anime Study Desk',
    url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=1920&auto=format&fit=crop',
    blur: 8,
    opacity: 0.25,
    isCustom: false,
  },
  {
    id: 'minimal-sunset',
    name: 'Twilight Cloudscape',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1920&auto=format&fit=crop',
    blur: 10,
    opacity: 0.25,
    isCustom: false,
  },
  {
    id: 'cyber-library',
    name: 'Neon Knowledge Archive',
    url: 'https://images.unsplash.com/photo-1507842229450-76b2512a8069?q=80&w=1920&auto=format&fit=crop',
    blur: 6,
    opacity: 0.2,
    isCustom: false,
  },
  {
    id: 'starry-mountain',
    name: 'Starry Focus Night',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1920&auto=format&fit=crop',
    blur: 8,
    opacity: 0.22,
    isCustom: false,
  },
  {
    id: 'warm-cafe',
    name: 'Warm Parisian Cafe',
    url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1920&auto=format&fit=crop',
    blur: 6,
    opacity: 0.22,
    isCustom: false,
  },
];
