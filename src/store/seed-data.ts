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
  YouTubeVideo,
  PomodoroSession,
  SUBJECT_COLORS,
  WALLPAPER_PRESETS,
} from '@/types';

// ============================================================
// Seed Data — Realistic demo data for Study Planner Pro
// ============================================================

const TODAY = new Date();
const toISO = (d: Date) => d.toISOString().split('T')[0];
const daysAgo = (n: number) => {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - n);
  return toISO(d);
};
const daysFromNow = (n: number) => {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + n);
  return toISO(d);
};

// ---------- Subjects ----------
const subjects: Subject[] = [
  { id: 'sub-1', userId: 'user-1', name: 'Data Structures', code: 'CS-301', instructor: 'Prof. Alan Turing', credits: 4, color: SUBJECT_COLORS[0], totalStudyMinutes: 480, createdAt: daysAgo(60) },
  { id: 'sub-2', userId: 'user-1', name: 'Operating Systems', code: 'CS-304', instructor: 'Dr. Linus Gates', credits: 4, color: SUBJECT_COLORS[1], totalStudyMinutes: 320, createdAt: daysAgo(60) },
  { id: 'sub-3', userId: 'user-1', name: 'Web Development', code: 'CS-320', instructor: 'Prof. Tim Berners', credits: 3, color: SUBJECT_COLORS[2], totalStudyMinutes: 560, createdAt: daysAgo(60) },
  { id: 'sub-4', userId: 'user-1', name: 'Mathematics III', code: 'MATH-201', instructor: 'Dr. Katherine Johnson', credits: 4, color: SUBJECT_COLORS[3], totalStudyMinutes: 240, createdAt: daysAgo(60) },
  { id: 'sub-5', userId: 'user-1', name: 'Database Systems', code: 'CS-315', instructor: 'Dr. Edgar Codd', credits: 3, color: SUBJECT_COLORS[4], totalStudyMinutes: 180, createdAt: daysAgo(60) },
];

// ---------- Timetable ----------
const timetable: TimetableEntry[] = [
  // Monday
  { id: 'tt-1', subjectId: 'sub-1', dayOfWeek: 'monday', startTime: '09:00', endTime: '10:00', room: 'Room 301', type: 'lecture' },
  { id: 'tt-2', subjectId: 'sub-2', dayOfWeek: 'monday', startTime: '10:15', endTime: '11:15', room: 'Room 204', type: 'lecture' },
  { id: 'tt-3', subjectId: 'sub-3', dayOfWeek: 'monday', startTime: '11:30', endTime: '12:30', room: 'Lab 101', type: 'lab' },
  { id: 'tt-4', subjectId: 'sub-4', dayOfWeek: 'monday', startTime: '14:00', endTime: '15:00', room: 'Room 105', type: 'lecture' },
  // Tuesday
  { id: 'tt-5', subjectId: 'sub-5', dayOfWeek: 'tuesday', startTime: '09:00', endTime: '10:00', room: 'Room 302', type: 'lecture' },
  { id: 'tt-6', subjectId: 'sub-1', dayOfWeek: 'tuesday', startTime: '10:15', endTime: '11:45', room: 'Lab 202', type: 'lab' },
  { id: 'tt-7', subjectId: 'sub-3', dayOfWeek: 'tuesday', startTime: '13:00', endTime: '14:00', room: 'Room 301', type: 'lecture' },
  // Wednesday
  { id: 'tt-8', subjectId: 'sub-2', dayOfWeek: 'wednesday', startTime: '09:00', endTime: '10:00', room: 'Room 204', type: 'lecture' },
  { id: 'tt-9', subjectId: 'sub-4', dayOfWeek: 'wednesday', startTime: '10:15', endTime: '11:15', room: 'Room 105', type: 'tutorial' },
  { id: 'tt-10', subjectId: 'sub-5', dayOfWeek: 'wednesday', startTime: '11:30', endTime: '13:00', room: 'Lab 303', type: 'lab' },
  // Thursday
  { id: 'tt-11', subjectId: 'sub-1', dayOfWeek: 'thursday', startTime: '09:00', endTime: '10:00', room: 'Room 301', type: 'lecture' },
  { id: 'tt-12', subjectId: 'sub-3', dayOfWeek: 'thursday', startTime: '10:15', endTime: '11:45', room: 'Lab 101', type: 'lab' },
  { id: 'tt-13', subjectId: 'sub-2', dayOfWeek: 'thursday', startTime: '14:00', endTime: '15:00', room: 'Room 204', type: 'tutorial' },
  // Friday
  { id: 'tt-14', subjectId: 'sub-4', dayOfWeek: 'friday', startTime: '09:00', endTime: '10:00', room: 'Room 105', type: 'lecture' },
  { id: 'tt-15', subjectId: 'sub-5', dayOfWeek: 'friday', startTime: '10:15', endTime: '11:15', room: 'Room 302', type: 'lecture' },
  { id: 'tt-16', subjectId: 'sub-1', dayOfWeek: 'friday', startTime: '11:30', endTime: '12:30', room: 'Room 301', type: 'tutorial' },
  { id: 'tt-17', subjectId: 'sub-3', dayOfWeek: 'friday', startTime: '14:00', endTime: '15:00', room: 'Room 301', type: 'lecture' },
  // Saturday
  { id: 'tt-18', subjectId: 'sub-2', dayOfWeek: 'saturday', startTime: '09:00', endTime: '10:30', room: 'Lab 202', type: 'lab' },
];

