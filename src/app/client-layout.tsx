'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AppProvider } from '@/store/AppContext';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import WallpaperBackground from '@/components/wallpaper/WallpaperBackground';
import UnifiedFloatingDock from '@/components/dock/UnifiedFloatingDock';

export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AppProvider>
        {/* Dynamic Ambience Wallpaper Backdrop */}
        <WallpaperBackground />

        <div className="flex min-h-screen bg-background text-foreground selection:bg-primary selection:text-white">
          {/* Desktop Sidebar */}
          <Sidebar />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col md:ml-[260px] min-h-screen">
            <TopBar />
            
            <main className="flex-1 p-4 md:p-7 pb-20 md:pb-10 max-w-7xl w-full mx-auto">
              {children}
            </main>
          </div>

          {/* Single Unified Floating Control Island (Clean, Professional, Non-overlapping) */}
          <UnifiedFloatingDock />
        </div>
      </AppProvider>
    </ThemeProvider>
  );
}
