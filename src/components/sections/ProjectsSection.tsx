'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';

interface ProjectsSectionProps {
  progress: number;
}

// Project data with icons - Real projects
const PROJECTS = [
  {
    id: 'walleto',
    title: 'WALLETO',
    codename: 'WALLET-1',
    status: 'LAUNCHING',
    description: 'Comprehensive crypto tracking platform for perpetual trades. Features real-time PnL tracking, advanced backtesting capabilities, and an AI trading coach to help optimize your strategy.',
    specs: [
      { label: 'FEATURES', value: '15+' },
      { label: 'BACKTEST', value: 'Live' },
      { label: 'AI COACH', value: 'Yes' },
    ],
    tech: ['Next.js', 'Python', 'AI/LLMs', 'Trading APIs'],
    links: { live: 'https://walleto.ai' },
    iconType: 'pulse',
    isPrivate: false,
  },
  {
    id: 'this-website',
    title: 'THIS WEBSITE',
    codename: 'META-0',
    status: 'LIVE',
    description: 'The immersive 3D portfolio website you are currently exploring. Features neural network visualization, scroll-driven camera animations, and unique section transitions.',
    specs: [
      { label: 'SECTIONS', value: '6' },
      { label: '3D', value: 'Yes' },
      { label: 'VIBES', value: '100%' },
    ],
    tech: ['Next.js', 'Three.js', 'Framer Motion', 'Tailwind'],
    links: { github: 'https://github.com/itaiwins/Resume-Website', live: 'https://itairotem.com' },
    iconType: 'globe',
    isPrivate: false,
  },
  {
    id: 'oura',
    title: 'OURA AI',
    codename: 'OURA-1',
    status: 'OPERATIONAL',
    description: 'Personal AI secretary built to handle daily tasks, scheduling, research, and communication. A custom-trained assistant tailored to my workflow and preferences.',
    specs: [
      { label: 'TASKS', value: '100+' },
      { label: 'ACCURACY', value: '95%' },
      { label: 'UPTIME', value: '24/7' },
    ],
    tech: ['Python', 'OpenAI', 'LangChain', 'APIs'],
    links: {},
    iconType: 'brain',
    isPrivate: true,
  },
  {
    id: 'trading-bots',
    title: 'CRYPTO TRADING BOTS',
    codename: 'ALPHA-3',
    status: 'OPERATIONAL',
    description: 'Automated long/short trading systems using live market indicators, funding rates, and sentiment analysis. Features a confluence engine combining RSI, Fear & Greed Index, CVD, and trend bias for precision entries. Includes Bull/Bear dual-bot ecosystem for market-adaptive strategies.',
    specs: [
      { label: 'SIGNALS', value: 'Live' },
      { label: 'EXCHANGES', value: '3+' },
      { label: 'INDICATORS', value: '10+' },
    ],
    tech: ['Python', 'CCXT', 'Coinglass', 'BloFin', 'Telegram', 'Pandas'],
    links: {},
    iconType: 'chart',
    isPrivate: true,
  },
  {
    id: 'polymarket-bot',
    title: 'POLYMARKET BOT',
    codename: 'POLY-1',
    status: 'ACTIVE',
    description: 'Automated prediction market bot for Polymarket. Analyzes odds, identifies value bets, and executes trades based on custom strategies and market inefficiencies.',
    specs: [
      { label: 'MARKETS', value: '50+' },
      { label: 'SIGNALS', value: 'Live' },
      { label: 'ROI', value: 'Positive' },
    ],
    tech: ['Python', 'Polymarket API', 'Data Analysis', 'Automation'],
    links: {},
    iconType: 'waves',
    isPrivate: true,
  },
  {
    id: 'alphahq',
    title: 'ALPHAHQ',
    codename: 'ALPHA-HQ',
    status: 'LIVE',
    description: 'Premium crypto trading community providing daily technical analysis, trade signals, and 1-on-1 mentorship. Educational content on blockchain, DeFi, and market psychology. Grown through Twitter/X marketing strategy.',
    specs: [
      { label: 'MEMBERS', value: '15+' },
      { label: 'SIGNALS', value: 'Daily' },
      { label: 'MENTORSHIP', value: '1-on-1' },
    ],
    tech: ['Discord', 'Twitter/X', 'Trading', 'Education'],
    links: { live: 'https://whop.com/alphahq' },
    iconType: 'blocks',
    isPrivate: false,
  },
  {
    id: 'pnl-tracker',
    title: 'CRYPTO PNL TRACKER',
    codename: 'PNL-1',
    status: 'DEPLOYED',
    description: 'Full-stack application for tracking cryptocurrency profits and losses across multiple exchanges. Real-time sync, trade history, and performance analytics.',
    specs: [
      { label: 'EXCHANGES', value: '5+' },
      { label: 'TRADES', value: '10K+' },
      { label: 'SYNC', value: 'Real-time' },
    ],
    tech: ['React', 'Node.js', 'Supabase', 'Exchange APIs'],
    links: {},
    iconType: 'diamond',
    isPrivate: true,
  },
  {
    id: 'future-projects',
    title: 'FUTURE PROJECTS',
    codename: 'NEXT-X',
    status: 'IN DEV',
    description: 'Multiple projects currently in development. Building tools for traders, AI-powered applications, and Web3 infrastructure. Stay tuned for launches.',
    specs: [
      { label: 'PROJECTS', value: '3+' },
      { label: 'STATUS', value: 'Building' },
      { label: 'ETA', value: '2025' },
    ],
    tech: ['Python', 'Next.js', 'AI', 'Web3'],
    links: {},
    iconType: 'code',
    isPrivate: false,
  },
];

