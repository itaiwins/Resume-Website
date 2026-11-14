<!--
Knowledge pack for "Itai's AI". This file is the ONLY thing the model knows about Itai.
The Worker strips this comment and the [S] tags before the model sees it.

  [S1]-[S2] https://itairotem.com (the site's vetted content: about, experience, skills, FAQ)
  [S3] https://www.mexant.com and https://www.mexant.com/tend
  [S4] https://getunskippable.com
  [S5] https://mcpsafe.org
  [S6] Tend on the App Store: https://apps.apple.com/us/app/tend-agentic-notes/id6815052928
  [S7] https://github.com/itaiwins (public profile and public repos)
  [S8]-[S12] Mexant's internal records (the agent platform, workspace rules, project notes and
        client work). Not public; clients are anonymised here on purpose.

Left out on purpose: client and prospect names, client staff, sales reps and partners; every
price, rate, invoice, revenue, spend or usage figure (incl. this chat's cap); keys, internal
hostnames, server details, dashboards' addresses; security incidents, audits and findings;
personal finances and health.

Edit freely: the Worker embeds this file at deploy time.
-->

# Itai Rotem — knowledge pack

## Who he is
- Name: Itai Rotem. Online handle: itaiwins. [S1][S7]
- Headline on his site: "AI Engineer · Crypto Trader · Web3". His GitHub bio says "Aspiring AI Engineer". [S1][S7]
- Lives in Florida, USA. [S1]
- Studies Information Technology at FSU (Florida State University). [S1]
- Founder of Mexant LLC, the company that ships his apps Tend and MCPSafe, and is building Unskippable. [S1][S4]
- His site describes him as a "Web3 Builder & Crypto Trader" and an "FSU Information Technology Student". [S1]
- Mission, in his words: "Building tools for traders and pushing the boundaries of Web3." [S1]
- His site's quick stats: 5+ years in Web3 and markets, 6+ projects built, 3 companies founded, and "∞ cans of Coke Zero". [S1]
- Focus: Web3 and trading, and AI-powered automation. Current status: building, and open to work. [S1]
- In one line for a recruiter: Itai runs Mexant as an AI-native one-person company. He designed and manages an AI engineering team of 23 agents, organised like a company, and that team ships his own products (Tend on the App Store, MCPSafe, Unskippable) and client software. He is the product owner, the architect of how the team works, and the human who approves what ships. [S8][S9][S11]

## What he's open to
- He is open to work and "available for opportunities". [S1]
- In his own FAQ: "Yes! I'm open to freelance and consulting opportunities, especially in the crypto/Web3 space. Let's discuss your project." [S1]
- What he likes to work on, in his words: "I specialize in crypto trading systems, Web3 development, and AI-powered automation. I love building tools that give traders an edge." [S1]
- Contact page line: "Have a project in mind? Want to collaborate? I'd love to hear from you." [S1]

## How to reach him
- Email: itairotem23@gmail.com [S1]
- GitHub: https://github.com/itaiwins [S1]
- LinkedIn: https://www.linkedin.com/in/itai-rotem23/ [S1]
- X / Twitter: @itaiwins — https://twitter.com/itaiwins [S1]
- Response time, in his words: "I usually respond within 24-48 hours. For urgent matters, mention it in your message or DM me on Twitter." [S1]
- Email is the best way for anything about work or projects.

## How Itai works: Mexant and his AI agent team
- Short version: Itai designed and manages an AI engineering team. Mexant runs as an AI-native one-person company: Itai is the only human, and a team of 23 AI agents does the building, reviewing, security checks and operations, organised like a real company. [S8][S9]
- The control plane is Paperclip, an agent-orchestration platform. Every agent has a role, a manager and a job description, and every piece of work is a tracked issue. [S8][S9]
- Scale (as of 2026-11-13): 23 agents; more than 2,100 tracked issues since the team started on 2026-09-25, over 2,000 of them done; often 100 or more agent work sessions ("runs") a day. [S8]
- The org chart (the agents have anime-character names): [S8][S9]
  - Leadership: **Lelouch** (CEO agent: sets direction, reviews across teams, approves reviewed deploys), **Erwin** (manager for client delivery), **Gojo** (manager for Itai's own products, and their reviewer).
  - Security: **Guts** (project security reviews) and **Alucard** (security lead).
  - DevOps: **Roy Mustang** (server and DevOps lead) and **Winry** (server infrastructure).
  - Builders, each owning a product: **Frieren** (Tend), **Mei** (Unskippable app and server), **Milly** (Autopost video editor), **L** (MCPSafe), **Tanjiro** (Tickets), **Kaneki** (DemandCapture), **Edward** (mexant.com and internal tools), **Jin-Woo** (production builds), **Yuji** and **Kurapika** (client storefront and back office), **Fern** (another app), plus designers **Uta** and **Kamina**.
  - Sales side: **Reigen** (sales lead), **Gon** (demos for sales reps) and **Spike** (partner liaison).
- The rules the team runs on, which Itai set: [S9]
  - Every task is a tracked issue with one owner. Work, reviews and approvals all happen on the issue, so there's a full record.
  - The builder never reviews its own work. A different agent reviews; managers approve.
  - Anything touching security (auth, secrets, production data) also gets a security review from Guts or Alucard.
  - Nothing a client or prospect sees, and nothing that costs money, ships without Itai's approval. He reviews the finished work himself.
  - A backup and a written rollback before every risky change (database migrations, deploys), and a live check after every deploy, with a rollback if it fails.
  - Cloudflare first for hosting (Workers, D1, R2, Containers); other hosts only when Cloudflare can't do the job. In late October 2026 the team moved most apps onto Cloudflare.
  - Spend caps and run budgets: agents only wake for a specific issue (no timers burning usage), big tasks need Itai's OK with a run estimate first, and products that call AI models have hard daily spend caps.
  - Report on the issue: every finished task ends with what was done, how it was verified, and what was skipped.
- Around the agents there's plain automation: an outside uptime monitor that checks every client-facing app every minute, sends Itai a phone alert and wakes the on-call agent; nightly backups; a nightly overview and a weekly sync written by the CEO agent. [S9][S11]
- Itai's own job in all this: he brings the work, decides what gets built, picks between designs (agents show him rendered options first), writes the rules above, and is the human in the loop who approves anything that reaches a client or costs money. [S9]
- This chat is an example: one agent built it, a second agent did a security review, a manager approved it, and Itai tried it before anything went public. [S11]

## What he's built

### Tend — iPhone app (live on the App Store)
- What it is: "A calm place for your day." Tasks, calendar, habits, notes and health live together in one iPhone app, and one assistant bar files whatever you type or say. [S1][S3]
- Example: "Dentist Tuesday at 3" becomes an event, "buy milk" becomes a task, and "read 10 pages every day" becomes a habit. [S1][S3]
- Features: [S1][S3]
  - Today view: tasks, events from your iPhone calendars, habits and the weather in one view.
  - Habits with streaks and tallies.
  - Notes with styles, checklists, tables, photos and document scanning; folders; lock a note with Face ID.
  - Health in plain words: recovery, sleep, training and body, with one line on what that means for today. Connects to Whoop, Apple Health and Hevy. Apple Health is optional and read-only.
  - Home Screen and Lock Screen widgets, plus a "Today" Live Activity.
  - Works offline. Sign in with Apple to sync between devices, or don't sign in at all.
  - Tend Pro adds a cloud assistant, voice input and more themes.
- Platform: iPhone, iOS 16.4 or later. Seller: Mexant LLC. Released 2026-11-06; version 1.0.1 at the time this pack was written. [S1][S3][S6]
- Stack: Expo and React Native (Expo Router, Zustand, Reanimated), home-screen widgets via WidgetKit, HealthKit; a Cloudflare Workers + D1 backend; RevenueCat for the subscription; EAS builds and over-the-air updates. [S1][S11]
- Built by his agent team: one builder agent (Frieren), reviewed by the projects manager (Gojo), with security changes reviewed by Guts. [S8][S11]
- His role: founder and product owner. He decided the features, picked the Health page design from rendered concepts, and approved every release.
- Links: App Store https://apps.apple.com/us/app/tend-agentic-notes/id6815052928 and https://www.mexant.com/tend [S1]

### Unskippable — iPhone app (invite-only beta)
- What it is: "From idea to posted. One app. Your whole content team, in your pocket." It takes a short video from idea to posted: ideas built on what works for you, filming help shot by shot, a one-tap edit, a "Ready to post?" check, then what worked, compared against your own usual. [S1][S4]
- The steps: [S4]
  - Ideas: built from your own best videos and what's working in your niche this week. Or say your idea in a line and it plans the shots.
  - Filming help: every shot planned one step at a time — where the phone goes, what's in frame, what to do, the line on screen, and what to avoid. Already filmed it? Upload the whole video instead.
  - One-tap edit: cuts the pauses, retakes and slow start, adds captions as you speak and a hook line on the first seconds. You see it next to yours and can turn any part off before you save.
  - Ready to post?: checks you can see (a hook in the first 2 seconds, words on screen, the search keyword said and shown, the first frame), then a caption, hashtags and a cover, and your phone's share sheet to post to TikTok or Instagram.
  - What worked: your own videos re-learned every Monday — the times, lengths and openings that beat your usual. Connect TikTok or Instagram and every finding is compared with your own typical video. It also shows who's watching (age, where they are, the hours they scroll).
  - Comment help on Instagram: it picks comments worth answering and drafts a reply in your style. Nothing is sent until you tap Send.
- For UGC creators: it reads the video itself (what the opening does, three different hooks, a pre-send check, and a portfolio card), since brand videos run on someone else's account. [S4]
- Privacy: you post your videos yourself from the share sheet; it never posts, follows or messages for you. Delete everything in one tap. The video check never analyses how anyone looks. 18 and over only. [S4]
- Status: invite-only beta on iPhone through TestFlight; people apply on the site. First commit 2026-10-17. Made by Mexant LLC; not affiliated with TikTok, Instagram, YouTube or Google. [S1][S4]
- Stack: Expo iOS app; a Cloudflare Worker API; Turso (libSQL) database; Cloudflare R2 for uploads; a Node.js render box with ffmpeg and whisper.cpp for the edits; Claude for the video analysis. [S1][S11]
- How it's kept honest: the AI coach is checked against a bank of 130 test questions to catch invented answers before changes ship. [S11]
- His role: founder and product owner; the agents Mei (app and server) and Uta (website) build it, Gojo reviews. [S8][S11]
- Link: https://getunskippable.com [S1]

### MCPSafe — security scanner for MCP servers (live)
- What it is: "the security scanner and quality registry for Model Context Protocol servers." Scan, verify, and discover trusted MCP servers. [S1][S5]
- It analyzes MCP servers for vulnerabilities including prompt injection, data exfiltration and excessive permissions, with automated vulnerability detection, trust scores and a public registry. Code analysis uses Tree-sitter parsing for JavaScript, TypeScript and Python. [S1][S5]
- Public numbers on the site: 260+ servers in the registry, 1,200+ vulnerabilities found, 490+ scans. [S1]
- Registry metadata is live; public security findings are published only after review gates pass. [S1]
- It also offers an API, webhooks, CI/CD integration and email alerts, and is built to be used by AI agents too. [S5]
- First commit 2026-01-18; a Mexant LLC product since 2026-10-14. [S1]
- It has its own MCP endpoint, so AI assistants can ask MCPSafe whether a server is safe before installing it. [S11]
- Stack: Next.js, Hono, PostgreSQL, Redis, AI/LLMs; a Python scanner; hosted on Cloudflare (Workers and Containers). [S1][S11]
- His role: founder. The first version came from an autonomous agent loop; the agent L now maintains it, with security grades only published once they're calibrated. [S8][S11]
- Link: https://mcpsafe.org [S1]

### Mexant — his company (Mexant LLC)
- Mexant LLC is the company Itai founded. Tend and MCPSafe ship under it, and Unskippable is made by it. [S1][S4]
- What it does, from mexant.com: "Mexant builds the shop, the back office and the books for small businesses, and makes them agree. Shipped in weeks, not quarters." [S1][S3]
- It started as an AI-powered software agency building custom chatbots for businesses, with live demos across restaurants, healthcare, real estate, e-commerce, home services and SaaS. [S1]
- First commit 2026-01-20. Stack: Next.js, Cloudflare Workers, AI/LLMs, email APIs. [S1]
- What Mexant builds for businesses: websites (from simple sites to e-commerce, booking, payments and member areas); custom software (internal tools, CRMs, integrations, dashboards, web and mobile apps); AI services (chatbots, knowledge-base search, document and form automation, scheduling, review management, quote calculators, content automation and more); and ongoing care (hosting, security, updates). [S10]
- How a project runs: [S9][S10]
  1. First contact: Itai brings the opportunity, or a business sees a free demo built for it first.
  2. Demo: a quick, disposable preview plus a short video, built from the business's own words and photos, so they see their software before they pay for anything.
  3. Scope: a manager agent scopes the work and sets a scope fence (what's in, what's out, a run budget).
  4. Build: a builder agent builds it, with a design pass first for client work.
  5. Review: a different agent reviews the code and re-checks it live; security work gets a security review.
  6. Itai's review: he sees the finished work before the client does.
  7. Ship: backup and rollback ready, deploy, live check, and a report on the issue.
- Two of the demos turned into client builds. [S10][S12]
- Link: https://www.mexant.com [S1]
- (No prices here: for rates or a quote, email Itai.)

### Walleto — crypto tracking platform (launching)
- A tracking platform for perpetual crypto trades: real-time PnL tracking, advanced backtesting, and an AI trading coach to help optimize your strategy. 15+ features. [S1]
- Status: launching soon. His role: founder and developer. [S1]
- Stack: Next.js, Python, AI/LLMs, trading APIs. [S1]
- Link: https://walleto.ai [S1]

### Automated trading systems (private)
- A suite of automated trading systems: crypto trading bots and Polymarket prediction bots (5+ bots). [S1]
- They use live market indicators, funding rates and sentiment analysis, plus a confluence engine combining RSI, the Fear & Greed Index, CVD and trend bias. They analyze odds and look for value bets across crypto and prediction markets. [S1]
- He has built three iterations of automated trading bots. [S1]
- Stack: Python, CCXT, Coinglass, Polymarket API, Telegram. Status: operational, private (no public link). [S1]

### AlphaHQ — crypto trading community
- A crypto trading community with daily technical analysis, trade signals and 1-on-1 mentorship, plus educational content on blockchain, DeFi and market psychology. Grown through Twitter/X. [S1]
- Founded January 2025; 15+ members per his site. [S1]
- Runs on Discord. Link: https://whop.com/alphahq [S1]

### Oura AI — personal AI secretary (private)
- A personal AI secretary he built for daily tasks, scheduling, research and communication, tailored to his own workflow. [S1]
- Stack: Python, OpenAI, LangChain, APIs. Private, no public link. [S1]

### Backtest Engine (open source)
- A modular Python backtesting framework for crypto trading strategies: pluggable strategies, Sharpe and Sortino ratios, max drawdown analysis and equity-curve charts. Binance data. [S1][S7]
- Stack: Python, Pandas, NumPy, Matplotlib, Binance API. First commit 2026-01-10. [S1]
- Code: https://github.com/itaiwins/backtesting-framework [S1]

### Signal API (open source)
- A crypto trading signals REST API built with FastAPI. It analyzes market data with RSI, MACD and EMA crossovers to give buy/sell/hold recommendations with confidence ratings, for 40+ cryptocurrencies. Runs in Docker. [S1][S7]
- Stack: Python, FastAPI, Pandas, Docker, CoinGecko API. First commit 2026-01-10. [S1]
- Code: https://github.com/itaiwins/trading-signal-api [S1]

### Research Agent (open source)
- An AI crypto research tool using Claude's tool-use: it fetches prices, pulls news from several sources and writes research reports, for 30+ major cryptocurrencies. [S1][S7]
- Stack: Python, Anthropic Claude, Typer, Rich, HTTPX. First commit 2026-01-10. [S1]
- Code: https://github.com/itaiwins/crypto-research-agent [S1]

### Market Dashboard (open source)
- A real-time cryptocurrency market dashboard with live prices, charts and sentiment indicators, built with React, Vite and Tailwind CSS. [S7]
- Code: https://github.com/itaiwins/market-dashboard [S7]

### itairotem.com (his 3D portfolio)
- His portfolio site: a 3D site with a neural-network visualization, scroll-driven camera animations and section transitions. [S1]
- Stack: Next.js, Three.js, Framer Motion, Tailwind. First commit 2026-01-08. [S1][S7]
- Links: https://itairotem.com and code at https://github.com/itaiwins/Resume-Website [S1]
- This chat ("Itai's AI") is part of a new version of his site, still a preview: a site you talk to. It runs on Claude Haiku in a Cloudflare Worker, answers only from this pack, streams its answers, has per-visitor limits and a hard daily spend cap, and an output filter that removes anything that looks like a secret or an unknown link. [S11]

### Autopost — video editor and poster (internal tool)
- Problem: turning raw phone and drone clips into captioned short-form posts takes hours. [S11]
- Built: a studio where you upload clips; it auto-cuts and captions them (ffmpeg and whisper.cpp), keeps a bank of edited clips, suggests edits with Claude, and schedules posts to TikTok and Instagram. A lot of its editing work later went into Unskippable. [S11]
- Stack: Node.js with SQLite, running in Cloudflare Containers, media in Cloudflare R2. [S11]
- Status: used internally; no public link. Built by the agent Milly. [S8][S11]

### DemandCapture — AI-search visibility for B2B software (paused)
- Problem: software companies can't see which brands AI assistants recommend when buyers ask them questions. [S11]
- Built: it finds the questions buyers ask, samples AI answers, measures which brands get recommended, ranks the gaps and drafts fact-checked fixes, with strict honesty rules (modelled numbers are never shown as real results). [S11]
- Stack: FastAPI with a worker queue, Next.js, PostgreSQL with pgvector and row-level security, Redis. First commit 2026-09-12. [S11]
- Status: paused by Itai in late September 2026. [S11]

### Tickets — digital hauling tickets for trucking (built, not launched)
- Problem: construction-hauling trucking companies still run on paper tickets. Built for a trucking company. [S11][S12]
- Built: an offline-first web app for drivers (phone-code login, GPS, timestamps, photos and a signature, all working with no signal), dispatch approval, invoicing, driver pay and a carrier portal; multi-company, with database row-level security. [S11]
- Stack: Next.js, Supabase (PostgreSQL with row-level security and scheduled jobs), Twilio Verify. First commit 2026-08-13. [S11]
- Status: built and tested but never put into daily use; parked until the client is ready. [S11]

### Mexant's own operations tools (internal)
- An operations dashboard: a board of builds in progress, an enquiries inbox, uptime and response times for every app, and a ledger of every project and client. Next.js, Tailwind, Supabase. [S11]
- An outside uptime monitor: a Cloudflare Worker that checks every client-facing app every minute, opens one incident after two failures in a row, pushes an alert to Itai's phone and wakes the on-call agent. [S11]
- The mexant.com site itself (Vite, React, TypeScript), moved to Cloudflare in October 2026. [S11]

## Client work (clients kept anonymous)
Mexant's clients are small businesses. They aren't named here; Itai can share more by email. Each was built by the agent team, reviewed by a second agent, and approved by Itai before the client saw it. [S9][S12]

- **A fragrance and wholesale e-commerce brand.** Problem: a stock theme store with no wholesale ordering, and stock and prices kept by hand across the store and the accounting system. Built: a custom storefront over their real Shopify catalogue (filters, an AI scent picker, wholesale ordering, Shopify checkout), then an AI back-office console over Shopify and QuickBooks (today's tasks, reorder points, stock and price differences, a trade inbox, competitor price checks, and every change confirmed, logged and undoable). Stack: Next.js, Shopify Admin API, QuickBooks Online, Supabase, the Claude API. Live since August 2026. Mexant's first signed client. [S12]
- **A residential exterior-cleaning company.** Problem: growing repeat business from an existing customer list. Built: customer import, review-request texts, a door-knocking form, a public booking page with service plans, a schedule and calendar, offers by text and email with consent handling, ad conversion tracking, results counting, team screens, and an installable app. Stack: Next.js on Cloudflare Workers with D1. Status: built; launch waits on the client. [S12]
- **A construction-hauling trucking company:** see Tickets above. [S12]

## Demos
- Mexant's way in with a new business is to show, not pitch: before asking for anything, the team builds a small live preview of that business's software and a short video made from the business's own words and photos. [S10]
- Standard demo types cover restaurants and bakeries, salons and spas, home services, gyms, clinics, law and accounting firms, photographers and auto repair, plus custom ones for anything else. [S10]
- The storefront demo became Mexant's first paying client build. [S10][S12]

## Skills this proves (each tied to a project above)
- **AI agent orchestration:** designed and runs a 23-agent team on Paperclip, with roles, managers, review gates and approval rules; 2,000+ tracked issues done since 2026-09-25. [S8][S9]
- **Product management:** owns the roadmap for Tend, Unskippable and MCPSafe; scopes work with scope fences and run budgets; picks designs from rendered concepts; decides what to pause (DemandCapture). [S9][S11]
- **Shipping iOS apps:** Tend is live on the App Store (Expo, React Native, widgets, HealthKit, subscriptions); Unskippable is in TestFlight beta. [S1][S4][S11]
- **Cloudflare (Workers, D1, R2, Containers):** a Cloudflare-first rule for every new build; Tend's backend, MCPSafe, Autopost, the uptime monitor, client apps and this chat all run there. [S9][S11]
- **Security-minded review:** every security-relevant change gets a separate security review; MCPSafe is itself a security scanner; client apps use row-level security, audit logs and undo. [S5][S9][S11][S12]
- **Cost control:** agents wake only for a specific issue, big tasks need a run estimate first, and AI features have hard daily spend caps (this chat included). [S9][S11]
- **Real client delivery:** a live e-commerce storefront and back office for a small business, plus booking and trucking builds for two more. [S12]

## Experience timeline
- 2024 – present — Founder & Developer, Walleto / AlphaHQ. Building Walleto (launching soon); running AlphaHQ since January 2025 with 15+ active members; built three iterations of automated trading bots; created his AI secretary "Oura"; built a Polymarket prediction bot. Tools: Python, Next.js, CCXT, Coinglass, Telegram, AI/LLMs. [S1]
- Now — Founder of Mexant LLC, which ships Tend (on the App Store since 2026-11-06) and MCPSafe, and is building Unskippable. Since 2026-09-25 he has run Mexant with a 23-agent AI team on Paperclip that also delivers client software. (His site doesn't give a founding date for Mexant.) [S1][S4][S8]
- 2022 – 2024 — Trader & Entrepreneur, independent. Took a step back from Web3 to explore other ventures while still trading; founded a sports betting analytics group; worked various jobs "to stay grounded"; returned to crypto full-time in 2024. [S1]
- 2021 – 2022 — Event Planner & Moderator, Llamaverse (an NFT project). Organized online events (game nights, Q&As, speaker events), moderated the Discord community, handled customer and investor questions, and kept customer data and event logs, while trading NFTs. [S1]
- 2019 — Sneaker reseller and botter, self-employed. Used bots to secure limited sneaker drops and resold them; his first experience with automation, market timing and online entrepreneurship. [S1]
- Education: Information Technology at FSU (current student). [S1]

## Skills
Self-rated on his site (out of 100): [S1]
- Trading: Technical Analysis 95, Risk Management 92, Market Research 90, Portfolio Strategy 88.
- Web3: Cryptocurrency 95, Blockchain 93, NFTs 88, DeFi 85, Tokenomics 82.
- Technical: AI Prompting 92, Python 85, Data Analysis 80, SQL 65.
- Marketing: Community Building 90, Digital Marketing 88, Content Strategy 85.

Tools and tech that show up across his projects: Python, TypeScript/JavaScript, Next.js, React, React Native and Expo, Cloudflare Workers, D1, R2 and Containers, Supabase, Shopify and QuickBooks APIs, AI agent orchestration (Paperclip, Claude), FastAPI, Pandas/NumPy, PostgreSQL, Redis, Docker, Three.js, Tailwind, LLM APIs (Claude, OpenAI), CCXT and trading APIs, Discord and Telegram bots. [S1][S7]

## FAQ
- **Is Itai available for work?** Yes — he's open to work, including freelance and consulting, especially in crypto/Web3 and AI automation. Email itairotem23@gmail.com. [S1]
- **What kind of projects does he do?** iPhone apps and web products through Mexant (Tend, Unskippable, MCPSafe), custom software for small businesses, AI-powered automation, and crypto trading systems. [S1][S11][S12]
- **How does Itai use AI agents?** He runs Mexant with a team of 23 AI agents organised like a company on Paperclip: a CEO agent, two managers, builders who each own a product, separate reviewers, security and DevOps. Every task is a tracked issue, the builder never reviews its own work, and nothing reaches a client or costs money without Itai's approval. [S8][S9]
- **Why hire him?** He has designed and run an AI engineering team that ships real software (Tend on the App Store, MCPSafe live, client storefronts and back offices); he owns products end to end as the product owner; and he builds with guardrails (separate review, security review, backups, spend caps). [S8][S9][S11][S12]
- **Who are Mexant's clients?** Small businesses, such as a fragrance and wholesale e-commerce brand, an exterior-cleaning company and a construction-hauling trucking company. They aren't named here. [S12]
- **How fast does he reply?** Usually within 24–48 hours. For urgent things, say so in the message or DM him on X (@itaiwins). [S1]
- **Where is he based?** Florida, USA. [S1]
- **Where does he study?** FSU, Information Technology. [S1]
- **Can I try Tend?** Yes, it's on the App Store for iPhone (iOS 16.4+): https://apps.apple.com/us/app/tend-agentic-notes/id6815052928 [S1][S3]
- **Can I try Unskippable?** It's an invite-only beta on iPhone; apply at https://getunskippable.com. 18+ only. [S4]
- **What's MCPSafe?** A security scanner and registry for MCP (Model Context Protocol) servers, at https://mcpsafe.org. [S5]
- **Is his code public?** Some of it: the backtesting framework, signal API, research agent, market dashboard and his old portfolio site are on https://github.com/itaiwins. The trading bots, Oura, Mexant's products and client code are private. [S1][S7]
- **What's his favorite drink?** According to his site, Coke Zero — "∞ cans". [S1]
- **Are you really Itai?** No — this is Itai's AI. It answers from what Itai has published about himself. For anything real (work, hiring, a project), email him directly.
