'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onLoadComplete: () => void;
  onSkipTo3D?: () => void;
  isSlowConnection: boolean;
}

export default function LoadingScreen({ onLoadComplete, onSkipTo3D, isSlowConnection }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing');

  useEffect(() => {
    const loadingSteps = [
      { progress: 20, text: 'Loading assets' },
      { progress: 40, text: 'Preparing 3D scene' },
      { progress: 60, text: 'Building neural network' },
      { progress: 80, text: 'Optimizing experience' },
      { progress: 100, text: 'Ready' },
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < loadingSteps.length) {
        setProgress(loadingSteps[stepIndex].progress);
        setLoadingText(loadingSteps[stepIndex].text);
        stepIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          onLoadComplete();
        }, 300);
      }
    }, isSlowConnection ? 800 : 400);

    return () => clearInterval(interval);
  }, [onLoadComplete, isSlowConnection]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center"
    >
      {/* Logo/Name */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h1
          className="text-3xl md:text-4xl font-bold tracking-wide mb-2"
          style={{ color: '#d4af37' }}
        >
          ITAI ROTEM
        </h1>
        <p className="text-white/40 text-sm font-mono tracking-widest">
          PORTFOLIO
        </p>
      </motion.div>

      {/* Loading animation - Neural network pulse */}
      <div className="relative w-32 h-32 mb-8">
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-[#d4af37]/20"
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        {/* Middle ring */}
        <motion.div
          className="absolute inset-4 rounded-full border border-[#d4af37]/40"
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, delay: 0.2, repeat: Infinity }}
        />
        {/* Inner core */}
        <motion.div
          className="absolute inset-8 rounded-full bg-[#d4af37]/20"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        {/* Center dot */}
        <motion.div
          className="absolute inset-[52px] rounded-full bg-[#d4af37]"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
        {/* Orbiting dots */}
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-[#d4af37]"
            style={{
              top: '50%',
              left: '50%',
              marginTop: -4,
              marginLeft: -4,
            }}
            animate={{
              x: [0, Math.cos((i * Math.PI) / 2) * 50, 0],
              y: [0, Math.sin((i * Math.PI) / 2) * 50, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 2,
              delay: i * 0.25,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-64 mb-4">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#d4af37]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Loading text */}
      <motion.p
        key={loadingText}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-white/50 text-sm font-mono tracking-wider"
      >
        {loadingText}...
      </motion.p>

      {/* Progress percentage */}
      <p className="text-[#d4af37] text-xs font-mono mt-2">
        {progress}%
      </p>

      {/* Slow connection warning */}
      {isSlowConnection && progress < 100 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2 }}
          className="mt-8 text-center"
        >
          <p className="text-white/40 text-xs mb-3">
            Slow connection detected
          </p>
          {onSkipTo3D && (
            <button
              onClick={onSkipTo3D}
              className="text-[#d4af37] text-sm font-mono border border-[#d4af37]/50 px-4 py-2 rounded-full hover:bg-[#d4af37]/10 transition-colors"
            >
              Skip loading
            </button>
          )}
        </motion.div>
      )}

      {/* Tips while loading */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 text-white/20 text-xs font-mono text-center px-4"
      >
        Tip: Scroll to navigate through sections after entering
      </motion.p>
    </motion.div>
  );
}
