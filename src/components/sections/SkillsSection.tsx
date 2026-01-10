'use client';

import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';

interface SkillsSectionProps {
  progress: number;
}

// Skill data with realistic crypto-style metrics
const SKILLS_DATA = [
  // Trading & Finance
  { name: 'Technical Analysis', symbol: 'TA', level: 95, change: +18.5, volume: '3.2M', category: 'Trading', color: '#22c55e' },
  { name: 'Risk Management', symbol: 'RISK', level: 92, change: +12.3, volume: '2.1M', category: 'Trading', color: '#16a34a' },
  { name: 'Market Research', symbol: 'MKT', level: 90, change: +15.7, volume: '1.8M', category: 'Trading', color: '#15803d' },
  { name: 'Portfolio Strategy', symbol: 'PORT', level: 88, change: +9.4, volume: '1.5M', category: 'Trading', color: '#166534' },
  // Web3
  { name: 'Blockchain', symbol: 'BLKC', level: 93, change: +22.1, volume: '2.8M', category: 'Web3', color: '#8b5cf6' },
  { name: 'Cryptocurrency', symbol: 'CRYPTO', level: 95, change: +28.4, volume: '3.5M', category: 'Web3', color: '#7c3aed' },
  { name: 'NFTs', symbol: 'NFT', level: 88, change: +16.2, volume: '1.9M', category: 'Web3', color: '#6d28d9' },
  { name: 'DeFi', symbol: 'DEFI', level: 85, change: +19.8, volume: '1.6M', category: 'Web3', color: '#5b21b6' },
  { name: 'Tokenomics', symbol: 'TOKEN', level: 82, change: +14.5, volume: '1.2M', category: 'Web3', color: '#4c1d95' },
  // Technical
  { name: 'Python', symbol: 'PY', level: 85, change: +11.2, volume: '2.4M', category: 'Technical', color: '#3776AB' },
  { name: 'AI Prompting', symbol: 'AI', level: 92, change: +45.3, volume: '2.9M', category: 'Technical', color: '#10b981' },
  { name: 'Data Analysis', symbol: 'DATA', level: 80, change: +8.7, volume: '1.4M', category: 'Technical', color: '#0ea5e9' },
  { name: 'SQL', symbol: 'SQL', level: 65, change: +5.2, volume: '890K', category: 'Technical', color: '#f97316' },
  // Marketing
  { name: 'Digital Marketing', symbol: 'DMKT', level: 88, change: +13.6, volume: '1.7M', category: 'Marketing', color: '#ec4899' },
  { name: 'Community Building', symbol: 'COMM', level: 90, change: +21.4, volume: '2.2M', category: 'Marketing', color: '#d946ef' },
  { name: 'Content Strategy', symbol: 'CONT', level: 85, change: +10.8, volume: '1.3M', category: 'Marketing', color: '#a855f7' },
];

// Generate fake chart data
function generateChartData(baseLevel: number, isUp: boolean) {
  const data = [];
  let value = baseLevel - 10;
  for (let i = 0; i < 24; i++) {
    value += (Math.random() - (isUp ? 0.3 : 0.7)) * 3;
    value = Math.max(baseLevel - 15, Math.min(baseLevel + 5, value));
    data.push(value);
  }
  if (isUp) data[data.length - 1] = baseLevel;
  return data;
}

