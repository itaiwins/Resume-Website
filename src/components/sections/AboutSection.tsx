'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

interface AboutSectionProps {
  progress: number;
}

// Terminal commands and outputs
const TERMINAL_CONTENT = [
  { type: 'command', text: 'whoami', delay: 0 },
  { type: 'output', text: 'itai_rotem', delay: 0.3 },
  { type: 'blank', text: '', delay: 0.5 },
  { type: 'command', text: 'cat ~/about.txt', delay: 0.6 },
  { type: 'output', text: '╔══════════════════════════════════════════════════════════════╗', delay: 0.9 },
  { type: 'output', text: '║                                                              ║', delay: 0.95 },
  { type: 'output', text: '║   Web3 Builder & Crypto Trader                              ║', delay: 1.0 },
  { type: 'output', text: '║   FSU Information Technology Student                        ║', delay: 1.05 },
  { type: 'output', text: '║                                                              ║', delay: 1.1 },
  { type: 'output', text: '╚══════════════════════════════════════════════════════════════╝', delay: 1.15 },
  { type: 'blank', text: '', delay: 1.3 },
  { type: 'command', text: 'ls -la ~/skills/', delay: 1.4 },
  { type: 'output', text: 'drwxr-xr-x  crypto_trading/', delay: 1.6 },
  { type: 'output', text: 'drwxr-xr-x  web3_blockchain/', delay: 1.65 },
  { type: 'output', text: 'drwxr-xr-x  python_automation/', delay: 1.7 },
  { type: 'output', text: 'drwxr-xr-x  community_building/', delay: 1.75 },
  { type: 'blank', text: '', delay: 1.9 },
  { type: 'command', text: 'echo $MISSION', delay: 2.0 },
  { type: 'output', text: '"Building tools for traders and pushing the boundaries of Web3."', delay: 2.2 },
  { type: 'blank', text: '', delay: 2.4 },
  { type: 'command', text: 'uptime', delay: 2.5 },
  { type: 'output', text: '5+ years in markets, 6+ projects shipped, ∞ cans of coke zero', delay: 2.7 },
];

// Typing animation component
function TypedText({ text, delay, onComplete }: { text: string; delay: number; onComplete?: () => void }) {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let index = 0;
      const interval = setInterval(() => {
        if (index <= text.length) {
          setDisplayText(text.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
          setIsComplete(true);
          onComplete?.();
        }
      }, 30);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [text, delay, onComplete]);

  return (
    <span>
      {displayText}
      {!isComplete && <span className="animate-pulse">▋</span>}
    </span>
  );
}

// Info row for the sidebar - side by side layout
function InfoRow({ label, value, delay }: { label: string; value: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex items-center justify-between py-3"
    >
      <div className="text-[11px] text-white/30 uppercase tracking-wider">{label}</div>
      <div className="text-white font-medium text-sm">{value}</div>
    </motion.div>
  );
}

