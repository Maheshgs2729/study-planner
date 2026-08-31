'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Video, ExternalLink, X, Clock } from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { YOUTUBE_RECOMMENDATIONS } from '@/store/seed-data';
import { YouTubeVideo } from '@/types';

interface YouTubeVideoGridProps {
  selectedSubjectId?: string;
}

export default function YouTubeVideoGrid({ selectedSubjectId }: YouTubeVideoGridProps) {
  const { getSubject } = useApp();
  const [activeVideo, setActiveVideo] = useState<YouTubeVideo | null>(null);

  const videos = YOUTUBE_RECOMMENDATIONS.filter((v) =>
    selectedSubjectId ? v.subjectId === selectedSubjectId : true
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-red-500/15 text-red-600 dark:text-red-400 flex items-center justify-center">
            <Video className="w-4 h-4" />
          </div>
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            Recommended Subject Tutorials
          </h3>
        </div>
        <span className="text-xs text-gray-400 font-medium">Curated for your syllabus</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((vid) => {
          const sub = getSubject(vid.subjectId);
          return (
            <motion.div
              key={vid.id}
              whileHover={{ y: -3, scale: 1.02 }}
              className="glass rounded-3xl overflow-hidden border border-white/20 shadow-md flex flex-col group cursor-pointer"
              onClick={() => setActiveVideo(vid)}
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                <img
                  src={vid.thumbnailUrl}
                  alt={vid.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="w-11 h-11 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 ml-0.5" />
                  </div>
                </div>

                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/80 text-[10px] font-bold text-white flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" />
                  {vid.duration}
                </div>
              </div>

              {/* Info Box */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <span
                    className="px-2 py-0.5 rounded-md text-[10px] font-bold text-white mb-1.5 inline-block"
                    style={{ backgroundColor: sub?.color || '#6366f1' }}
                  >
                    {sub?.name || 'Tutorial'}
                  </span>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-snug line-clamp-2">
                    {vid.title}
                  </h4>
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-500 pt-2 border-t border-border/40">
                  <span className="font-semibold">{vid.channel}</span>
                  <span className="text-primary font-bold flex items-center gap-1 group-hover:underline">
                    Watch <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Embedded Player Modal */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveVideo(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl glass rounded-3xl border border-white/20 shadow-2xl overflow-hidden bg-black flex flex-col"
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800 bg-gray-900">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-bold text-white truncate max-w-md">
                    {activeVideo.title}
                  </span>
                </div>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="aspect-video w-full bg-black">
                <iframe
                  src={`${activeVideo.embedUrl}?autoplay=1`}
                  title={activeVideo.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
