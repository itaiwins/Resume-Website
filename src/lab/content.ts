// Shared content for all lab concepts.
// Recruiter-facing: every entry leads with what it is, then a hard number, then the stack.
// Concepts import from here so switching visual direction never means retyping the resume.

export const IDENTITY = {
  name: 'Itai Rotem',
  // TODO(itai): confirm. Old site said "AI Engineer / Crypto Trader / Web3", but MCPSafe +
  // Mexant + Walleto read as a builder of AI tooling and trading infrastructure.
  role: 'Software Engineer',
  focus: 'AI tooling, security, and trading infrastructure',
  location: 'Florida, USA',
  education: 'Florida State University — Information Technology',
  email: 'itairotem23@gmail.com',
  github: 'https://github.com/itaiwins',
  linkedin: 'https://www.linkedin.com/in/itai-rotem23/',
  site: 'https://itairotem.com',
  available: true,
};

export type Project = {
  id: string;
  name: string;
  // One line. What it is, for someone who has never heard of it.
  blurb: string;
  // The single most defensible number. Shown large.
  metric: { value: string; label: string };
  // Two supporting numbers, max. More than three total reads as noise.
  support: { value: string; label: string }[];
  stack: string[];
  role: string;
  year: string;
  status: 'live' | 'building' | 'private';
  href?: string;
  repo?: string;
};

export const PROJECTS: Project[] = [
  {
    id: 'mcpsafe',
    name: 'MCPSafe',
    blurb:
      'Security scanner for the Model Context Protocol ecosystem. Detects prompt injection, data exfiltration, and over-broad permissions in MCP servers, then publishes trust scores so developers can vet a tool before wiring it into an agent.',
    metric: { value: '1,200+', label: 'vulnerabilities found' },
    support: [
      { value: '260+', label: 'servers scanned' },
      { value: '490+', label: 'scans run' },
    ],
    stack: ['Next.js', 'Hono', 'PostgreSQL', 'Redis', 'LLMs'],
    role: 'Sole engineer — scanner, API, registry, and frontend',
    year: '2026',
    status: 'live',
    href: 'https://mcpsafe.org',
    repo: 'https://github.com/itaiwins/mcp',
  },
  {
    id: 'mexant',
    name: 'Mexant',
    blurb:
      'AI software agency built around custom chatbots. Ships a live demo per vertical — restaurants, healthcare, real estate, e-commerce, home services, SaaS — each a working assistant, backed by an automated lead-gen and cold outreach pipeline.',
    metric: { value: '6', label: 'verticals live' },
    support: [
      { value: 'Auto', label: 'outreach pipeline' },
      { value: '2026', label: 'founded' },
    ],
    stack: ['Next.js', 'Railway', 'LLMs', 'Email APIs'],
    role: 'Founder and engineer',
    year: '2026',
    status: 'live',
    href: 'https://mexant.com',
  },
  {
    id: 'walleto',
    name: 'Walleto',
    blurb:
      'Crypto tracking platform for perpetual futures traders. Real-time PnL across exchanges, historical backtesting against your own fills, and an AI coach that reviews closed trades for repeated mistakes.',
    metric: { value: '15+', label: 'features shipped' },
    support: [
      { value: 'Live', label: 'backtesting' },
      { value: 'Soon', label: 'public launch' },
    ],
    stack: ['Next.js', 'Python', 'LLMs', 'Exchange APIs'],
    role: 'Founder and engineer',
    year: '2025—',
    status: 'building',
    href: 'https://walleto.ai',
  },
  {
    id: 'trading-systems',
    name: 'Automated Trading',
    blurb:
      'A suite of live trading and prediction bots. A confluence engine combines RSI, funding rates, CVD, and the Fear & Greed index into a single bias, then sizes and routes orders across crypto exchanges and Polymarket.',
    metric: { value: '5+', label: 'bots in production' },
    support: [
      { value: '24/7', label: 'live execution' },
      { value: '3', label: 'iterations rebuilt' },
    ],
    stack: ['Python', 'CCXT', 'Coinglass', 'Polymarket API', 'Telegram'],
    role: 'Sole engineer',
    year: '2024—',
    status: 'private',
  },
  {
    id: 'backtest',
    name: 'Backtest Engine',
    blurb:
      'Python framework for testing trading strategies against historical data. Pluggable strategy interface, Sharpe and Sortino, max-drawdown analysis, and publication-quality equity curves.',
    metric: { value: '10+', label: 'performance metrics' },
    support: [
      { value: '3+', label: 'strategies' },
      { value: 'Binance', label: 'data source' },
    ],
    stack: ['Python', 'Pandas', 'NumPy', 'Matplotlib'],
    role: 'Sole engineer',
    year: '2026',
    status: 'live',
    repo: 'https://github.com/itaiwins/backtesting-framework',
  },
  {
    id: 'signal-api',
    name: 'Signal API',
    blurb:
      'FastAPI service turning live market data into buy/sell/hold calls with confidence ratings, using RSI, MACD, and EMA crossovers. Dockerised and documented.',
    metric: { value: '40+', label: 'assets covered' },
    support: [
      { value: '3', label: 'indicators' },
      { value: 'Docker', label: 'deploys anywhere' },
    ],
    stack: ['Python', 'FastAPI', 'Pandas', 'Docker'],
    role: 'Sole engineer',
    year: '2026',
    status: 'live',
    repo: 'https://github.com/itaiwins/trading-signal-api',
  },
  {
    id: 'research-agent',
    name: 'Research Agent',
    blurb:
      'Autonomous crypto research CLI built on Claude tool-use. Fetches prices, aggregates news across sources, and writes a structured research brief without supervision.',
    metric: { value: '30+', label: 'assets supported' },
    support: [
      { value: 'Claude', label: 'tool-use loop' },
      { value: 'Multi', label: 'news sources' },
    ],
    stack: ['Python', 'Anthropic API', 'Typer', 'HTTPX'],
    role: 'Sole engineer',
    year: '2026',
    status: 'live',
    repo: 'https://github.com/itaiwins/crypto-research-agent',
  },
  {
    id: 'alphahq',
    name: 'AlphaHQ',
    blurb:
      'Paid trading community running daily technical analysis, trade signals, and one-on-one mentorship. Grown entirely through organic content on X.',
    metric: { value: '15+', label: 'paying members' },
    support: [
      { value: 'Daily', label: 'signals published' },
      { value: '2025', label: 'founded' },
    ],
    stack: ['Discord', 'X', 'Whop'],
    role: 'Founder',
    year: '2025—',
    status: 'live',
    href: 'https://whop.com/alphahq',
  },
];