// Animated icons for each project type - Large and impressive
function AnimatedIcon({ type }: { type: string }) {
  switch (type) {
    case 'chart':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Grid lines */}
          {[20, 40, 60, 80].map((y) => (
            <motion.line key={y} x1="10" y1={y} x2="90" y2={y} stroke="currentColor" strokeWidth="0.5" opacity={0.2} />
          ))}
          {/* Animated bars */}
          <motion.rect x="15" y="70" width="12" height="0" fill="currentColor" opacity={0.6}
            animate={{ height: [0, 25, 25], y: [70, 45, 45] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }} />
          <motion.rect x="32" y="70" width="12" height="0" fill="currentColor" opacity={0.7}
            animate={{ height: [0, 40, 40], y: [70, 30, 30] }}
            transition={{ duration: 1, delay: 0.15, repeat: Infinity, repeatDelay: 2 }} />
          <motion.rect x="49" y="70" width="12" height="0" fill="currentColor" opacity={0.8}
            animate={{ height: [0, 35, 35], y: [70, 35, 35] }}
            transition={{ duration: 1, delay: 0.3, repeat: Infinity, repeatDelay: 2 }} />
          <motion.rect x="66" y="70" width="12" height="0" fill="currentColor" opacity={0.9}
            animate={{ height: [0, 50, 50], y: [70, 20, 20] }}
            transition={{ duration: 1, delay: 0.45, repeat: Infinity, repeatDelay: 2 }} />
          {/* Trend line */}
          <motion.path d="M20 60 Q35 45 50 50 T80 25" stroke="currentColor" strokeWidth="2" fill="none"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, delay: 0.8, repeat: Infinity, repeatDelay: 2 }} />
          {/* Data points */}
          {[[20, 60], [35, 47], [50, 50], [65, 38], [80, 25]].map(([cx, cy], i) => (
            <motion.circle key={i} cx={cx} cy={cy} r="3" fill="currentColor"
              initial={{ scale: 0 }} animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.3, delay: 1 + i * 0.1, repeat: Infinity, repeatDelay: 2.5 }} />
          ))}
          {/* Pulse effect on latest point */}
          <motion.circle cx="80" cy="25" r="3" stroke="currentColor" fill="none"
            animate={{ r: [3, 12], opacity: [0.8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }} />
        </svg>
      );
    case 'blocks':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Blockchain blocks */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <motion.rect x="10" y="35" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"
              animate={{ fill: ['transparent', 'rgba(255,255,255,0.1)', 'transparent'] }}
              transition={{ duration: 2, repeat: Infinity }} />
            <motion.rect x="40" y="35" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"
              animate={{ fill: ['transparent', 'rgba(255,255,255,0.1)', 'transparent'] }}
              transition={{ duration: 2, delay: 0.3, repeat: Infinity }} />
            <motion.rect x="70" y="35" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"
              animate={{ fill: ['transparent', 'rgba(255,255,255,0.1)', 'transparent'] }}
              transition={{ duration: 2, delay: 0.6, repeat: Infinity }} />
          </motion.g>
          {/* Chain connections */}
          <motion.path d="M30 45 L40 45" stroke="currentColor" strokeWidth="2"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }} />
          <motion.path d="M60 45 L70 45" stroke="currentColor" strokeWidth="2"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.3, repeat: Infinity, repeatDelay: 2 }} />
          {/* Hash symbols inside blocks */}
          {[20, 50, 80].map((x, i) => (
            <motion.text key={i} x={x} y="48" textAnchor="middle" fill="currentColor" fontSize="8" opacity={0.5}
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity }}>
              #
            </motion.text>
          ))}
          {/* New block appearing */}
          <motion.g initial={{ x: 20, opacity: 0 }} animate={{ x: [20, 0], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}>
            <rect x="85" y="60" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1" fill="none" opacity={0.5} />
          </motion.g>
          {/* Decorative nodes */}
          {[[15, 70], [45, 75], [75, 68], [30, 20], [60, 22]].map(([x, y], i) => (
            <motion.circle key={i} cx={x} cy={y} r="2" fill="currentColor" opacity={0.3}
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }} />
          ))}
        </svg>
      );
    case 'brain':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Neural network nodes */}
          {/* Input layer */}
          {[25, 40, 55, 70].map((y, i) => (
            <motion.circle key={`in-${i}`} cx="15" cy={y} r="5" stroke="currentColor" strokeWidth="1.5" fill="none"
              animate={{ fill: ['transparent', 'rgba(255,255,255,0.3)', 'transparent'] }}
              transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity }} />
          ))}
          {/* Hidden layer 1 */}
          {[20, 35, 50, 65, 80].map((y, i) => (
            <motion.circle key={`h1-${i}`} cx="40" cy={y} r="4" stroke="currentColor" strokeWidth="1.5" fill="none"
              animate={{ fill: ['transparent', 'rgba(255,255,255,0.3)', 'transparent'] }}
              transition={{ duration: 1.5, delay: 0.3 + i * 0.08, repeat: Infinity }} />
          ))}
          {/* Hidden layer 2 */}
          {[30, 50, 70].map((y, i) => (
            <motion.circle key={`h2-${i}`} cx="65" cy={y} r="4" stroke="currentColor" strokeWidth="1.5" fill="none"
              animate={{ fill: ['transparent', 'rgba(255,255,255,0.3)', 'transparent'] }}
              transition={{ duration: 1.5, delay: 0.6 + i * 0.1, repeat: Infinity }} />
          ))}
          {/* Output */}
          <motion.circle cx="85" cy="50" r="6" stroke="currentColor" strokeWidth="2" fill="none"
            animate={{ fill: ['transparent', 'rgba(255,255,255,0.4)', 'transparent'], scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, delay: 0.9, repeat: Infinity }} />
          {/* Connections - animated signal flow */}
          {[25, 40, 55, 70].map((y1, i) =>
            [20, 35, 50, 65, 80].map((y2, j) => (
              <motion.line key={`c1-${i}-${j}`} x1="20" y1={y1} x2="36" y2={y2}
                stroke="currentColor" strokeWidth="0.5" opacity={0.2}
                animate={{ opacity: [0.1, 0.4, 0.1] }}
                transition={{ duration: 1, delay: (i + j) * 0.05, repeat: Infinity }} />
            ))
          )}
          {[20, 35, 50, 65, 80].map((y1, i) =>
            [30, 50, 70].map((y2, j) => (
              <motion.line key={`c2-${i}-${j}`} x1="44" y1={y1} x2="61" y2={y2}
                stroke="currentColor" strokeWidth="0.5" opacity={0.2}
                animate={{ opacity: [0.1, 0.4, 0.1] }}
                transition={{ duration: 1, delay: 0.3 + (i + j) * 0.05, repeat: Infinity }} />
            ))
          )}
          {[30, 50, 70].map((y, i) => (
            <motion.line key={`c3-${i}`} x1="69" y1={y} x2="79" y2="50"
              stroke="currentColor" strokeWidth="0.5" opacity={0.3}
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 1, delay: 0.6 + i * 0.1, repeat: Infinity }} />
          ))}
          {/* Signal pulse traveling through */}
          <motion.circle r="2" fill="currentColor"
            animate={{ cx: [15, 40, 65, 85], cy: [40, 50, 50, 50], opacity: [1, 1, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.5 }} />
        </svg>
      );
    case 'diamond':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Outer rotating diamond */}
          <motion.path d="M50 10 L85 40 L50 90 L15 40 Z" stroke="currentColor" strokeWidth="1.5" fill="none"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "50px 50px" }} />
          {/* Inner diamond */}
          <motion.path d="M50 25 L70 45 L50 75 L30 45 Z" stroke="currentColor" strokeWidth="1" fill="none" opacity={0.5}
            animate={{ rotate: [360, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "50px 50px" }} />
          {/* Facet lines */}
          <motion.path d="M15 40 L50 50 L85 40" stroke="currentColor" strokeWidth="0.5" fill="none" opacity={0.4} />
          <motion.path d="M50 50 L50 90" stroke="currentColor" strokeWidth="0.5" fill="none" opacity={0.4} />
          {/* Center gem */}
          <motion.circle cx="50" cy="50" r="8" stroke="currentColor" strokeWidth="1" fill="none"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }} />
          <motion.circle cx="50" cy="50" r="3" fill="currentColor"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }} />
          {/* Sparkle effects */}
          {[[30, 30], [70, 30], [25, 55], [75, 55], [40, 80], [60, 80]].map(([x, y], i) => (
            <motion.circle key={i} cx={x} cy={y} r="1.5" fill="currentColor"
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
              transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }} />
          ))}
          {/* Glow pulse */}
          <motion.circle cx="50" cy="50" r="15" stroke="currentColor" fill="none" strokeWidth="1"
            animate={{ r: [15, 30], opacity: [0.5, 0] }}
            transition={{ duration: 2, repeat: Infinity }} />
        </svg>
      );
    case 'pulse':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Background grid */}
          {[20, 40, 60, 80].map((y) => (
            <line key={y} x1="5" y1={y} x2="95" y2={y} stroke="currentColor" strokeWidth="0.3" opacity={0.2} />
          ))}
          {/* Main heartbeat line */}
          <motion.path
            d="M5 50 L20 50 L25 50 L30 35 L35 65 L40 25 L45 75 L50 40 L55 60 L60 45 L65 55 L70 50 L95 50"
            stroke="currentColor" strokeWidth="2" fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1] }}
            transition={{ duration: 2, repeat: Infinity }} />
          {/* Scanning line */}
          <motion.line x1="5" y1="10" x2="5" y2="90" stroke="currentColor" strokeWidth="1" opacity={0.3}
            animate={{ x1: [5, 95], x2: [5, 95] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
          {/* Data points */}
          <motion.circle cx="40" cy="25" r="3" fill="currentColor"
            initial={{ scale: 0 }} animate={{ scale: [0, 1, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, times: [0, 0.2, 0.8, 1] }} />
          <motion.circle cx="45" cy="75" r="3" fill="currentColor"
            initial={{ scale: 0 }} animate={{ scale: [0, 1, 1, 0] }}
            transition={{ duration: 2, delay: 0.1, repeat: Infinity, times: [0, 0.2, 0.8, 1] }} />
          {/* Pulse rings */}
          <motion.circle cx="50" cy="50" r="10" stroke="currentColor" fill="none" strokeWidth="1"
            animate={{ r: [10, 40], opacity: [0.6, 0] }}
            transition={{ duration: 2, repeat: Infinity }} />
          <motion.circle cx="50" cy="50" r="10" stroke="currentColor" fill="none" strokeWidth="1"
            animate={{ r: [10, 40], opacity: [0.6, 0] }}
            transition={{ duration: 2, delay: 0.5, repeat: Infinity }} />
          {/* BPM display */}
          <motion.text x="80" y="20" fill="currentColor" fontSize="10" fontFamily="monospace"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}>
            127
          </motion.text>
        </svg>
      );
    case 'waves':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Multiple animated wave layers */}
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.path
              key={i}
              d={`M0 ${50 + i * 8} Q25 ${40 + i * 8} 50 ${50 + i * 8} T100 ${50 + i * 8}`}
              stroke="currentColor"
              strokeWidth={2 - i * 0.3}
              fill="none"
              opacity={1 - i * 0.15}
              animate={{
                d: [
                  `M0 ${50 + i * 8} Q25 ${40 + i * 8} 50 ${50 + i * 8} T100 ${50 + i * 8}`,
                  `M0 ${50 + i * 8} Q25 ${60 + i * 8} 50 ${50 + i * 8} T100 ${50 + i * 8}`,
                  `M0 ${50 + i * 8} Q25 ${40 + i * 8} 50 ${50 + i * 8} T100 ${50 + i * 8}`,
                ]
              }}
              transition={{ duration: 2 + i * 0.3, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
          {/* Floating particles */}
          {[[15, 35], [30, 60], [50, 25], [70, 70], [85, 40]].map(([x, y], i) => (
            <motion.circle key={i} cx={x} cy={y} r="2" fill="currentColor" opacity={0.5}
              animate={{ y: [y, y - 10, y], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2 + i * 0.2, repeat: Infinity }} />
          ))}
          {/* Sound bars on sides */}
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.rect key={`l-${i}`} x={5} y={35 + i * 7} width="3" height="5" fill="currentColor" opacity={0.4}
              animate={{ height: [5, 15, 5], y: [35 + i * 7, 30 + i * 7, 35 + i * 7] }}
              transition={{ duration: 0.5 + i * 0.1, repeat: Infinity }} />
          ))}
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.rect key={`r-${i}`} x={92} y={35 + i * 7} width="3" height="5" fill="currentColor" opacity={0.4}
              animate={{ height: [5, 15, 5], y: [35 + i * 7, 30 + i * 7, 35 + i * 7] }}
              transition={{ duration: 0.5 + i * 0.1, delay: 0.2, repeat: Infinity }} />
          ))}
        </svg>
      );
    case 'code':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Code brackets */}
          <motion.path d="M25 20 L10 50 L25 80" stroke="currentColor" strokeWidth="3" fill="none"
            animate={{ x: [-3, 0, -3] }}
            transition={{ duration: 1.5, repeat: Infinity }} />
          <motion.path d="M75 20 L90 50 L75 80" stroke="currentColor" strokeWidth="3" fill="none"
            animate={{ x: [3, 0, 3] }}
            transition={{ duration: 1.5, repeat: Infinity }} />
          {/* Slash */}
          <motion.line x1="60" y1="15" x2="40" y2="85" stroke="currentColor" strokeWidth="2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }} />
          {/* Code lines */}
          {[30, 42, 54, 66].map((y, i) => (
            <motion.rect key={i} x={35} y={y} width={30 - i * 3} height="3" fill="currentColor" opacity={0.3}
              animate={{ width: [30 - i * 3, 35, 30 - i * 3], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 1 + i * 0.2, repeat: Infinity }} />
          ))}
          {/* Cursor blink */}
          <motion.rect x="55" y="54" width="2" height="10" fill="currentColor"
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }} />
          {/* Flying characters */}
          {['0', '1', '{', '}', ';'].map((char, i) => (
            <motion.text key={i} fill="currentColor" fontSize="8" opacity={0.3}
              animate={{
                x: [10 + i * 15, 90],
                y: [20 + i * 12, 80 - i * 8],
                opacity: [0, 0.5, 0]
              }}
              transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}>
              {char}
            </motion.text>
          ))}
        </svg>
      );
    case 'globe':
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Main globe circle */}
          <motion.circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="1.5" fill="none" />
          {/* Latitude lines */}
          {[-20, 0, 20].map((offset, i) => (
            <motion.ellipse key={`lat-${i}`} cx="50" cy={50 + offset} rx="35" ry={8 - Math.abs(offset) * 0.2}
              stroke="currentColor" strokeWidth="0.5" fill="none" opacity={0.3} />
          ))}
          {/* Rotating longitude lines */}
          <motion.g animate={{ rotateY: 360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "50px 50px" }}>
            <ellipse cx="50" cy="50" rx="15" ry="35" stroke="currentColor" strokeWidth="0.5" fill="none" opacity={0.4} />
            <ellipse cx="50" cy="50" rx="28" ry="35" stroke="currentColor" strokeWidth="0.5" fill="none" opacity={0.3} />
          </motion.g>
          {/* Orbiting satellite */}
          <motion.g animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "50px 50px" }}>
            <circle cx="50" cy="10" r="3" fill="currentColor" />
            <motion.circle cx="50" cy="10" r="3" stroke="currentColor" fill="none"
              animate={{ r: [3, 8], opacity: [0.8, 0] }}
              transition={{ duration: 1, repeat: Infinity }} />
          </motion.g>
          {/* Data points on globe */}
          {[[35, 35], [65, 40], [45, 60], [60, 65], [50, 45]].map(([x, y], i) => (
            <motion.circle key={i} cx={x} cy={y} r="2" fill="currentColor"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2, delay: i * 0.4, repeat: Infinity }} />
          ))}
          {/* Connection lines between points */}
          <motion.path d="M35 35 Q50 30 65 40" stroke="currentColor" strokeWidth="0.5" fill="none" opacity={0.3}
            animate={{ opacity: [0.1, 0.5, 0.1] }}
            transition={{ duration: 2, repeat: Infinity }} />
          <motion.path d="M45 60 Q55 55 60 65" stroke="currentColor" strokeWidth="0.5" fill="none" opacity={0.3}
            animate={{ opacity: [0.1, 0.5, 0.1] }}
            transition={{ duration: 2, delay: 0.5, repeat: Infinity }} />
          {/* Center glow */}
          <motion.circle cx="50" cy="50" r="5" fill="currentColor" opacity={0.2}
            animate={{ r: [5, 8, 5], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 3, repeat: Infinity }} />
        </svg>
      );
    default:
      return null;
  }
}

