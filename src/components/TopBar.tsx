'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Sun, Moon, Image as ImageIcon, Search } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useApp } from '@/store/AppContext';
import BrandLogo from './BrandLogo';
import WallpaperModal from './wallpaper/WallpaperModal';

export default function TopBar() {
  const { theme, toggleTheme } = useTheme();
  const { state, setIsAuthModalOpen, setIsProfileModalOpen } = useApp();
  const [isWallpaperModalOpen, setIsWallpaperModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <>
      <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-xl border-b border-border transition-colors">
        <div className="flex items-center justify-between h-16 px-4 md:px-7">
          {/* Left — Brand Logo on mobile */}
          <div className="flex items-center gap-3 md:hidden">
            <BrandLogo size="sm" showText={true} />
          </div>

          {/* Desktop Search Bar (Apple / Notion Signature Search Pill) */}
          <div className="hidden md:flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lectures, assignments, exams..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-full bg-slate-100/80 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 outline-none focus:border-slate-900 dark:focus:border-white focus:bg-surface focus:ring-2 focus:ring-slate-900/10 dark:focus:ring-white/10 text-foreground transition-all"
              />
            </div>
          </div>

          {/* Right — Actions & Profile */}
          <div className="flex items-center gap-2.5">
            {/* Active Streak Badge */}
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs"
            >
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'loop',
                }}
              >
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              </motion.div>
              <span className="text-xs font-black text-slate-900 dark:text-white">
                {state.user.streak}d Streak
              </span>
            </motion.div>

            {/* Wallpaper Ambience Trigger */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsWallpaperModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-800 dark:text-white border border-slate-200 dark:border-zinc-700 text-xs font-bold transition-all cursor-pointer"
              title="Change Ambience Theme"
            >
              <ImageIcon className="w-3.5 h-3.5 opacity-70" />
              <span className="hidden sm:inline">Theme</span>
            </motion.button>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-foreground transition-colors border border-slate-200 dark:border-zinc-800 cursor-pointer"
              aria-label="Toggle theme"
            >
              <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-slate-800" />
                )}
              </motion.div>
            </motion.button>

            {/* User Profile Avatar Pill / Sign In Trigger */}
            {state.user.isAuthenticated ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 text-left transition-all cursor-pointer"
                title="Edit Profile & Settings"
              >
                <div className="relative">
                  {state.user.avatar ? (
                    <img
                      src={state.user.avatar}
                      alt={state.user.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-zinc-700 shadow-sm"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black flex items-center justify-center font-black text-xs shadow-sm">
                      {state.user.name.charAt(0)}
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border-2 border-white dark:border-black" />
                </div>
                <div className="hidden lg:flex flex-col">
                  <span className="text-xs font-black text-slate-900 dark:text-white leading-none">
                    {state.user.name}
                  </span>
                  <span className="text-[9px] text-slate-500 dark:text-zinc-400 mt-0.5 font-medium truncate max-w-[110px]">
                    {state.user.university || state.user.email}
                  </span>
                </div>
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 dark:bg-white text-white dark:text-black font-black text-xs hover:bg-slate-800 dark:hover:bg-zinc-200 transition-all shadow-md cursor-pointer"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
                <span>Sign In</span>
              </motion.button>
            )}
          </div>
        </div>
      </header>

      {/* Wallpaper Customizer Modal */}
      <WallpaperModal
        isOpen={isWallpaperModalOpen}
        onClose={() => setIsWallpaperModalOpen(false)}
      />
    </>
  );
}