export type Chapter = {
  version: string;
  period: string;
  title: string;
  org: string;
  summary: string;
  highlights: string[];
};

export const TIMELINE: Chapter[] = [
  {
    version: '04',
    period: '2026',
    title: 'Building AI developer tooling',
    org: 'MCPSafe · Mexant',
    summary:
      'Shipped a security scanner for the MCP ecosystem and founded an AI agency delivering production chatbots to businesses.',
    highlights: [
      'MCPSafe live with 260+ servers indexed',
      'Mexant shipping across 6 verticals',
      'Six open-source repos published',
    ],
  },
  {
    version: '03',
    period: '2024 — 2025',
    title: 'Founder & Engineer',
    org: 'Walleto · AlphaHQ',
    summary:
      'Built Walleto for perpetual-futures traders and founded AlphaHQ, a paid trading community with daily analysis and mentorship.',
    highlights: [
      'Three generations of automated trading bots',
      'Polymarket prediction bot in production',
      'Personal AI assistant, "Oura"',
    ],
  },
  {
    version: '02',
    period: '2022 — 2024',
    title: 'Trader & Entrepreneur',
    org: 'Independent',
    summary:
      'Stepped back from Web3 to run a sports-betting analytics group and work outside the industry, while trading throughout. Returned to crypto full-time in 2024.',
    highlights: [
      'Founded a sports betting analytics community',
      'Sharpened risk management under real capital',
    ],
  },
  {
    version: '01',
    period: '2019 — 2022',
    title: 'Community & Automation',
    org: 'Llamaverse · Self-employed',
    summary:
      'Event planner and moderator for an NFT project, handling investor questions and running online events. Before that, wrote scraping bots to buy and resell limited sneaker drops — the first taste of automation.',
    highlights: [
      'Ran game nights, AMAs, and speaker events',
      'Moderated a large Discord community',
      'Built and operated retail purchase bots',
    ],
  },
];

// Shown as a fast-scan strip. Only numbers that are true and checkable.
export const FACTS = [
  { value: '8', label: 'projects shipped' },
  { value: '6', label: 'public repos' },
  { value: '3', label: 'ventures founded' },
  { value: '5+', label: 'years building' },
];

export const CAPABILITIES = [
  {
    group: 'Engineering',
    items: ['TypeScript', 'Python', 'Next.js', 'React', 'Hono / FastAPI', 'PostgreSQL', 'Redis', 'Docker'],
  },
  {
    group: 'AI',
    items: ['LLM tool-use', 'Agent design', 'Prompt engineering', 'Anthropic API', 'RAG'],
  },
  {
    group: 'Markets',
    items: ['Exchange APIs', 'Backtesting', 'Risk management', 'Technical analysis'],
  },
];
