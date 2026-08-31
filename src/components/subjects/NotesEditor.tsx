'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/store/AppContext';
import { Note } from '@/types';
import dynamic from 'next/dynamic';
import { Plus, Trash2, FileText, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface NotesEditorProps {
  subjectId: string;
}

export default function NotesEditor({ subjectId }: NotesEditorProps) {
  const { getSubjectNotes, addNote, updateNoteContent, deleteNote } = useApp();
  const notes = getSubjectNotes(subjectId);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(
    notes.length > 0 ? notes[0].id : null
  );
  
  const selectedNote = notes.find((n) => n.id === selectedNoteId);
  const [content, setContent] = useState(selectedNote?.content || '');

  useEffect(() => {
    if (selectedNote) {
      setContent(selectedNote.content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNoteId, selectedNote?.content]);

  // Debounced auto-save
  useEffect(() => {
    if (!selectedNoteId) return;

    const handler = setTimeout(() => {
      if (selectedNote && selectedNote.content !== content) {
        updateNoteContent(selectedNoteId, selectedNote.title, content);
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [content, selectedNoteId, updateNoteContent, selectedNote]);

  const handleAddNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      subjectId,
      title: 'New Note',
      content: '# New Note\n\nStart typing here...',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    addNote(newNote);
    setSelectedNoteId(newNote.id);
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNote(id);
    if (selectedNoteId === id) {
      const remainingNotes = notes.filter((n) => n.id !== id);
      setSelectedNoteId(remainingNotes.length > 0 ? remainingNotes[0].id : null);
    }
  };

  return (
    <div className="flex h-full gap-4 relative">
      <div className="w-64 flex flex-col glass rounded-2xl overflow-hidden shadow-sm h-full">
        <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50 flex justify-between items-center">
          <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-indigo-500" /> Notes
          </h3>
          <button
            onClick={handleAddNote}
            className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <Plus className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <AnimatePresence>
            {notes.map((note) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onClick={() => setSelectedNoteId(note.id)}
                className={`p-3 rounded-xl cursor-pointer flex justify-between items-start group transition-all ${
                  selectedNoteId === note.id
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 shadow-sm border border-indigo-100 dark:border-indigo-800/30'
                    : 'hover:bg-gray-100/50 dark:hover:bg-gray-800/50 border border-transparent'
                }`}
              >
                <div className="overflow-hidden">
                  <h4 className={`text-sm font-medium truncate ${selectedNoteId === note.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'}`}>
                    {note.title || 'Untitled Note'}
                  </h4>
                  <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3" />
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={(e) => handleDeleteNote(note.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
          {notes.length === 0 && (
            <div className="p-4 text-center text-sm text-gray-500 mt-4">
              No notes yet. Click + to add one.
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 glass rounded-2xl overflow-hidden shadow-sm flex flex-col h-full bg-white/90 dark:bg-gray-900/90">
        {selectedNoteId ? (
          <div data-color-mode="light" className="h-full flex flex-col dark:hidden-md-editor-override">
            <style jsx global>{`
              [data-color-mode*='dark'], [data-color-mode*='dark'] body {
                --color-canvas-default: transparent !important;
              }
              html.dark .w-md-editor {
                background-color: transparent !important;
                color: #e5e7eb !important;
              }
              html.dark .w-md-editor-toolbar {
                background-color: rgba(31, 41, 55, 0.5) !important;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
              }
              .w-md-editor {
                height: 100% !important;
                border-radius: 1rem;
                border: none !important;
                box-shadow: none !important;
                background-color: transparent;
              }
            `}</style>
            <MDEditor
              value={content}
              onChange={(val) => setContent(val || '')}
              className="flex-1 rounded-none border-none shadow-none"
              preview="live"
              hideToolbar={false}
              visibleDragbar={false}
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 flex-col gap-4">
            <FileText className="w-12 h-12 opacity-20" />
            <p>Select a note to view or edit</p>
          </div>
        )}
      </div>
    </div>
  );
}
