'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  ClipboardList,
  GraduationCap,
  FolderOpen,
  Timer,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import BrandLogo from './BrandLogo';

const navItems = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/subjects', label: 'Subjects', icon: BookOpen },
  { href: '/assignments', label: 'Tasks & Projects', icon: ClipboardList },
  { href: '/exams', label: 'Exams & Grades', icon: GraduationCap },
  { href: '/resources', label: 'Files & Media', icon: FolderOpen },
  { href: '/focus', label: 'Focus Mode', icon: Timer },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 260 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:flex flex-col fixed left-0 top-0 h-full z-40 bg-surface border-r border-border shadow-xs transition-colors"
      >
        {/* Brand Logo Header */}
        <div className="flex items-center px-5 h-16 border-b border-border overflow-hidden">
          <Link href="/" className="flex items-center">
            <BrandLogo size="sm" showText={!collapsed} />
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-5 px-3.5 space-y-1.5 overflow-y-auto custom-scrollbar">
          {!collapsed && (
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted px-3 mb-2 block">
              Menu
            </span>
          )}

          {navItems.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl transition-all relative ${
                    isActive
                      ? 'text-black font-black shadow-lg bg-white border border-white'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-black stroke-[2.5]' : 'text-zinc-400'}`} />
                  {!collapsed && (
                    <span className="whitespace-nowrap text-xs font-bold tracking-tight">
                      {item.label}
                    </span>
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="p-3.5 border-t border-border">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full py-2 px-3 rounded-2xl hover:bg-surface-hover text-muted hover:text-foreground transition-colors flex items-center justify-center border border-border/60"
            title={collapsed ? 'Expand Menu' : 'Collapse Menu'}
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Bottom Tab Bar (Pure Monochrome Style) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-t border-zinc-800">
        <div className="flex items-center justify-around h-16 px-2 overflow-x-auto">
          {navItems.slice(0, 5).map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className="flex-1">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`flex flex-col items-center gap-1 py-1 ${
                    isActive ? 'text-white font-bold' : 'text-zinc-500'
                  }`}
                >
                  <div className="relative">
                    {isActive && (
                      <motion.div
                        layoutId="mobile-tab-active"
                        className="absolute -inset-1.5 rounded-xl bg-white/10"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <item.icon className="w-5 h-5 relative z-10" />
                  </div>
                  <span className="text-[9px] font-bold truncate max-w-[60px]">
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </>
  );
}
