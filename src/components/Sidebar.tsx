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
      {/* Desktop Sidebar (100dvh) */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 260 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="hidden md:flex flex-col fixed left-0 top-0 h-[100dvh] max-h-[100dvh] z-40 bg-surface/90 backdrop-blur-xl border-r border-border shadow-xs transition-colors overflow-hidden"
      >
        {/* Brand Logo Header */}
        <div className="flex items-center px-5 h-16 border-b border-border overflow-hidden flex-shrink-0">
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
                  className={`flex items-center gap-3.5 px-3.5 py-3 rounded-2xl transition-all relative min-h-[44px] ${
                    isActive
                      ? 'text-white bg-slate-900 dark:bg-white dark:text-black font-extrabold shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-zinc-900'
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 flex-shrink-0 ${
                      isActive ? 'stroke-[2.5]' : 'opacity-70'
                    }`}
                  />
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
        <div className="p-3.5 border-t border-border flex-shrink-0">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full py-2.5 px-3 rounded-2xl hover:bg-surface-hover text-muted hover:text-foreground transition-colors flex items-center justify-center border border-border/60 min-h-[44px] cursor-pointer"
            title={collapsed ? 'Expand Menu' : 'Collapse Menu'}
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>
      </motion.aside>

      {/* Mobile Bottom Tab Bar (Locked Safe Area & 44px Touch Targets) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/95 dark:bg-black/95 backdrop-blur-xl border-t border-border shadow-lg max-w-[100vw] overflow-hidden pb-[env(safe-area-inset-bottom,0px)]">
        <div className="flex items-center justify-around h-16 px-1 w-full max-w-full">
          {navItems.slice(0, 5).map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className="flex-1 min-w-0">
                <motion.div
                  whileTap={{ scale: 0.92 }}
                  className={`flex flex-col items-center justify-center gap-1 py-1.5 min-h-[44px] w-full touch-manipulation cursor-pointer ${
                    isActive
                      ? 'text-slate-950 dark:text-white font-extrabold'
                      : 'text-slate-400 dark:text-zinc-500'
                  }`}
                >
                  <div className="relative flex items-center justify-center">
                    {isActive && (
                      <motion.div
                        layoutId="mobile-tab-active"
                        className="absolute -inset-1.5 rounded-xl bg-slate-100 dark:bg-white/10"
                        transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                      />
                    )}
                    <item.icon className="w-5 h-5 relative z-10 flex-shrink-0" />
                  </div>
                  <span className="text-[9px] font-bold truncate max-w-[64px] text-center leading-tight">
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
