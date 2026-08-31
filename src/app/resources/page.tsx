'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  FolderOpen,
  Upload,
  FileText,
  Image as ImageIcon,
  Music,
  Video,
  Eye,
  Trash2,
  Search,
} from 'lucide-react';
import PageTransition from '@/components/PageTransition';
import { useApp } from '@/store/AppContext';
import { ResourceFile, ResourceFileType } from '@/types';
import MediaPreviewModal from '@/components/resources/MediaPreviewModal';
import YouTubeVideoGrid from '@/components/resources/YouTubeVideoGrid';

export default function ResourcesPage() {
  const { state, addResource, deleteResource, getSubject } = useApp();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [activeTab, setActiveTab] = useState<'all' | ResourceFileType | 'youtube'>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewResource, setPreviewResource] = useState<ResourceFile | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Upload Form State
  const [uploadSubjectId] = useState(state.subjects[0]?.id || '');
  const [uploadTitle, setUploadTitle] = useState('');

  const filteredResources = state.resources.filter((res) => {
    if (activeTab !== 'all' && activeTab !== 'youtube' && res.fileType !== activeTab) return false;
    if (selectedSubject !== 'all' && res.subjectId !== selectedSubject) return false;
    if (searchQuery.trim() && !res.title.toLowerCase().includes(searchQuery.toLowerCase()) && !res.fileName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      let fType: ResourceFileType = 'doc';
      if (file.type.includes('pdf')) fType = 'pdf';
      else if (file.type.startsWith('image/')) fType = 'image';
      else if (file.type.startsWith('audio/')) fType = 'audio';
      else if (file.type.startsWith('video/')) fType = 'video';

      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        addResource({
          subjectId: uploadSubjectId || undefined,
          title: uploadTitle.trim() || file.name.replace(/\.[^/.]+$/, ''),
          fileType: fType,
          fileName: file.name,
          fileSize: file.size,
          dataUrl,
          tags: [fType, 'uploaded'],
        });
      };
      reader.readAsDataURL(file);
    });

    setUploadTitle('');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (type: ResourceFileType) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-500" />;
      case 'image':
        return <ImageIcon className="w-5 h-5 text-teal-500" />;
      case 'audio':
        return <Music className="w-5 h-5 text-indigo-500" />;
      case 'video':
        return <Video className="w-5 h-5 text-violet-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-2.5">
              Study Resources & Files
              <FolderOpen className="w-7 h-7 text-indigo-500" />
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Upload and organize PDFs, whiteboard photos, audio lectures, and video tutorials
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-opacity self-start sm:self-auto"
          >
            <Upload className="w-4 h-4" />
            <span>Upload File</span>
          </motion.button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf, image/*, audio/*, video/*, .doc, .docx"
            onChange={(e) => handleFilesSelected(e.target.files)}
            className="hidden"
          />
        </div>

        {/* Drag & Drop Upload Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            handleFilesSelected(e.dataTransfer.files);
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`glass rounded-3xl p-6 border-2 border-dashed text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-primary bg-primary/10 ring-4 ring-primary/20 scale-[1.01]'
              : 'border-border/80 hover:border-primary/50'
          }`}
        >
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              Drag & Drop PDF, Photos, Audio or Video files here
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Supports .pdf, .jpg, .png, .mp3, .mp4, and lecture recordings
            </p>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="glass p-4 rounded-3xl border border-white/20 shadow-md flex flex-wrap items-center justify-between gap-3">
          {/* File Type Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
            {(
              [
                { id: 'all', label: 'All Files' },
                { id: 'pdf', label: 'PDFs' },
                { id: 'image', label: 'Photos / Diagrams' },
                { id: 'audio', label: 'Audio Memos' },
                { id: 'video', label: 'Videos' },
                { id: 'youtube', label: 'YouTube Tutorials' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search & Subject */}
          <div className="flex items-center gap-2 flex-1 sm:flex-initial">
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search files..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-gray-100 dark:bg-gray-800 border border-border outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl bg-gray-100 dark:bg-gray-800 border border-border outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Subjects</option>
              {state.subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* YouTube Section if active */}
        {activeTab === 'youtube' ? (
          <YouTubeVideoGrid selectedSubjectId={selectedSubject !== 'all' ? selectedSubject : undefined} />
        ) : (
          /* File Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.length === 0 ? (
              <div className="col-span-full p-12 glass rounded-3xl text-center text-gray-500 dark:text-gray-400">
                No files found. Drag and drop files above to upload lecture slides, photos, or recordings.
              </div>
            ) : (
              filteredResources.map((res) => {
                const sub = getSubject(res.subjectId || '');
                return (
                  <motion.div
                    key={res.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-3xl p-4 sm:p-5 border border-white/20 shadow-md flex flex-col justify-between space-y-3 group hover:border-primary/40 transition-all"
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="px-2.5 py-0.5 rounded-md text-[10px] font-bold text-white shadow-xs"
                          style={{ backgroundColor: sub?.color || '#6366f1' }}
                        >
                          {sub?.name || 'General'}
                        </span>
                        <span className="text-[10px] font-semibold text-gray-400">
                          {formatFileSize(res.fileSize)}
                        </span>
                      </div>

                      {/* Title & Icon */}
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 flex-shrink-0">
                          {getFileIcon(res.fileType)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-gray-900 dark:text-white line-clamp-2 leading-snug">
                            {res.title}
                          </h4>
                          <span className="text-[10px] text-gray-400 truncate block mt-0.5">
                            {res.fileName}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-border/40 text-xs">
                      <span className="text-[10px] text-gray-400 capitalize">
                        {res.fileType} Document
                      </span>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setPreviewResource(res);
                            setIsPreviewOpen(true);
                          }}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-[11px] font-bold transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </button>
                        <button
                          onClick={() => deleteResource(res.id)}
                          className="p-1.5 rounded-xl text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                          title="Delete File"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        )}

        {/* Media Preview Modal */}
        <MediaPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => {
            setIsPreviewOpen(false);
            setPreviewResource(null);
          }}
          resource={previewResource}
        />
      </div>
    </PageTransition>
  );
}
