'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Headphones,
  StickyNote as StickyIcon,
  Plus,
  X,
  Sparkles,
  GripHorizontal,
  Send,
  RefreshCw,
  User,
  Play,
  Pause,
  CloudRain,
  Coffee,
  Waves,
  Radio,
  Activity,
  Pin,
  Trash2,
  Timer,
  ClipboardList,
  GraduationCap,
  Calendar,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useApp } from '@/store/AppContext';
import { ChatMessage, StickyColor } from '@/types';

type ActivePanel = 'none' | 'leo' | 'music' | 'stickies' | 'actions';

const STICKY_COLORS: Record<StickyColor, { bg: string; text: string; border: string; dot: string }> = {
  yellow: { bg: 'bg-amber-100 dark:bg-amber-950/80', text: 'text-amber-950 dark:text-amber-100', border: 'border-amber-300 dark:border-amber-800', dot: 'bg-amber-400' },
  pink: { bg: 'bg-pink-100 dark:bg-pink-950/80', text: 'text-pink-950 dark:text-pink-100', border: 'border-pink-300 dark:border-pink-800', dot: 'bg-pink-400' },
  mint: { bg: 'bg-emerald-100 dark:bg-emerald-950/80', text: 'text-emerald-950 dark:text-emerald-100', border: 'border-emerald-300 dark:border-emerald-800', dot: 'bg-emerald-400' },
  blue: { bg: 'bg-sky-100 dark:bg-sky-950/80', text: 'text-sky-950 dark:text-sky-100', border: 'border-sky-300 dark:border-sky-800', dot: 'bg-sky-400' },
  purple: { bg: 'bg-purple-100 dark:bg-purple-950/80', text: 'text-purple-950 dark:text-purple-100', border: 'border-purple-300 dark:border-purple-800', dot: 'bg-purple-400' },
};

