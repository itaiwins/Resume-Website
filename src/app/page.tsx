'use client';

import dynamic from 'next/dynamic';
import { Suspense, useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';

// Dynamic imports for better performance
const NetworkScene = dynamic(() => import('@/components/3d/NetworkScene'), { ssr: false });
const SectionOverlays = dynamic(() => import('@/components/sections/SectionOverlays'), { ssr: false });

// Story chapters - the journey through the network
// Each chapter has camera positions that create a cinematic path
const STORY_CHAPTERS = [
  {
    id: 'intro',
    phase: 'intro',
    title: '',
    subtitle: '',
    camera: { position: [0, 0, 22], target: [0, 0, 0] },
    duration: 0.05,
  },
  {
    id: 'name-reveal',
    phase: 'intro',
    title: '',
    subtitle: '',
    camera: { position: [0, 2, 14], target: [0, 0, 0] },
    duration: 0.05,
  },
  {
    id: 'approach-about',
    phase: 'transition',
    title: '',
    subtitle: '',
    camera: { position: [-2, 1.5, 8], target: [-3, 1.5, 2] },
    duration: 0.04,
  },
  {
    id: 'about',
    phase: 'section',
    sectionId: 'about',
    title: 'ABOUT ME',
    subtitle: 'The mind behind the code',
    camera: { position: [-4, 1.5, 4], target: [-3, 1.5, 2] },
    duration: 0.12,
  },
  {
    id: 'travel-to-projects',
    phase: 'transition',
    title: '',
    subtitle: '',
    camera: { position: [0, 2, 6], target: [1, 1, 0] },
    duration: 0.04,
  },
  {
    id: 'approach-projects',
    phase: 'transition',
    title: '',
    subtitle: '',
    camera: { position: [2, 2, 4], target: [3, 2, -1] },
    duration: 0.03,
  },
  {
    id: 'projects',
    phase: 'section',
    sectionId: 'projects',
    title: 'PROJECTS',
    subtitle: 'What I\'ve built',
    camera: { position: [4, 2, 2], target: [3, 2, -1] },
    duration: 0.12,
  },
  {
    id: 'travel-to-skills',
    phase: 'transition',
    title: '',
    subtitle: '',
    camera: { position: [1, 0, 5], target: [0, -1, 0] },
    duration: 0.04,
  },
  {
    id: 'approach-skills',
    phase: 'transition',
    title: '',
    subtitle: '',
    camera: { position: [-1, -1, 3], target: [-2, -2, -2] },
    duration: 0.03,
  },
  {
    id: 'skills',
    phase: 'section',
    sectionId: 'skills',
    title: 'SKILLS',
    subtitle: 'Technologies I master',
    camera: { position: [-3, -2, 1], target: [-2, -2, -2] },
    duration: 0.12,
  },
  {
    id: 'travel-to-experience',
    phase: 'transition',
    title: '',
    subtitle: '',
    camera: { position: [0, -1, 5], target: [1, -1, 1] },
    duration: 0.04,
  },
  {
    id: 'approach-experience',
    phase: 'transition',
    title: '',
    subtitle: '',
    camera: { position: [2, -1, 4], target: [2.5, -1.5, 2.5] },
    duration: 0.03,
  },
  {
    id: 'experience',
    phase: 'section',
    sectionId: 'experience',
    title: 'EXPERIENCE',
    subtitle: 'My journey so far',
    camera: { position: [3.5, -1.5, 4], target: [2.5, -1.5, 2.5] },
    duration: 0.12,
  },
  {
    id: 'travel-to-contact',
    phase: 'transition',
    title: '',
    subtitle: '',
    camera: { position: [1, -2.5, 5], target: [0, -3, 0] },
    duration: 0.06,
  },
  {
    id: 'approach-contact',
    phase: 'transition',
    title: '',
    subtitle: '',
    camera: { position: [0.5, -3, 4], target: [0, -3, 0] },
    duration: 0.03,
  },
  {
    id: 'contact',
    phase: 'section',
    sectionId: 'contact',
    title: 'CONTACT',
    subtitle: 'Let\'s connect',
    camera: { position: [0, -3.5, 3], target: [0, -3, 0] },
    duration: 0.08,
  },
];

// Calculate cumulative scroll positions for each chapter
function getChapterPositions() {
  let cumulative = 0;
  return STORY_CHAPTERS.map((chapter) => {
    const start = cumulative;
    cumulative += chapter.duration;
    return { ...chapter, scrollStart: start, scrollEnd: cumulative };
  });
}

const CHAPTERS_WITH_POSITIONS = getChapterPositions();

// Intro overlay component
function IntroOverlay({ onStart, visible }: { onStart: () => void; visible: boolean }) {
  const [showReminder, setShowReminder] = useState(false);
  const reminderTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!visible) return;

    const resetReminder = () => {
      setShowReminder(false);
      if (reminderTimeoutRef.current) {
        clearTimeout(reminderTimeoutRef.current);
      }
      reminderTimeoutRef.current = setTimeout(() => {
        setShowReminder(true);
      }, 15000);
    };

    resetReminder();

    const handleActivity = () => resetReminder();
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    return () => {
      if (reminderTimeoutRef.current) {
        clearTimeout(reminderTimeoutRef.current);
      }
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-[60] flex flex-col items-center justify-between pointer-events-none py-12 md:py-16"
    >
      {/* Top spacer to push title down */}
      <div className="flex-1" />

      {/* Top Section - Name and Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative z-10 text-center"
      >
        <motion.h1
          className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-wide"
          style={{
            color: '#d4af37',
            textShadow: '0 0 60px rgba(212, 175, 55, 0.5), 0 0 120px rgba(212, 175, 55, 0.3)',
          }}
        >
          Hi, I&apos;m Itai
        </motion.h1>

        {/* Spacer between title and subtitle */}
        <div style={{ height: '40px' }} />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="font-mono text-xs md:text-sm text-white tracking-[0.25em]"
          style={{ opacity: 0.7 }}
        >
          AI ENGINEER • CRYPTO TRADER • WEB3
        </motion.p>
      </motion.div>

      {/* Middle Section - Space for Neural Network (transparent) */}
      <div className="flex-[10]" />

      {/* Bottom Section - Start Button */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="relative z-10 text-center pointer-events-auto"
      >
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.0 }}
          onClick={onStart}
          whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(212, 175, 55, 0.4)' }}
          whileTap={{ scale: 0.95 }}
          className="font-mono text-sm md:text-base tracking-[0.15em] text-[#d4af37] bg-black/40 border-2 border-[#d4af37]/60 rounded-full hover:border-[#d4af37] hover:bg-[#d4af37]/10 transition-all duration-300 shadow-lg shadow-[#d4af37]/25 backdrop-blur-sm"
          style={{ padding: '12px 24px' }}
        >
          ENTER PORTFOLIO
        </motion.button>

        {/* Spacer between button and text */}
        <div style={{ height: '40px' }} />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          style={{ opacity: 0.7 }}
          className="text-white text-sm font-mono tracking-[0.1em]"
        >
          DRAG TO EXPLORE • CLICK TO BEGIN
        </motion.p>
      </motion.div>

      {/* Bottom spacer to push button up */}
      <div className="flex-1" />

      {/* Reminder */}
      <AnimatePresence>
        {showReminder && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-40 left-1/2 -translate-x-1/2 pointer-events-auto"
          >
            <motion.div
              animate={{ boxShadow: ['0 0 20px rgba(212, 175, 55, 0.3)', '0 0 40px rgba(212, 175, 55, 0.5)', '0 0 20px rgba(212, 175, 55, 0.3)'] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="px-6 py-3 bg-black/90 border border-[#d4af37]/50 rounded-full"
            >
              <p className="text-[#d4af37] text-sm font-mono">
                Click the button to enter
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Story title overlay for transition chapters
function StoryTitle({ chapter }: { chapter: typeof CHAPTERS_WITH_POSITIONS[0] }) {
  if (!chapter.title || chapter.phase === 'section') return null;

  return (
    <motion.div
      key={chapter.id}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none"
    >
      <div className="text-center">
        <motion.h2
          className="font-display text-4xl md:text-6xl font-bold tracking-[0.15em] mb-4"
          style={{
            color: '#d4af37',
            textShadow: '0 0 40px rgba(212, 175, 55, 0.4)',
          }}
        >
          {chapter.title}
        </motion.h2>
        {chapter.subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-mono text-sm md:text-base text-white/50 tracking-[0.1em]"
          >
            {chapter.subtitle}
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}

// Progress indicator
function ScrollProgress({ progress, chapters }: { progress: number; chapters: typeof CHAPTERS_WITH_POSITIONS }) {
  const sectionChapters = chapters.filter(c => c.phase === 'section');

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
      {sectionChapters.map((chapter) => {
        const isActive = progress >= chapter.scrollStart && progress < chapter.scrollEnd;
        const isPast = progress >= chapter.scrollEnd;

        return (
          <div key={chapter.id} className="flex items-center gap-3">
            <motion.div
              animate={{
                scale: isActive ? 1.3 : 1,
                backgroundColor: isActive ? '#d4af37' : isPast ? '#d4af37' : 'transparent',
              }}
              className="w-2 h-2 rounded-full border border-[#d4af37]/50"
            />
            <motion.span
              animate={{ opacity: isActive ? 1 : 0.3 }}
              className="text-xs font-mono text-[#d4af37] tracking-wider hidden md:block"
            >
              {chapter.title}
            </motion.span>
          </div>
        );
      })}
    </div>
  );
}

export default function Home() {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(CHAPTERS_WITH_POSITIONS[0]);
  const [scrollProgressValue, setScrollProgressValue] = useState(0);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [sectionProgress, setSectionProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Prevent scrolling until user clicks Start
  useEffect(() => {
    if (!hasStarted) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [hasStarted]);

  // Total scroll height based on story duration
  const totalScrollHeight = 1000; // vh units - increased for longer scroll experience

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Track scroll and update current chapter
  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    setScrollProgressValue(progress);

    // Reset to intro when scrolled back to the very beginning
    if (progress <= 0.005 && hasStarted) {
      setHasStarted(false);
    }

    // Don't update sections when in intro mode (prevents glitches when returning to main)
    if (!hasStarted) {
      setActiveSection(null);
      setSectionProgress(0);
      return;
    }

    // Find current chapter
    for (const chapter of CHAPTERS_WITH_POSITIONS) {
      if (progress >= chapter.scrollStart && progress < chapter.scrollEnd) {
        if (currentChapter.id !== chapter.id) {
          setCurrentChapter(chapter);
        }

        // Track active section and progress within it
        if (chapter.sectionId) {
          const chapterProgress = (progress - chapter.scrollStart) / chapter.duration;
          // Show overlay after 30% into section (after zoom-in effect)
          if (chapterProgress > 0.3) {
            setActiveSection(chapter.sectionId);
            setSectionProgress((chapterProgress - 0.3) / 0.7); // Normalize to 0-1
          } else {
            setActiveSection(null);
            setSectionProgress(0);
          }
        } else {
          setActiveSection(null);
          setSectionProgress(0);
        }
        break;
      }
    }
  });

  const handleStart = useCallback(() => {
    setHasStarted(true);
    // Scroll down a bit to start the journey
    window.scrollTo({ top: window.innerHeight * 0.5, behavior: 'smooth' });
  }, []);

  const handleReturnToMain = useCallback(() => {
    // Immediately show intro overlay (z-60) to cover everything
    setHasStarted(false);
    setActiveSection(null);
    setSectionProgress(0);
    // Then scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div
      ref={containerRef}
      className="cursor-default"
      style={{ height: `${totalScrollHeight}vh` }}
    >
      {/* 3D Network Scene with immersive worlds */}
      <div className="fixed inset-0 z-0">
        <Suspense fallback={null}>
          <NetworkScene
            scrollProgress={scrollYProgress}
            chapters={CHAPTERS_WITH_POSITIONS}
            isIntro={!hasStarted}
          />
        </Suspense>
      </div>

      {/* Section Overlays - Full screen takeover for each section */}
      <SectionOverlays activeSection={activeSection} progress={sectionProgress} onReturnToMain={handleReturnToMain} />

      {/* Intro Overlay */}
      <AnimatePresence>
        {!hasStarted && (
          <IntroOverlay onStart={handleStart} visible={!hasStarted} />
        )}
      </AnimatePresence>

      {/* Story Title (for non-section chapters with titles) */}
      <AnimatePresence mode="wait">
        {hasStarted && currentChapter.phase !== 'section' && currentChapter.title && (
          <StoryTitle chapter={currentChapter} />
        )}
      </AnimatePresence>

      {/* Progress Indicator - hidden when inside a section */}
      {hasStarted && !activeSection && (
        <ScrollProgress progress={scrollProgressValue} chapters={CHAPTERS_WITH_POSITIONS} />
      )}

      {/* Scroll hint at bottom - hidden when inside a section */}
      {hasStarted && !activeSection && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30"
        >
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-white/20 text-xs font-mono tracking-wider"
          >
            SCROLL TO EXPLORE
          </motion.div>
        </motion.div>
      )}

      {/* Social links - hidden when inside a section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: hasStarted && !activeSection ? 1 : 0 }}
        transition={{ delay: 0.5 }}
        className="fixed top-6 right-6 z-50 flex gap-4"
      >
        {[
          { href: 'https://github.com/itaiwins', icon: 'github' },
          { href: 'https://www.linkedin.com/in/itai-rotem23/', icon: 'linkedin' },
          { href: 'https://twitter.com/itaiwins', icon: 'twitter' },
        ].map((social) => (
          <a
            key={social.icon}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center text-white/30 hover:text-[#d4af37] transition-colors"
          >
            {social.icon === 'github' && (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            )}
            {social.icon === 'linkedin' && (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            )}
            {social.icon === 'twitter' && (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            )}
          </a>
        ))}
      </motion.div>
    </div>
  );
}