// Blueprint schematic card - large icon focused
function BlueprintSchematic({
  project,
  index,
  onClick,
  isVisible,
}: {
  project: typeof PROJECTS[0];
  index: number;
  onClick: () => void;
  isVisible: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.8,
        y: isVisible ? 0 : 20
      }}
      transition={{ delay: index * 0.12, duration: 0.5, ease: "easeOut" }}
      onClick={onClick}
      className="relative cursor-pointer group h-full"
    >
      {/* Main schematic box */}
      <div className="relative h-full border border-white/30 bg-white/5 hover:bg-white/10 hover:border-white/50 transition-all duration-300 p-4 flex flex-col overflow-hidden">
        {/* Corner marks */}
        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-white/70" />
        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-white/70" />
        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-white/70" />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-white/70" />

        {/* Top header - Codename and Status */}
        <div className="flex items-center justify-between mb-2 relative z-10">
          <div className="text-[10px] text-white/50 font-mono tracking-widest">
            {project.codename}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[9px] text-green-400/80 font-mono">{project.status}</span>
          </div>
        </div>

        {/* Large Animated Icon - takes up most of the space */}
        <div className="flex-1 relative flex items-center justify-center min-h-0">
          <div className="w-full h-full max-w-[140px] max-h-[140px] md:max-w-[160px] md:max-h-[160px] text-white/60 group-hover:text-white/90 transition-colors duration-300">
            <AnimatedIcon type={project.iconType} />
          </div>
          {/* Glow effect behind icon on hover */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              className="w-24 h-24 rounded-full bg-white/0 group-hover:bg-white/5 blur-2xl transition-all duration-500"
            />
          </div>
        </div>

        {/* Bottom section - Title and key stat */}
        <div className="relative z-10 mt-2">
          {/* Title */}
          <h3 className="text-white font-mono text-sm md:text-base font-bold mb-2 group-hover:text-white transition-colors leading-tight truncate">
            {project.title}
          </h3>

          {/* Single key stat - most impressive one */}
          <div className="flex items-center justify-between py-2 px-3 border border-white/20 rounded bg-white/5 group-hover:border-white/30 transition-colors">
            <span className="text-white/40 text-[9px] font-mono tracking-wider">{project.specs[0].label}</span>
            <span className="text-white font-mono text-sm font-bold">{project.specs[0].value}</span>
          </div>
        </div>

        {/* Scan line effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background: 'linear-gradient(transparent 50%, rgba(255,255,255,0.02) 50%)',
            backgroundSize: '100% 4px',
          }}
        />

        {/* Click indicator */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[8px] text-white/40 font-mono">CLICK TO EXPAND</span>
        </div>
      </div>
    </motion.div>
  );
}