// ---------- Attendance (last 4 weeks) ----------
function generateAttendance(): AttendanceRecord[] {
  const records: AttendanceRecord[] = [];
  let id = 1;
  const dayMap: Record<string, number> = {
    monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6,
  };

  for (let week = 0; week < 4; week++) {
    for (const entry of timetable) {
      const dayNum = dayMap[entry.dayOfWeek];
      const date = new Date(TODAY);
      const currentDay = date.getDay() || 7;
      date.setDate(date.getDate() - ((currentDay - dayNum + 7) % 7) - week * 7);

      if (date > TODAY) continue;

      const rand = Math.random();
      let status: AttendanceRecord['status'] = 'present';
      if (rand > 0.85) status = 'absent';
      else if (rand > 0.80) status = 'cancelled';

      records.push({
        id: `att-${id++}`,
        entryId: entry.id,
        subjectId: entry.subjectId,
        date: toISO(date),
        status,
      });
    }
  }
  return records;
}

// ---------- Tasks ----------
const tasks: Task[] = [
  { id: 'task-1', subjectId: 'sub-1', title: 'Implement Binary Search Tree', description: 'Write BST with insert, delete, and traversal methods in C++', dueDate: daysFromNow(2), status: 'in-progress', priority: 'high', createdAt: daysAgo(5), updatedAt: daysAgo(1) },
  { id: 'task-2', subjectId: 'sub-1', title: 'Solve Graph Problems Set', description: 'Complete 10 problems on BFS/DFS from the textbook', dueDate: daysFromNow(5), status: 'todo', priority: 'medium', createdAt: daysAgo(3), updatedAt: daysAgo(3) },
  { id: 'task-3', subjectId: 'sub-2', title: 'Process Scheduling Report', description: 'Write a comparative report on FCFS, SJF, and Round Robin algorithms', dueDate: daysFromNow(1), status: 'in-progress', priority: 'high', createdAt: daysAgo(7), updatedAt: daysAgo(2) },
  { id: 'task-4', subjectId: 'sub-3', title: 'Build Portfolio Website', description: 'Create a responsive portfolio using Next.js and Tailwind CSS', dueDate: daysFromNow(7), status: 'todo', priority: 'medium', createdAt: daysAgo(2), updatedAt: daysAgo(2) },
  { id: 'task-5', subjectId: 'sub-3', title: 'REST API Assignment', description: 'Design and implement a RESTful API with Express and MongoDB', dueDate: daysAgo(1), status: 'submitted', priority: 'high', createdAt: daysAgo(10), updatedAt: daysAgo(1) },
  { id: 'task-6', subjectId: 'sub-4', title: 'Laplace Transforms Worksheet', description: 'Solve problems 1-15 from Chapter 7', dueDate: daysFromNow(3), status: 'todo', priority: 'low', createdAt: daysAgo(4), updatedAt: daysAgo(4) },
  { id: 'task-7', subjectId: 'sub-5', title: 'ER Diagram for Library System', description: 'Design complete ER diagram with cardinality and participation constraints', dueDate: daysFromNow(4), status: 'todo', priority: 'medium', createdAt: daysAgo(3), updatedAt: daysAgo(3) },
  { id: 'task-8', subjectId: 'sub-5', title: 'SQL Query Practice', description: 'Write complex SQL queries involving joins, subqueries, and aggregates', dueDate: daysAgo(3), status: 'submitted', priority: 'low', createdAt: daysAgo(14), updatedAt: daysAgo(4) },
  { id: 'task-9', subjectId: 'sub-2', title: 'Memory Management Simulation', description: 'Simulate paging and segmentation in Python', dueDate: daysFromNow(6), status: 'todo', priority: 'medium', createdAt: daysAgo(1), updatedAt: daysAgo(1) },
  { id: 'task-10', subjectId: 'sub-4', title: 'Fourier Series Assignment', description: 'Compute Fourier series for given periodic functions', dueDate: daysAgo(2), status: 'submitted', priority: 'high', createdAt: daysAgo(12), updatedAt: daysAgo(3) },
];