// Mini sparkline chart component
function SparklineChart({ data, isUp }: { data: number[]; isUp: boolean }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((v - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`gradient-${isUp ? 'up' : 'down'}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={isUp ? '#22c55e' : '#ef4444'} stopOpacity="0.3" />
          <stop offset="100%" stopColor={isUp ? '#22c55e' : '#ef4444'} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,100 ${points} 100,100`}
        fill={`url(#gradient-${isUp ? 'up' : 'down'})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={isUp ? '#22c55e' : '#ef4444'}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

// Individual skill row component
function SkillRow({ skill, index, isVisible }: {
  skill: typeof SKILLS_DATA[0];
  index: number;
  isVisible: boolean;
}) {
  const [displayPrice, setDisplayPrice] = useState(skill.level);
  const chartData = useMemo(() => generateChartData(skill.level, skill.change > 0), [skill.level, skill.change]);
  const isUp = skill.change > 0;

  // Animate price fluctuation
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setDisplayPrice(prev => {
        const fluctuation = (Math.random() - 0.5) * 0.4;
        return Math.max(skill.level - 1, Math.min(skill.level + 1, prev + fluctuation));
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [isVisible, skill.level]);

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -30 }}
      transition={{ delay: index * 0.03, duration: 0.4, ease: 'easeOut' }}
      className="grid grid-cols-12 items-center gap-4 py-5 border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer group"
      style={{ paddingLeft: '40px', paddingRight: '40px' }}
    >
      {/* Rank */}
      <div className="col-span-1 text-white/30 text-sm font-medium">
        {index + 1}
      </div>

      {/* Name & Symbol */}
      <div className="col-span-3 flex items-center gap-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-xs"
          style={{ background: `linear-gradient(135deg, ${skill.color}40, ${skill.color}20)`, border: `1px solid ${skill.color}40` }}
        >
          {skill.symbol.slice(0, 2)}
        </div>
        <div>
          <div className="font-semibold text-white group-hover:text-[#d4af37] transition-colors">
            {skill.name}
          </div>
          <div className="text-xs text-white/40">{skill.symbol}</div>
        </div>
      </div>

      {/* Category */}
      <div className="col-span-2 hidden md:block">
        <span className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-white/50 border border-white/10">
          {skill.category}
        </span>
      </div>

      {/* Chart */}
      <div className="col-span-2 h-12">
        <SparklineChart data={chartData} isUp={isUp} />
      </div>

      {/* Price/Level */}
      <div className="col-span-2 text-right">
        <div className="text-white font-semibold" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          {displayPrice.toFixed(1)}
          <span className="text-white/40 text-sm ml-0.5">%</span>
        </div>
      </div>

      {/* 24h Change */}
      <div className="col-span-2 text-right">
        <div className={`text-sm flex items-center justify-end gap-1 font-medium ${isUp ? 'text-green-400' : 'text-red-400'}`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <span className="text-xs">{isUp ? '▲' : '▼'}</span>
          {Math.abs(skill.change).toFixed(1)}%
        </div>
        <div className="text-xs text-white/30" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>{skill.volume}</div>
      </div>
    </motion.div>
  );
}

// Stats card component
function StatCard({ label, value, change, delay }: { label: string; value: string; change?: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="bg-white/[0.03] rounded-xl p-5 border border-white/10"
    >
      <div className="text-white/40 text-xs uppercase tracking-wider mb-3 font-medium">{label}</div>
      <div className="flex items-baseline justify-between">
        <div className="text-2xl font-semibold text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>{value}</div>
        {change && (
          <div className={`text-sm font-medium ${change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
            {change} this year
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function SkillsSection({ progress }: SkillsSectionProps) {
  const [activeCategory, setActiveCategory] = useState('All Skills');
  const isVisible = progress > 0.1;
  const totalValue = SKILLS_DATA.reduce((sum, s) => sum + s.level, 0);
  const avgChange = SKILLS_DATA.reduce((sum, s) => sum + s.change, 0) / SKILLS_DATA.length;

  // Filter skills based on active category
  const filteredSkills = useMemo(() => {
    if (activeCategory === 'All Skills') return SKILLS_DATA;
    return SKILLS_DATA.filter(skill => skill.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="w-full h-full bg-[#0a0b0f] text-white overflow-hidden flex flex-col">
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Hero Stats Section */}
        <div style={{ padding: '48px 40px 40px 40px' }} className="border-b border-white/5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: '36px' }}
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-3">
              Technical Skills
              <span className="text-[#d4af37]"> Portfolio</span>
            </h1>
            <p className="text-white/50 text-lg">Real-time proficiency tracking across {SKILLS_DATA.length} technologies</p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <StatCard label="Portfolio Value" value={`${totalValue}%`} change="+127%" delay={0.1} />
            <StatCard label="Active Skills" value={SKILLS_DATA.length.toString()} delay={0.15} />
            <StatCard label="Avg. Growth" value={`${avgChange.toFixed(1)}%`} change="+45%" delay={0.2} />
            <StatCard label="Experience" value="5+ Years" delay={0.25} />
          </div>
        </div>

        {/* Category Tabs */}
        <div style={{ padding: '24px 40px' }} className="border-b border-white/5 flex items-center gap-3 overflow-x-auto">
          {['All Skills', 'Trading', 'Web3', 'Technical', 'Marketing'].map((cat, i) => (
            <motion.button
              key={cat}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-[#d4af37] text-black'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 items-center gap-4 py-4 text-xs text-white/40 uppercase tracking-wider border-b border-white/5 bg-white/[0.02] sticky top-0 font-medium" style={{ paddingLeft: '40px', paddingRight: '40px' }}>
          <div className="col-span-1">#</div>
          <div className="col-span-3">Skill</div>
          <div className="col-span-2 hidden md:block">Category</div>
          <div className="col-span-2">24h Chart</div>
          <div className="col-span-2 text-right">Proficiency</div>
          <div className="col-span-2 text-right">Growth</div>
        </div>

        {/* Skills List */}
        <div style={{ paddingBottom: '32px' }}>
          {filteredSkills.map((skill, i) => (
            <SkillRow
              key={skill.symbol}
              skill={skill}
              index={i}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>

      {/* Bottom Ticker */}
      <div className="border-t border-white/10 bg-[#0a0b0f] py-4 overflow-hidden" style={{ paddingLeft: '40px' }}>
        <motion.div
          animate={{ x: [0, -1500] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="flex gap-10 whitespace-nowrap"
        >
          {[...SKILLS_DATA, ...SKILLS_DATA, ...SKILLS_DATA].map((skill, i) => (
            <span key={i} className="flex items-center gap-3 text-sm">
              <span className="text-white/70 font-medium">{skill.symbol}</span>
              <span className="text-white" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>{skill.level}%</span>
              <span className={skill.change > 0 ? 'text-green-400' : 'text-red-400'} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                {skill.change > 0 ? '+' : ''}{skill.change.toFixed(1)}%
              </span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
