'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  Camera,
  Bell,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  X,
  ShieldCheck,
  Sparkles,
  Volume2,
  VideoOff,
  Video,
} from 'lucide-react';

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type PermissionStatus = 'granted' | 'denied' | 'prompt' | 'unsupported';

export default function PermissionsModal({ isOpen, onClose }: PermissionsModalProps) {
  const [micStatus, setMicStatus] = useState<PermissionStatus>('prompt');
  const [cameraStatus, setCameraStatus] = useState<PermissionStatus>('prompt');
  const [notificationStatus, setNotificationStatus] = useState<PermissionStatus>('prompt');

  // Live media test states
  const [isMicTesting, setIsMicTesting] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [testNotificationSent, setTestNotificationSent] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Check initial permission states
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Notifications
    if ('Notification' in window) {
      if (Notification.permission === 'granted') setNotificationStatus('granted');
      else if (Notification.permission === 'denied') setNotificationStatus('denied');
      else setNotificationStatus('prompt');
    } else {
      setNotificationStatus('unsupported');
    }

    // 2. Media permissions (if navigator.permissions is supported)
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions
        .query({ name: 'microphone' as PermissionName })
        .then((res) => {
          setMicStatus(res.state);
          res.onchange = () => setMicStatus(res.state);
        })
        .catch(() => {});

      navigator.permissions
        .query({ name: 'camera' as PermissionName })
        .then((res) => {
          setCameraStatus(res.state);
          res.onchange = () => setCameraStatus(res.state);
        })
        .catch(() => {});
    }
  }, [isOpen]);

  const stopMediaStreams = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setIsCameraActive(false);
    setIsMicTesting(false);
    setAudioLevel(0);
  };

  // Clean up streams when modal closes
  useEffect(() => {
    if (!isOpen) {
      stopMediaStreams();
    }
  }, [isOpen]);

  // Request Microphone
  const requestMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStatus('granted');
      setIsMicTesting(true);

      // Web Audio Analyser for live visualizer
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const updateLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        const avg = dataArray.reduce((p, c) => p + c, 0) / dataArray.length;
        setAudioLevel(Math.min(100, Math.round((avg / 128) * 100)));
        animationFrameRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();
    } catch {
      setMicStatus('denied');
    }
  };

  // Request Camera
  const requestCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 480, height: 360 } });
      mediaStreamRef.current = stream;
      setCameraStatus('granted');
      setIsCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch {
      setCameraStatus('denied');
    }
  };

  // Request Notifications
  const requestNotifications = async () => {
    if (!('Notification' in window)) {
      setNotificationStatus('unsupported');
      return;
    }
    try {
      const result = await Notification.requestPermission();
      setNotificationStatus(result === 'granted' ? 'granted' : result === 'denied' ? 'denied' : 'prompt');
      if (result === 'granted') {
        sendTestNotification();
      }
    } catch {
      setNotificationStatus('denied');
    }
  };

  const sendTestNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Study Planner Pro 🔔', {
        body: 'Notifications are enabled! You will receive class reminders and Pomodoro alerts.',
        icon: '/icons/icon-192.png',
      });
      setTestNotificationSent(true);
      setTimeout(() => setTestNotificationSent(false), 4000);
    }
  };

  // Grant All
  const requestAllPermissions = async () => {
    await requestNotifications();
    await requestMicrophone();
    await requestCamera();
  };

  const getStatusBadge = (status: PermissionStatus) => {
    switch (status) {
      case 'granted':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" /> Granted
          </span>
        );
      case 'denied':
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-red-600 dark:text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
            <AlertTriangle className="w-3 h-3" /> Blocked
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
            <HelpCircle className="w-3 h-3" /> Not Configured
          </span>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl max-h-[90vh] flex flex-col glass rounded-3xl border border-white/20 shadow-2xl overflow-hidden bg-white/95 dark:bg-gray-900/95"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-indigo-600 flex items-center justify-center text-white shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  App Permissions & Features
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Configure browser hardware and notification access
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Privacy Note Banner */}
          <div className="px-6 py-3 bg-indigo-500/10 border-b border-indigo-500/20 flex items-center gap-2.5 text-xs text-indigo-700 dark:text-indigo-300">
            <Sparkles className="w-4 h-4 flex-shrink-0 text-indigo-500" />
            <span>
              <strong>Privacy Guarantee:</strong> All audio and camera feeds run 100% on your local device for instant AI notes and focus verification. Zero data is uploaded.
            </span>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
            {/* 1. Notifications Card */}
            <div className="p-4 rounded-2xl bg-gray-50/80 dark:bg-gray-800/50 border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">Push Notifications</h3>
                    {getStatusBadge(notificationStatus)}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Get alerted for upcoming lectures, class timetable changes, and Pomodoro focus interval breaks.
                  </p>
                </div>
              </div>

              <div className="flex-shrink-0 self-end sm:self-auto flex items-center gap-2">
                {notificationStatus === 'granted' ? (
                  <button
                    onClick={sendTestNotification}
                    className="px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold transition-colors"
                  >
                    {testNotificationSent ? 'Sent! ✓' : 'Send Test Alert'}
                  </button>
                ) : (
                  <button
                    onClick={requestNotifications}
                    className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-semibold shadow-sm hover:opacity-95 transition-opacity"
                  >
                    Enable Notifications
                  </button>
                )}
              </div>
            </div>

            {/* 2. Microphone Card */}
            <div className="p-4 rounded-2xl bg-gray-50/80 dark:bg-gray-800/50 border border-border space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white">Microphone Access</h3>
                      {getStatusBadge(micStatus)}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Dictate notes directly into your subject workspace and measure ambient study noise levels.
                    </p>
                  </div>
                </div>

                <div className="flex-shrink-0 self-end sm:self-auto">
                  {micStatus === 'granted' ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <Volume2 className="w-4 h-4" /> Live
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={requestMicrophone}
                      className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-semibold shadow-sm hover:opacity-95 transition-opacity"
                    >
                      Allow Microphone
                    </button>
                  )}
                </div>
              </div>

              {/* Live Mic Meter Preview */}
              {micStatus === 'granted' && isMicTesting && (
                <div className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-border flex items-center gap-3">
                  <span className="text-[11px] font-semibold text-gray-500">Live Voice Input:</span>
                  <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-teal-400 to-indigo-500 rounded-full"
                      style={{ width: `${audioLevel}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-teal-500 w-8">{audioLevel}%</span>
                </div>
              )}
            </div>

            {/* 3. Camera Card */}
            <div className="p-4 rounded-2xl bg-gray-50/80 dark:bg-gray-800/50 border border-border space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white">Camera Access</h3>
                      {getStatusBadge(cameraStatus)}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Scan physical textbook pages for OCR notes and activate desk focus companion mode.
                    </p>
                  </div>
                </div>

                <div className="flex-shrink-0 self-end sm:self-auto">
                  {cameraStatus === 'granted' ? (
                    <button
                      onClick={() => {
                        if (isCameraActive) {
                          stopMediaStreams();
                        } else {
                          requestCamera();
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-500/10 hover:bg-violet-500/20 text-violet-600 dark:text-violet-400 text-xs font-semibold transition-colors"
                    >
                      {isCameraActive ? <VideoOff className="w-3.5 h-3.5" /> : <Video className="w-3.5 h-3.5" />}
                      <span>{isCameraActive ? 'Hide Feed' : 'Preview Cam'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={requestCamera}
                      className="px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold shadow-sm hover:opacity-95 transition-opacity"
                    >
                      Allow Camera
                    </button>
                  )}
                </div>
              </div>

              {/* Live Video Preview Box */}
              {isCameraActive && (
                <div className="relative rounded-xl overflow-hidden bg-black/90 aspect-video max-h-48 flex items-center justify-center border border-violet-500/30">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-sm text-[10px] text-white flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    Live Study Feed
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-gray-50/50 dark:bg-gray-800/30">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Permissions can be reset anytime in browser settings.
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={requestAllPermissions}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-teal-500 text-white text-xs font-bold shadow-md hover:opacity-95 transition-opacity"
              >
                Grant All Recommended
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
