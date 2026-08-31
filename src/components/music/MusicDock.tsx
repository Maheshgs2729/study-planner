'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Music,
  Headphones,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronDown,
  Sparkles,
  CloudRain,
  Coffee,
  Waves,
  Radio,
  Activity,
  Plus,
  GripHorizontal,
} from 'lucide-react';

interface PlaylistOption {
  id: string;
  name: string;
  genre: string;
  embedUri: string;
  color: string;
}

const PRESET_PLAYLISTS: PlaylistOption[] = [
  {
    id: 'lofi',
    name: 'Lo-Fi Study Beats',
    genre: 'Chillhop / Instrumental',
    embedUri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX8Uebhn9wzrS?utm_source=generator&theme=0',
    color: 'from-amber-500 to-rose-500',
  },
  {
    id: 'deep-focus',
    name: 'Deep Focus Piano',
    genre: 'Modern Classical',
    embedUri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX4sWSpwq3LiO?utm_source=generator&theme=0',
    color: 'from-indigo-500 to-violet-600',
  },
  {
    id: 'synthwave',
    name: 'Synthwave Coding',
    genre: 'Electronic / Retrowave',
    embedUri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXdLEN7aqioXM?utm_source=generator&theme=0',
    color: 'from-fuchsia-500 to-cyan-500',
  },
  {
    id: 'binaural',
    name: 'Alpha Waves (40Hz Focus)',
    genre: 'Brainwave Entrainment',
    embedUri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX9uKNf5jGX6m?utm_source=generator&theme=0',
    color: 'from-teal-400 to-emerald-600',
  },
  {
    id: 'cafe-jazz',
    name: 'Late Night Study Jazz',
    genre: 'Acoustic / Soft Brass',
    embedUri: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX6ziVCJnEm59?utm_source=generator&theme=0',
    color: 'from-orange-500 to-amber-600',
  },
];

interface AmbientSound {
  id: string;
  name: string;
  icon: React.ElementType;
  volume: number; // 0 to 100
  isPlaying: boolean;
}

