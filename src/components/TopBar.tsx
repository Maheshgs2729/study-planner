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
  const { state } = useApp();
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

          {/* Desktop Search Bar (Nur Alam Signature Pill) */}
          <div className="hidden md:flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search lectures, assignments, exams..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-full bg-surface-hover border border-border outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground transition-all"
              />
            </div>
          </div>

          {/* Right — Actions & Profile */}
          <div className="flex items-center gap-2.5">
            {/* Active Streak Badge */}
            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 shadow-xs"
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
                <Flame className="w-4 h-4 text-white fill-white" />
              </motion.div>
              <span className="text-xs font-black text-white">
                {state.user.streak}d Streak
              </span>
            </motion.div>

            {/* Wallpaper Ambience Trigger */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setIsWallpaperModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 text-xs font-bold transition-all"
              title="Change Ambience Wallpaper"
            >
              <ImageIcon className="w-3.5 h-3.5 text-white" />
              <span className="hidden sm:inline">Theme</span>
            </motion.button>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              className="p-2 rounded-full bg-surface-hover hover:bg-border text-muted hover:text-foreground transition-colors border border-border/60"
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
                  <Moon className="w-4 h-4 text-primary" />
                )}
              </motion.div>
            </motion.button>

            {/* User Profile Avatar Pill / Sign In Trigger */}
            {state.user.isAuthenticated ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-left transition-all cursor-pointer"
                title="Edit Profile & Settings"
              >
                <div className="relative">
                  {state.user.avatar ? (
                    <img
                      src={state.user.avatar}
                      alt={state.user.name}
                      className="w-8 h-8 rounded-full object-cover border border-zinc-700 shadow-sm"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-black text-xs shadow-sm">
                      {state.user.name.charAt(0)}
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-white border border-black" />
                </div>
                <div className="hidden lg:flex flex-col">
                  <span className="text-xs font-black text-white leading-none">
                    {state.user.name}
                  </span>
                  <span className="text-[9px] text-zinc-400 mt-0.5 font-medium truncate max-w-[110px]">
                    {state.user.university || state.user.email}
                  </span>
                </div>
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setIsAuthModalOpen(true)}
                className="px-4 py-1.5 rounded-full bg-white text-black font-black text-xs hover:bg-zinc-200 transition-all shadow-md cursor-pointer"
              >
                Sign In
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
