'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/store/AppContext';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { Plus, Trash2, AlertCircle } from 'lucide-react';

interface KanbanBoardProps {
  subjectId: string;
}

const COLUMNS = [
  { id: 'todo', title: 'To-Do', status: 'todo' as const },
  { id: 'in-progress', title: 'In Progress', status: 'in-progress' as const },
  { id: 'submitted', title: 'Submitted', status: 'submitted' as const },
];

export default function KanbanBoard({ subjectId }: KanbanBoardProps) {
  const { getSubjectTasks, moveTask, addTask, deleteTask } = useApp();
  const tasks = getSubjectTasks(subjectId);
  const [isClient, setIsClient] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [successAnim, setSuccessAnim] = useState<string | null>(null);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'medium' as 'low' | 'medium' | 'high',
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = COLUMNS[Number(destination.droppableId)].status;
    
    moveTask(draggableId, newStatus);

    if (newStatus === 'submitted') {
      setSuccessAnim(draggableId);
      setTimeout(() => setSuccessAnim(null), 1500);
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    addTask({
      subjectId,
      title: newTask.title,
      description: newTask.description,
      status: 'todo',
      priority: newTask.priority,
      dueDate: new Date(newTask.dueDate).toISOString(),
    });

    setNewTask({
      title: '',
      description: '',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'medium',
    });
    setShowAddForm(false);
  };

  const getDueDateBadge = (dueDateString: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dueDateString);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: 'Overdue', className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800' };
    }
    if (diffDays === 0) {
      return { text: 'Due today', className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800' };
    }
    return { text: `Due in ${diffDays} day${diffDays > 1 ? 's' : ''}`, className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700' };
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (!isClient) return null;

  return (
    <div className="h-full">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 h-full items-start">
          {COLUMNS.map((col, index) => {
            const colTasks = tasks.filter((t) => t.status === col.status);
            
            return (
              <div key={col.id} className="flex-1 min-w-[300px] flex flex-col h-[calc(100vh-14rem)] bg-gray-50/50 dark:bg-gray-900/30 rounded-2xl p-4 border border-gray-200/50 dark:border-gray-800/50">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 px-2 flex justify-between items-center">
                  {col.title}
                  <span className="text-xs font-normal bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded-full text-gray-600 dark:text-gray-400">
                    {colTasks.length}
                  </span>
                </h3>
                
                <Droppable droppableId={index.toString()}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 overflow-y-auto space-y-3 p-1 transition-colors ${
                        snapshot.isDraggingOver ? 'bg-indigo-50/30 dark:bg-indigo-900/10 rounded-xl' : ''
                      }`}
                    >
                      {colTasks.map((task, idx) => (
                        <Draggable key={task.id} draggableId={task.id} index={idx}>
                          {(provided, snapshot) => {
                            const badge = getDueDateBadge(task.dueDate);
                            const isSuccess = successAnim === task.id;
                            
                            return (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...provided.draggableProps.style,
                                }}
                              >
                                <motion.div
                                  layoutId={`task-${task.id}`}
                                  whileHover={{ y: -2 }}
                                  className={`glass p-4 rounded-xl cursor-grab active:cursor-grabbing relative group ${
                                    snapshot.isDragging ? 'shadow-xl ring-2 ring-indigo-500/50 rotate-2 z-50' : 'shadow-sm'
                                  }`}
                                >
                                  {isSuccess && (
                                    <motion.div
                                      initial={{ scale: 0, opacity: 0 }}
                                      animate={{ scale: 1, opacity: 1 }}
                                      exit={{ scale: 0, opacity: 0 }}
                                      className="absolute inset-0 z-10 flex items-center justify-center bg-green-500/90 rounded-xl backdrop-blur-sm"
                                    >
                                      <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1.5 }}
                                        transition={{ type: 'spring', bounce: 0.5 }}
                                      >
                                        <AlertCircle className="w-8 h-8 text-white" />
                                      </motion.div>
                                    </motion.div>
                                  )}
                                  
                                  <div className="flex justify-between items-start mb-2">
                                    <div className="flex gap-2 items-center">
                                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                                      <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                                        {task.title}
                                      </h4>
                                    </div>
                                    <button
                                      onClick={() => deleteTask(task.id)}
                                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity p-1"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                  
                                  {task.description && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                                      {task.description}
                                    </p>
                                  )}
                                  
                                  <div className="flex items-center justify-between mt-3">
                                    <span className={`text-[10px] px-2 py-1 rounded-md border font-medium ${badge.className}`}>
                                      {badge.text}
                                    </span>
                                  </div>
                                </motion.div>
                              </div>
                            );
                          }}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                {col.id === 'todo' && (
                  <div className="mt-4">
                    {showAddForm ? (
                      <form onSubmit={handleAddTask} className="glass p-4 rounded-xl space-y-3">
                        <input
                          type="text"
                          placeholder="Task title"
                          className="w-full bg-transparent border-b border-gray-300 dark:border-gray-700 focus:border-indigo-500 outline-none text-sm py-1"
                          value={newTask.title}
                          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                          autoFocus
                        />
                        <textarea
                          placeholder="Description (optional)"
                          className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg focus:border-indigo-500 outline-none text-xs p-2 resize-none h-16"
                          value={newTask.description}
                          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        />
                        <div className="flex gap-2">
                          <input
                            type="date"
                            className="flex-1 bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg text-xs p-1 outline-none"
                            value={newTask.dueDate}
                            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                          />
                          <select
                            className="flex-1 bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg text-xs p-1 outline-none"
                            value={newTask.priority}
                            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'low' | 'medium' | 'high' })}
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setShowAddForm(false)}
                            className="flex-1 text-xs py-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={!newTask.title.trim()}
                            className="flex-1 text-xs py-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50"
                          >
                            Add
                          </button>
                        </div>
                      </form>
                    ) : (
                      <button
                        onClick={() => setShowAddForm(true)}
                        className="w-full py-3 flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl transition-colors border border-dashed border-gray-300 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-700"
                      >
                        <Plus className="w-4 h-4" /> Add Task
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
