'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Send,
  Sparkles,
  X,
  RefreshCw,
  User,
  GripHorizontal,
} from 'lucide-react';
import { useApp } from '@/store/AppContext';
import { ChatMessage } from '@/types';

const PRESET_PROMPTS = [
  '⚡ Explain AVL Tree rotations with a simple example',
  '🧠 What is Banker’s Algorithm for Deadlock Avoidance?',
  '📊 Give me 3 practice quiz questions on Database Normalization',
  '📐 How does Laplace Transform solve differential equations?',
  '🎯 Summarize my upcoming exams and give a revision plan',
];

export default function CopilotAgent() {
  const { state } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const isDraggingRef = useRef(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      role: 'assistant',
      content: `👋 Hi ${state.user.name.split(' ')[0]}! I'm **Leo**, your personal AI study buddy. Ask me any doubt, formula explanation, code debugging, or quick revision quiz. What are we learning today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // AI Response Generator
  const generateAIResponse = (userPrompt: string): string => {
    const prompt = userPrompt.toLowerCase();

    if (prompt.includes('avl') || prompt.includes('tree') || prompt.includes('rotation') || prompt.includes('data structure')) {
      return `### 🌲 AVL Tree Rotations Explained by Leo\n\nAVL Trees maintain balance with a balance factor of \`-1, 0, or 1\` ($Height(Left) - Height(Right)$).\n\n1. **Single Right (LL) Rotation**: When a node is inserted in the left subtree of the left child.\n2. **Single Left (RR) Rotation**: When inserted in the right subtree of the right child.\n3. **Left-Right (LR) Double Rotation**: Left rotation on child, then right rotation on root.\n4. **Right-Left (RL) Double Rotation**: Right rotation on child, then left rotation on root.\n\n\`\`\`cpp\n// Time Complexity: O(1) for rotation, O(log N) for search/insert\nNode* rightRotate(Node* y) {\n    Node* x = y->left;\n    y->left = x->right;\n    x->right = y;\n    return x;\n}\n\`\`\`\n\n💡 *Leo's Tip:* For your CS-301 Midterm, calculate balance factors starting from the inserted node upwards!`;
    }

    if (prompt.includes('deadlock') || prompt.includes('banker') || prompt.includes('operating system') || prompt.includes('concurrency')) {
      return `### 🔒 Deadlock & Banker’s Algorithm Summary\n\n**4 Necessary Coffman Conditions for Deadlock:**\n1. **Mutual Exclusion** (non-shareable resources)\n2. **Hold and Wait**\n3. **No Preemption**\n4. **Circular Wait**\n\n**Banker's Algorithm Safety Check:**\n- We check if $Need \\le Available$ for any process.\n- If safe, allocate resources, simulate process execution, and return resources to $Available = Available + Allocation$.\n- If all processes complete safely, the state is **SAFE**!`;
    }

    if (prompt.includes('normal') || prompt.includes('database') || prompt.includes('sql') || prompt.includes('dbms')) {
      return `### 📊 Database Normalization Quick Quiz from Leo:\n\n**Question 1:** What anomaly does **2NF** remove?\n*(Answer: Partial Dependency — all non-key attributes must depend on the full primary key).* \n\n**Question 2:** What is the difference between 3NF and BCNF?\n*(Answer: In BCNF, for every functional dependency $X \\rightarrow Y$, $X$ must be a strict superkey).* \n\n**Question 3:** True or False: 1NF requires atomic attribute values.\n*(Answer: True).*`;
    }

    if (prompt.includes('laplace') || prompt.includes('math') || prompt.includes('fourier')) {
      return `### 📐 Laplace Transform Key Identities\n\nThe Laplace Transform converts a time-domain function $f(t)$ into a complex frequency-domain function $F(s)$:\n\n$$\\mathcal{L}\\{f(t)\\} = \\int_{0}^{\\infty} e^{-st} f(t) \\, dt$$\n\n**Standard Transforms:**\n- $\\mathcal{L}\\{1\\} = \\frac{1}{s}$\n- $\\mathcal{L}\\{t^n\\} = \\frac{n!}{s^{n+1}}$\n- $\\mathcal{L}\\{e^{at}\\} = \\frac{1}{s-a}$\n- $\\mathcal{L}\\{\\sin(at)\\} = \\frac{a}{s^2 + a^2}$\n\nWould you like me to walk through solving a 2nd order differential equation with initial values?`;
    }

    if (prompt.includes('exam') || prompt.includes('schedule') || prompt.includes('gpa') || prompt.includes('plan')) {
      const upcoming = state.exams.filter((e) => e.status === 'upcoming');
      const nextExam = upcoming[0];
      return `### 🎯 Leo's Exam Readiness Overview\n\nYou currently have **${upcoming.length} upcoming exams** scheduled:\n\n${upcoming
        .map((e) => `- 📅 **${e.title}** on **${e.date}** at **${e.time}** (${e.location || 'Campus Hall'})`)
        .join('\n')}\n\n🔥 **Next Priority:** ${nextExam ? `Study for **${nextExam.title}** scheduled for ${nextExam.date}!` : 'All caught up!'} \n\nWould you like me to create a 3-day revision timetable?`;
    }

    return `### 💡 Leo's Study Analysis\n\nGreat question! Regarding **"${userPrompt}"**:\n\n1. **Core Concept**: Break this topic down into fundamental definitions, mathematical formulations, and edge cases.\n2. **Practical Application**: Link this directly to your current semester subjects (${state.subjects.map((s) => s.name).join(', ')}).\n3. **Active Practice**: Try solving 2 active recall questions or test yourself with a 15-minute Pomodoro focus session.\n\nIs there a specific homework problem or lecture note you'd like me to explain further?`;
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate realistic AI streaming delay
    setTimeout(() => {
      const responseContent = generateAIResponse(text);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: responseContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handlePillClick = () => {
    if (isDraggingRef.current) return;
    setIsOpen(true);
  };

  return (
    <motion.aside
      drag
      dragMomentum={false}
      dragElastic={0.08}
      onDragStart={() => {
        isDraggingRef.current = true;
      }}
      onDragEnd={() => {
        setTimeout(() => {
          isDraggingRef.current = false;
        }, 120);
      }}
      whileDrag={{ scale: 1.03, cursor: 'grabbing' }}
      aria-label="Leo AI Study Assistant"
      className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 select-none cursor-grab active:cursor-grabbing"
    >
      <AnimatePresence>
        {isOpen ? (
          /* Chat Window */
          <motion.div
            key="copilot-chat"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="w-[calc(100vw-2rem)] sm:w-[420px] rounded-[28px] border border-black/[0.08] dark:border-white/[0.12] shadow-2xl overflow-hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl flex flex-col h-[560px] max-h-[85vh] cursor-default"
          >
            {/* Header (Acts as primary drag handle) */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-gradient-to-r from-indigo-500/15 via-violet-500/15 to-cyan-500/15 cursor-grab active:cursor-grabbing">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-500 to-cyan-400 flex items-center justify-center text-white shadow-md">
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-gray-900" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1.5 leading-none">
                    Leo AI
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  </h3>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400">
                    24/7 AI Study Copilot • Drag to move
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    setMessages([
                      {
                        id: 'msg-1',
                        role: 'assistant',
                        content: `Chat reset! What topic or homework problem can I help you solve?`,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      },
                    ])
                  }
                  className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Clear Chat"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar text-xs">
              {messages.map((msg) => {
                const isUser = msg.role === 'user';
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs ${
                        isUser
                          ? 'bg-gradient-to-br from-indigo-500 to-violet-600'
                          : 'bg-gradient-to-br from-cyan-500 to-indigo-600'
                      }`}
                    >
                      {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>

                    <div
                      className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                        isUser
                          ? 'bg-primary text-white rounded-tr-xs shadow-sm font-medium'
                          : 'bg-gray-100 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 rounded-tl-xs border border-border/60'
                      }`}
                    >
                      {msg.content}
                      <span
                        className={`block text-[9px] mt-1.5 ${
                          isUser ? 'text-indigo-200' : 'text-gray-400'
                        }`}
                      >
                        {msg.timestamp}
                      </span>
                    </div>
                  </motion.div>
                );
              })}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <div className="w-6 h-6 rounded-xl bg-cyan-500/20 text-cyan-500 flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div className="px-4 py-2 border-t border-border/50 bg-gray-50/50 dark:bg-gray-800/20 overflow-x-auto flex gap-1.5 custom-scrollbar">
              {PRESET_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-white dark:bg-gray-800 border border-border hover:border-primary text-gray-700 dark:text-gray-300 hover:text-primary whitespace-nowrap transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 border-t border-border bg-white dark:bg-gray-900 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask Leo any doubt or homework question..."
                className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-gray-100 dark:bg-gray-800 border border-border focus:ring-2 focus:ring-primary outline-none text-gray-900 dark:text-white"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="p-2 rounded-xl bg-primary text-white shadow-md hover:opacity-90 disabled:opacity-40 transition-opacity"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        ) : (
          /* Minimized Floating Draggable Corner Avatar */
          <motion.div
            key="copilot-button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePillClick}
            className="flex items-center gap-2.5 pl-2.5 pr-3.5 py-2 rounded-full glass border border-cyan-400/40 shadow-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 text-white backdrop-blur-xl group hover:shadow-cyan-500/25 transition-all cursor-grab active:cursor-grabbing"
            title="Drag to move • Click to chat with Leo"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-black tracking-wide leading-tight flex items-center gap-1">
                Leo AI <Sparkles className="w-3 h-3 text-cyan-300" />
              </span>
              <span className="text-[9px] text-cyan-100 font-medium">
                Drag to move • Click to chat
              </span>
            </div>
            <GripHorizontal className="w-3 h-3 text-cyan-200/60 ml-0.5 group-hover:text-cyan-200 transition-colors" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
}
