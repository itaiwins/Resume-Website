'use client';

import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

interface ExperienceSectionProps {
  progress: number;
}

// Experience/Changelog data - Real journey
const EXPERIENCE_DATA = [
  {
    version: '3.0',
    date: '2024 - Present',
    title: 'Founder & Developer',
    company: 'Walleto / AlphaHQ',
    type: 'current',
    description: 'Building Walleto, a crypto tracking platform for perpetual trades with backtesting and AI coaching. Running AlphaHQ (Jan 2025), a paid trading community providing daily technical analysis, trade signals, and 1-on-1 mentorship.',
    achievements: [
      'Developing Walleto.ai - launching soon',
      'Founded AlphaHQ with 15+ active members',
      'Built 3 iterations of automated trading bots',
      'Created personal AI secretary "Oura"',
      'Developed Polymarket prediction bot',
    ],
    technologies: ['Python', 'Next.js', 'CCXT', 'Coinglass', 'Telegram', 'AI/LLMs'],
  },
  {
    version: '2.5',
    date: '2022 - 2024',
    title: 'Trader & Entrepreneur',
    company: 'Independent',
    type: 'past',
    description: 'Took a step back from Web3 to explore other ventures while maintaining trading activity. Founded a sports betting analytics group, worked various jobs to stay grounded, then returned full-time to crypto in 2024.',
    achievements: [
      'Founded sports betting community',
      'Maintained active trading portfolio',
      'Developed market analysis skills',
      'Returned to Web3 full-time in 2024',
    ],
    technologies: ['Trading', 'Analytics', 'Community Building', 'Risk Management'],
  },
  {
    version: '2.0',
    date: '2021 - 2022',
    title: 'Event Planner & Moderator',
    company: 'Llamaverse',
    type: 'past',
    description: 'Joined the NFT revolution early. Worked as Event Planner and Moderator for Llamaverse, organizing online events and managing investor relations while actively trading NFTs.',
    achievements: [
      'Organized game nights, Q&As, and speaker events',
      'Managed Discord community moderation',
      'Handled customer/investor inquiries professionally',
      'Recorded customer data and event logs',
      'Generated significant returns trading NFTs',
    ],
    technologies: ['Discord', 'Event Planning', 'Community Management', 'NFTs', 'Data Analytics'],
  },
  {
    version: '1.0',
    date: '2019',
    title: 'Sneaker Reseller & Botter',
    company: 'Self-Employed',
    type: 'origin',
    description: 'First taste of automation and hustle. Used bots to scrape websites and secure limited sneaker drops, reselling for profit. This introduced me to the world of automation, market dynamics, and online entrepreneurship.',
    achievements: [
      'Mastered sneaker bot software',
      'Built network of resellers',
      'Learned market timing & demand cycles',
      'First experience with automation',
    ],
    technologies: ['Bots', 'Automation', 'E-commerce', 'Market Analysis'],
  },
];

// Stats data
const STATS = [
  { value: '5+', label: 'Years in Web3' },
  { value: '6+', label: 'Projects Built' },
  { value: '3', label: 'Companies Founded' },
  { value: '∞', label: 'Cans of Coke Zero' },
];

