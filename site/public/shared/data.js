// Content for the desktop. Every fact below is copied from the live
// itairotem.com (fetched 2026-11-13), the project's own live page, its App
// Store listing, or its GitHub repo (the same vetted set as itairotem-log,
// checked line by line on MEXA-2055). Nothing here is invented; sentences
// that are not verbatim are built only from facts in those sources.
// Dropped on purpose: the dead github.com/itaiwins/mcp link and the
// "immersive 3D portfolio you are currently exploring" line.
window.DATA = {
  name: "Itai Rotem",
  title: "Itai Rotem | AI Engineer & Crypto Trader",
  tagline: "AI Engineer · Crypto Trader · Web3",
  status: "Open to work",
  email: "itairotem23@gmail.com",

  welcome: [
    "Hi, I'm Itai Rotem.",
    "",
    "I'm an AI engineer and crypto trader in Florida, USA, studying Information Technology at FSU.",
    "",
    "I founded Mexant LLC. It ships Tend, an iPhone app for tasks, calendar, habits and notes, and MCPSafe, a security scanner for MCP servers. I'm also building Unskippable, an iPhone app that takes a video from idea to posted. It's in invite-only beta.",
    "",
    "Before that: three iterations of automated crypto trading bots, a paid trading community (AlphaHQ), and Walleto, a crypto tracking platform for perpetual trades.",
    "",
    "I'm open to work.",
    "",
    "Double-click the icons on the desktop to explore:",
    "",
    "    About Me ...... who I am",
    "    Projects ...... what I've built",
    "    Experience .... where I've worked",
    "    Skills ........ what I'm good at",
    "    Contact ....... how to reach me",
    "",
    "Thanks for stopping by."
  ],

  about: {
    lines: ["Web3 Builder & Crypto Trader", "FSU Information Technology Student"],
    mission: "Building tools for traders and pushing the boundaries of Web3.",
    summary: "5+ years in markets, 6+ projects shipped, ∞ cans of coke zero",
    details: [["Focus", "Web3 & Trading"], ["Location", "Florida, USA"], ["Education", "FSU - IT Major"], ["Status", "Building"]],
    stats: [["5+", "Years in Web3"], ["6+", "Projects Built"], ["3", "Companies Founded"], ["∞", "Cans of Coke Zero"]],
    faq: [
      ["What kind of projects do you work on?", "I specialize in crypto trading systems, Web3 development, and AI-powered automation. I love building tools that give traders an edge."],
      ["Are you available for freelance work?", "Yes! I'm open to freelance and consulting opportunities, especially in the crypto/Web3 space. Let's discuss your project."],
      ["What's your typical response time?", "I usually respond within 24-48 hours. For urgent matters, mention it in your message or DM me on Twitter."]
    ]
  },

  // One icon per project. `shot` is a screenshot of the project's own public
  // page, taken 2026-11-13 (public/img). Projects without a public page have none.
  projects: [
    {
      id: "tend", name: "Tend", icon: "app", status: "Live on the App Store", when: "Released 2026-11-06 · version 1.0.1",
      shot: "tend.jpg", shotAlt: "The Tend page on mexant.com",
      body: [
        "Tend is a calm place for your day. Tasks, calendar, habits and notes live together, and one assistant bar files whatever you type or say.",
        "Just type it. “Dentist Tuesday at 3” becomes an event, “buy milk” becomes a task and “read 10 pages every day” becomes a habit."
      ],
      bullets: [
        "Your whole day in one view: tasks, events from your iPhone calendars, habits and the weather.",
        "Habits with streaks and tallies.",
        "Notes with styles, checklists, tables, photos and document scanning. Lock a note with Face ID, and sort notes into folders.",
        "Home Screen and Lock Screen widgets, plus a “Today” Live Activity.",
        "Apple Health (optional, read-only): steps, energy and workouts next to your day.",
        "Works offline. Sign in with Apple to sync between devices, or don’t sign in at all."
      ],
      facts: [["Platform", "iPhone"], ["Seller", "Mexant LLC"], ["Version", "1.0.1"]],
      tech: ["Expo", "React Native", "Cloudflare Workers"],
      links: [
        { label: "View on the App Store", href: "https://apps.apple.com/us/app/tend-agentic-notes/id6815052928" },
        { label: "mexant.com/tend", href: "https://www.mexant.com/tend" }
      ]
    },
    {
      id: "unskippable", name: "Unskippable", icon: "app", status: "Invite-only beta on iPhone", when: "First commit 2026-10-17",
      shot: "unskippable.jpg", shotAlt: "The getunskippable.com home page",
      body: [
        "Unskippable takes a video from idea to posted in one app: ideas built on what works for you, filming help shot by shot, a one-tap edit, a Ready to post? check, then what worked, against your own usual. Invite-only beta on iPhone.",
        "Free during the beta. You post it yourself, from your phone’s share sheet. It never posts for you."
      ],
      facts: [["Access", "Invite-only"], ["Platform", "iPhone"], ["Price", "Free in beta"]],
      tech: ["Expo", "React Native", "Node.js", "Turso"],
      links: [{ label: "getunskippable.com", href: "https://getunskippable.com" }]
    },
    {
      id: "mcpsafe", name: "MCPSafe", icon: "shield", status: "Live", when: "First commit 2026-01-18 · a Mexant LLC product since 2026-10-14",
      shot: "mcpsafe.jpg", shotAlt: "The mcpsafe.org home page",
      body: [
        "MCPSafe is a security scanner and quality registry for Model Context Protocol (MCP) servers. Scan, verify, and discover trusted MCP servers.",
        "Open security scanner for the MCP (Model Context Protocol) ecosystem. Analyzes MCP servers for vulnerabilities including prompt injection, data exfiltration, and excessive permissions. Features a public registry of 260+ scanned servers, automated vulnerability detection, and trust scores to help developers ship safer AI tool integrations.",
        "Registry metadata is live; public security findings are published only after review gates pass. A Mexant LLC product."
      ],
      facts: [["Servers", "260+"], ["Vulns found", "1,200+"], ["Scans", "490+"], ["Operator", "Mexant LLC"]],
      tech: ["Next.js", "Hono", "PostgreSQL", "Redis", "AI/LLMs"],
      links: [{ label: "mcpsafe.org", href: "https://mcpsafe.org" }]
    },
    {
      id: "mexant", name: "Mexant", icon: "briefcase", status: "Live", when: "First commit 2026-01-20 · Mexant LLC",
      shot: "mexant.jpg", shotAlt: "The mexant.com home page",
      body: [
        "Mexant builds the shop, the back office and the books for small businesses, and makes them agree. Shipped in weeks, not quarters.",
        "It started as an AI-powered software agency that builds custom chatbot solutions for businesses. Features an automated lead generation engine, multi-vertical demo portfolio, and cold outreach system. Live demos span restaurants, healthcare, real estate, e-commerce, home services, and SaaS — each with a fully functional AI assistant tailored to the vertical.",
        "Now Mexant LLC. Tend and MCPSafe ship under it."
      ],
      facts: [["Entity", "Mexant LLC"], ["Ships", "In weeks"], ["Products", "Tend, MCPSafe"], ["Verticals", "6"]],
      tech: ["Next.js", "Cloudflare Workers", "AI/LLMs", "Email APIs"],
      links: [{ label: "mexant.com", href: "https://mexant.com" }]
    },
    {
      id: "walleto", name: "Walleto", icon: "chart", status: "Launching", when: "",
      shot: "walleto.jpg", shotAlt: "The walleto.ai home page",
      body: [
        "Comprehensive crypto tracking platform for perpetual trades. Features real-time PnL tracking, advanced backtesting capabilities, and an AI trading coach to help optimize your strategy."
      ],
      facts: [["Features", "15+"], ["Backtest", "Live"], ["AI coach", "Yes"]],
      tech: ["Next.js", "Python", "AI/LLMs", "Trading APIs"],
      links: [{ label: "walleto.ai", href: "https://walleto.ai" }]
    },
    {
      id: "trading", name: "Automated Trading", icon: "bot", status: "Operational · private", when: "",
      body: [
        "Suite of automated trading systems including crypto trading bots and Polymarket prediction bots. Uses live market indicators, funding rates, sentiment analysis, and a confluence engine combining RSI, Fear & Greed Index, CVD, and trend bias. Analyzes odds and identifies value bets across crypto and prediction markets."
      ],
      facts: [["Bots", "5+"], ["Markets", "Crypto / Polymarket"], ["Signals", "Live"]],
      tech: ["Python", "CCXT", "Coinglass", "Polymarket API", "Telegram"],
      links: []
    },
    {
      id: "alphahq", name: "AlphaHQ", icon: "people", status: "Live", when: "Since January 2025",
      body: [
        "Premium crypto trading community providing daily technical analysis, trade signals, and 1-on-1 mentorship. Educational content on blockchain, DeFi, and market psychology. Grown through Twitter/X marketing strategy."
      ],
      facts: [["Members", "15+"], ["Signals", "Daily"], ["Mentorship", "1-on-1"]],
      tech: ["Discord", "Twitter/X", "Trading", "Education"],
      links: [{ label: "whop.com/alphahq", href: "https://whop.com/alphahq" }]
    },
    {
      id: "oura", name: "Oura AI", icon: "bot", status: "Operational · private", when: "",
      body: [
        "Personal AI secretary built to handle daily tasks, scheduling, research, and communication. A custom-trained assistant tailored to my workflow and preferences."
      ],
      facts: [["Tasks", "100+"], ["Accuracy", "95%"], ["Uptime", "24/7"]],
      tech: ["Python", "OpenAI", "LangChain", "APIs"],
      links: []
    },
    {
      id: "backtest", name: "Backtest Engine", icon: "code", status: "Live", when: "First commit 2026-01-10",
      body: [
        "Python-based backtesting framework for testing crypto trading strategies on historical data. Features pluggable strategy architecture, Sharpe/Sortino ratios, max drawdown analysis, and professional equity curve visualizations."
      ],
      facts: [["Strategies", "3+"], ["Metrics", "10+"], ["Data", "Binance"]],
      tech: ["Python", "Pandas", "NumPy", "Matplotlib", "Binance API"],
      links: [{ label: "Code on GitHub", href: "https://github.com/itaiwins/backtesting-framework" }]
    },
    {
      id: "signal-api", name: "Signal API", icon: "code", status: "Live", when: "First commit 2026-01-10",
      body: [
        "Cryptocurrency trading signals REST API built with FastAPI. Analyzes real-time market data using RSI, MACD, and EMA crossovers to generate buy/sell/hold recommendations with confidence ratings. Supports 40+ cryptocurrencies."
      ],
      facts: [["Coins", "40+"], ["Indicators", "3"], ["Docker", "Yes"]],
      tech: ["Python", "FastAPI", "Pandas", "Docker", "CoinGecko API"],
      links: [{ label: "Code on GitHub", href: "https://github.com/itaiwins/trading-signal-api" }]
    },
    {
      id: "research-agent", name: "Research Agent", icon: "code", status: "Live", when: "First commit 2026-01-10",
      body: [
        "AI-powered crypto research tool using Claude’s tool-use capabilities. Autonomously fetches prices, aggregates news from multiple sources, and generates comprehensive research reports. Supports 30+ major cryptocurrencies."
      ],
      facts: [["Coins", "30+"], ["AI", "Claude"], ["Sources", "Multi"]],
      tech: ["Python", "Anthropic Claude", "Typer", "Rich", "HTTPX"],
      links: [{ label: "Code on GitHub", href: "https://github.com/itaiwins/crypto-research-agent" }]
    },
    {
      id: "site-3d", name: "itairotem.com (3D site)", icon: "globe", status: "Live", when: "First commit 2026-01-10",
      shot: "site-3d.jpg", shotAlt: "The 3D itairotem.com home page",
      body: [
        "The 3D portfolio at itairotem.com. Features neural network visualization, scroll-driven camera animations, and unique section transitions."
      ],
      facts: [["Sections", "6"], ["3D", "Yes"], ["Vibes", "100%"]],
      tech: ["Next.js", "Three.js", "Framer Motion", "Tailwind"],
      links: [
        { label: "itairotem.com", href: "https://itairotem.com" },
        { label: "Code on GitHub", href: "https://github.com/itaiwins/Resume-Website" }
      ]
    }
  ],

  experience: [
    {
      role: "Founder & Developer", org: "Walleto / AlphaHQ", when: "2024 – Present",
      body: "Building Walleto, a crypto tracking platform for perpetual trades with backtesting and AI coaching. Running AlphaHQ (Jan 2025), a paid trading community providing daily technical analysis, trade signals, and 1-on-1 mentorship.",
      bullets: ["Developing Walleto.ai - launching soon", "Founded AlphaHQ with 15+ active members", "Built 3 iterations of automated trading bots", "Created personal AI secretary “Oura”", "Developed Polymarket prediction bot"],
      tech: ["Python", "Next.js", "CCXT", "Coinglass", "Telegram", "AI/LLMs"]
    },
    {
      role: "Trader & Entrepreneur", org: "Independent", when: "2022 – 2024",
      body: "Took a step back from Web3 to explore other ventures while maintaining trading activity. Founded a sports betting analytics group, worked various jobs to stay grounded, then returned full-time to crypto in 2024.",
      bullets: ["Founded sports betting community", "Maintained active trading portfolio", "Developed market analysis skills", "Returned to Web3 full-time in 2024"],
      tech: ["Trading", "Analytics", "Community Building", "Risk Management"]
    },
    {
      role: "Event Planner & Moderator", org: "Llamaverse", when: "2021 – 2022",
      body: "Joined the NFT revolution early. Worked as Event Planner and Moderator for Llamaverse, organizing online events and managing investor relations while actively trading NFTs.",
      bullets: ["Organized game nights, Q&As, and speaker events", "Managed Discord community moderation", "Handled customer/investor inquiries professionally", "Recorded customer data and event logs", "Generated significant returns trading NFTs"],
      tech: ["Discord", "Event Planning", "Community Management", "NFTs", "Data Analytics"]
    },
    {
      role: "Sneaker Reseller & Botter", org: "Self-Employed", when: "2019",
      body: "First taste of automation and hustle. Used bots to scrape websites and secure limited sneaker drops, reselling for profit. This introduced me to the world of automation, market dynamics, and online entrepreneurship.",
      bullets: ["Mastered sneaker bot software", "Built network of resellers", "Learned market timing & demand cycles", "First experience with automation"],
      tech: ["Bots", "Automation", "E-commerce", "Market Analysis"]
    }
  ],

  // Self-rated, as published on itairotem.com.
  skills: [
    ["Trading", [["Technical Analysis", 95], ["Risk Management", 92], ["Market Research", 90], ["Portfolio Strategy", 88]]],
    ["Web3", [["Blockchain", 93], ["Cryptocurrency", 95], ["NFTs", 88], ["DeFi", 85], ["Tokenomics", 82]]],
    ["Technical", [["Python", 85], ["AI Prompting", 92], ["Data Analysis", 80], ["SQL", 65]]],
    ["Marketing", [["Digital Marketing", 88], ["Community Building", 90], ["Content Strategy", 85]]]
  ],

  contact: {
    intro: "Have a project in mind? Want to collaborate? I’d love to hear from you.",
    availability: "Available for opportunities",
    links: [
      ["Email", "itairotem23@gmail.com", "mailto:itairotem23@gmail.com"],
      ["GitHub", "github.com/itaiwins", "https://github.com/itaiwins"],
      ["LinkedIn", "linkedin.com/in/itai-rotem23", "https://www.linkedin.com/in/itai-rotem23/"],
      ["X / Twitter", "@itaiwins", "https://twitter.com/itaiwins"]
    ]
  },

  recycle: [
    { name: "game-lobby-draft.html", kind: "Earlier draft of this site", note: "This site, as a video-game lobby screen. Looked great. Nobody could tell what Itai did." },
    { name: "git-log-draft.html", kind: "Earlier draft of this site", note: "This site, as a git log. The commits were real. A recruiter would have had no idea what anything was." }
  ]
};
