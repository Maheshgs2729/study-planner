'use client';

import { useApp } from '@/store/AppContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function WallpaperBackground() {
  const { state } = useApp();
  const { wallpaper } = state;

  if (!wallpaper || !wallpaper.url) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={wallpaper.url}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: wallpaper.opacity, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-300"
          style={{
            backgroundImage: `url(${wallpaper.url})`,
            filter: `blur(${wallpaper.blur}px)`,
            transform: 'scale(1.05)', // Prevent blur edge cutoff
          }}
        />
      </AnimatePresence>

      {/* Gradient vignette for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background/90" />
    </div>
  );
}