// Project Detail Modal
function ProjectDetail3D({
  project,
  onClose,
}: {
  project: typeof PROJECTS[0];
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-8"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/85" />

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[800px] max-h-[85vh] overflow-y-auto bg-[#0c1829] rounded-2xl border-2 border-white/30"
        style={{ padding: '48px' }}
      >
        {/* Close button - absolute positioned in top right */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all z-10"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Codename and Status */}
        <div className="flex items-center gap-3" style={{ marginBottom: '32px' }}>
          <span className="text-white/40 text-xs font-mono tracking-[0.2em]">
            {project.codename}
          </span>
          <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-400 text-xs font-medium">
            {project.status}
          </span>
        </div>

        {/* Icon and Title */}
        <div className="flex items-center gap-6" style={{ marginBottom: '32px' }}>
          <div className="w-16 h-16 text-white flex-shrink-0">
            <AnimatedIcon type={project.iconType} />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            {project.title}
          </h2>
        </div>

        {/* Description */}
        <p className="text-white/70 text-base leading-relaxed" style={{ marginBottom: '32px' }}>
          {project.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4" style={{ marginBottom: '32px' }}>
          {project.specs.map((spec) => (
            <div
              key={spec.label}
              className="flex flex-col items-center justify-center py-5 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="text-xl md:text-2xl font-semibold text-white text-center leading-none tabular-nums" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontVariantNumeric: 'tabular-nums' }}>
                {spec.value}
              </div>
              <div className="text-white/40 text-[11px] font-medium tracking-wider uppercase text-center mt-3">
                {spec.label}
              </div>
            </div>
          ))}
        </div>

        {/* Tech Stack */}
        <div style={{ marginBottom: '32px' }}>
          <div className="text-white/40 text-xs font-semibold tracking-wider uppercase mb-4">
            Technologies
          </div>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 text-sm font-medium border border-white/20 text-white/80 rounded-lg bg-white/5"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <div className="flex gap-4">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-3 py-4 border border-white/20 text-white font-medium hover:bg-white/10 transition-all text-sm rounded-xl"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
                View Source
              </a>
            )}
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-3 py-4 bg-white text-[#0c1829] font-semibold hover:bg-white/90 transition-all text-sm rounded-xl"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Launch Project
              </a>
            )}
          </div>

          {/* Private repo notice */}
          {project.isPrivate && (
            <div className="flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/10 rounded-xl">
              <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-white/50 text-sm">Private repository —</span>
              <a
                href="mailto:itairotem23@gmail.com?subject=Code%20Access%20Request"
                className="text-[#d4af37] text-sm font-medium hover:underline"
              >
                contact me to view code
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ProjectsSection({ progress }: ProjectsSectionProps) {
  const [selectedProject, setSelectedProject] = useState<typeof PROJECTS[0] | null>(null);

  // Calculate how many projects should be visible based on scroll progress
  const visibleCount = useMemo(() => {
    // Start showing projects after 10% progress, all visible by 60%
    const adjustedProgress = Math.max(0, (progress - 0.1) / 0.5);
    return Math.min(PROJECTS.length, Math.floor(adjustedProgress * (PROJECTS.length + 2)));
  }, [progress]);

  return (
    <div className="w-full h-full overflow-hidden relative flex flex-col" style={{ backgroundColor: '#0a1929' }}>
      {/* Blueprint grid background */}
      <div className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.06) 2px, transparent 2px),
            linear-gradient(90deg, rgba(255,255,255,0.06) 2px, transparent 2px),
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px, 100px 100px, 20px 20px, 20px 20px',
        }}
      />

      {/* Radial gradient overlay */}
      <div className="absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at center, transparent 0%, rgba(10, 25, 41, 0.4) 70%, rgba(10, 25, 41, 0.8) 100%)' }}
      />

      {/* Compact Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: progress > 0.1 ? 1 : 0, y: progress > 0.1 ? 0 : -20 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center py-6 px-4"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="h-px w-12 bg-white/30" />
          <span className="text-white/40 text-[9px] font-mono tracking-[0.3em]">TECHNICAL DOCUMENTATION</span>
          <div className="h-px w-12 bg-white/30" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold font-mono text-white tracking-tight">
          PROJECT BLUEPRINTS
        </h1>
      </motion.div>

      {/* Full-screen Grid Container */}
      <div className="relative flex-1 px-4 md:px-8 pb-4 flex items-center justify-center">
        <div className="w-full max-w-6xl h-full max-h-[calc(100vh-180px)] grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 md:gap-6">
          {PROJECTS.map((project, index) => (
            <BlueprintSchematic
              key={project.id}
              project={project}
              index={index}
              onClick={() => setSelectedProject(project)}
              isVisible={index < visibleCount}
            />
          ))}
        </div>
      </div>

      {/* Stats bar at bottom */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: progress > 0.3 ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-center justify-center gap-8 py-4 border-t border-white/10"
      >
        <div className="text-center">
          <span className="text-2xl font-bold font-mono text-white">{PROJECTS.length}</span>
          <span className="text-white/30 text-[10px] font-mono ml-2">PROJECTS</span>
        </div>
        <div className="w-px h-6 bg-white/20" />
        <div className="text-center">
          <span className="text-2xl font-bold font-mono text-white">6</span>
          <span className="text-white/30 text-[10px] font-mono ml-2">LIVE</span>
        </div>
        <div className="w-px h-6 bg-white/20" />
        <div className="text-center">
          <span className="text-2xl font-bold font-mono text-white">3+</span>
          <span className="text-white/30 text-[10px] font-mono ml-2">IN DEVELOPMENT</span>
        </div>
      </motion.div>

      {/* 3D Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetail3D
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
