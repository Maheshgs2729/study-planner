'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, RefreshCw, Heart } from 'lucide-react';

interface StudyQuote {
  quote: string;
  author: string;
  tag: string;
}

const QUOTES: StudyQuote[] = [
  {
    quote: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi",
    tag: "Wisdom",
  },
  {
    quote: "It always seems impossible until it's done.",
    author: "Nelson Mandela",
    tag: "Perseverance",
  },
  {
    quote: "The expert in anything was once a beginner.",
    author: "Helen Hayes",
    tag: "Growth",
  },
  {
    quote: "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar",
    tag: "Motivation",
  },
  {
    quote: "Success is the sum of small efforts, repeated day in and day out.",
    author: "Robert Collier",
    tag: "Consistency",
  },
  {
    quote: "An investment in knowledge pays the best interest.",
    author: "Benjamin Franklin",
    tag: "Focus",
  },
  {
    quote: "The beautiful thing about learning is that no one can take it away from you.",
    author: "B.B. King",
    tag: "Inspiration",
  },
  {
    quote: "Don't count the days, make the days count.",
    author: "Muhammad Ali",
    tag: "Action",
  },
  {
    quote: "Simplicity is the prerequisite for reliability.",
    author: "Edsger W. Dijkstra",
    tag: "Engineering",
  },
  {
    quote: "The secret to getting ahead is getting started.",
    author: "Mark Twain",
    tag: "Discipline",
  },
  {
    quote: "Study while others are sleeping; work while others are loafing; prepare while others are playing.",
    author: "William Arthur Ward",
    tag: "Dedication",
  },
  {
    quote: "Small daily improvements over time lead to stunning results.",
    author: "Robin Sharma",
    tag: "Mastery",
  },
];

export default function DailyQuoteBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // Initialize with deterministic daily index
  useEffect(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    setCurrentIndex(dayOfYear % QUOTES.length);
  }, []);

  const handleNextQuote = () => {
    setIsLiked(false);
    setCurrentIndex((prev) => (prev + 1) % QUOTES.length);
  };

  const current = QUOTES[currentIndex];

  return (
    <aside aria-label="Daily Inspiration Quote" className="w-full max-w-5xl mx-auto my-6 px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass rounded-3xl p-4 sm:p-5 border border-white/20 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
      >
        {/* Accent Glow Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 opacity-80" />

        {/* Quote Content */}
        <div className="flex items-start gap-3.5 flex-1">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500/15 to-violet-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 border border-indigo-500/20">
            <Quote className="w-4 h-4" />
          </div>

          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-cyan-400 px-2 py-0.5 rounded-full bg-indigo-500/10 dark:bg-cyan-500/10 border border-indigo-500/20">
                Daily Motivation • {current.tag}
              </span>
            </div>

            <AnimatePresence mode="wait">
              <motion.p
                key={currentIndex}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 leading-relaxed italic"
              >
                &ldquo;{current.quote}&rdquo;
                <span className="not-italic font-bold text-gray-500 dark:text-gray-400 text-xs ml-2">
                  — {current.author}
                </span>
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 self-end sm:self-center">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2 rounded-xl transition-colors ${
              isLiked
                ? 'bg-rose-500/15 text-rose-500'
                : 'text-gray-400 hover:text-rose-500 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            title="Favorite Quote"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
          </motion.button>

          <motion.button
            whileHover={{ rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.3 }}
            onClick={handleNextQuote}
            className="p-2 rounded-xl text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Shuffle Quote"
          >
            <RefreshCw className="w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>
    </aside>
  );
}