export default function MusicDock() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'spotify' | 'ambient'>('spotify');
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistOption>(PRESET_PLAYLISTS[0]);
  const [customUrl, setCustomUrl] = useState('');
  const [customEmbedUrl, setCustomEmbedUrl] = useState<string | null>(null);

  // Web Audio Ambient State
  const [isAmbientMasterPlaying, setIsAmbientMasterPlaying] = useState(false);
  const [ambientSounds, setAmbientSounds] = useState<AmbientSound[]>([
    { id: 'rain', name: 'Rainfall', icon: CloudRain, volume: 60, isPlaying: false },
    { id: 'cafe', name: 'Cozy Cafe', icon: Coffee, volume: 40, isPlaying: false },
    { id: 'stream', name: 'Gentle Waves', icon: Waves, volume: 50, isPlaying: false },
    { id: 'whitenoise', name: 'Brown Noise', icon: Radio, volume: 30, isPlaying: false },
    { id: 'binaural', name: '40Hz Tone', icon: Activity, volume: 25, isPlaying: false },
  ]);

  // Audio Context & Nodes refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const soundNodesRef = useRef<Record<string, { gainNode: GainNode; sourceNode?: AudioNode }>>({});
  const isDraggingRef = useRef(false);

  // Convert user Spotify URLs into embed URLs
  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;

    try {
      let embedUrl = customUrl.trim();
      if (embedUrl.includes('open.spotify.com')) {
        embedUrl = embedUrl.replace('open.spotify.com/', 'open.spotify.com/embed/');
        if (!embedUrl.includes('?')) {
          embedUrl += '?utm_source=generator&theme=0';
        }
      }
      setCustomEmbedUrl(embedUrl);
    } catch {
      // Fallback
    }
  };

  // Initialize Web Audio Synthesizers for Ambient Soundscapes
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

  // Web Audio Synth generator
  const startAmbientSynth = (soundId: string) => {
    const ctx = getAudioContext();
    if (soundNodesRef.current[soundId]) return;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.connect(ctx.destination);

    if (soundId === 'rain' || soundId === 'stream' || soundId === 'whitenoise') {
      // Noise Buffer generator
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (soundId === 'whitenoise') {
          // Brown noise
          output[i] = (lastOut + 0.02 * white) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5;
        } else if (soundId === 'rain') {
          // Pink/Rain filter
          output[i] = (lastOut + 0.05 * white) / 1.05;
          lastOut = output[i];
        } else {
          // Stream
          output[i] = white * 0.5;
        }
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter
      const filter = ctx.createBiquadFilter();
      filter.type = soundId === 'rain' ? 'lowpass' : soundId === 'stream' ? 'bandpass' : 'lowpass';
      filter.frequency.value = soundId === 'rain' ? 800 : soundId === 'stream' ? 500 : 400;

      whiteNoise.connect(filter);
      filter.connect(gainNode);
      whiteNoise.start();

      soundNodesRef.current[soundId] = { gainNode, sourceNode: whiteNoise };
    } else if (soundId === 'binaural') {
      // 40Hz Binaural Sine Oscillators (Left 200Hz, Right 240Hz)
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.connect(gainNode);
      osc.start();
      soundNodesRef.current[soundId] = { gainNode, sourceNode: osc };
    } else if (soundId === 'cafe') {
      // Warm Acoustic Ambient Tone
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(110, ctx.currentTime);
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 350;
      osc.connect(filter);
      filter.connect(gainNode);
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
      // Turn on first sound
      toggleSound('rain');
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const currentEmbed = customEmbedUrl || selectedPlaylist.embedUri;

  return (
    <motion.aside
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
      aria-label="Study Music and Ambient Audio Dock"
      className="fixed bottom-16 md:bottom-4 left-4 md:left-[260px] z-40 select-none cursor-grab active:cursor-grabbing"
    >
      <AnimatePresence>
        {isExpanded ? (
          /* Expanded Player Modal / Dock */
          <motion.div
            key="expanded-music-dock"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="w-[calc(100vw-2rem)] sm:w-[460px] glass rounded-3xl border border-white/20 shadow-2xl overflow-hidden bg-white/95 dark:bg-gray-900/95 flex flex-col max-h-[560px] cursor-default"
          >
            {/* Header (Drag handle) */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-gray-50/50 dark:bg-gray-800/40 cursor-grab active:cursor-grabbing">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-indigo-600 flex items-center justify-center text-white shadow-sm">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white leading-none">
                    Study Music & Soundscapes
                  </h3>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">
                    Spotify & Ambient Mixer • Drag anywhere
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {/* Mode Tabs */}
                <div className="flex items-center p-1 rounded-xl bg-gray-100 dark:bg-gray-800 border border-border">
                  <button
                    onClick={() => setActiveTab('spotify')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'spotify'
                        ? 'bg-primary text-white shadow-xs'
                        : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Spotify
                  </button>
                  <button
                    onClick={() => setActiveTab('ambient')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      activeTab === 'ambient'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    Ambient
                  </button>
                </div>

                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Tab 1: Spotify Embed & Playlists */}
            {activeTab === 'spotify' ? (
              <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar">
                {/* Spotify Iframe Player */}
                <div className="rounded-2xl overflow-hidden bg-black/90 shadow-inner border border-border/50">
                  <iframe
                    src={currentEmbed}
                    width="100%"
                    height="152"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="border-0 rounded-2xl"
                    title="Spotify Study Player"
                  />
                </div>

                {/* Preset Study Playlists */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                    Curated Study Streams
                  </label>
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
                          className={`p-2.5 rounded-xl text-left border transition-all flex items-center gap-2.5 ${
                            isSelected
                              ? 'bg-primary/10 border-primary shadow-xs'
                              : 'bg-gray-50 dark:bg-gray-800/60 border-border hover:border-gray-300 dark:hover:border-gray-700'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${p.color} flex items-center justify-center text-white flex-shrink-0 text-xs font-bold shadow-xs`}>
                            <Music className="w-3.5 h-3.5" />
                          </div>
                          <div className="truncate">
                            <div className="text-xs font-bold text-gray-900 dark:text-white truncate">
                              {p.name}
                            </div>
                            <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                              {p.genre}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Spotify URL Input */}
                <form onSubmit={handleApplyCustomUrl} className="pt-2 border-t border-border space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Embed Your Own Spotify Playlist / Track
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      placeholder="Paste Spotify Link (e.g. open.spotify.com/...)"
                      className="flex-1 px-3 py-2 text-xs rounded-xl bg-gray-50 dark:bg-gray-800 border border-border focus:ring-2 focus:ring-primary outline-none"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:opacity-95 transition-opacity flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Embed</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              /* Tab 2: Ambient Soundscape Generator */
              <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar">
                {/* Master Controller */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    <div>
                      <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300">
                        Multi-Track Ambient Mixer
                      </h4>
                      <p className="text-[10px] text-emerald-700 dark:text-emerald-400">
                        Layer custom soundscapes generated locally in your browser
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={toggleMasterAmbient}
                    className={`p-2 rounded-xl text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
                      isAmbientMasterPlaying ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    {isAmbientMasterPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    <span>{isAmbientMasterPlaying ? 'Pause All' : 'Play'}</span>
                  </button>
                </div>

                {/* Sound Sliders */}
                <div className="space-y-2.5">
                  {ambientSounds.map((sound) => {
                    const Icon = sound.icon;
                    return (
                      <div
                        key={sound.id}
                        className={`p-3 rounded-2xl border transition-all ${
                          sound.isPlaying
                            ? 'bg-white dark:bg-gray-800 border-emerald-500/40 shadow-xs'
                            : 'bg-gray-50/70 dark:bg-gray-800/40 border-border opacity-70 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleSound(sound.id)}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center text-white transition-all shadow-xs ${
                                sound.isPlaying ? 'bg-emerald-500' : 'bg-gray-400 dark:bg-gray-600'
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-bold text-gray-900 dark:text-white">
                              {sound.name}
                            </span>
                          </div>

                          <span className="text-[10px] font-bold text-gray-500">
                            {sound.isPlaying ? `${sound.volume}%` : 'Muted'}
                          </span>
                        </div>

                        {/* Slider */}
                        <div className="flex items-center gap-2">
                          <VolumeX className="w-3 h-3 text-gray-400" />
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={sound.volume}
                            disabled={!sound.isPlaying}
                            onChange={(e) => handleVolumeChange(sound.id, Number(e.target.value))}
                            className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-500 disabled:opacity-40"
                          />
                          <Volume2 className="w-3 h-3 text-gray-400" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          /* Collapsed Mini Pill */
          <motion.div
            key="collapsed-music-dock"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            whileHover={{ scale: 1.03 }}
            onClick={() => {
              if (isDraggingRef.current) return;
              setIsExpanded(true);
            }}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-full glass border border-white/25 shadow-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl group hover:border-primary/40 transition-colors cursor-grab active:cursor-grabbing"
            title="Drag to move • Click to open Study Music"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Headphones className="w-3.5 h-3.5 animate-pulse" />
            </div>

            <div className="flex flex-col leading-tight max-w-[140px] sm:max-w-[180px]">
              <span className="text-xs font-bold text-gray-900 dark:text-white truncate">
                {activeTab === 'spotify' ? selectedPlaylist.name : isAmbientMasterPlaying ? 'Ambient Soundscape Active' : 'Study Sounds'}
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Drag or click to play
              </span>
            </div>

            <GripHorizontal className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary transition-colors ml-0.5" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
