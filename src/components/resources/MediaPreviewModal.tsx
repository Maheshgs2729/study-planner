'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  FileText,
  Image as ImageIcon,
  Music,
  Video,
  Download,
  ExternalLink,
  Maximize2,
  Minimize2,
  Printer,
  BookOpen,
  Tag,
  Sparkles,
} from 'lucide-react';
import { ResourceFile } from '@/types';

interface MediaPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource: ResourceFile | null;
}

// Reliable fallback sample PDF document for demo items
const SAMPLE_PDF_URL = 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf';

export default function MediaPreviewModal({
  isOpen,
  onClose,
  resource,
}: MediaPreviewModalProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pdfViewMode, setPdfViewMode] = useState<'embed' | 'study-reader'>('embed');

  if (!isOpen || !resource) return null;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const pdfSource = resource.dataUrl || SAMPLE_PDF_URL;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfSource;
    link.download = resource.fileName;
    link.target = '_blank';
    link.click();
  };

  const handlePrint = () => {
    const printWindow = window.open(pdfSource, '_blank');
    printWindow?.focus();
    printWindow?.print();
  };

  const handleOpenNewTab = () => {
    window.open(pdfSource, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative w-full flex flex-col rounded-[28px] border border-white/20 shadow-2xl overflow-hidden bg-white/95 dark:bg-gray-900/95 transition-all duration-300 ${
            isFullscreen
              ? 'fixed inset-2 sm:inset-4 max-w-none h-[calc(100vh-2rem)]'
              : 'max-w-5xl h-[88vh] max-h-[900px]'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border bg-gray-50/70 dark:bg-gray-800/50 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-xs">
                {resource.fileType === 'pdf' ? (
                  <FileText className="w-5 h-5 text-rose-500" />
                ) : resource.fileType === 'image' ? (
                  <ImageIcon className="w-5 h-5 text-teal-500" />
                ) : resource.fileType === 'audio' ? (
                  <Music className="w-5 h-5 text-indigo-500" />
                ) : (
                  <Video className="w-5 h-5 text-violet-500" />
                )}
              </div>

              <div className="truncate">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white leading-tight truncate max-w-xs sm:max-w-md">
                  {resource.title}
                </h3>
                <span className="text-[11px] text-gray-500 dark:text-gray-400 truncate block">
                  {resource.fileName} • {formatFileSize(resource.fileSize)}
                </span>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {resource.fileType === 'pdf' && (
                <>
                  {/* View Mode Toggle */}
                  <div className="hidden sm:flex items-center p-1 rounded-xl bg-gray-100 dark:bg-gray-800 border border-border text-xs font-semibold">
                    <button
                      onClick={() => setPdfViewMode('embed')}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        pdfViewMode === 'embed'
                          ? 'bg-primary text-white shadow-xs'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      PDF Viewer
                    </button>
                    <button
                      onClick={() => setPdfViewMode('study-reader')}
                      className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 ${
                        pdfViewMode === 'study-reader'
                          ? 'bg-primary text-white shadow-xs'
                          : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>Study Notes</span>
                    </button>
                  </div>

                  <button
                    onClick={handleOpenNewTab}
                    className="p-2 rounded-xl text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    title="Open PDF in New Browser Tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handlePrint}
                    className="p-2 rounded-xl text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    title="Print Document"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </>
              )}

              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold shadow-xs hover:opacity-95 transition-opacity"
                title="Download file"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download</span>
              </button>

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 rounded-xl text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden sm:inline-flex"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Media Content Body */}
          <div className="flex-1 overflow-hidden bg-slate-900/10 dark:bg-black/40 flex flex-col">
            {/* 1. PDF VIEWER */}
            {resource.fileType === 'pdf' && (
              <div className="w-full h-full flex flex-col">
                {pdfViewMode === 'embed' ? (
                  /* Native Embedded PDF Browser Reader */
                  <div className="w-full h-full relative bg-slate-800 flex flex-col">
                    <iframe
                      src={`${pdfSource}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
                      className="w-full h-full border-0 bg-white"
                      title={resource.title}
                    />
                  </div>
                ) : (
                  /* Structured In-App Study Reader Mode */
                  <div className="w-full h-full overflow-y-auto p-6 sm:p-8 space-y-6 bg-white dark:bg-gray-900 custom-scrollbar">
                    <div className="max-w-3xl mx-auto space-y-6">
                      <div className="p-6 rounded-[24px] pastel-purple border border-indigo-200/50 dark:border-indigo-800/30">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/80 dark:bg-gray-900/60 shadow-xs mb-2 inline-block">
                          Module Revision Summary
                        </span>
                        <h2 className="text-xl font-bold">{resource.title}</h2>
                        <p className="text-xs opacity-85 mt-1">
                          Lecture Notes & Formula Reference • File: {resource.fileName}
                        </p>
                      </div>

                      <div className="space-y-4 text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-sans">
                        <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-indigo-500" />
                          Key Lecture Concepts & Highlights
                        </h3>
                        <p>
                          This document contains fundamental theorem proofs, data structures definitions, time-complexity analysis, and examination practice problems.
                        </p>

                        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-border space-y-2 text-xs">
                          <span className="font-bold text-indigo-600 dark:text-cyan-400 uppercase tracking-wide">
                            Core Study Guidelines:
                          </span>
                          <ul className="list-disc list-inside space-y-1 text-gray-600 dark:text-gray-300">
                            <li>Review all definitions and edge cases before exam day.</li>
                            <li>Practice active recall with Leo AI (ask Leo for quiz questions on this PDF).</li>
                            <li>Solve the highlighted practice problems at the end of Chapter 3.</li>
                          </ul>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border flex items-center justify-between">
                        <button
                          onClick={() => setPdfViewMode('embed')}
                          className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:opacity-95"
                        >
                          Switch to Full PDF Document View
                        </button>
                        <button
                          onClick={handleOpenNewTab}
                          className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                        >
                          Open Raw PDF in New Tab <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. IMAGE LIGHTBOX */}
            {resource.fileType === 'image' && (
              <div className="w-full h-full p-4 flex items-center justify-center overflow-auto custom-scrollbar">
                <img
                  src={resource.dataUrl || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200'}
                  alt={resource.title}
                  className="max-h-full max-w-full object-contain rounded-2xl shadow-2xl border border-white/10"
                />
              </div>
            )}

            {/* 3. AUDIO PLAYER */}
            {resource.fileType === 'audio' && (
              <div className="w-full h-full p-8 flex flex-col items-center justify-center">
                <div className="w-full max-w-md p-8 glass rounded-[28px] border border-white/20 shadow-2xl text-center space-y-6 bg-white/95 dark:bg-gray-900/95">
                  <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-teal-500 to-indigo-600 text-white flex items-center justify-center shadow-lg">
                    <Music className="w-10 h-10" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-gray-900 dark:text-white">
                      {resource.title}
                    </h4>
                    <span className="text-xs text-gray-500">Audio Recording • {resource.fileName}</span>
                  </div>
                  <audio
                    controls
                    className="w-full"
                    src={resource.dataUrl || ''}
                  >
                    Your browser does not support audio playback.
                  </audio>
                </div>
              </div>
            )}

            {/* 4. VIDEO PLAYER */}
            {resource.fileType === 'video' && (
              <div className="w-full h-full p-4 flex items-center justify-center bg-black">
                <div className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
                  <video
                    controls
                    className="w-full h-full object-contain"
                    src={resource.dataUrl || ''}
                  >
                    Your browser does not support video playback.
                  </video>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {resource.tags && resource.tags.length > 0 && (
            <div className="px-6 py-2.5 border-t border-border bg-gray-50/70 dark:bg-gray-800/40 flex items-center justify-between flex-shrink-0 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-gray-400" />
                <div className="flex flex-wrap gap-1.5">
                  {resource.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-[11px] font-medium hidden sm:inline">
                Uploaded {new Date(resource.uploadedAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
