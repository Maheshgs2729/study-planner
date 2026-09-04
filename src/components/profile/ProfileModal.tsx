'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Mail,
  GraduationCap,
  BookOpen,
  Calendar,
  Check,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  LogOut,
} from 'lucide-react';
import { useApp } from '@/store/AppContext';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=250&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=250&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=250&auto=format&fit=crop',
];

export default function ProfileModal() {
  const {
    isProfileModalOpen,
    setIsProfileModalOpen,
    state,
    updateUserProfile,
    linkSpotify,
    addSpotifyPlaylist,
    removeSpotifyPlaylist,
    logoutUser,
    setIsAuthModalOpen,
  } = useApp();

  const { user } = state;
  const [activeTab, setActiveTab] = useState<'profile' | 'accounts' | 'spotify'>('profile');

  // Form State
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [university, setUniversity] = useState(user.university || '');
  const [major, setMajor] = useState(user.major || '');
  const [semester, setSemester] = useState(user.semester || '');
  const [avatar, setAvatar] = useState(user.avatar || AVATAR_PRESETS[0]);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');

  // Spotify input state
  const [spotifyUsername, setSpotifyUsername] = useState(user.spotifyUser || '');
  const [playlistName, setPlaylistName] = useState('');
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isProfileModalOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name: name.trim() || user.name,
      email: email.trim() || user.email,
      university: university.trim(),
      major: major.trim(),
      semester: semester.trim(),
      avatar: customAvatarUrl.trim() || avatar,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsProfileModalOpen(false);
    }, 600);
  };

  const handleLinkSpotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spotifyUsername.trim()) return;
    linkSpotify(spotifyUsername.trim());
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleAddPlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playlistUrl.trim()) return;
    addSpotifyPlaylist(playlistName.trim() || 'Study Playlist', playlistUrl.trim());
    setPlaylistName('');
    setPlaylistUrl('');
  };

  const handleLogout = () => {
    logoutUser();
    setIsProfileModalOpen(false);
    setIsAuthModalOpen(true);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="w-full max-w-2xl bg-surface border border-border rounded-[28px] overflow-hidden shadow-2xl relative text-foreground flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="p-6 border-b border-border flex items-center justify-between bg-surface-hover/50">
            <div className="flex items-center gap-3">
              <img
                src={avatar}
                alt={user.name}
                className="w-12 h-12 rounded-2xl object-cover border border-border shadow-xs"
              />
              <div>
                <h2 className="text-lg font-black text-foreground">{user.name}</h2>
                <span className="text-xs text-muted font-medium">{user.email}</span>
              </div>
            </div>

            <button
              onClick={() => setIsProfileModalOpen(false)}
              className="p-2 rounded-full bg-surface-hover hover:bg-border text-muted hover:text-foreground transition-colors border border-border cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex px-6 pt-3 border-b border-border bg-surface gap-4">
            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-3 text-xs font-bold transition-all relative cursor-pointer ${
                activeTab === 'profile' ? 'text-foreground' : 'text-muted hover:text-foreground'
              }`}
            >
              Profile Details
              {activeTab === 'profile' && (
                <motion.div layoutId="profileTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('accounts')}
              className={`pb-3 text-xs font-bold transition-all relative cursor-pointer ${
                activeTab === 'accounts' ? 'text-foreground' : 'text-muted hover:text-foreground'
              }`}
            >
              Linked Accounts
              {activeTab === 'accounts' && (
                <motion.div layoutId="profileTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('spotify')}
              className={`pb-3 text-xs font-bold transition-all relative cursor-pointer ${
                activeTab === 'spotify' ? 'text-foreground' : 'text-muted hover:text-foreground'
              }`}
            >
              Spotify Playlists ({user.customPlaylists?.length || 0})
              {activeTab === 'spotify' && (
                <motion.div layoutId="profileTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 dark:bg-white" />
              )}
            </button>
          </div>

          {/* Body Content */}
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
            {savedSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Profile details saved successfully!</span>
              </div>
            )}

            {/* TAB 1: Profile Details */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                {/* Avatar Presets */}
                <div>
                  <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-2">
                    Choose Profile Avatar
                  </label>
                  <div className="flex flex-wrap items-center gap-3">
                    {AVATAR_PRESETS.map((preset, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => { setAvatar(preset); setCustomAvatarUrl(''); }}
                        className={`w-12 h-12 rounded-2xl overflow-hidden border-2 transition-all cursor-pointer ${
                          avatar === preset && !customAvatarUrl
                            ? 'border-slate-900 dark:border-white scale-105 shadow-md'
                            : 'border-border opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={preset} alt="preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                  <div className="mt-2.5">
                    <input
                      type="text"
                      value={customAvatarUrl}
                      onChange={(e) => { setCustomAvatarUrl(e.target.value); setAvatar(e.target.value); }}
                      placeholder="Or paste custom image URL (https://...)"
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-hover border border-border focus:border-slate-900 dark:focus:border-white focus:bg-surface outline-none text-xs text-foreground placeholder:text-muted/60 font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-hover border border-border focus:border-slate-900 dark:focus:border-white focus:bg-surface outline-none text-xs text-foreground font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-hover border border-border focus:border-slate-900 dark:focus:border-white focus:bg-surface outline-none text-xs text-foreground font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1">
                      University / College
                    </label>
                    <div className="relative">
                      <GraduationCap className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                      <input
                        type="text"
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        placeholder="e.g. Stanford University"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-hover border border-border focus:border-slate-900 dark:focus:border-white focus:bg-surface outline-none text-xs text-foreground font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1">
                      Major / Department
                    </label>
                    <div className="relative">
                      <BookOpen className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                      <input
                        type="text"
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                        placeholder="e.g. Computer Science"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-hover border border-border focus:border-slate-900 dark:focus:border-white focus:bg-surface outline-none text-xs text-foreground font-medium"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-muted uppercase tracking-wider mb-1">
                      Semester / Academic Year
                    </label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                      <input
                        type="text"
                        value={semester}
                        onChange={(e) => setSemester(e.target.value)}
                        placeholder="e.g. Semester 5 (Fall 2026)"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-hover border border-border focus:border-slate-900 dark:focus:border-white focus:bg-surface outline-none text-xs text-foreground font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-hover hover:bg-border text-muted hover:text-foreground border border-border text-xs font-bold transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Switch Account / Sign Out</span>
                  </button>

                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-black font-black text-xs hover:bg-slate-800 dark:hover:bg-zinc-200 transition-all shadow-md cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: Linked Accounts */}
            {activeTab === 'accounts' && (
              <div className="space-y-4">
                {/* Google Account */}
                <div className="p-4 rounded-2xl bg-surface-hover/70 border border-border flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center shadow-xs">
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">Google Account</h4>
                      <p className="text-[11px] text-muted">
                        {user.googleLinked ? `Connected as ${user.googleEmail || user.email}` : 'Not connected'}
                      </p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-surface text-foreground border border-border shadow-2xs">
                    {user.googleLinked ? '✓ Connected' : 'Connect'}
                  </span>
                </div>

                {/* Spotify Account */}
                <div className="p-4 rounded-2xl bg-surface-hover/70 border border-border space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.308c-.215.354-.674.464-1.027.248-2.812-1.718-6.353-2.107-10.523-1.155-.403.092-.807-.162-.9-.566-.092-.403.163-.807.566-.9 4.568-1.044 8.483-.598 11.636 1.346.354.215.464.673.248 1.027zm1.47-3.268c-.27.44-.848.578-1.287.308-3.22-1.978-8.13-2.55-11.938-1.393-.493.15-1.02-.132-1.17-.625-.15-.494.133-1.02.626-1.17 4.356-1.322 9.776-.68 13.46 1.593.44.27.578.847.309 1.287zm.127-3.41c-3.86-2.292-10.228-2.504-13.91-1.386-.593.18-1.222-.16-1.402-.753-.18-.593.16-1.223.753-1.403 4.234-1.285 11.265-1.037 15.717 1.606.533.316.708 1.008.392 1.542-.317.533-1.008.708-1.55.394z"/>
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-foreground">Spotify Integration</h4>
                        <p className="text-[11px] text-muted">
                          {user.spotifyLinked ? `Linked as @${user.spotifyUser}` : 'Link your account for personalized playlists'}
                        </p>
                      </div>
                    </div>

                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-surface text-foreground border border-border shadow-2xs">
                      {user.spotifyLinked ? '✓ Linked' : 'Not Linked'}
                    </span>
                  </div>

                  <form onSubmit={handleLinkSpotify} className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={spotifyUsername}
                      onChange={(e) => setSpotifyUsername(e.target.value)}
                      placeholder="Enter Spotify Username or Profile link"
                      className="flex-1 px-3.5 py-2 rounded-xl bg-surface border border-border focus:border-slate-900 dark:focus:border-white outline-none text-xs text-foreground"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-black font-bold text-xs hover:bg-slate-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
                    >
                      Update Spotify
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 3: Custom Playlists */}
            {activeTab === 'spotify' && (
              <div className="space-y-4">
                {/* Add Playlist Form */}
                <form onSubmit={handleAddPlaylist} className="p-4 rounded-2xl bg-surface-hover/70 border border-border space-y-3">
                  <h4 className="text-xs font-bold text-foreground flex items-center gap-2">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Custom Spotify Playlist</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={playlistName}
                      onChange={(e) => setPlaylistName(e.target.value)}
                      placeholder="Playlist Title (e.g. Deep Math Focus)"
                      className="px-3.5 py-2 rounded-xl bg-surface border border-border focus:border-slate-900 dark:focus:border-white outline-none text-xs text-foreground"
                    />
                    <input
                      type="text"
                      value={playlistUrl}
                      onChange={(e) => setPlaylistUrl(e.target.value)}
                      placeholder="Spotify URL (https://open.spotify.com/playlist/...)"
                      className="px-3.5 py-2 rounded-xl bg-surface border border-border focus:border-slate-900 dark:focus:border-white outline-none text-xs text-foreground"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!playlistUrl.trim()}
                    className="w-full py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-black font-black text-xs hover:bg-slate-800 dark:hover:bg-zinc-200 disabled:opacity-40 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Save Playlist to In-App Player</span>
                  </button>
                </form>

                {/* Playlist List */}
                <div className="space-y-2.5">
                  <h4 className="text-[11px] font-bold text-muted uppercase tracking-wider">
                    Your Saved Playlists
                  </h4>
                  {!user.customPlaylists || user.customPlaylists.length === 0 ? (
                    <div className="p-6 text-center text-xs text-muted rounded-2xl bg-surface-hover/50 border border-border">
                      No custom playlists added yet. Paste a link above to add!
                    </div>
                  ) : (
                    user.customPlaylists.map((pl) => (
                      <div
                        key={pl.id}
                        className="p-3.5 rounded-xl bg-surface-hover/70 border border-border flex items-center justify-between shadow-2xs"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center border border-emerald-500/20 font-black text-xs">
                            🎵
                          </div>
                          <div>
                            <h5 className="text-xs font-bold text-foreground">{pl.name}</h5>
                            <a
                              href={pl.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-muted hover:text-foreground flex items-center gap-1 mt-0.5"
                            >
                              <span>View on Spotify</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>

                        <button
                          onClick={() => removeSpotifyPlaylist(pl.id)}
                          className="p-2 rounded-lg hover:bg-surface text-muted hover:text-rose-500 transition-colors cursor-pointer"
                          title="Remove playlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