// ---------- Exams & Grades ----------
const exams: Exam[] = [
  {
    id: 'exam-1',
    subjectId: 'sub-1',
    title: 'Midterm: Trees & Graph Algorithms',
    date: daysFromNow(4),
    time: '10:00',
    location: 'Auditorium Hall B',
    totalMarks: 100,
    weightage: 30,
    status: 'upcoming',
    notes: 'Covers Chapters 1-6. Bring scientific calculator.',
    createdAt: daysAgo(15),
  },
  {
    id: 'exam-2',
    subjectId: 'sub-2',
    title: 'OS Midterm: Process Concurrency',
    date: daysFromNow(9),
    time: '14:00',
    location: 'Room 304',
    totalMarks: 100,
    weightage: 25,
    status: 'upcoming',
    notes: 'Focus on Semaphores, Mutex, and Banker’s Algorithm.',
    createdAt: daysAgo(10),
  },
  {
    id: 'exam-3',
    subjectId: 'sub-3',
    title: 'Web Dev Practical & Live Coding',
    date: daysFromNow(14),
    time: '11:30',
    location: 'Computer Lab 102',
    totalMarks: 50,
    weightage: 20,
    status: 'upcoming',
    notes: 'Build a fullstack CRUD feature within 90 minutes.',
    createdAt: daysAgo(8),
  },
  {
    id: 'exam-4',
    subjectId: 'sub-4',
    title: 'Calculus & Laplace Transforms Quiz',
    date: daysAgo(12),
    time: '09:00',
    location: 'Room 105',
    totalMarks: 50,
    obtainedMarks: 47,
    grade: 'A+',
    weightage: 15,
    status: 'completed',
    notes: 'Scored 94%. High score in class!',
    createdAt: daysAgo(25),
  },
  {
    id: 'exam-5',
    subjectId: 'sub-5',
    title: 'DBMS SQL & Normalization Test',
    date: daysAgo(6),
    time: '13:00',
    location: 'Room 302',
    totalMarks: 100,
    obtainedMarks: 88,
    grade: 'A',
    weightage: 20,
    status: 'completed',
    notes: 'Minor point lost on 3NF multi-valued dependency question.',
    createdAt: daysAgo(20),
  },
];

