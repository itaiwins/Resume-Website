// Pack v2 content (MEXA-2153 / MEXA-2154): Mexant, the agent team and the
// projects that are not on itairotem.com. Every line below is copied or
// condensed from the API's pack.md (the Guts-reviewed knowledge
// pack, v2, 2026-11-13); the pack section is noted per block. Clients stay
// anonymous exactly as the pack keeps them. No number here that the pack
// doesn't give. data.js stays byte-identical to the vetted set; this file is
// added next to it, never merged into it.
window.MORE = {
  // "How Itai works: Mexant and his AI agent team"
  org: {
    asOf: "2026-11-13",
    human: { name: "Itai Rotem", role: "Owner · the only human", does: ["brings the work", "decides what gets built", "picks between rendered designs", "writes the rules", "approves anything a client sees or that costs money"] },
    controlPlane: { name: "Paperclip", note: "Agent-orchestration platform. Every agent has a role, a manager and a job description; every piece of work is a tracked issue." },
    scale: [["23", "agents"], ["2,100+", "tracked issues since 2026-09-25"], ["2,000+", "of them done"], ["100+", "agent work sessions on a busy day"]],
    teams: [
      { id: "lead", name: "Leadership", members: [["Lelouch", "CEO: direction, cross-team review, approves reviewed deploys"], ["Erwin", "Manager, client delivery"], ["Gojo", "Manager, Itai's own products; their reviewer"]] },
      { id: "build", name: "Builders", note: "each owns a product", members: [["Frieren", "Tend"], ["Mei", "Unskippable app + server"], ["Milly", "Autopost"], ["L", "MCPSafe"], ["Tanjiro", "Tickets"], ["Kaneki", "DemandCapture"], ["Edward", "mexant.com + internal tools"], ["Jin-Woo", "production builds"], ["Yuji", "client storefront + back office"], ["Kurapika", "client storefront + back office"], ["Fern", "another app"], ["Uta", "design"], ["Kamina", "design"]] },
      { id: "sec", name: "Security", members: [["Guts", "project security reviews"], ["Alucard", "security lead"]] },
      { id: "ops", name: "DevOps", members: [["Roy Mustang", "server + DevOps lead"], ["Winry", "server infrastructure"]] },
      { id: "sales", name: "Sales", members: [["Reigen", "sales lead"], ["Gon", "demos for sales reps"], ["Spike", "partner liaison"]] }
    ],
    // issue → build → independent review → security → Itai's approval → ship
    flow: [
      ["Issue", "Every task is a tracked issue with one owner. Work, reviews and approvals happen on it, so there's a full record."],
      ["Build", "A builder agent builds it. Big tasks need Itai's OK with a run estimate first; agents wake only for a specific issue."],
      ["Review", "A different agent reviews and re-checks it live. The builder never reviews its own work; a manager approves."],
      ["Security", "Anything touching auth, secrets or production data also gets a security review from Guts or Alucard."],
      ["Itai", "Nothing a client or prospect sees, and nothing that costs money, ships without his approval. He reviews the finished work himself."],
      ["Ship", "Backup and a written rollback before risky changes, a live check after every deploy, a rollback if it fails, and a report on the issue: done, verified, skipped."]
    ],
    rules: [
      "Every task is a tracked issue with one owner.",
      "The builder never reviews its own work; managers approve.",
      "Security changes get a separate security review.",
      "Nothing client-facing or costing money ships without Itai.",
      "Backup and rollback before risky changes; live check after.",
      "Cloudflare first for hosting (Workers, D1, R2, Containers).",
      "Spend caps and run budgets; agents wake only for an issue.",
      "Report on the issue: what was done, how it was verified, what was skipped."
    ],
    around: "Around the agents: an outside uptime monitor checks every client-facing app every minute, alerts Itai's phone and wakes the on-call agent; nightly backups; a nightly overview and a weekly sync written by the CEO agent."
  },

  // "What he's built" (projects not on itairotem.com) + "Client work" + "Demos".
  // Same shape as data.projects so the project card renders them; no `shot`
  // because none of these has a public page.
  projects: [
    {
      id: "autopost", name: "Autopost", status: "Internal tool", when: "",
      body: ["A studio where you upload clips; it auto-cuts and captions them, keeps a bank of edited clips, suggests edits with Claude, and schedules posts to TikTok and Instagram. A lot of its editing work later went into Unskippable."],
      facts: [["Problem", "Hours per captioned post"], ["Status", "Used internally"], ["Built by", "Milly (agent)"]],
      tech: ["Node.js", "SQLite", "ffmpeg", "whisper.cpp", "Cloudflare Containers", "Cloudflare R2"], links: []
    },
    {
      id: "demandcapture", name: "DemandCapture", status: "Paused", when: "First commit 2026-09-12 · paused late September 2026",
      body: ["Finds the questions B2B software buyers ask, samples AI answers, measures which brands get recommended, ranks the gaps and drafts fact-checked fixes. Strict honesty rules: modelled numbers are never shown as real results."],
      facts: [["Problem", "Who do AI assistants recommend?"], ["Status", "Paused by Itai"], ["Built by", "Kaneki (agent)"]],
      tech: ["FastAPI", "Next.js", "PostgreSQL", "pgvector", "Redis"], links: []
    },
    {
      id: "tickets", name: "Tickets", status: "Built, not launched", when: "First commit 2026-08-13 · for a construction-hauling trucking company",
      body: ["Digital hauling tickets for trucking: an offline-first web app for drivers (phone-code login, GPS, timestamps, photos and a signature, all with no signal), dispatch approval, invoicing, driver pay and a carrier portal. Multi-company, with database row-level security."],
      facts: [["Problem", "Paper tickets"], ["Status", "Parked until the client is ready"], ["Built by", "Tanjiro (agent)"]],
      tech: ["Next.js", "Supabase", "PostgreSQL RLS", "Twilio Verify"], links: []
    },
    {
      id: "ops", name: "Mexant ops tools", status: "Internal", when: "",
      body: ["An operations dashboard (builds in progress, an enquiries inbox, uptime and response times for every app, a ledger of every project and client) and an outside uptime monitor: a Cloudflare Worker that checks every client-facing app every minute, opens one incident after two failures in a row, pushes an alert to Itai's phone and wakes the on-call agent."],
      facts: [["Dashboard", "Next.js · Supabase"], ["Monitor", "Cloudflare Worker"], ["Checks", "Every minute"]],
      tech: ["Next.js", "Tailwind", "Supabase", "Cloudflare Workers"], links: []
    },
    {
      id: "client-store", name: "A fragrance & wholesale e-commerce brand", kind: "client", status: "Live since August 2026", when: "Mexant's first signed client · started as a demo",
      body: ["Problem: a stock theme store with no wholesale ordering, and stock and prices kept by hand across the store and the accounting system. Built: a custom storefront over their real Shopify catalogue (filters, an AI scent picker, wholesale ordering, Shopify checkout), then an AI back-office console over Shopify and QuickBooks: today's tasks, reorder points, stock and price differences, a trade inbox, competitor price checks, every change confirmed, logged and undoable."],
      facts: [["Problem", "No wholesale; stock by hand"], ["Built", "Storefront + AI back office"], ["Status", "Live"]],
      tech: ["Next.js", "Shopify Admin API", "QuickBooks Online", "Supabase", "Claude API"], links: []
    },
    {
      id: "client-clean", name: "A residential exterior-cleaning company", kind: "client", status: "Built · launch waits on the client", when: "",
      body: ["Problem: growing repeat business from an existing customer list. Built: customer import, review-request texts, a door-knocking form, a public booking page with service plans, a schedule and calendar, offers by text and email with consent handling, ad conversion tracking, results counting, team screens, and an installable app."],
      facts: [["Problem", "Repeat business"], ["Built", "Booking, offers, schedule"], ["Status", "Built"]],
      tech: ["Next.js", "Cloudflare Workers", "D1"], links: []
    },
    {
      id: "client-haul", name: "A construction-hauling trucking company", kind: "client", status: "Built, not launched", when: "See Tickets",
      body: ["Digital hauling tickets, built for this company. Built and tested but never put into daily use; parked until the client is ready."],
      facts: [["Built", "Tickets"], ["Status", "Parked"]],
      tech: ["Next.js", "Supabase", "Twilio Verify"], links: []
    }
  ],

  // One line per new project, for the ledger rows and the Everything panel.
  blurbs: {
    autopost: "Upload clips; it cuts, captions and schedules the posts.",
    demandcapture: "Which brands do AI assistants recommend to B2B buyers?",
    tickets: "Offline-first digital hauling tickets for trucking.",
    ops: "The ops dashboard and the minute-by-minute uptime monitor.",
    "client-store": "Custom storefront + AI back office over Shopify and QuickBooks.",
    "client-clean": "Booking page, offers by text and email, schedule, team screens.",
    "client-haul": "Tickets, built for them."
  },

  mexant: {
    kinds: ["Websites: from simple sites to e-commerce, booking, payments and member areas.", "Custom software: internal tools, CRMs, integrations, dashboards, web and mobile apps.", "AI services: chatbots, knowledge-base search, document and form automation, scheduling, review management, quote calculators, content automation.", "Ongoing care: hosting, security, updates."],
    steps: [["First contact", "Itai brings the opportunity, or a business sees a free demo built for it first."], ["Demo", "A quick, disposable preview plus a short video, built from the business's own words and photos."], ["Scope", "A manager agent scopes the work and sets a scope fence: what's in, what's out, a run budget."], ["Build", "A builder agent builds it, with a design pass first for client work."], ["Review", "A different agent reviews the code and re-checks it live; security work gets a security review."], ["Itai's review", "He sees the finished work before the client does."], ["Ship", "Backup and rollback ready, deploy, live check, and a report on the issue."]],
    demos: "Mexant's way in with a new business is to show, not pitch: a small live preview of that business's software and a short video, before asking for anything. The storefront demo became Mexant's first paying client build.",
    noPrices: "No prices here: for rates or a quote, email Itai."
  },

  // "Skills this proves (each tied to a project above)"
  proves: [
    ["AI agent orchestration", "designed and runs a 23-agent team on Paperclip, with roles, managers, review gates and approval rules; 2,000+ tracked issues done since 2026-09-25."],
    ["Product management", "owns the roadmap for Tend, Unskippable and MCPSafe; scopes work with scope fences and run budgets; picks designs from rendered concepts; decides what to pause."],
    ["Shipping iOS apps", "Tend is live on the App Store (Expo, React Native, widgets, HealthKit, subscriptions); Unskippable is in TestFlight beta."],
    ["Cloudflare", "a Cloudflare-first rule for every new build; Tend's backend, MCPSafe, Autopost, the uptime monitor, client apps and this chat all run there."],
    ["Security-minded review", "every security-relevant change gets a separate security review; MCPSafe is itself a security scanner; client apps use row-level security, audit logs and undo."],
    ["Cost control", "agents wake only for a specific issue, big tasks need a run estimate first, and AI features have hard daily spend caps (this chat included)."],
    ["Real client delivery", "a live e-commerce storefront and back office for a small business, plus booking and trucking builds for two more."]
  ]
};
