'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '@/store/AppContext';

interface GoogleJwtPayload {
  name?: string;
  email?: string;
  picture?: string;
}

export default function SignInBanner() {
  const { state, setIsAuthModalOpen, loginUser } = useApp();
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  const GOOGLE_CLIENT_ID =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    '790056986546-abino2ent03nr492k13474okrfdhdks1.apps.googleusercontent.com';

  useEffect(() => {
    setMounted(true);
    // Check if user previously dismissed for this session
    const isDismissed = sessionStorage.getItem('signin_banner_dismissed') === 'true';
    if (isDismissed) {
      setDismissed(true);
    }
  }, []);

  // Handle Google Token Callback
  const handleGoogleCallback = (response: { credential?: string }) => {
    try {
      if (!response.credential) return;
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const data: GoogleJwtPayload = JSON.parse(jsonPayload);

      loginUser({
        name: data.name || 'Google User',
        email: data.email || 'student@gmail.com',
        googleLinked: true,
        googleEmail: data.email,
        avatar: data.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=250&auto=format&fit=crop',
      });
      setDismissed(true);
    } catch (err) {
      console.error('Google One-Tap parse error:', err);
    }
  };

  // Automatically trigger Google One-Tap prompt on entering the website
  useEffect(() => {
    if (!mounted || state.user.isAuthenticated) return;

    const scriptId = 'google-jssdk';
    const initGsi = () => {
      if (typeof window !== 'undefined' && (window as unknown as { google?: { accounts?: { id?: { initialize: (cfg: object) => void; prompt: () => void } } } }).google?.accounts?.id) {
        const gAccounts = (window as unknown as { google: { accounts: { id: { initialize: (cfg: object) => void; prompt: () => void } } } }).google.accounts.id;
        gAccounts.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCallback,
          auto_select: false,
        });
        gAccounts.prompt();
      }
    };

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initGsi;
      document.body.appendChild(script);
    } else {
      initGsi();
    }
  }, [mounted, state.user.isAuthenticated]);

  if (!mounted || state.user.isAuthenticated || dismissed) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('signin_banner_dismissed', 'true');
  };

  const handleQuickGoogleSignIn = () => {
    if (typeof window !== 'undefined' && (window as unknown as { google?: { accounts?: { id?: { prompt: () => void } } } }).google?.accounts?.id) {
      try {
        (window as unknown as { google: { accounts: { id: { prompt: () => void } } } }).google.accounts.id.prompt();
        return;
      } catch (e) {
        console.warn('Google prompt fallback', e);
      }
    }
    // Fallback: Open Auth Modal
    setIsAuthModalOpen(true);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.98 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed top-3 left-4 right-4 md:left-auto md:right-8 md:max-w-xl z-50 pointer-events-auto"
      >
        <div className="p-4 sm:p-4.5 rounded-2xl bg-surface/95 backdrop-blur-xl border border-border shadow-2xl shadow-slate-900/10 dark:shadow-black flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          {/* Left Info */}
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-black flex items-center justify-center flex-shrink-0 font-bold shadow-xs">
              <Sparkles className="w-4 h-4 fill-current" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-xs font-black text-foreground">Welcome to Study Planner Pro!</h4>
                <span className="hidden sm:inline-flex items-center gap-1 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheck className="w-2.5 h-2.5" /> Sign-in available
                </span>
              </div>
              <p className="text-[11px] text-muted font-medium mt-0.5 leading-tight">
                Sign in with Google or your email to sync timetables, notes, and attendance.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
            {/* Google Quick Sign-In Button */}
            <button
              onClick={handleQuickGoogleSignIn}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-hover hover:bg-slate-200 dark:hover:bg-zinc-800 border border-border text-foreground text-xs font-bold transition-all shadow-2xs cursor-pointer"
              title="Sign in with Google"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Google</span>
            </button>

            {/* Email Sign In */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-black text-xs font-black hover:bg-slate-800 dark:hover:bg-zinc-200 transition-all shadow-xs cursor-pointer"
            >
              <span>Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="p-1.5 rounded-xl hover:bg-surface-hover text-muted hover:text-foreground transition-colors cursor-pointer"
              title="Explore as guest"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