// ---------- Resources (PDF, Images, Audio, Video) ----------
const resources: ResourceFile[] = [
  {
    id: 'res-1',
    subjectId: 'sub-1',
    title: 'Complete Binary Search Trees & AVL Handout',
    fileType: 'pdf',
    fileName: 'Data_Structures_Module3_Trees.pdf',
    fileSize: 2450000,
    dataUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
    uploadedAt: daysAgo(5),
    tags: ['lecture-notes', 'cheat-sheet', 'revision'],
  },
  {
    id: 'res-2',
    subjectId: 'sub-1',
    title: 'Graph Traversal Complexity Cheatsheet',
    fileType: 'image',
    fileName: 'BFS_DFS_Complexity_Matrix.png',
    fileSize: 850000,
    dataUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200',
    uploadedAt: daysAgo(7),
    tags: ['diagram', 'visual-guide'],
  },
  {
    id: 'res-3',
    subjectId: 'sub-2',
    title: 'Lecture 12 Recording: Deadlocks & Prevention',
    fileType: 'audio',
    fileName: 'OS_Lec12_Deadlocks_Audio.mp3',
    fileSize: 15200000,
    dataUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    uploadedAt: daysAgo(3),
    tags: ['voice-memo', 'lecture-audio'],
  },
  {
    id: 'res-4',
    subjectId: 'sub-3',
    title: 'Next.js App Router Architecture Crash Video',
    fileType: 'video',
    fileName: 'NextJS_App_Router_Walkthrough.mp4',
    fileSize: 48000000,
    dataUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    uploadedAt: daysAgo(2),
    tags: ['tutorial', 'coding-demo'],
  },
  {
    id: 'res-5',
    subjectId: 'sub-5',
    title: 'SQL Normalization 1NF to BCNF Formula Guide',
    fileType: 'pdf',
    fileName: 'Database_Normalization_Guide.pdf',
    fileSize: 1800000,
    dataUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf',
    uploadedAt: daysAgo(8),
    tags: ['exam-prep', 'reference'],
  },
];

// ---------- Sticky Notes ----------
const stickyNotes: StickyNote[] = [
  {
    id: 'sticky-1',
    content: '⚡ **Exam Priority:**\n- Review AVL rotation formulas\n- Solve Dijkstra 3 practice problems\n- Memorize Banker Algorithm steps',
    color: 'yellow',
    pinned: true,
    createdAt: daysAgo(2),
    updatedAt: daysAgo(1),
  },
  {
    id: 'sticky-2',
    content: '💡 **Project Idea:**\nIntegrate Supabase Auth & PostgreSQL database with Study Planner Pro next weekend.',
    color: 'mint',
    pinned: true,
    createdAt: daysAgo(4),
    updatedAt: daysAgo(4),
  },
  {
    id: 'sticky-3',
    content: '📚 **Library Books to Return:**\n- *Operating System Concepts* (9th Ed.)\n- Due on Friday afternoon!',
    color: 'pink',
    pinned: false,
    createdAt: daysAgo(1),
    updatedAt: daysAgo(1),
  },
];

// ---------- Curated YouTube Study Recommendations ----------
export const YOUTUBE_RECOMMENDATIONS: YouTubeVideo[] = [
  {
    id: 'yt-1',
    subjectId: 'sub-1',
    title: 'Data Structures and Algorithms Full Course',
    channel: 'freeCodeCamp.org',
    thumbnailUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=480&auto=format&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/8hly31xKli0',
    duration: '5 hr 24 min',
  },
  {
    id: 'yt-2',
    subjectId: 'sub-1',
    title: 'Binary Trees & Graphs Explained Visually',
    channel: 'NeetCode',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=480&auto=format&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/fAAZixBzIAI',
    duration: '22 min',
  },
  {
    id: 'yt-3',
    subjectId: 'sub-2',
    title: 'Operating Systems Crash Course in 2 Hours',
    channel: 'Neso Academy',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=480&auto=format&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/26QPDBe-NB8',
    duration: '1 hr 45 min',
  },
  {
    id: 'yt-4',
    subjectId: 'sub-3',
    title: 'Next.js 14 Full Stack App Tutorial',
    channel: 'Traversy Media',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=480&auto=format&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/wm5gMKuwSYk',
    duration: '2 hr 10 min',
  },
  {
    id: 'yt-5',
    subjectId: 'sub-4',
    title: 'Laplace Transform Complete Concept & Examples',
    channel: '3Blue1Brown',
    thumbnailUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=480&auto=format&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/spUNpyF58BY',
    duration: '34 min',
  },
  {
    id: 'yt-6',
    subjectId: 'sub-5',
    title: 'Database Normalization 1NF, 2NF, 3NF & BCNF',
    channel: 'Fireship',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=480&auto=format&fit=crop',
    embedUrl: 'https://www.youtube.com/embed/GFQaEYEc8_8',
    duration: '14 min',
  },
];