// Experience card component
function ExperienceCard({ experience, index, isVisible, isScrollExpanded }: {
  experience: typeof EXPERIENCE_DATA[0];
  index: number;
  isVisible: boolean;
  isScrollExpanded: boolean;
}) {
  // Expansion is controlled by scroll position from parent
  const isExpanded = isScrollExpanded;

  const typeStyles: Record<string, { dot: string; badge: string; badgeText: string; badgeBg: string }> = {
    current: {
      dot: 'bg-green-500',
      badge: 'NOW',
      badgeText: 'text-green-400',
      badgeBg: 'bg-green-500/10 border-green-500/20'
    },
    past: {
      dot: 'bg-blue-500',
      badge: 'SHIPPED',
      badgeText: 'text-blue-400',
      badgeBg: 'bg-blue-500/10 border-blue-500/20'
    },
    origin: {
      dot: 'bg-[#d4af37]',
      badge: 'GENESIS',
      badgeText: 'text-[#d4af37]',
      badgeBg: 'bg-[#d4af37]/10 border-[#d4af37]/20'
    },
  };

  const style = typeStyles[experience.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="relative"
    >
      {/* Timeline line */}
      {index < EXPERIENCE_DATA.length - 1 && (
        <div className="absolute left-6 top-16 bottom-0 w-px bg-gradient-to-b from-white/20 to-transparent" />
      )}

      <div className="flex gap-8">
        {/* Timeline node */}
        <div className="relative z-10 flex-shrink-0">
          <motion.div
            className={`w-12 h-12 rounded-xl ${style.dot}/10 border border-white/10 flex items-center justify-center backdrop-blur-sm`}
            whileHover={{ scale: 1.1 }}
          >
            <div className={`w-3 h-3 rounded-full ${style.dot}`} />
          </motion.div>
        </div>

        {/* Content card */}
        <motion.div
          className={`flex-1 mb-8 rounded-2xl border transition-all duration-300 ${
            isExpanded
              ? 'bg-white/[0.04] border-white/10 shadow-lg shadow-black/20'
              : 'bg-white/[0.01] border-white/5'
          }`}
        >
          <div style={{ padding: '28px 32px' }}>
            {/* Header row */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {/* Version & Badge */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[#d4af37] font-bold text-lg" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                    v{experience.version}
                  </span>
                  <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${style.badgeBg} ${style.badgeText}`}>
                    {style.badge}
                  </span>
                  <span className="text-white/30 text-sm">{experience.date}</span>
                </div>

                {/* Title & Company */}
                <h3 className="text-xl font-bold text-white mb-1">{experience.title}</h3>
                <p className="text-white/50">{experience.company}</p>
              </div>

            </div>

            {/* Expandable content */}
            <motion.div
              initial={false}
              animate={{
                height: isExpanded ? 'auto' : 0,
                opacity: isExpanded ? 1 : 0,
                marginTop: isExpanded ? 24 : 0
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              {/* Description */}
              <p className="text-white/60 leading-relaxed mb-6">
                {experience.description}
              </p>

              {/* Two column layout for achievements and tech */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Achievements */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-white/30 font-semibold mb-4">Key Achievements</h4>
                  <div className="space-y-2.5">
                    {experience.achievements.map((achievement, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: isExpanded ? 1 : 0, x: isExpanded ? 0 : -10 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-3"
                      >
                        <span className="text-green-400 text-sm mt-0.5">+</span>
                        <span className="text-white/70 text-sm leading-relaxed">{achievement}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Technologies */}
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-white/30 font-semibold mb-4">Skills Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {experience.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1.5 text-xs font-medium bg-white/5 border border-white/10 rounded-lg text-white/60 hover:text-white/80 hover:border-white/20 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function ExperienceSection({ progress }: ExperienceSectionProps) {
  const isVisible = progress > 0.1;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [expandedIndex, setExpandedIndex] = useState(0);

  // Track scroll position to auto-expand cards
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;

      // Calculate which card should be expanded based on scroll position
      // Each card is roughly 150px when collapsed, header is about 400px
      const headerHeight = 400;
      const cardHeight = 180;

      if (scrollTop < headerHeight) {
        setExpandedIndex(0);
      } else {
        const adjustedScroll = scrollTop - headerHeight + containerHeight * 0.3;
        const newIndex = Math.min(
          EXPERIENCE_DATA.length - 1,
          Math.floor(adjustedScroll / cardHeight)
        );
        setExpandedIndex(Math.max(0, newIndex));
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="w-full h-full bg-[#0a0b0f] text-white overflow-hidden flex flex-col">
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        {/* Header Section */}
        <div style={{ padding: '48px 40px 40px 40px' }} className="border-b border-white/5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: '36px' }}
          >
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full border border-green-500/20 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-sm font-medium">Actively building</span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Version
              <span className="text-[#d4af37]"> History</span>
            </h1>
            <p className="text-white/50 text-lg max-w-2xl">
              A changelog of my journey through Web3, trading, and tech. Each version represents growth, pivots, and new capabilities.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-5"
          >
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.5 }}
                className="bg-white/[0.03] rounded-xl p-5 border border-white/10"
              >
                <div className="text-3xl font-bold text-[#d4af37] mb-1" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  {stat.value}
                </div>
                <div className="text-white/40 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Timeline Section */}
        <div style={{ padding: '40px 40px 32px 40px' }}>
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4 mb-8"
          >
            <h2 className="text-xs uppercase tracking-wider text-white/30 font-semibold">Release Notes</h2>
            <div className="flex-1 h-px bg-white/5" />
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {EXPERIENCE_DATA.map((experience, i) => (
              <ExperienceCard
                key={experience.version}
                experience={experience}
                index={i}
                isVisible={isVisible}
                isScrollExpanded={i <= expandedIndex}
              />
            ))}
          </div>
        </div>

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center border-t border-white/5"
          style={{ margin: '0 40px', padding: '48px 0 64px 0' }}
        >
          <p className="text-white/30 text-sm mb-8">
            New features shipping regularly...
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <motion.a
              href="/resume.docx"
              download
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-xl bg-gradient-to-r from-[#d4af37] to-[#b8973a] text-black font-semibold hover:from-[#e5c349] hover:to-[#d4af37] transition-all shadow-lg shadow-[#d4af37]/20 whitespace-nowrap"
              style={{ padding: '14px 28px' }}
            >
              Download Resume
            </motion.a>
            <motion.a
              href="https://www.linkedin.com/in/itai-rotem23/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-xl bg-white/5 border border-white/10 text-white/70 font-medium hover:bg-white/10 hover:text-white transition-all whitespace-nowrap"
              style={{ padding: '14px 28px' }}
            >
              View LinkedIn
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
