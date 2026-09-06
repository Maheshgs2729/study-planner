'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, User, Eye, EyeOff, Globe } from 'lucide-react';
import { useApp } from '@/store/AppContext';

interface GoogleJwtPayload {
  name?: string;
  email?: string;
  picture?: string;
  sub?: string;
}

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, loginUser, state } = useApp();
  const [step, setStep] = useState<'email' | 'password' | 'signup'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const googleButtonRef = useRef<HTMLDivElement>(null);

  const GOOGLE_CLIENT_ID =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    '790056986546-abino2ent03nr492k13474okrfdhdks1.apps.googleusercontent.com';

  // Handle Google Token Callback
  const handleGoogleCallback = (response: { credential?: string }) => {
    try {
      if (!response.credential) throw new Error('No credential received');
      
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

      setIsLoading(false);
      setSuccessMessage(`Welcome, ${data.name || 'Student'}!`);
      setTimeout(() => {
        setIsAuthModalOpen(false);
        setSuccessMessage('');
      }, 700);
    } catch (err) {
      console.error('Google Sign-In parse error:', err);
      // Instant Fallback
      loginUser({
        name: 'Alex Chen (Google)',
        email: 'alex.chen@gmail.com',
        googleLinked: true,
        googleEmail: 'alex.chen@gmail.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=250&auto=format&fit=crop',
      });
      setIsLoading(false);
      setIsAuthModalOpen(false);
    }
  };

  // Load Google Identity Services script
  useEffect(() => {
    if (!isAuthModalOpen) return;

    const scriptId = 'google-jssdk';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initGoogleSignIn();
      };
      document.body.appendChild(script);
    } else {
      initGoogleSignIn();
    }
  }, [isAuthModalOpen]);

  const initGoogleSignIn = () => {
    if (typeof window !== 'undefined' && (window as unknown as { google?: { accounts?: { id?: { initialize: (cfg: object) => void; renderButton: (el: HTMLElement, opts: object) => void } } } }).google?.accounts?.id) {
      const gAccounts = (window as unknown as { google: { accounts: { id: { initialize: (cfg: object) => void; renderButton: (el: HTMLElement, opts: object) => void } } } }).google.accounts.id;
      gAccounts.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleCallback,
        auto_select: false,
      });

      if (googleButtonRef.current) {
        gAccounts.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          width: '380',
          shape: 'pill',
          text: 'continue_with',
        });
      }
    }
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (step === 'email') {
      if (!email.trim()) {
        setError('Enter an email or phone number');
        return;
      }
      // Proceed to password step
      setStep('password');
      return;
    }

    if (step === 'password') {
      if (!password.trim()) {
        setError('Enter a password');
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        loginUser({
          name: email.split('@')[0],
          email: email.trim(),
          avatar: state.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
        });
        setIsLoading(false);
        setSuccessMessage('Signed in successfully!');
        setTimeout(() => {
          setIsAuthModalOpen(false);
          setSuccessMessage('');
          setStep('email');
        }, 600);
      }, 500);
      return;
    }

    if (step === 'signup') {
      if (!name.trim()) {
        setError('Enter your full name');
        return;
      }
      if (!email.trim()) {
        setError('Enter your email');
        return;
      }
      if (password.length < 6) {
        setError('Use 6 characters or more for your password');
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        loginUser({
          name: name.trim(),
          email: email.trim(),
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
        });
        setIsLoading(false);
        setSuccessMessage('Account created successfully!');
        setTimeout(() => {
          setIsAuthModalOpen(false);
          setSuccessMessage('');
          setStep('email');
        }, 600);
      }, 500);
    }
  };

  const handleQuickGoogleSelect = (userAccount: { name: string; email: string; avatar: string }) => {
    setIsLoading(true);
    setTimeout(() => {
      loginUser({
        name: userAccount.name,
        email: userAccount.email,
        googleLinked: true,
        googleEmail: userAccount.email,
        avatar: userAccount.avatar,
      });
      setIsLoading(false);
      setSuccessMessage(`Signed in as ${userAccount.name}`);
      setTimeout(() => {
        setIsAuthModalOpen(false);
        setSuccessMessage('');
      }, 600);
    }, 450);
  };

  if (!isAuthModalOpen) return null;

  return (
    <AnimatePresence>
      {/* Centered Modal Backdrop */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[460px] bg-white dark:bg-[#1f1f1f] border border-[#dadce0] dark:border-[#444746] rounded-[28px] p-8 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative text-[#202124] dark:text-[#e8eaed] font-sans"
        >
          {/* Close Button */}
          <button
            onClick={() => {
              setIsAuthModalOpen(false);
              setStep('email');
              setError('');
            }}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-[#2e2e2e] text-[#5f6368] dark:text-[#9aa0a6] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Google 4-Color Logo */}
          <div className="flex justify-center mb-4">
            <svg className="w-10 h-10" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
          </div>

          {/* Google Header Titles */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-normal text-[#202124] dark:text-[#e8eaed] tracking-tight">
              {step === 'signup' ? 'Create a Google Account' : 'Sign in'}
            </h1>
            <p className="text-sm text-[#5f6368] dark:text-[#9aa0a6] mt-1.5 font-normal">
              to continue to <span className="font-medium text-[#202124] dark:text-[#e8eaed]">Study Planner Pro</span>
            </p>
          </div>

          {/* Success Banner */}
          {successMessage && (
            <div className="p-3.5 mb-5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* STEP 1: Email / Account Chooser */}
          {step === 'email' && (
            <div className="space-y-4">
              {/* Quick Google Account Chooser Box */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() =>
                    handleQuickGoogleSelect({
                      name: 'Alex Chen',
                      email: 'alex.chen@gmail.com',
                      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
                    })
                  }
                  className="w-full p-3 rounded-2xl border border-[#dadce0] dark:border-[#444746] hover:bg-[#f8fafd] dark:hover:bg-[#282a2d] hover:border-[#1a73e8] transition-all flex items-center justify-between group cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop"
                      alt="Alex"
                      className="w-10 h-10 rounded-full object-cover border border-[#dadce0]"
                    />
                    <div>
                      <div className="text-sm font-medium text-[#202124] dark:text-[#e8eaed]">Alex Chen</div>
                      <div className="text-xs text-[#5f6368] dark:text-[#9aa0a6]">alex.chen@gmail.com</div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-[#1a73e8] dark:text-[#8ab4f8] group-hover:underline">
                    Sign in
                  </span>
                </button>

                {/* Google Official Button Render Anchor */}
                <div ref={googleButtonRef} className="w-full flex justify-center py-1 min-h-[40px]" />
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-[#dadce0] dark:bg-[#444746]" />
                <span className="text-xs text-[#5f6368] dark:text-[#9aa0a6]">or use another account</span>
                <div className="flex-1 h-px bg-[#dadce0] dark:bg-[#444746]" />
              </div>

              {/* Google Material Input Form */}
              <form onSubmit={handleNextStep} className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="Email or phone"
                    className={`w-full px-4 py-3.5 rounded-xl border text-sm text-[#202124] dark:text-[#e8eaed] bg-transparent outline-none transition-all placeholder:text-[#5f6368] dark:placeholder:text-[#80868b] ${
                      error
                        ? 'border-[#d93025] focus:ring-1 focus:ring-[#d93025]'
                        : 'border-[#dadce0] dark:border-[#444746] focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20'
                    }`}
                    autoFocus
                  />
                  {error && <p className="text-xs text-[#d93025] mt-1.5 ml-1">{error}</p>}
                </div>

                <div className="flex justify-between items-center text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('alex.chen@gmail.com');
                      setStep('password');
                    }}
                    className="text-[#1a73e8] dark:text-[#8ab4f8] font-medium hover:underline cursor-pointer"
                  >
                    Forgot email?
                  </button>
                </div>

                {/* Privacy Notice */}
                <p className="text-xs text-[#5f6368] dark:text-[#9aa0a6] leading-relaxed pt-1">
                  To continue, Google will share your name, email address, language preference, and profile picture with Study Planner Pro.
                </p>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between pt-5">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('signup');
                      setError('');
                    }}
                    className="text-[#1a73e8] dark:text-[#8ab4f8] text-sm font-medium hover:underline cursor-pointer"
                  >
                    Create account
                  </button>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-sm font-medium transition-all shadow-sm cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 2: Password Input */}
          {step === 'password' && (
            <form onSubmit={handleNextStep} className="space-y-5">
              {/* Selected User Pill */}
              <div
                onClick={() => setStep('email')}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#dadce0] dark:border-[#444746] hover:bg-slate-50 dark:hover:bg-[#282a2d] text-xs font-medium text-[#202124] dark:text-[#e8eaed] cursor-pointer mb-2"
                title="Change account"
              >
                <User className="w-3.5 h-3.5 text-[#5f6368]" />
                <span>{email || 'alex.chen@gmail.com'}</span>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3.5 pr-11 rounded-xl border text-sm text-[#202124] dark:text-[#e8eaed] bg-transparent outline-none transition-all placeholder:text-[#5f6368] ${
                    error
                      ? 'border-[#d93025] focus:ring-1 focus:ring-[#d93025]'
                      : 'border-[#dadce0] dark:border-[#444746] focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20'
                  }`}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5f6368] hover:text-[#202124] dark:hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {error && <p className="text-xs text-[#d93025] mt-1.5 ml-1">{error}</p>}
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-[#5f6368] dark:text-[#9aa0a6] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                    className="rounded border-[#dadce0] text-[#1a73e8] focus:ring-[#1a73e8]"
                  />
                  <span>Show password</span>
                </label>

                <button
                  type="button"
                  onClick={() => setPassword('password123')}
                  className="text-[#1a73e8] dark:text-[#8ab4f8] font-medium hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-between pt-5">
                <button
                  type="button"
                  onClick={() => {
                    setStep('email');
                    setError('');
                  }}
                  className="text-[#1a73e8] dark:text-[#8ab4f8] text-sm font-medium hover:underline cursor-pointer"
                >
                  Back
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-sm font-medium transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Sign Up */}
          {step === 'signup' && (
            <form onSubmit={handleNextStep} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full name"
                  className="w-full px-4 py-3 rounded-xl border border-[#dadce0] dark:border-[#444746] focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 text-sm text-[#202124] dark:text-[#e8eaed] bg-transparent outline-none placeholder:text-[#5f6368]"
                  autoFocus
                />
              </div>

              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your student email address"
                  className="w-full px-4 py-3 rounded-xl border border-[#dadce0] dark:border-[#444746] focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 text-sm text-[#202124] dark:text-[#e8eaed] bg-transparent outline-none placeholder:text-[#5f6368]"
                />
              </div>

              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create password (6+ characters)"
                  className="w-full px-4 py-3 rounded-xl border border-[#dadce0] dark:border-[#444746] focus:border-[#1a73e8] focus:ring-2 focus:ring-[#1a73e8]/20 text-sm text-[#202124] dark:text-[#e8eaed] bg-transparent outline-none placeholder:text-[#5f6368]"
                />
              </div>

              {error && <p className="text-xs text-[#d93025]">{error}</p>}

              {/* Footer Buttons */}
              <div className="flex items-center justify-between pt-5">
                <button
                  type="button"
                  onClick={() => {
                    setStep('email');
                    setError('');
                  }}
                  className="text-[#1a73e8] dark:text-[#8ab4f8] text-sm font-medium hover:underline cursor-pointer"
                >
                  Sign in instead
                </button>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-sm font-medium transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? 'Creating...' : 'Next'}
                </button>
              </div>
            </form>
          )}

          {/* Google Bottom Footer */}
          <div className="mt-8 pt-4 border-t border-[#f1f3f4] dark:border-[#3c4043] flex items-center justify-between text-[11px] text-[#5f6368] dark:text-[#9aa0a6]">
            <div className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" />
              <span>English (United States)</span>
            </div>
            <div className="flex items-center gap-3">
              <a href="#" className="hover:underline">Help</a>
              <a href="#" className="hover:underline">Privacy</a>
              <a href="#" className="hover:underline">Terms</a>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