// ---------- Notes ----------
const notes: Note[] = [
  {
    id: 'note-1',
    subjectId: 'sub-1',
    title: 'Binary Trees Overview',
    content: `# Binary Trees\n\n## Key Concepts\n- A binary tree is a tree data structure where each node has at most **two children**\n- **Full Binary Tree**: Every node has 0 or 2 children\n- **Complete Binary Tree**: All levels filled except possibly the last\n\n## Traversals\n\`\`\`cpp\nvoid inorder(Node* root) {\n    if (!root) return;\n    inorder(root->left);\n    cout << root->data << " ";\n    inorder(root->right);\n}\n\`\`\`\n\n## Time Complexities\n| Operation | Average | Worst |\n|-----------|---------|-------|\n| Search    | O(log n)| O(n)  |\n| Insert    | O(log n)| O(n)  |\n| Delete    | O(log n)| O(n)  |`,
    createdAt: daysAgo(14),
    updatedAt: daysAgo(3),
  },
  {
    id: 'note-2',
    subjectId: 'sub-3',
    title: 'React Hooks Cheatsheet',
    content: `# React Hooks\n\n## useState\n\`\`\`tsx\nconst [count, setCount] = useState(0);\n\`\`\`\n\n## useEffect\n\`\`\`tsx\nuseEffect(() => {\n  // runs on mount & when deps change\n  return () => { /* cleanup */ };\n}, [dependency]);\n\`\`\`\n\n## Custom Hooks\nExtract reusable logic into custom hooks prefixed with \`use\`.`,
    createdAt: daysAgo(10),
    updatedAt: daysAgo(5),
  },
];

// ---------- Pomodoro Sessions ----------
const pomodoroSessions: PomodoroSession[] = [
  { id: 'pomo-1', subjectId: 'sub-1', taskId: 'task-1', startedAt: new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate(), 10, 0).toISOString(), durationMinutes: 25, completed: true },
  { id: 'pomo-2', subjectId: 'sub-1', startedAt: new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate(), 10, 30).toISOString(), durationMinutes: 25, completed: true },
  { id: 'pomo-3', subjectId: 'sub-3', taskId: 'task-4', startedAt: new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() - 1, 14, 0).toISOString(), durationMinutes: 25, completed: true },
  { id: 'pomo-4', subjectId: 'sub-2', taskId: 'task-3', startedAt: new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() - 1, 15, 0).toISOString(), durationMinutes: 25, completed: true },
  { id: 'pomo-5', subjectId: 'sub-5', startedAt: new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() - 2, 9, 0).toISOString(), durationMinutes: 25, completed: true },
];

// ---------- Full seed state ----------
export const seedData: AppState = {
  user: {
    id: 'user-1',
    name: 'Alex Chen',
    email: 'alex.chen@university.edu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
    university: 'Stanford University',
    major: 'Computer Science & Engineering',
    semester: 'Semester 5 (Year 3)',
    googleLinked: true,
    googleEmail: 'alex.chen@gmail.com',
    spotifyLinked: false,
    spotifyUser: '',
    isAuthenticated: false,
    customPlaylists: [
      {
        id: 'cust-1',
        name: 'Deep Coding Flow',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DXdLEN7aqioXM',
        embedUri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXdLEN7aqioXM?utm_source=generator&theme=0',
        createdAt: daysAgo(10),
      },
      {
        id: 'cust-2',
        name: 'Late Night Library Session',
        url: 'https://open.spotify.com/playlist/37i9dQZF1DX8Uebhn9wzrS',
        embedUri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn9wzrS?utm_source=generator&theme=0',
        createdAt: daysAgo(5),
      }
    ],
    streak: 7,
    longestStreak: 14,
    lastLoginDate: toISO(TODAY),
    createdAt: daysAgo(60),
  },
  subjects,
  timetable,
  attendance: generateAttendance(),
  tasks,
  exams,
  resources,
  stickyNotes,
  notes,
  pomodoroSessions,
  pomodoroSettings: {
    focusMinutes: 25,
    breakMinutes: 5,
    longBreakMinutes: 15,
  },
  wallpaper: WALLPAPER_PRESETS[0], // Clean Minimal (No Wallpaper)
};
