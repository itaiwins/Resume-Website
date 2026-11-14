// The scripted answers: the fallback for any turn the real model can't take,
// and the source of the artifacts shown under the model's own words. Every
// sentence below is copied from data.js (the set checked line by line on
// MEXA-2055/2059/2074) or rewritten from facts in it in the voice of Itai's AI
// ("I" is the AI, Itai is "he"); the source is noted per answer. Nothing here
// can be invented at runtime.
//
// Markup: blank line = paragraph, "- " = bullet, "> " = a note line, **bold**,
// *em*, `code`, [text](url), and {{artifact:arg}} for an inline artifact
// rendered by engine.js.
// v2 (MEXA-2154): the Mexant / agent-team / client-work topics quote pack v2
// (the API's pack.md, Guts-reviewed) through more.js; the pack
// section is noted per answer. Clients stay anonymous.
window.ANSWERS = {
  model: {
    id: "itai-1",
    // about.stats "5+ Years in Web3"
    tag: "5+ yrs in Web3",
    // The picker joke. Each "version" is a real chapter from data.experience.
    versions: [
      { id: "itai-1", note: "AI engineer & crypto trader · Mexant LLC", when: "2024 – now" },
      { id: "itai-0.5", note: "Event planner & moderator, Llamaverse", when: "2021 – 2022" },
      { id: "itai-0", note: "Sneaker reseller & botter", when: "2019" }
    ],
    note: "Every version answers the same. Same brief, same Itai.",
    live: "Live: a small model with a short brief about Itai, written from what he's published and how his company runs.",
    busy: "Busy right now: answers come from his site until it's back."
  },

  // Suggested prompts on the landing state, and the fallback set.
  root: ["What has Itai built?", "How does he use AI agents?", "Why should I hire him?", "What's Tend?", "Is he open to work?", "What's Mexant?", "What's his experience?", "How do I reach him?"],

  // One line per project for the tiles. Each is the first fact of that project's body in data.js.
  blurbs: {
    tend: "Tasks, calendar, habits and notes in one calm iPhone app.",
    unskippable: "Takes a video from idea to posted, in one iPhone app.",
    mcpsafe: "Security scanner and quality registry for MCP servers.",
    mexant: "The shop, the back office and the books for small businesses.",
    walleto: "Crypto tracking for perpetual trades, with backtesting and an AI trading coach.",
    trading: "Crypto trading bots and Polymarket prediction bots.",
    alphahq: "Paid crypto trading community: daily analysis, signals, 1-on-1 mentorship.",
    oura: "Personal AI secretary for daily tasks, scheduling, research and communication.",
    backtest: "Python framework for testing crypto strategies on historical data.",
    "signal-api": "Trading signals REST API from RSI, MACD and EMA crossovers. 40+ coins.",
    "research-agent": "Claude tool-use agent that fetches prices, aggregates news and writes research reports.",
    "site-3d": "The current itairotem.com: a 3D portfolio with scroll-driven camera animations."
  },

  // Prompt label → topic id. Any label also works typed into the composer.
  prompts: {
    "What has Itai built?": "projects",
    "What's Tend?": "tend",
    "Is he open to work?": "available",
    "What's his experience?": "experience",
    "What is he good at?": "skills",
    "How do I reach him?": "contact",
    "What does he build?": "build",
    "Who is Itai?": "about",
    "What's Mexant?": "mexant",
    "What's Unskippable?": "unskippable",
    "What's MCPSafe?": "mcpsafe",
    "What's Walleto?": "walleto",
    "Got a résumé?": "resume",
    "Where is he based?": "location",
    "Show me the trading tools": "trading",
    "Open everything": "everything",
    "How does he use AI agents?": "org",
    "Why should I hire him?": "hire",
    "Who are Mexant's clients?": "clients",
    "What is he good at?": "skills",
    "What's Autopost?": "autopost",
    "What's DemandCapture?": "demandcapture",
    "What's Tickets?": "tickets"
  },

  // Topics whose artifact goes under a live model answer when free text matches
  // them. Chips always attach their topic's artifacts. (Skills, about and
  // location match on loose words, so they only attach from a chip.)
  artifactTopics: ["projects", "tend", "unskippable", "mcpsafe", "mexant", "walleto", "trading", "alphahq", "oura", "backtest", "signal-api", "research-agent", "site-3d", "experience", "contact", "available", "everything", "resume", "org", "hire", "clients", "autopost", "demandcapture", "tickets", "ops", "client-store", "client-clean", "client-haul"],

  // Lines shown above a scripted answer when the model couldn't take the turn.
  notes: {
    busy: "I'm busy right now, so here's the short version from his site.",
    limited: "You've asked a lot this hour, so here's the short version from his site.",
    dropped: "The connection dropped there. Here's the short version from his site."
  },

  topics: {
    // welcome + about.details + mexant body.
    about: {
      text: "**Itai Rotem** is an AI engineer and crypto trader in Florida, USA, studying Information Technology at FSU.\n\nHe founded **Mexant LLC**. It ships Tend, an iPhone app for tasks, calendar, habits and notes, and MCPSafe, a security scanner for MCP servers. He's also building Unskippable, an iPhone app that takes a video from idea to posted.\n\n{{about}}\n\nHe's open to work.",
      next: ["What has Itai built?", "What's his experience?", "What is he good at?", "How do I reach him?"]
    },

    // welcome paragraphs 2–3 + project bodies + experience bullets.
    build: {
      text: "Two kinds of things: **apps** and **trading tools**.\n\n- **Tend**, an iPhone app for tasks, calendar, habits and notes. Live on the App Store.\n- **Unskippable**, an iPhone app that takes a video from idea to posted. Invite-only beta.\n- **MCPSafe**, a security scanner for MCP servers.\n- Three iterations of automated crypto trading bots, a backtest engine, a trading signals API, and **Walleto**, a crypto tracking platform for perpetual trades.\n\nTend and MCPSafe ship under his company, Mexant LLC.",
      next: ["What has Itai built?", "What's Tend?", "What's Mexant?", "What's his experience?"]
    },

    // data.projects: every tile is a project entry; the live tiles play the first fact of each body.
    projects: {
      text: "Here's what he's built: two iPhone apps, a security scanner, a company, a stack of trading tools, and the internal tools and client software his agent team built under Mexant.\n\n{{bento}}\n\nTend and MCPSafe ship under **Mexant LLC**. Unskippable is in invite-only beta. Ask about any one of them and I'll go deeper.",
      next: ["What's Tend?", "What's Unskippable?", "What's MCPSafe?", "Show me the trading tools", "Is he open to work?"]
    },

    // tend body + bullets + facts, verbatim or lowercased.
    tend: {
      text: "**Tend** is a calm place for your day. Tasks, calendar, habits and notes live together, and one assistant bar files whatever you type or say.\n\nJust type it. “Dentist Tuesday at 3” becomes an event, “buy milk” becomes a task and “read 10 pages every day” becomes a habit.\n\n{{demo:tend}}\n\n- Your whole day in one view: tasks, events from your iPhone calendars, habits and the weather.\n- Habits with streaks and tallies.\n- Notes with styles, checklists, tables, photos and document scanning. Lock a note with Face ID, and sort notes into folders.\n- Home Screen and Lock Screen widgets, plus a “Today” Live Activity.\n- Apple Health (optional, read-only): steps, energy and workouts next to your day.\n- Works offline. Sign in with Apple to sync between devices, or don’t sign in at all.\n\nHere is the day view as a spec sheet. Slots, not content; every dimension is a variable.\n\n{{drawing:tend}}\n\n{{project:tend}}",
      next: ["What's Unskippable?", "What's Mexant?", "What has Itai built?", "How do I reach him?"]
    },
    unskippable: {
      text: "**Unskippable** takes a video from idea to posted in one app: ideas built on what works for you, filming help shot by shot, a one-tap edit, a *Ready to post?* check, then what worked, against your own usual.\n\n{{demo:unskippable}}\n\nInvite-only beta on iPhone. Free during the beta. You post it yourself, from your phone’s share sheet. It never posts for you.\n\n{{project:unskippable}}",
      next: ["What's Tend?", "What's MCPSafe?", "What has Itai built?", "How do I reach him?"]
    },
    mcpsafe: {
      text: "**MCPSafe** is a security scanner and quality registry for Model Context Protocol (MCP) servers. Scan, verify, and discover trusted MCP servers.\n\n{{demo:mcpsafe}}\n\nIt analyzes MCP servers for vulnerabilities including prompt injection, data exfiltration, and excessive permissions, with a public registry of 260+ scanned servers, automated vulnerability detection, and trust scores. Registry metadata is live; public security findings are published only after review gates pass.\n\nA Mexant LLC product.\n\n{{project:mcpsafe}}",
      next: ["What's Mexant?", "What's Tend?", "What has Itai built?", "How do I reach him?"]
    },
    mexant: {
      text: "**Mexant LLC** is Itai's company. It builds the shop, the back office and the books for small businesses, and makes them agree. Shipped in weeks, not quarters. Tend and MCPSafe ship under it, and Unskippable is made by it.\n\nIt runs as an AI-native one-person company: Itai is the only human, and a team of 23 AI agents on Paperclip does the building, reviewing, security checks and operations. Two of its free demos turned into paying client builds.\n\n{{project:mexant}}\n\n{{org}}",
      next: ["How does he use AI agents?", "Who are Mexant's clients?", "What has Itai built?", "Is he open to work?"]
    },
    walleto: {
      text: "**Walleto** is a comprehensive crypto tracking platform for perpetual trades: real-time PnL tracking, advanced backtesting capabilities, and an AI trading coach to help optimize your strategy. Launching.\n\n{{project:walleto}}",
      next: ["Show me the trading tools", "What is he good at?", "What's his experience?", "How do I reach him?"]
    },
    trading: {
      text: "The trading side is a suite of tools, most of them Python.\n\n- **Automated Trading**: crypto trading bots and Polymarket prediction bots. Live market indicators, funding rates, sentiment analysis, and a confluence engine combining RSI, Fear & Greed Index, CVD, and trend bias. Private.\n- **Backtest Engine**: a Python framework for testing crypto strategies on historical data. Pluggable strategies, Sharpe/Sortino ratios, max drawdown analysis, equity curve visualizations.\n- **Signal API**: a FastAPI REST API that reads RSI, MACD and EMA crossovers and returns buy/sell/hold with confidence ratings. 40+ cryptocurrencies.\n- **Research Agent**: a crypto research tool using Claude’s tool-use. It fetches prices, aggregates news and writes research reports. 30+ coins.\n- **Walleto**: crypto tracking for perpetual trades, with backtesting and an AI trading coach.\n\n{{project:backtest}}\n\n{{project:signal-api}}\n\n{{project:research-agent}}",
      next: ["What's Walleto?", "What is he good at?", "What's his experience?", "How do I reach him?"]
    },
    alphahq: {
      text: "**AlphaHQ** is a premium crypto trading community: daily technical analysis, trade signals, and 1-on-1 mentorship, plus educational content on blockchain, DeFi, and market psychology. Since January 2025.\n\n{{project:alphahq}}",
      next: ["What has Itai built?", "What's his experience?", "How do I reach him?"]
    },
    oura: {
      text: "**Oura** is Itai's personal AI secretary, built to handle daily tasks, scheduling, research, and communication. A custom-trained assistant tailored to his workflow and preferences. Private.\n\n{{project:oura}}",
      next: ["What has Itai built?", "What does he build?", "How do I reach him?"]
    },
    backtest: { text: "A Python backtesting framework for crypto trading strategies on historical data: pluggable strategy architecture, Sharpe/Sortino ratios, max drawdown analysis, and equity curve visualizations.\n\n{{project:backtest}}", next: ["Show me the trading tools", "What is he good at?", "How do I reach him?"] },
    "signal-api": { text: "A cryptocurrency trading signals REST API built with FastAPI. It analyzes real-time market data using RSI, MACD, and EMA crossovers to generate buy/sell/hold recommendations with confidence ratings. 40+ cryptocurrencies.\n\n{{project:signal-api}}", next: ["Show me the trading tools", "What is he good at?", "How do I reach him?"] },
    "research-agent": { text: "An AI crypto research tool using Claude’s tool-use capabilities. It fetches prices, aggregates news from multiple sources, and generates research reports. 30+ major cryptocurrencies.\n\n{{project:research-agent}}", next: ["Show me the trading tools", "What does he build?", "How do I reach him?"] },
    "site-3d": { text: "That's the current itairotem.com: a 3D portfolio with a neural network visualization, scroll-driven camera animations, and section transitions.\n\n{{project:site-3d}}", next: ["What has Itai built?", "What is he good at?", "How do I reach him?"] },

    // data.experience + welcome.
    experience: {
      text: "The short version, newest first.\n\n{{timeline}}\n\nRight now: he's studying Information Technology at FSU, and open to work.",
      next: ["What is he good at?", "Is he open to work?", "What has Itai built?", "How do I reach him?"]
    },

    // data.skills (self-rated, as published) + about.faq[0].
    skills: {
      text: "Trading, Web3, Python and AI prompting, mostly. Self-rated, as published on his site:\n\n{{skills}}\n\nIn his words: he specializes in crypto trading systems, Web3 development, and AI-powered automation, and loves building tools that give traders an edge.",
      next: ["What has Itai built?", "What's his experience?", "Is he open to work?", "How do I reach him?"]
    },

    // about.faq[2] + contact.links.
    contact: {
      text: "Email is easiest. He usually responds within 24-48 hours. For urgent matters, mention it in your message or DM him on X.\n\n{{contact}}",
      next: ["Is he open to work?", "Got a résumé?", "What has Itai built?"]
    },

    // No résumé file exists on itairotem.com (checked 2026-11-13).
    resume: {
      text: "There's no PDF. Everything a résumé would say is in the *Everything* panel: about, every project, the timeline, skills and contact, on one scannable page.\n\n{{everything}}",
      next: ["What's his experience?", "What is he good at?", "How do I reach him?"]
    },

    // data.status + about.faq[1] + contact.intro.
    available: {
      text: "Yes. He's **open to work**, and open to freelance and consulting opportunities, especially in the crypto/Web3 space.\n\nHave a project in mind? Want to collaborate? He'd love to hear from you.\n\n{{contact}}",
      next: ["Got a résumé?", "What's his experience?", "What has Itai built?"]
    },

    // pack v2 "How Itai works": the short version, then the org as a spec sheet.
    org: {
      text: "Itai designed and manages an AI engineering team. Mexant runs with **Itai as the only human** and 23 AI agents organised like a company on **Paperclip**: a CEO agent, two managers, builders who each own a product, separate reviewers, security and DevOps.\n\nEvery task is a tracked issue, the builder never reviews its own work, and nothing reaches a client or costs money without his approval. More than 2,100 tracked issues since 2026-09-25.\n\n{{org}}",
      next: ["Why should I hire him?", "What's Mexant?", "Who are Mexant's clients?", "What has Itai built?"]
    },
    // pack v2 FAQ "Why hire him?" + "Skills this proves".
    hire: {
      text: "Three reasons, each tied to something real.\n\n- He has designed and run an **AI engineering team** that ships: Tend is on the App Store, MCPSafe is live, and client storefronts and back offices are in use.\n- He owns products end to end as the **product owner**: roadmap, scope, design picks, what to pause.\n- He builds with **guardrails**: separate review, security review, backups and rollbacks, spend caps.\n\n{{org}}\n\n{{proves}}",
      next: ["How does he use AI agents?", "What has Itai built?", "Is he open to work?", "How do I reach him?"]
    },
    // pack v2 "Client work (clients kept anonymous)".
    clients: {
      text: "Small businesses. They aren't named here; Itai can share more by email. Each build was done by the agent team, reviewed by a second agent, and approved by Itai before the client saw it.\n\n{{ledger:clients}}",
      next: ["What's Mexant?", "How does he use AI agents?", "Is he open to work?", "How do I reach him?"]
    },
    // pack v2 project entries (internal tools), one card each.
    autopost: { text: "**Autopost** is an internal tool: upload clips and it auto-cuts and captions them, keeps a bank of edited clips, suggests edits with Claude, and schedules posts to TikTok and Instagram. A lot of its editing work later went into Unskippable.\n\n{{project:autopost}}", next: ["What's Unskippable?", "What has Itai built?", "How do I reach him?"] },
    demandcapture: { text: "**DemandCapture** finds the questions B2B software buyers ask, samples AI answers, measures which brands get recommended, ranks the gaps and drafts fact-checked fixes. Itai paused it in late September 2026.\n\n{{project:demandcapture}}", next: ["What has Itai built?", "How does he use AI agents?", "How do I reach him?"] },
    tickets: { text: "**Tickets** is digital hauling tickets for trucking: an offline-first web app for drivers, dispatch approval, invoicing, driver pay and a carrier portal. Built and tested for a construction-hauling trucking company, but never put into daily use; parked until the client is ready.\n\n{{project:tickets}}", next: ["Who are Mexant's clients?", "What has Itai built?", "How do I reach him?"] },
    ops: { text: "Mexant's own operations tools: a dashboard of builds, enquiries, uptime and a ledger of every project, plus an outside uptime monitor that checks every client-facing app every minute and alerts Itai's phone.\n\n{{project:ops}}", next: ["How does he use AI agents?", "What has Itai built?", "How do I reach him?"] },
    "client-store": { text: "A fragrance and wholesale e-commerce brand, Mexant's first signed client. A custom storefront over their real Shopify catalogue, then an AI back-office console over Shopify and QuickBooks. Live since August 2026.\n\n{{project:client-store}}", next: ["Who are Mexant's clients?", "What's Mexant?", "How do I reach him?"] },
    "client-clean": { text: "A residential exterior-cleaning company: customer import, review-request texts, a public booking page, a schedule, offers by text and email with consent handling, and an installable app. Built; launch waits on the client.\n\n{{project:client-clean}}", next: ["Who are Mexant's clients?", "What's Mexant?", "How do I reach him?"] },
    "client-haul": { text: "A construction-hauling trucking company: that's Tickets, built for them and parked until they're ready.\n\n{{project:tickets}}", next: ["What's Tickets?", "Who are Mexant's clients?", "How do I reach him?"] },

    location: { text: "Florida, USA. He's studying Information Technology at FSU.", next: ["Who is Itai?", "What's his experience?", "How do I reach him?"] },
    education: { text: "FSU, Information Technology. He's studying it now.", next: ["What's his experience?", "What is he good at?", "How do I reach him?"] },
    everything: { text: "Here's all of it on one page.\n\n{{everything}}", next: ["What has Itai built?", "How do I reach him?"] },
    hello: { text: "Hi. Ask me anything about Itai: what he builds, how he runs his AI agent team, or how to reach him.", next: null },
    thanks: { text: "Anytime.", next: ["What has Itai built?", "How do I reach him?"] },
    bye: { text: "Later.", next: ["What has Itai built?", "How do I reach him?"] },
    fallback: { text: "I only know about Itai: his projects, how he works, his story and how to reach him. Try one of these:", next: null }
  },

  // Free-text matcher, first hit wins. Specific names before generic words.
  match: [
    [/r[ée]sum|\bcv\b/, "resume"],
    [/^\s*(hi|hey+|hello|yo|sup|hiya|howdy|hola|shalom)\b[\s!.,]*$/, "hello"],
    [/thank|\bthx\b|\bty\b/, "thanks"],
    [/\b(bye|later|cya|see ya|peace)\b/, "bye"],
    [/everything|all of it|one page|overview|summary/, "everything"],
    [/\btend\b/, "tend"],
    [/unskip/, "unskippable"],
    [/mcp\s?safe|\bmcp\b|security scanner/, "mcpsafe"],
    [/mexant|\bllc\b|(your|his) company|agency/, "mexant"],
    [/walleto/, "walleto"],
    [/alpha\s?hq|community|mentor/, "alphahq"],
    [/\boura\b|secretary/, "oura"],
    [/backtest/, "backtest"],
    [/signal/, "signal-api"],
    [/research/, "research-agent"],
    [/\b3d\b|three\.?js|current site|old site|this site|portfolio site/, "site-3d"],
    [/\bbots?\b|polymarket|automated|trading (system|tool)|algo/, "trading"],
    [/autopost/, "autopost"],
    [/demand ?capture|ai[- ]search visibility/, "demandcapture"],
    [/\btickets?\b|hauling|trucking/, "tickets"],
    [/uptime|monitor|ops tools|operations dashboard/, "ops"],
    [/fragrance|wholesale|storefront|shopify|quickbooks|perfume|scent/, "client-store"],
    [/cleaning|pressure wash|exterior|home[- ]services/, "client-clean"],
    [/client|customer|small business|who does he build for|built for/, "clients"],
    [/why (should|would) .*hire|hire him|why hire|hire itai|stand out|what makes (him|itai)|strength|why him|good hire|case for/, "hire"],
    [/paperclip|\bagents?\b|agentic|workflow|how (does|do) (he|you|itai) (work|operate|run)|(his|the|your) team|process|org ?chart|orchestrat|one-person|solo|delegat|review gate|approv/, "org"],
    [/hire|hiring|availab|freelance|open to|\bjob\b|consult|work with|work for|contract|\brate\b|\bgig\b/, "available"],
    [/email|contact|reach|linkedin|twitter|\bx\b|github|\bdm\b|phone|number|talk|message|connect/, "contact"],
    [/what (do you|does he|does itai) (build|make|do)|what (are you|is he) building|what (do you|does he) work on|what (you|he) builds?/, "build"],
    [/experience|background|history|worked|career|story|journey|\bpast\b|before|timeline|jobs?\b/, "experience"],
    [/skill|good at|stack|tech|language|python|strength|tools|know how|expert/, "skills"],
    [/project|portfolio|show me|built|build|ship|made|work on|working on|showcase|\bapps?\b|demo/, "projects"],
    [/where|location|based|florida|live\b|\bfrom\b/, "location"],
    [/school|fsu|study|college|university|education|degree|major|student/, "education"],
    [/who is (itai|he)|about (itai|him)|who are you|about you|yourself|intro|(your|his) name|tell me about|who is/, "about"],
    [/crypto|trad(e|ing|er)|market|web3|defi|nft|bitcoin|btc|eth/, "trading"]
  ]
};