const PRESET_PLAYLISTS = [
  { id: 'lofi', name: 'Lo-Fi Study Beats', genre: 'Chillhop / Instrumental', embedUri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn9wzrS?utm_source=generator&theme=0', color: 'from-amber-500 to-rose-500' },
  { id: 'deep-focus', name: 'Deep Focus Piano', genre: 'Modern Classical', embedUri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO?utm_source=generator&theme=0', color: 'from-indigo-500 to-violet-600' },
  { id: 'synthwave', name: 'Synthwave Coding', genre: 'Electronic / Retrowave', embedUri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXdLEN7aqioXM?utm_source=generator&theme=0', color: 'from-fuchsia-500 to-cyan-500' },
  { id: 'binaural', name: 'Alpha Waves (40Hz Focus)', genre: 'Brainwave Entrainment', embedUri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX9uKNf5jGX6m?utm_source=generator&theme=0', color: 'from-teal-400 to-emerald-600' },
  { id: 'cafe-jazz', name: 'Late Night Study Jazz', genre: 'Acoustic / Soft Brass', embedUri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX6ziVCJnEm59?utm_source=generator&theme=0', color: 'from-orange-500 to-amber-600' },
];

const PRESET_PROMPTS = [
  '⚡ Explain AVL Tree rotations with a simple example',
  '🧠 What is Banker’s Algorithm for Deadlock Avoidance?',
  '📊 Give me 3 practice quiz questions on Database Normalization',
  '📐 How does Laplace Transform solve differential equations?',
  '🎯 Summarize my upcoming exams and give a revision plan',
];

export default function UnifiedFloatingDock() {
  const pathname = usePathname();
  const {
    state,
    addStickyNote,
    updateStickyNote,
    deleteStickyNote,
    addSpotifyPlaylist,
    setIsProfileModalOpen,
  } = useApp();

  const [activePanel, setActivePanel] = useState<ActivePanel>('none');
  const [quickSpotifyUrl, setQuickSpotifyUrl] = useState('');
  const [quickPlaylistName, setQuickPlaylistName] = useState('');
  const [showAddPlaylistForm, setShowAddPlaylistForm] = useState(false);
  const isDraggingRef = useRef(false);

  // Auto-close open panel on page navigation so inner tasks stay completely clean
  useEffect(() => {
    setActivePanel('none');
  }, [pathname]);

  // ---------- Leo AI State ----------
  const [leoInput, setLeoInput] = useState('');
  const [leoTyping, setLeoTyping] = useState(false);
  const leoEndRef = useRef<HTMLDivElement | null>(null);
  const [leoMessages, setLeoMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      role: 'assistant',
      content: `👋 Hi ${state.user.name.split(' ')[0]}! I'm **Leo**, your personal AI study copilot. Ask me any doubt, formula, or exam concept!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  useEffect(() => {
    if (activePanel === 'leo') {
      leoEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [leoMessages, activePanel]);

  const generateLeoResponse = (userPrompt: string): string => {
    const prompt = userPrompt.toLowerCase();
    if (prompt.includes('avl') || prompt.includes('tree') || prompt.includes('rotation') || prompt.includes('data structure')) {
      return `### 🌲 AVL Tree Rotations Explained by Leo\n\nAVL Trees maintain balance with a balance factor of \`-1, 0, or 1\` ($Height(Left) - Height(Right)$).\n\n1. **Single Right (LL) Rotation**: When a node is inserted in left subtree of left child.\n2. **Single Left (RR) Rotation**: When inserted in right subtree of right child.\n3. **Left-Right (LR) Double Rotation**: Left rotation on child, then right rotation on root.\n4. **Right-Left (RL) Double Rotation**: Right rotation on child, then left rotation on root.\n\n\`\`\`cpp\n// Time Complexity: O(1) for rotation, O(log N) for search/insert\nNode* rightRotate(Node* y) {\n    Node* x = y->left;\n    y->left = x->right;\n    x->right = y;\n    return x;\n}\n\`\`\`\n\n💡 *Leo's Tip:* For your upcoming exam, always calculate balance factors starting from bottom-up!`;
    }
    if (prompt.includes('deadlock') || prompt.includes('banker') || prompt.includes('operating system') || prompt.includes('concurrency')) {
      return `### 🔒 Deadlock & Banker’s Algorithm Summary\n\n**4 Necessary Coffman Conditions for Deadlock:**\n1. **Mutual Exclusion** (non-shareable resources)\n2. **Hold and Wait**\n3. **No Preemption**\n4. **Circular Wait**\n\n**Banker's Algorithm Safety Check:**\n- We check if $Need \\le Available$ for any process.\n- If safe, simulate execution and release: $Available = Available + Allocation$.\n- If all processes finish safely, state is **SAFE**!`;
    }
    if (prompt.includes('normal') || prompt.includes('database') || prompt.includes('sql') || prompt.includes('dbms')) {
      return `### 📊 Database Normalization Quick Quiz from Leo:\n\n**Question 1:** What anomaly does **2NF** remove?\n*(Answer: Partial Dependency — non-key attributes must depend on full primary key).* \n\n**Question 2:** What is the difference between 3NF and BCNF?\n*(Answer: In BCNF, for every functional dependency $X \\rightarrow Y$, $X$ must be a strict superkey).* \n\n**Question 3:** True or False: 1NF requires atomic attribute values.\n*(Answer: True).*`;
    }
    if (prompt.includes('laplace') || prompt.includes('math') || prompt.includes('fourier')) {
      return `### 📐 Laplace Transform Key Identities\n\nThe Laplace Transform converts time-domain $f(t)$ into complex frequency-domain $F(s)$:\n\n$$\\mathcal{L}\\{f(t)\\} = \\int_{0}^{\\infty} e^{-st} f(t) \\, dt$$\n\n**Standard Transforms:**\n- $\\mathcal{L}\\{1\\} = \\frac{1}{s}$\n- $\\mathcal{L}\\{t^n\\} = \\frac{n!}{s^{n+1}}$\n- $\\mathcal{L}\\{e^{at}\\} = \\frac{1}{s-a}$\n- $\\mathcal{L}\\{\\sin(at)\\} = \\frac{a}{s^2 + a^2}$`;
    }
    if (prompt.includes('exam') || prompt.includes('schedule') || prompt.includes('gpa') || prompt.includes('plan')) {
      const upcoming = state.exams.filter((e) => e.status === 'upcoming');
      const nextExam = upcoming[0];
      return `### 🎯 Leo's Exam Readiness Overview\n\nYou currently have **${upcoming.length} upcoming exams** scheduled:\n\n${upcoming
        .map((e) => `- 📅 **${e.title}** on **${e.date}** at **${e.time}** (${e.location || 'Campus Hall'})`)
        .join('\n')}\n\n🔥 **Next Priority:** ${nextExam ? `Study for **${nextExam.title}** scheduled for ${nextExam.date}!` : 'All caught up!'}`;
    }
    return `### 💡 Leo's Study Analysis\n\nRegarding **"${userPrompt}"**:\n1. **Core Concept**: Break this into fundamental definitions and edge cases.\n2. **Practical Application**: Relate this to your current semester courses (${state.subjects.map((s) => s.name).join(', ')}).\n3. **Quick Practice**: Try a 15-minute Pomodoro focus session on this topic!\n\nWhat specific part would you like me to clarify further?`;
  };

  const handleSendLeo = (textToSend?: string) => {
    const text = textToSend || leoInput;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setLeoMessages((prev) => [...prev, userMsg]);
    setLeoInput('');
    setLeoTyping(true);

    setTimeout(() => {
      const response = generateLeoResponse(text);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setLeoMessages((prev) => [...prev, aiMsg]);
      setLeoTyping(false);
    }, 600);
  };

  // ---------- Music State ----------
  const [musicTab, setMusicTab] = useState<'spotify' | 'ambient'>('spotify');
  const [selectedPlaylist, setSelectedPlaylist] = useState(PRESET_PLAYLISTS[0]);
  const [customEmbedUrl, setCustomEmbedUrl] = useState<string | null>(null);

  // Web Audio Ambient Synthesizer
  const [isAmbientMasterPlaying, setIsAmbientMasterPlaying] = useState(false);
  const [ambientSounds, setAmbientSounds] = useState([
    { id: 'rain', name: 'Rainfall', icon: CloudRain, volume: 60, isPlaying: false },
    { id: 'cafe', name: 'Cozy Cafe', icon: Coffee, volume: 40, isPlaying: false },
    { id: 'stream', name: 'Gentle Waves', icon: Waves, volume: 50, isPlaying: false },
    { id: 'whitenoise', name: 'Brown Noise', icon: Radio, volume: 30, isPlaying: false },
    { id: 'binaural', name: '40Hz Tone', icon: Activity, volume: 25, isPlaying: false },
  ]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundNodesRef = useRef<Record<string, { gainNode: GainNode; sourceNode?: AudioNode }>>({});

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const startAmbientSynth = (soundId: string) => {
    const ctx = getAudioContext();
    if (soundNodesRef.current[soundId]) return;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.connect(ctx.destination);

    if (soundId === 'rain' || soundId === 'stream' || soundId === 'whitenoise') {
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (soundId === 'whitenoise') {
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5;
        } else if (soundId === 'rain') {
          output[i] = (lastOut + 0.05 * white) / 1.05;
          lastOut = output[i];
        } else {
          output[i] = white * 0.5;
        }
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = soundId === 'rain' ? 'lowpass' : soundId === 'stream' ? 'bandpass' : 'lowpass';
      filter.frequency.value = soundId === 'rain' ? 800 : soundId === 'stream' ? 500 : 400;

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      whiteNoise.start();

      soundNodesRef.current[soundId] = { gainNode, sourceNode: whiteNoise };
    } else {
      const osc = ctx.createOscillator();
      osc.type = soundId === 'cafe' ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(soundId === 'cafe' ? 110 : 140, ctx.currentTime);
      osc.connect(gainNode);
      osc.start();
      soundNodesRef.current[soundId] = { gainNode, sourceNode: osc };
    }

    const sound = ambientSounds.find((s) => s.id === soundId);
    const targetVol = sound ? sound.volume / 100 : 0.5;
    gainNode.gain.linearRampToValueAtTime(targetVol, ctx.currentTime + 0.5);
  };

  const stopAmbientSynth = (soundId: string) => {
    const nodeData = soundNodesRef.current[soundId];
    if (nodeData && audioCtxRef.current) {
      nodeData.gainNode.gain.linearRampToValueAtTime(0.01, audioCtxRef.current.currentTime + 0.3);
      setTimeout(() => {
        if (nodeData.sourceNode && 'stop' in nodeData.sourceNode) {
          (nodeData.sourceNode as AudioScheduledSourceNode).stop();
        }
        delete soundNodesRef.current[soundId];
      }, 350);
    }
  };

  const toggleSound = (soundId: string) => {
    setAmbientSounds((prev) =>
      prev.map((s) => {
        if (s.id === soundId) {
          const nextState = !s.isPlaying;
          if (nextState) {
            startAmbientSynth(soundId);
            setIsAmbientMasterPlaying(true);
          } else {
            stopAmbientSynth(soundId);
          }
          return { ...s, isPlaying: nextState };
        }
        return s;
      })
    );
  };

  const handleVolumeChange = (soundId: string, newVolume: number) => {
    setAmbientSounds((prev) =>
      prev.map((s) => (s.id === soundId ? { ...s, volume: newVolume } : s))
    );
    const nodeData = soundNodesRef.current[soundId];
    if (nodeData && audioCtxRef.current) {
      nodeData.gainNode.gain.setValueAtTime(newVolume / 100, audioCtxRef.current.currentTime);
    }
  };

  const toggleMasterAmbient = () => {
    const nextMaster = !isAmbientMasterPlaying;
    setIsAmbientMasterPlaying(nextMaster);
    if (!nextMaster) {
      ambientSounds.forEach((s) => stopAmbientSynth(s.id));
      setAmbientSounds((prev) => prev.map((s) => ({ ...s, isPlaying: false })));
    } else {
      toggleSound('rain');
    }
  };

  // Clean up audio
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // ---------- Sticky Notes State ----------
  const [stickyColor, setStickyColor] = useState<StickyColor>('yellow');
  const [stickyText, setStickyText] = useState('');
  const [isAddingSticky, setIsAddingSticky] = useState(false);

  const handleCreateSticky = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stickyText.trim()) return;
    addStickyNote(stickyText.trim(), stickyColor);
    setStickyText('');
    setIsAddingSticky(false);
  };

  // Click Handler that ignores dragging
  const handleDockIconClick = (panel: ActivePanel) => {
    if (isDraggingRef.current) return;
    setActivePanel(activePanel === panel ? 'none' : panel);
  };

  const currentEmbed = customEmbedUrl || selectedPlaylist.embedUri;

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0.08}
      onDragStart={() => {
        isDraggingRef.current = true;
      }}
      onDragEnd={() => {
        setTimeout(() => {
          isDraggingRef.current = false;
        }, 120);
      }}
      whileDrag={{ scale: 1.02, cursor: 'grabbing' }}
      className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40 select-none cursor-grab active:cursor-grabbing flex flex-col items-end gap-3"
      aria-label="Smart Study Control Island"
    >
      {/* 1. EXPANDED PANEL (Only ONE open at any time) */}
      <AnimatePresence mode="wait">
        {activePanel === 'leo' && (
          <motion.div
            key="leo-panel"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 26 }}
            className="w-[calc(100vw-2.5rem)] sm:w-[420px] rounded-[28px] border border-border shadow-2xl overflow-hidden bg-surface/98 backdrop-blur-2xl flex flex-col h-[550px] max-h-[82vh] cursor-default"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-primary/10 cursor-grab active:cursor-grabbing">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-md">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-foreground flex items-center gap-1.5 leading-none">
                    Leo AI <Sparkles className="w-3.5 h-3.5 text-primary" />
                  </h3>
                  <span className="text-[10px] text-muted font-medium">
                    24/7 AI Study Copilot
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    setLeoMessages([
                      {
                        id: 'msg-1',
                        role: 'assistant',
                        content: `Chat reset! What topic or homework problem can I help you solve?`,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      },
                    ])
                  }
                  className="p-1.5 rounded-xl hover:bg-surface-hover text-muted hover:text-foreground transition-colors"
                  title="Clear Chat"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActivePanel('none')}
                  className="p-1.5 rounded-xl hover:bg-surface-hover text-muted hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar text-xs">
              {leoMessages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs ${
                        isUser ? 'bg-primary' : 'bg-gradient-to-br from-indigo-500 to-violet-600'
                      }`}
                    >
                      {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                        isUser
                          ? 'bg-primary text-white font-medium rounded-tr-xs shadow-xs'
                          : 'bg-surface-hover text-foreground border border-border rounded-tl-xs'
                      }`}
                    >
                      {msg.content}
                      <span className={`block text-[9px] mt-1 ${isUser ? 'text-white/70' : 'text-muted'}`}>
                        {msg.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {leoTyping && (
                <div className="flex items-center gap-2 text-xs text-muted">
                  <div className="w-6 h-6 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={leoEndRef} />
            </div>

            {/* Quick Chips */}
            <div className="px-4 py-2 border-t border-border/60 bg-surface-hover/50 overflow-x-auto flex gap-1.5 custom-scrollbar">
              {PRESET_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendLeo(prompt)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-surface border border-border hover:border-primary text-foreground hover:text-primary whitespace-nowrap transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendLeo();
              }}
              className="p-3 border-t border-border bg-surface flex items-center gap-2"
            >
              <input
                type="text"
                value={leoInput}
                onChange={(e) => setLeoInput(e.target.value)}
                placeholder="Ask Leo any study doubt or question..."
                className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-surface-hover border border-border focus:ring-2 focus:ring-primary outline-none text-foreground font-medium"
              />
              <button
                type="submit"
                disabled={!leoInput.trim() || leoTyping}
                className="p-2 rounded-xl bg-primary text-white shadow-md hover:opacity-90 disabled:opacity-40 transition-opacity"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}

        {/* 2. MUSIC & AMBIENT PANEL */}
        {activePanel === 'music' && (
          <motion.div
            key="music-panel"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 26 }}
            className="w-[calc(100vw-2.5rem)] sm:w-[440px] rounded-[28px] border border-border shadow-2xl overflow-hidden bg-surface/98 backdrop-blur-2xl flex flex-col max-h-[550px] cursor-default"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-primary/10 cursor-grab active:cursor-grabbing">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-md">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-foreground leading-none">
                    Study Beats & Ambience
                  </h3>
                  <span className="text-[10px] text-muted font-medium">
                    Spotify & Browser Audio Mixer
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <div className="flex items-center p-1 rounded-xl bg-surface border border-border">
                  <button
                    onClick={() => setMusicTab('spotify')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      musicTab === 'spotify' ? 'bg-primary text-white shadow-xs' : 'text-muted hover:text-foreground'
                    }`}
                  >
                    Spotify
                  </button>
                  <button
                    onClick={() => setMusicTab('ambient')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      musicTab === 'ambient' ? 'bg-emerald-600 text-white shadow-xs' : 'text-muted hover:text-foreground'
                    }`}
                  >
                    Ambient
                  </button>
                </div>
                <button
                  onClick={() => setActivePanel('none')}
                  className="p-1.5 rounded-xl hover:bg-surface-hover text-muted hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tab 1: Spotify */}
            {musicTab === 'spotify' ? (
              <div className="p-4 space-y-3.5 overflow-y-auto custom-scrollbar">
                {/* Spotify Account Status & Add Button Header */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[11px] font-bold text-foreground">
                      {state.user.spotifyLinked ? `Linked: @${state.user.spotifyUser || 'Spotify'}` : 'Spotify Web Player'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setShowAddPlaylistForm(!showAddPlaylistForm)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-900 hover:bg-slate-200 dark:hover:bg-zinc-800 text-foreground text-[10px] font-bold border border-border transition-colors cursor-pointer"
                    >
                      {showAddPlaylistForm ? 'Cancel' : '+ Add Playlist'}
                    </button>
                    <button
                      onClick={() => {
                        setActivePanel('none');
                        setIsProfileModalOpen(true);
                      }}
                      className="text-[10px] text-muted hover:text-foreground font-medium underline cursor-pointer"
                    >
                      Manage
                    </button>
                  </div>
                </div>

                {/* Quick Add Playlist Form */}
                {showAddPlaylistForm && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!quickSpotifyUrl.trim()) return;
                      addSpotifyPlaylist(quickPlaylistName.trim() || 'My Study Playlist', quickSpotifyUrl.trim());
                      let embed = quickSpotifyUrl.trim();
                      if (embed.includes('open.spotify.com') && !embed.includes('/embed/')) {
                        embed = embed.replace('open.spotify.com/', 'open.spotify.com/embed/');
                      }
                      if (!embed.includes('?')) embed += '?utm_source=generator&theme=0';
                      setCustomEmbedUrl(embed);
                      setQuickSpotifyUrl('');
                      setQuickPlaylistName('');
                      setShowAddPlaylistForm(false);
                    }}
                    className="p-3 rounded-2xl bg-surface-hover/70 border border-border space-y-2"
                  >
                    <div className="text-[11px] font-bold text-foreground">Add Custom Spotify Playlist / Album / Track</div>
                    <input
                      type="text"
                      value={quickPlaylistName}
                      onChange={(e) => setQuickPlaylistName(e.target.value)}
                      placeholder="Playlist Name (e.g. Deep Work)"
                      className="w-full px-3 py-1.5 rounded-xl bg-surface border border-border text-xs text-foreground placeholder:text-muted/60 outline-none focus:border-slate-900 dark:focus:border-white"
                    />
                    <input
                      type="text"
                      value={quickSpotifyUrl}
                      onChange={(e) => setQuickSpotifyUrl(e.target.value)}
                      placeholder="Paste Spotify Link (https://open.spotify.com/...)"
                      className="w-full px-3 py-1.5 rounded-xl bg-surface border border-border text-xs text-foreground placeholder:text-muted/60 outline-none focus:border-slate-900 dark:focus:border-white"
                    />
                    <button
                      type="submit"
                      disabled={!quickSpotifyUrl.trim()}
                      className="w-full py-1.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-black font-black text-xs hover:bg-slate-800 dark:hover:bg-zinc-200 disabled:opacity-40 transition-all cursor-pointer"
                    >
                      Play & Save to Profile
                    </button>
                  </form>
                )}

                {/* Spotify Interactive Web Player Embed */}
                <div className="rounded-2xl overflow-hidden bg-black shadow-inner border border-border">
                  <iframe
                    src={currentEmbed}
                    width="100%"
                    height="152"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="border-0 rounded-2xl"
                    title="Spotify Player"
                  />
                </div>

                {/* User's Custom Playlists (if any) */}
                {state.user.customPlaylists && state.user.customPlaylists.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted block">
                      Your Custom Playlists
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {state.user.customPlaylists.map((cp) => {
                        const isSelected = customEmbedUrl === cp.embedUri;
                        return (
                          <button
                            key={cp.id}
                            onClick={() => {
                              setCustomEmbedUrl(cp.embedUri);
                            }}
                            className={`p-2.5 rounded-xl text-left border transition-all flex items-center gap-2.5 cursor-pointer ${
                              isSelected
                                ? 'bg-slate-900 text-white dark:bg-white dark:text-black border-slate-900 dark:border-white font-bold shadow-xs'
                                : 'bg-surface-hover/70 border-border hover:border-slate-300 dark:hover:border-zinc-700 text-foreground'
                            }`}
                          >
                            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center flex-shrink-0 text-xs font-black shadow-2xs">
                              🎵
                            </div>
                            <div className="truncate">
                              <div className="text-xs font-bold truncate">{cp.name}</div>
                              <div className="text-[10px] text-muted truncate">Custom Linked</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Curated Study Playlists */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-muted block">
                    Curated Study Playlists
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {PRESET_PLAYLISTS.map((p) => {
                      const isSelected = selectedPlaylist.id === p.id && !customEmbedUrl;
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            setSelectedPlaylist(p);
                            setCustomEmbedUrl(null);
                          }}
                          className={`p-2.5 rounded-xl text-left border transition-all flex items-center gap-2.5 cursor-pointer ${
                            isSelected
                              ? 'bg-slate-900 text-white dark:bg-white dark:text-black border-slate-900 dark:border-white font-bold shadow-xs'
                              : 'bg-surface-hover/70 border-border hover:border-slate-300 dark:hover:border-zinc-700 text-foreground'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${p.color} flex items-center justify-center text-white flex-shrink-0 text-xs font-bold shadow-2xs`}>
                            <Headphones className="w-3.5 h-3.5" />
                          </div>
                          <div className="truncate">
                            <div className="text-xs font-bold truncate">{p.name}</div>
                            <div className="text-[10px] text-muted truncate">{p.genre}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              /* Tab 2: Ambient Mixer */
              <div className="p-4 space-y-3 overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <div>
                    <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                      Multi-Track Ambient Mixer
                    </h4>
                    <p className="text-[10px] text-emerald-700 dark:text-emerald-400">
                      Layer ambient soundscapes locally
                    </p>
                  </div>
                  <button
                    onClick={toggleMasterAmbient}
                    className={`px-3 py-1.5 rounded-xl text-white text-xs font-bold shadow-xs flex items-center gap-1.5 ${
                      isAmbientMasterPlaying ? 'bg-emerald-600' : 'bg-gray-600'
                    }`}
                  >
                    {isAmbientMasterPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isAmbientMasterPlaying ? 'Pause All' : 'Play'}</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {ambientSounds.map((sound) => {
                    const Icon = sound.icon;
                    return (
                      <div
                        key={sound.id}
                        className={`p-2.5 rounded-2xl border transition-all ${
                          sound.isPlaying ? 'bg-surface border-emerald-500/40 shadow-xs' : 'bg-surface-hover/60 border-border opacity-70'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleSound(sound.id)}
                              className={`w-6 h-6 rounded-lg flex items-center justify-center text-white transition-all ${
                                sound.isPlaying ? 'bg-emerald-500' : 'bg-gray-400'
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-bold text-foreground">{sound.name}</span>
                          </div>
                          <span className="text-[10px] font-bold text-muted">
                            {sound.isPlaying ? `${sound.volume}%` : 'Off'}
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={sound.volume}
                          disabled={!sound.isPlaying}
                          onChange={(e) => handleVolumeChange(sound.id, Number(e.target.value))}
                          className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 disabled:opacity-40"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* 3. STICKY NOTES PANEL */}
        {activePanel === 'stickies' && (
          <motion.div
            key="stickies-panel"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 26 }}
            className="w-[calc(100vw-2.5rem)] sm:w-[380px] rounded-[28px] border border-border shadow-2xl overflow-hidden bg-surface/98 backdrop-blur-2xl flex flex-col max-h-[500px] cursor-default"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-amber-500/10 cursor-grab active:cursor-grabbing">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-amber-400 text-amber-950 flex items-center justify-center shadow-xs">
                  <StickyIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-foreground leading-none">
                    Sticky Scratchpad
                  </h3>
                  <span className="text-[10px] text-muted">Quick Notes & Reminders</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsAddingSticky(!isAddingSticky)}
                  className="p-1.5 rounded-xl bg-amber-500/20 text-amber-700 dark:text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New</span>
                </button>
                <button
                  onClick={() => setActivePanel('none')}
                  className="p-1.5 rounded-xl hover:bg-surface-hover text-muted hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add Sticky Box */}
            <AnimatePresence>
              {isAddingSticky && (
                <motion.form
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  onSubmit={handleCreateSticky}
                  className="p-4 border-b border-border bg-surface-hover/50 space-y-2.5 overflow-hidden"
                >
                  <textarea
                    value={stickyText}
                    onChange={(e) => setStickyText(e.target.value)}
                    placeholder="Type quick thought, formula, or reminder..."
                    rows={2}
                    className="w-full p-2.5 text-xs rounded-xl bg-surface border border-border outline-none focus:ring-2 focus:ring-amber-400 resize-none font-sans"
                    autoFocus
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      {(Object.keys(STICKY_COLORS) as StickyColor[]).map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setStickyColor(c)}
                          className={`w-5 h-5 rounded-full ${STICKY_COLORS[c].dot} transition-transform ${
                            stickyColor === c ? 'scale-125 ring-2 ring-offset-1 ring-gray-600' : 'opacity-70 hover:opacity-100'
                          }`}
                        />
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingSticky(false)}
                        className="px-2 py-1 text-xs text-muted hover:text-foreground"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 rounded-lg bg-amber-500 text-amber-950 text-xs font-bold shadow-xs hover:bg-amber-400"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Notes List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {state.stickyNotes.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted font-medium">
                  No sticky notes yet. Click &quot;+ New&quot; to jot thoughts down!
                </div>
              ) : (
                state.stickyNotes.map((note) => {
                  const style = STICKY_COLORS[note.color] || STICKY_COLORS.yellow;
                  return (
                    <div
                      key={note.id}
                      className={`p-3.5 rounded-2xl border ${style.bg} ${style.border} ${style.text} shadow-xs relative group`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-black/30 dark:bg-white/30" />
                        <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => updateStickyNote({ ...note, pinned: !note.pinned })}
                            className={`p-1 rounded-md hover:bg-black/10 ${note.pinned ? 'font-bold text-amber-600' : ''}`}
                            title="Pin"
                          >
                            <Pin className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => deleteStickyNote(note.id)}
                            className="p-1 rounded-md hover:bg-black/10 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs whitespace-pre-wrap leading-relaxed font-medium">
                        {note.content}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}

        {/* 4. QUICK ACTIONS MENU */}
        {activePanel === 'actions' && (
          <motion.div
            key="actions-panel"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="rounded-2xl p-2 bg-surface/95 backdrop-blur-2xl border border-border shadow-2xl flex flex-col gap-1 min-w-[180px] cursor-default"
          >
            <Link
              href="/focus"
              onClick={() => setActivePanel('none')}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center">
                <Timer className="w-3.5 h-3.5" />
              </div>
              <span>Focus Timer</span>
            </Link>
            <Link
              href="/assignments"
              onClick={() => setActivePanel('none')}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-indigo-500/10 text-primary flex items-center justify-center">
                <ClipboardList className="w-3.5 h-3.5" />
              </div>
              <span>Assignments</span>
            </Link>
            <Link
              href="/exams"
              onClick={() => setActivePanel('none')}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <GraduationCap className="w-3.5 h-3.5" />
              </div>
              <span>Schedule Exam</span>
            </Link>
            <Link
              href="/calendar"
              onClick={() => setActivePanel('none')}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <span>Calendar</span>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. SINGLE UNIFIED SLIM FLOATING CONTROL DOCK */}
      <motion.div
        whileHover={{ scale: 1.03 }}
        className="flex items-center gap-1.5 p-1.5 rounded-full bg-surface/90 backdrop-blur-2xl border border-border shadow-xl transition-shadow hover:border-slate-300 dark:hover:border-zinc-700"
      >
        {/* Drag Grab Handle */}
        <div className="pl-2 pr-1 text-muted opacity-60 hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
          <GripHorizontal className="w-3.5 h-3.5" />
        </div>

        {/* 1. Leo AI Trigger */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => handleDockIconClick('leo')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black transition-all cursor-pointer ${
            activePanel === 'leo'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-md'
              : 'bg-surface-hover text-foreground hover:bg-slate-200 dark:hover:bg-zinc-800 border border-border'
          }`}
          title="Leo AI Copilot"
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Leo AI</span>
        </motion.button>

        {/* 2. Music Trigger */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => handleDockIconClick('music')}
          className={`p-2 rounded-full transition-all cursor-pointer ${
            activePanel === 'music'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-md'
              : 'text-muted hover:text-foreground hover:bg-surface-hover'
          }`}
          title="Study Music & Ambience"
        >
          <Headphones className="w-4 h-4" />
        </motion.button>

        {/* 3. Sticky Notes Trigger */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => handleDockIconClick('stickies')}
          className={`p-2 rounded-full transition-all cursor-pointer ${
            activePanel === 'stickies'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-md'
              : 'text-muted hover:text-foreground hover:bg-surface-hover'
          }`}
          title="Sticky Scratchpad"
        >
          <StickyIcon className="w-4 h-4" />
        </motion.button>

        {/* 4. Quick Actions (+) Trigger */}
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => handleDockIconClick('actions')}
          className={`p-2 rounded-full transition-all cursor-pointer ${
            activePanel === 'actions'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-black shadow-md rotate-45'
              : 'text-muted hover:text-foreground hover:bg-surface-hover'
          }`}
          title="Quick Actions (+)"
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
