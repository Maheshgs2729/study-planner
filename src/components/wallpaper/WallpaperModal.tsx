'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image as ImageIcon,
  Upload,
  Sliders,
  Check,
  X,
  Sparkles,
  Eye,
} from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { WALLPAPER_PRESETS, WallpaperConfig } from '@/types';

interface WallpaperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WallpaperModal({ isOpen, onClose }: WallpaperModalProps) {
  const { state, setWallpaper } = useApp();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [currentConfig, setCurrentConfig] = useState<WallpaperConfig>(
    state.wallpaper || WALLPAPER_PRESETS[1]
  );

  const handleSelectPreset = (preset: WallpaperConfig) => {
    const updated = {
      ...preset,
      blur: currentConfig.blur,
      opacity: currentConfig.opacity,
    };
    setCurrentConfig(updated);
    setWallpaper(updated);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const customConfig: WallpaperConfig = {
        id: `custom-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        url: dataUrl,
        blur: currentConfig.blur,
        opacity: currentConfig.opacity,
        isCustom: true,
      };
      setCurrentConfig(customConfig);
      setWallpaper(customConfig);
    };
    reader.readAsDataURL(file);
  };

  const handleBlurChange = (val: number) => {
    const updated = { ...currentConfig, blur: val };
    setCurrentConfig(updated);
    setWallpaper(updated);
  };

  const handleOpacityChange = (val: number) => {
    const updated = { ...currentConfig, opacity: val };
    setCurrentConfig(updated);
    setWallpaper(updated);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl max-h-[90vh] flex flex-col glass rounded-3xl border border-white/20 shadow-2xl overflow-hidden bg-white/95 dark:bg-gray-900/95"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-pink-500 flex items-center justify-center text-white shadow-md">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  Study Ambience & Wallpapers
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Select curated aesthetic themes or upload your own wallpaper
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
            {/* 1. Curated Presets Grid */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Curated Aesthetic Recommendations
                </label>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload From Gallery</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {WALLPAPER_PRESETS.map((preset) => {
                  const isSelected = currentConfig.url === preset.url;
                  return (
                    <motion.button
                      key={preset.id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSelectPreset(preset)}
                      className={`relative h-28 rounded-2xl overflow-hidden border-2 text-left transition-all ${
                        isSelected
                          ? 'border-primary ring-2 ring-primary/40 shadow-lg shadow-indigo-500/20'
                          : 'border-border/60 hover:border-border'
                      }`}
                    >
                      {preset.url ? (
                        <div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{ backgroundImage: `url(${preset.url})` }}
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs text-gray-400 font-semibold">
                          Minimalist
                        </div>
                      )}

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-2.5 flex flex-col justify-between">
                        <div className="self-end">
                          {isSelected && (
                            <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center shadow-xs">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>
                        <span className="text-[11px] font-bold text-white drop-shadow-sm truncate">
                          {preset.name}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* 2. Custom Uploaded Banner (if active) */}
            {currentConfig.isCustom && (
              <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl bg-cover bg-center border border-indigo-500/30"
                    style={{ backgroundImage: `url(${currentConfig.url})` }}
                  />
                  <div>
                    <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                      Custom Gallery Wallpaper: {currentConfig.name}
                    </span>
                    <p className="text-[10px] text-indigo-700 dark:text-indigo-400">
                      Uploaded from your device
                    </p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md bg-indigo-500 text-white text-[10px] font-bold">
                  Active
                </span>
              </div>
            )}

            {/* 3. Realtime Blur & Opacity Sliders */}
            <div className="p-4 rounded-2xl bg-gray-50/80 dark:bg-gray-800/50 border border-border space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-white">
                <Sliders className="w-4 h-4 text-primary" />
                <span>Fine-Tune Ambience & Focus Balance</span>
              </div>

              {/* Blur Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-gray-600 dark:text-gray-300">
                    Background Blur (Soft Focus)
                  </span>
                  <span className="font-bold text-primary">{currentConfig.blur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={currentConfig.blur}
                  onChange={(e) => handleBlurChange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>Sharp</span>
                  <span>Cozy Frost Blur</span>
                </div>
              </div>

              {/* Opacity Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-gray-600 dark:text-gray-300">
                    Brightness & Tint Intensity
                  </span>
                  <span className="font-bold text-primary">
                    {Math.round(currentConfig.opacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.6"
                  step="0.02"
                  value={currentConfig.opacity}
                  onChange={(e) => handleOpacityChange(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>Subtle Ambient</span>
                  <span>Vivid Artwork</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-gray-50/50 dark:bg-gray-800/30">
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> Changes apply in real-time
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:opacity-95 transition-opacity"
            >
              Apply & Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
