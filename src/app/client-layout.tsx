'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AppProvider } from '@/store/AppContext';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import WallpaperBackground from '@/components/wallpaper/WallpaperBackground';
import UnifiedFloatingDock from '@/components/dock/UnifiedFloatingDock';
import AuthModal from '@/components/auth/AuthModal';
import ProfileModal from '@/components/profile/ProfileModal';
import SignInBanner from '@/components/auth/SignInBanner';

export function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AppProvider>
        {/* Dynamic Ambience Wallpaper Backdrop */}
        <WallpaperBackground />

        {/* Entrance Sign-In & Google One-Tap Notification */}
        <SignInBanner />

        {/* Root Layout Container with Safe Area & 100dvh Lock */}
        <div className="flex min-h-[100dvh] h-[100dvh] w-full max-w-[100vw] overflow-x-hidden bg-background text-foreground selection:bg-white selection:text-black">
          {/* Desktop Sidebar (Fixed Left) */}
          <Sidebar />

          {/* Main App Viewport & Scroll Container */}
          <div className="flex-1 flex flex-col md:ml-[260px] h-[100dvh] max-h-[100dvh] w-full max-w-full overflow-x-hidden overflow-y-auto custom-scrollbar">
            {/* Top Navigation Bar with Safe Area Inset */}
            <TopBar />
            
            {/* Scrollable Main Content with Ergonomic Bottom Padding */}
            <main className="flex-1 p-3.5 sm:p-5 md:p-7 pb-[calc(env(safe-area-inset-bottom,0px)+6.5rem)] md:pb-12 max-w-7xl w-full mx-auto overflow-x-hidden">
              {children}
            </main>
          </div>

          {/* Single Unified Floating Control Island */}
          <UnifiedFloatingDock />

          {/* Centered Auth & Profile Modals */}
          <AuthModal />
          <ProfileModal />
        </div>
      </AppProvider>
    </ThemeProvider>
  );
}