export default function AboutSection({ progress }: AboutSectionProps) {
  const [visibleLines, setVisibleLines] = useState(0);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Progress controls how many lines are visible
  useEffect(() => {
    const maxLines = Math.floor(progress * TERMINAL_CONTENT.length * 1.5);
    setVisibleLines(Math.min(maxLines, TERMINAL_CONTENT.length));
  }, [progress]);

  // Auto-scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [visibleLines]);

  return (
    <div className="w-full h-full bg-[#0a0a0a] text-white overflow-hidden flex items-center justify-center p-4 md:p-10 lg:p-16">
      {/* Centered Container */}
      <div className="w-full max-w-6xl h-full max-h-[85vh] flex flex-col lg:flex-row rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        {/* Left Side - Terminal */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          {/* Terminal Window Chrome */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-[#1a1a1a] border-b border-white/10 px-4 py-3 flex items-center gap-4"
          >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
          </div>
          <div className="flex-1 text-center">
            <span className="text-white/40 text-sm font-mono">itai@portfolio ~ zsh</span>
          </div>
          <div className="text-white/20 text-xs">⌘K</div>
        </motion.div>

        {/* Terminal Content */}
        <div
          ref={terminalRef}
          className="flex-1 p-6 font-mono text-sm overflow-y-auto bg-gradient-to-b from-[#0d0d0d] to-[#0a0a0a]"
        >
          {/* Welcome Banner */}
          <motion.pre
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-[#d4af37] text-xs mb-6 hidden md:block"
          >
{`
 ██╗████████╗ █████╗ ██╗    ██████╗  ██████╗ ████████╗███████╗███╗   ███╗
 ██║╚══██╔══╝██╔══██╗██║    ██╔══██╗██╔═══██╗╚══██╔══╝██╔════╝████╗ ████║
 ██║   ██║   ███████║██║    ██████╔╝██║   ██║   ██║   █████╗  ██╔████╔██║
 ██║   ██║   ██╔══██║██║    ██╔══██╗██║   ██║   ██║   ██╔══╝  ██║╚██╔╝██║
 ██║   ██║   ██║  ██║██║    ██║  ██║╚██████╔╝   ██║   ███████╗██║ ╚═╝ ██║
 ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝    ╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚══════╝╚═╝     ╚═╝
`}
          </motion.pre>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-white/40 text-xs mb-6"
          >
            Last login: {new Date().toLocaleDateString()} on ttys000
          </motion.div>

          {/* Terminal Lines */}
          <div className="space-y-1">
            {TERMINAL_CONTENT.slice(0, visibleLines).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`${line.type === 'blank' ? 'h-4' : ''}`}
              >
                {line.type === 'command' && (
                  <div className="flex items-center gap-2">
                    <span className="text-[#d4af37]">➜</span>
                    <span className="text-[#00d9ff]">~</span>
                    <span className="text-green-400">{line.text}</span>
                  </div>
                )}
                {line.type === 'output' && (
                  <div className="text-white/70 pl-4">{line.text}</div>
                )}
              </motion.div>
            ))}

            {/* Blinking Cursor */}
            {visibleLines >= TERMINAL_CONTENT.length && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <span className="text-[#d4af37]">➜</span>
                <span className="text-[#00d9ff]">~</span>
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="w-2 h-4 bg-white/70 inline-block"
                />
              </motion.div>
            )}
          </div>
        </div>

        {/* Terminal Status Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-[#1a1a1a] border-t border-white/10 px-4 py-2 flex items-center justify-between text-xs font-mono"
        >
          <div className="flex items-center gap-4">
            <span className="text-green-400">● zsh</span>
            <span className="text-white/40">utf-8</span>
          </div>
          <div className="flex items-center gap-4 text-white/40">
            <span>ln 24, col 1</span>
            <span>100%</span>
          </div>
        </motion.div>

        {/* Mobile Quick Actions - visible only on mobile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="lg:hidden bg-[#0a0a0a] border-t border-white/10 p-4 flex flex-col gap-3"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] to-[#a08530] flex items-center justify-center">
                <span className="text-sm font-bold text-black">IR</span>
              </div>
              <div>
                <div className="text-sm font-semibold">Itai Rotem</div>
                <div className="text-xs text-white/40">Web3 Builder & Trader</div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-400 text-xs">Open</span>
            </div>
          </div>
          <div className="flex gap-2">
            <motion.a
              href="/Itai_Rotem_Resume.docx"
              download
              whileTap={{ scale: 0.95 }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#c9a432] text-black font-semibold text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Resume
            </motion.a>
            <a
              href="mailto:itairotem23@gmail.com"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 font-medium text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email
            </a>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Info Panel */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="w-[380px] border-l border-white/10 bg-[#0a0a0a] hidden lg:flex flex-col"
      >
        {/* Profile Header */}
        <div className="mx-6 my-6 px-6 py-8 text-center border-b border-white/5">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="w-20 h-20 mx-auto mb-5 rounded-full bg-gradient-to-br from-[#d4af37] to-[#a08530] flex items-center justify-center shadow-lg shadow-[#d4af37]/20"
          >
            <span className="text-2xl font-bold text-black tracking-tight">IR</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl font-semibold tracking-tight mb-1"
          >
            Itai Rotem
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-white/40 text-sm mb-4"
          >
            Web3 Builder & Trader
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-xs font-medium">Open to work</span>
          </motion.div>
        </div>

        {/* Info Section */}
        <div className="mx-6 px-6 py-6 border-b border-white/5">
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xs font-medium text-white/30 uppercase tracking-widest mb-4"
          >
            Details
          </motion.h3>
          <div className="space-y-1">
            <InfoRow label="Focus" value="Web3 & Trading" delay={0.55} />
            <InfoRow label="Location" value="Florida, USA" delay={0.6} />
            <InfoRow label="Education" value="FSU - IT Major" delay={0.65} />
            <InfoRow label="Status" value="Building" delay={0.7} />
          </div>
        </div>

        {/* Connect Section */}
        <div className="mx-6 px-6 py-6">
          <motion.h3
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
            className="text-xs font-medium text-white/30 uppercase tracking-widest mb-4"
          >
            Connect
          </motion.h3>
          <div className="space-y-2">
            {[
              { label: 'Email', value: 'itairotem23@gmail.com', href: 'mailto:itairotem23@gmail.com' },
              { label: 'GitHub', value: 'github.com/itaiwins', href: 'https://github.com/itaiwins' },
              { label: 'LinkedIn', value: 'linkedin.com/in/itai-rotem23', href: 'https://www.linkedin.com/in/itai-rotem23/' },
            ].map((link, i) => (
              <motion.a
                key={link.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.08 }}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between py-3 rounded-lg hover:bg-white/[0.03] transition-colors group"
              >
                <div className="text-[11px] text-white/30 uppercase tracking-wider">{link.label}</div>
                <div className="text-sm text-white/70 group-hover:text-[#d4af37] transition-colors">
                  {link.value}
                </div>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Resume Download Section - Centered in remaining space */}
        <div className="flex-1 flex items-center justify-center mx-6 my-6">
          <div className="flex flex-col items-center">
            <motion.a
              href="/Itai_Rotem_Resume.docx"
              download
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0, duration: 0.4 }}
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(212, 175, 55, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-4 text-lg rounded-full bg-gradient-to-r from-[#d4af37] to-[#c9a432] text-black font-semibold hover:from-[#e5c349] hover:to-[#d4af37] transition-all shadow-lg shadow-[#d4af37]/20"
              style={{ padding: '12px 24px' }}
            >
              <motion.svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ y: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </motion.svg>
              Download Resume
            </motion.a>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="text-white/20 text-xs mt-4"
            >
              DOCX • Updated 2025
            </motion.p>
          </div>
        </div>
      </motion.div>
      </div>
    </div>
  );
}
