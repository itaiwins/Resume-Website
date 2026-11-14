// The conversation engine. Two ways an answer is produced, one way it is shown:
//   - the real model (model.js) streams SSE deltas; LiveWriter lays each word
//     out as it arrives and a paced queue reveals them (so a burst of tokens
//     still reads as writing, and a slow model never looks frozen);
//   - the scripted answers (answers.js) are laid out whole, then revealed with
//     the same word reveal. They are the fallback for any turn the model can't
//     take, and the source of the artifacts shown under the model's words.
// A markdown subset is rendered to DOM; artifacts are {{name:arg}} blocks.
// The skin may set window.SKIN = { thinking: () => Node } before this runs.
(() => {
  const D = window.DATA, A = window.ANSWERS, SKIN = window.SKIN || {}, MODEL = window.MODEL || null;
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const MORE = window.MORE || { projects: [], blurbs: {} };
  const PROJECTS = D.projects.concat(MORE.projects || []); // data.js (vetted, byte-identical) + pack v2 (more.js)
  const projectById = id => PROJECTS.find(p => p.id === id);
  const blurbOf = id => A.blurbs[id] || (MORE.blurbs || {})[id] || "";

  const thread = $("#thread"), form = $("#composer"), input = $("#input"), sendBtn = $("#send"), chipsEl = $("#chips"), hero = $("#hero");
  let streaming = null; // { skip: fn } while an answer is revealing

  // ---------- markdown subset (whole text) ----------
  function inline(text, into) {
    // **bold**, *em*, `code`, [text](url), and bare URLs / the email (shown as the short host)
    const re = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\)|https?:\/\/[^\s<>"')\]]+|[\w.+-]+@[\w-]+\.[\w.-]+)/g;
    let last = 0, m;
    while ((m = re.exec(text))) {
      if (m.index > last) into.append(text.slice(last, m.index));
      const t = m[0];
      if (t.startsWith("**")) into.append(el("strong", null, t.slice(2, -2)));
      else if (t.startsWith("`")) into.append(el("code", null, t.slice(1, -1)));
      else if (t.startsWith("[")) { const mm = t.match(/^\[([^\]]+)\]\(([^)]+)\)$/); into.append(link(mm[1], mm[2])); }
      else if (/^https?:|@/.test(t)) { const u = autolink(t); if (u) { into.append(u.a); if (u.tail) into.append(u.tail); } else into.append(t); }
      else into.append(el("em", null, t.slice(1, -1)));
      last = m.index + t.length;
    }
    if (last < text.length) into.append(text.slice(last));
  }
  function link(text, href) {
    const a = el("a", null, text); a.href = href;
    if (!/^mailto:/.test(href)) { a.target = "_blank"; a.rel = "noopener"; }
    return a;
  }
  // A bare URL or email in the words becomes a link labelled with its short host
  // ("apps.apple.com", "getunskippable.com"); trailing punctuation stays text.
  const shortHost = href => { try { return new URL(href).hostname.replace(/^www\./, ""); } catch { return href.replace(/^https?:\/\//, "").split("/")[0]; } };
  function autolink(w) {
    const m = w.match(/^(https?:\/\/[^\s<>"']+?|[\w.+-]+@[\w-]+\.[\w.-]+?)([.,;:!?)]*)$/);
    if (!m || (m[1].includes("://") && m[1].length <= 10)) return null;
    const isUrl = m[1].includes("://");
    const a = link(isUrl ? shortHost(m[1]) : m[1], isUrl ? m[1] : "mailto:" + m[1]);
    a.title = isUrl ? m[1] : ""; a.classList.add("auto");
    return { a, tail: m[2] || "" };
  }
  function markdown(src) {
    const frag = document.createDocumentFragment();
    for (const block of src.split(/\n\s*\n/)) {
      const b = block.trim(); if (!b) continue;
      const art = b.match(/^\{\{(\w[\w-]*)(?::([\w-]+))?\}\}$/);
      const blk = el("div", "blk");
      if (art) { const node = ARTIFACTS[art[1]] ? ARTIFACTS[art[1]](art[2]) : null; if (!node) continue; node.classList.add("art"); node.dataset.art = art[1]; blk.classList.add("blk-art"); blk.append(node); frag.append(blk); continue; }
      if (/^> /.test(b)) { const p = el("p", "note"); inline(b.replace(/^> /, "").replace(/\n/g, " "), p); blk.classList.add("blk-note"); blk.append(p); frag.append(blk); continue; }
      if (/^- /m.test(b)) { const ul = el("ul"); for (const line of b.split("\n")) { const li = el("li"); inline(line.replace(/^- /, ""), li); ul.append(li); } blk.append(ul); frag.append(blk); continue; }
      const p = el("p"); inline(b.replace(/\n/g, " "), p); blk.append(p); frag.append(blk);
    }
    return frag;
  }
  // The artifact blocks of a scripted topic, in order, as markdown.
  const artifactsOf = id => ((A.topics[id] || {}).text || "").match(/\{\{[^}]+\}\}/g) || [];
  // The words of a scripted topic without its artifacts, for the history.
  const wordsOf = id => ((A.topics[id] || A.topics.fallback).text || "").replace(/\{\{[^}]+\}\}/g, "").replace(/\n{3,}/g, "\n\n").trim();

  // ---------- artifacts ----------
  const ARTIFACTS = {
    bento() {
      const wrap = el("div", "bento");
      const order = ["tend", "unskippable", "mcpsafe", "mexant", "walleto", "trading", "alphahq", "oura", "site-3d"];
      for (const id of order) {
        const p = projectById(id); const t = el("button", "tile"); t.type = "button"; t.dataset.id = id;
        t.setAttribute("aria-label", `${p.name}: ${blurbOf(id)}`);
        const media = el("div", "tile-media");
        if (window.DEMOS && window.DEMOS[id]) media.append(window.DEMOS[id]({ compact: true }));
        else if (p.shot) { const img = el("img"); img.src = `img/${p.shot}`; img.alt = p.shotAlt; img.loading = "lazy"; img.decoding = "async"; media.append(img); }
        else if (id === "trading") { const ul = el("ul", "tile-list"); for (const n of ["Automated Trading", "Backtest Engine", "Signal API", "Research Agent"]) ul.append(el("li", null, n)); media.append(ul); }
        else media.append(el("div", "tile-mark", p.name[0]));
        const text = el("div", "tile-text");
        text.append(el("span", "tile-name", id === "trading" ? "Trading tools" : p.name), el("span", "tile-status", id === "trading" ? "4 tools · Python" : p.status), el("span", "tile-blurb", blurbOf(id)));
        t.append(media, text);
        t.addEventListener("click", () => ask(id === "trading" ? "Show me the trading tools" : `What's ${p.name}?`, id === "trading" ? "trading" : id));
        wrap.append(t);
      }
      if (!(MORE.projects || []).length) return wrap;
      const all = el("div", "allwork"); all.append(wrap, ARTIFACTS.ledger());
      return all;
    },
    // The rest of the work, as a ledger: the internal tools and the client builds (clients anonymised, as in the pack).
    ledger(kind) {
      const rows = (MORE.projects || []).filter(p => !kind || (kind === "clients" ? p.kind === "client" : p.kind !== "client"));
      const wrap = el("div", "ledger");
      const groups = kind ? [[kind === "clients" ? "Client work · clients kept anonymous" : "Also built", rows]] : [["Also built", rows.filter(p => p.kind !== "client")], ["Client work · clients kept anonymous", rows.filter(p => p.kind === "client")]];
      for (const [title, list] of groups) {
        if (!list.length) continue;
        wrap.append(el("h4", "ledger-h", title));
        for (const p of list) {
          const b = el("button", "lrow"); b.type = "button";
          b.append(el("span", "lrow-name", p.name), el("span", "lrow-blurb", blurbOf(p.id)), el("span", "lrow-status", p.status));
          b.addEventListener("click", () => ask(p.kind === "client" ? `Tell me about the ${p.name.replace(/^An? /, "")}` : `What's ${p.name}?`, p.id));
          wrap.append(b);
        }
      }
      return wrap;
    },
    // "How Itai works": the agent org as a spec sheet (org.js), with the rules under it.
    org() {
      const sheet = window.DRAWING && window.DRAWING.org ? window.DRAWING.org() : null; if (!sheet) return null;
      return sheet;
    },
    // The steps of a Mexant project, from first contact to ship.
    steps() {
      const M = MORE.mexant; if (!M) return null;
      const ol = el("ol", "steps");
      M.steps.forEach(([k, v]) => { const li = el("li"); li.append(el("span", "step-k", k), el("span", "step-v", v)); ol.append(li); });
      return ol;
    },
    // Skills this proves, each tied to a project (pack v2).
    proves() {
      const P = MORE.proves; if (!P) return null;
      const dl = el("dl", "proves");
      for (const [k, v] of P) dl.append(el("dt", null, k), el("dd", null, v));
      return dl;
    },
    project(id) {
      const p = projectById(id); const c = el("div", "pcard");
      const head = el("div", "pcard-head"); head.append(el("span", "pcard-name", p.name), el("span", "pcard-status", p.status));
      if (p.when) head.append(el("span", "pcard-when", p.when));
      c.append(head);
      if (p.shot) { const img = el("img", "pcard-shot"); img.src = `img/${p.shot}`; img.alt = p.shotAlt; img.loading = "eager"; img.decoding = "async"; img.width = 960; img.height = 600; c.append(img); }
      else if (p.body && p.body[0]) c.append(el("p", "pcard-body", p.body[0]));
      const facts = el("dl", "facts"); for (const [k, v] of p.facts) { facts.append(el("dt", null, k), el("dd", null, v)); } c.append(facts);
      const tech = el("ul", "tech"); for (const t of p.tech) tech.append(el("li", null, t)); c.append(tech);
      if (p.links.length) { const links = el("div", "links"); for (const l of p.links) { const a = link(l.label, l.href); a.className = "link"; links.append(a); } c.append(links); }
      return c;
    },
    about() {
      const c = el("div", "about");
      const stats = el("dl", "stats"); for (const [v, k] of D.about.stats) { const g = el("div", "stat"); g.append(el("dd", null, v), el("dt", null, k)); stats.append(g); } c.append(stats);
      const det = el("dl", "facts"); for (const [k, v] of D.about.details) det.append(el("dt", null, k), el("dd", null, v)); c.append(det);
      c.append(el("p", "art-note", "As published on itairotem.com."));
      return c;
    },
    timeline() {
      const wrap = el("div", "timeline-wrap");
      const ol = el("ol", "timeline");
      for (const j of D.experience) {
        const li = el("li", "job"); const h = el("div", "job-head"); h.append(el("span", "job-role", j.role), el("span", "job-org", j.org), el("span", "job-when", j.when)); li.append(h, el("p", "job-body", j.body));
        const ul = el("ul", "job-bullets"); for (const b of j.bullets) ul.append(el("li", null, b)); li.append(ul); ol.append(li);
      }
      wrap.append(ol, el("p", "art-note", "His words, as published on itairotem.com."));
      return wrap;
    },
    skills() {
      const c = el("div", "skills");
      for (const [group, items] of D.skills) {
        const g = el("div", "skill-group"); g.append(el("h4", null, group));
        for (const [name, v] of items) { const row = el("div", "skill"); row.style.setProperty("--v", v / 100); row.append(el("span", "skill-name", name), el("span", "skill-bar"), el("span", "skill-v", v)); g.append(row); }
        c.append(g);
      }
      c.append(el("p", "art-note", "Self-rated, as published on itairotem.com."));
      return c;
    },
    contact() {
      const c = el("div", "contact");
      for (const [k, label, href] of D.contact.links) { const a = link("", href); a.className = "contact-row"; a.textContent = ""; a.append(el("span", "contact-k", k), el("span", "contact-v", label)); c.append(a); }
      c.append(el("p", "contact-note", D.contact.availability));
      return c;
    },
    everything() {
      const b = el("button", "open-all"); b.type = "button"; b.textContent = "Open everything"; b.addEventListener("click", openEverything); return b;
    },
    demo(id) { return window.DEMOS && window.DEMOS[id] ? window.DEMOS[id]({ compact: false }) : null; },
    drawing(id) { return window.DRAWING && window.DRAWING[id] ? window.DRAWING[id]() : null; }
  };

  // ---------- everything panel ----------
  const dlg = $("#everything");
  function buildEverything() {
    const body = $("#everything-body"); if (!body || body.childElementCount) return;
    const sec = (title, node) => { const s = el("section"); s.append(el("h3", null, title), node); body.append(s); };
    const ab = el("div"); ab.append(el("p", null, D.welcome[2]), el("p", null, D.welcome[4]), el("p", null, D.welcome[6])); sec("About, in his words", ab);
    if (MORE.org) {
      const how = el("div", "how");
      how.append(el("p", null, "Itai designed and manages an AI engineering team. Mexant runs as an AI-native one-person company: Itai is the only human, and a team of " + MORE.org.scale[0][0] + " AI agents does the building, reviewing, security checks and operations, organised like a real company on Paperclip."));
      how.append(ARTIFACTS.org());
      const teams = el("dl", "teams");
      for (const t of MORE.org.teams) { teams.append(el("dt", null, `${t.name} · ${t.members.length}`), el("dd", null, t.members.map(([n, r]) => `${n} (${r})`).join(" · "))); }
      how.append(teams, el("p", "art-note", MORE.org.around));
      sec("How he works: Paperclip and the agent team", how);
    }
    if (MORE.mexant) {
      const mx = el("div", "mex");
      mx.append(el("p", null, "Mexant LLC is the company Itai founded. Tend and MCPSafe ship under it, and Unskippable is made by it. From mexant.com: \"Mexant builds the shop, the back office and the books for small businesses, and makes them agree. Shipped in weeks, not quarters.\""));
      const kinds = el("ul", "kinds"); for (const k of MORE.mexant.kinds) kinds.append(el("li", null, k)); mx.append(kinds);
      mx.append(el("h4", "sub", "How a project runs"), ARTIFACTS.steps(), el("p", "art-note", MORE.mexant.demos + " " + MORE.mexant.noPrices));
      sec("Mexant", mx);
    }
    const pl = el("ul", "plist"); for (const p of PROJECTS) { const li = el("li", "p"); if (p.kind === "client") li.classList.add("client"); li.append(el("strong", null, p.name), el("span", null, ` · ${p.status}. `), document.createTextNode(blurbOf(p.id))); if (p.links[0]) { li.append(" ", link(p.links[0].label, p.links[0].href)); } pl.append(li); } sec("All projects", pl);
    if (MORE.proves) sec("Skills this proves", ARTIFACTS.proves());
    sec("Experience", ARTIFACTS.timeline());
    sec("Skills", ARTIFACTS.skills());
    sec("Contact", ARTIFACTS.contact());
  }
  let lastFocus = null;
  function openEverything() { if (!dlg) return; buildEverything(); lastFocus = document.activeElement; dlg.showModal(); history.replaceState(null, "", "#everything"); }
  function closeEverything() { dlg.close(); }
  if (dlg) {
    dlg.addEventListener("close", () => { if (location.hash === "#everything") history.replaceState(null, "", location.pathname); if (lastFocus) lastFocus.focus(); });
    dlg.addEventListener("click", e => { if (e.target === dlg) closeEverything(); });
    $("#close-everything")?.addEventListener("click", closeEverything);
    $("#open-everything")?.addEventListener("click", openEverything);
    if (location.hash === "#everything") openEverything();
  }

  // ---------- model chip ----------
  const picker = $("#model");
  if (picker) {
    const label = $("#model-id"), menu = $("#model-menu");
    for (const v of A.model.versions) {
      const b = el("button", "model-opt"); b.type = "button"; b.setAttribute("role", "menuitemradio"); b.setAttribute("aria-checked", String(v.id === A.model.id));
      b.append(el("span", "model-opt-id", v.id), el("span", "model-opt-note", v.note), el("span", "model-opt-when", v.when));
      b.addEventListener("click", () => { label.textContent = v.id; for (const o of menu.querySelectorAll(".model-opt")) o.setAttribute("aria-checked", String(o === b)); picker.removeAttribute("open"); });
      menu.append(b);
    }
    menu.append(el("p", "model-note", A.model.note));
    const state = el("p", "model-state"); state.append(el("span", "model-state-dot"), el("span", "model-state-text", A.model.live)); menu.append(state);
    document.addEventListener("click", e => { if (picker.open && !picker.contains(e.target)) picker.removeAttribute("open"); });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && picker.open) picker.removeAttribute("open"); });
    new MutationObserver(() => { const busy = document.body.dataset.model === "busy"; $(".model-state-text", menu).textContent = busy ? A.model.busy : A.model.live; picker.querySelector("summary").setAttribute("aria-label", `Model: ${label.textContent}, ${busy ? "busy" : "live"}. Change version`); }).observe(document.body, { attributes: true, attributeFilter: ["data-model"] });
  }

  // ---------- chips ----------
  function setChips(list) {
    chipsEl.replaceChildren();
    for (const t of list) { const b = el("button", "chip", t); b.type = "button"; b.addEventListener("click", () => ask(t, A.prompts[t])); chipsEl.append(b); }
  }

  // ---------- intent ----------
  function matchTopic(text) {
    const q = text.toLowerCase().replace(/[’']/g, "'");
    if (A.prompts[text]) return A.prompts[text];
    for (const [re, id] of A.match) if (re.test(q)) return id;
    return "fallback";
  }

  // ---------- reveal ----------
  const pinned = () => (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 120);
  const scrollEnd = () => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "instant" });
  let skipped = false;
  const beginReveal = () => { skipped = false; streaming = { skip: () => { skipped = true; } }; sendBtn.classList.add("stop"); sendBtn.setAttribute("aria-label", "Show the whole answer"); };
  const endReveal = () => { sendBtn.classList.remove("stop"); sendBtn.setAttribute("aria-label", "Send"); streaming = null; };
  const pace = (word, prev) => { let ms = 18 + Math.random() * 30; if (/[.!?]\s*$/.test(prev)) ms += 140; else if (/[,;:]\s*$/.test(prev)) ms += 60; return ms; };

  function tokenize(root) {
    // Wrap every word (plus trailing space) in a span, in document order. Artifacts stay whole.
    const toks = [];
    const walk = node => {
      for (const child of [...node.childNodes]) {
        if (child.nodeType === 3) {
          const parts = child.textContent.match(/\S+|\s+/g) || [];
          const frag = document.createDocumentFragment();
          for (const w of parts) { if (!w.trim()) { frag.append(w); continue; } const s = el("span", "tok", w); frag.append(s); toks.push({ kind: "word", node: s }); }
          child.replaceWith(frag);
        } else if (child.nodeType === 1 && child.classList.contains("blk")) { toks.push({ kind: child.classList.contains("blk-art") ? "art" : "block", node: child }); if (!child.classList.contains("blk-art")) walk(child); }
        else if (child.nodeType === 1) walk(child);
      }
    };
    walk(root);
    return toks;
  }

  // Whole text known up front (scripted): lay everything out, then reveal in place.
  async function streamInto(container, frag) {
    container.append(frag);
    const toks = tokenize(container);
    for (const t of toks) if (t.kind !== "word") t.node.classList.add("pending");
    container.classList.add("streaming");
    beginReveal();
    const instant = reduce();
    let lastWord = "", cur = null;
    for (const t of toks) {
      const keep = pinned();
      if (t.kind === "block") { t.node.classList.remove("pending"); t.node.classList.add("open"); if (!instant && !skipped) await sleep(120); }
      else if (t.kind === "art") { if (!instant && !skipped) await sleep(260); t.node.classList.remove("pending"); t.node.classList.add("open"); if (keep) requestAnimationFrame(scrollEnd); if (!instant && !skipped) await sleep(420); }
      else {
        t.node.classList.add("on"); if (cur) cur.classList.remove("cur"); cur = t.node; cur.classList.add("cur");
        if (!instant && !skipped) { const w = t.node.textContent; const ms = pace(w, lastWord); lastWord = w; await sleep(ms); }
      }
      if (keep) scrollEnd();
    }
    if (cur) cur.classList.remove("cur");
    container.classList.remove("streaming"); container.classList.add("done");
    endReveal();
  }

  // Artifacts under a finished live answer: appended collapsed, then opened one by one.
  async function appendArtifacts(container, ids) {
    const blocks = ids.join("\n\n"); if (!blocks) return;
    container.classList.remove("done");
    const frag = markdown(blocks);
    const arts = [...frag.querySelectorAll(".blk")];
    for (const b of arts) b.classList.add("pending");
    container.append(frag);
    const instant = reduce();
    for (const b of arts) {
      const keep = pinned();
      if (!instant && !skipped) await sleep(220);
      b.classList.remove("pending"); b.classList.add("open");
      if (keep) requestAnimationFrame(scrollEnd);
      if (!instant && !skipped) await sleep(380);
    }
    container.classList.add("done");
  }

  // Text arriving in pieces (the model): words are laid out as they arrive and
  // revealed from a paced queue, so a burst of tokens still reads as writing.
  class LiveWriter {
    constructor(container) {
      this.c = container; this.buf = ""; this.pos = 0; this.final = false;
      this.blk = null; this.box = null; this.list = null; this.stack = []; this.wrap = null;
      this.unit = []; this.queue = []; this.draining = false; this.cur = null; this.prevWord = "";
      this.instant = reduce();
      container.classList.add("streaming");
    }
    get text() { return this.buf; }
    feed(t) { this.buf += t; this.consume(); this.drain(); }
    async end() { this.final = true; this.consume(); this.closeBlock(); this.drain(); while (this.draining) await sleep(20); if (this.cur) this.cur.classList.remove("cur"); this.c.classList.remove("streaming"); this.c.classList.add("done"); }
    openBlock(kind) {
      this.closeBlock();
      this.blk = el("div", "blk open"); this.blk.dataset.live = "";
      if (kind === "p") { this.box = el("p"); this.blk.append(this.box); this.list = null; }
      else { this.list = el(kind); this.blk.append(this.list); this.box = el("li"); this.list.append(this.box); }
      this.stack = []; this.wrap = this.box; this.c.append(this.blk);
    }
    newItem() { this.flushUnit(); this.box = el("li"); this.list.append(this.box); this.stack = []; this.wrap = this.box; }
    closeBlock() { this.flushUnit(); this.blk = null; this.box = null; this.list = null; this.stack = []; this.wrap = null; }
    toggle(tag) {
      this.flushUnit();
      const top = this.stack[this.stack.length - 1];
      if (top && top.tagName.toLowerCase() === tag) { this.stack.pop(); this.wrap = this.stack[this.stack.length - 1] || this.box; return; }
      const n = el(tag); this.wrap.append(n); this.stack.push(n); this.wrap = n;
    }
    word(w) {
      // Bare URLs and the email become links (the model writes them plain); trailing punctuation stays text.
      const u = autolink(w);
      if (u) {
        u.a.classList.add("tok"); this.wrap.append(u.a); this.unit.push(u.a);
        if (u.tail) { const t = el("span", "tok", u.tail); this.wrap.append(t); this.unit.push(t); }
        return;
      }
      const s = el("span", "tok", w); this.wrap.append(s); this.unit.push(s);
    }
    space(s) { this.flushUnit(); this.wrap.append(s); }
    flushUnit() { if (this.unit.length) { this.queue.push(this.unit); this.unit = []; } }
    inline(text) {
      const re = /(\*\*)|(`)|\[([^\]]*)\]\(([^)\s]*)\)|(\s+)|([^\s*`\[]+)|(\*)|(\[)/g;
      let m;
      while ((m = re.exec(text))) {
        if (m[1]) this.toggle("strong");
        else if (m[2]) this.toggle("code");
        else if (m[3] != null) { this.flushUnit(); const a = link("", m[4]); a.textContent = ""; this.wrap.append(a); for (const part of m[3].match(/\S+|\s+/g) || []) { if (part.trim()) { const s = el("span", "tok", part); a.append(s); this.unit.push(s); } else a.append(part); } this.flushUnit(); }
        else if (m[5]) this.space(m[5]);
        else if (m[6]) this.word(m[6]);
        else if (m[7]) { const next = text[m.index + 1]; const emOpen = this.stack.some(n => n.tagName === "EM"); if (emOpen || (next && !/\s/.test(next))) this.toggle("em"); else this.word("*"); }
        else if (m[8]) this.word("[");
      }
    }
    consume() {
      for (;;) {
        const rest = this.buf.slice(this.pos);
        if (!rest) return;
        if (!this.blk) {
          const ws = rest.match(/^\s*/)[0];
          if (ws.length === rest.length) { if (this.final) this.pos = this.buf.length; return; }
          this.pos += ws.length;
          const line = this.buf.slice(this.pos);
          const lm = line.match(/^(?:[-*•]\s|\d{1,2}[.)]\s)/);
          if (lm) { this.openBlock(/^\d/.test(line) ? "ol" : "ul"); this.pos += lm[0].length; continue; }
          if (!this.final && line.length < 4 && /^(?:[-*•]|\d{1,2}[.)]?)$/.test(line)) return; // can't tell a marker from a word yet
          const hm = line.match(/^#{1,4}\s+/);
          this.openBlock("p");
          if (hm) { this.pos += hm[0].length; this.toggle("strong"); }
          continue;
        }
        const nl = rest.indexOf("\n");
        const seg = nl === -1 ? rest : rest.slice(0, nl);
        let commit = seg;
        if (nl === -1 && !this.final) {
          const i = seg.search(/\S+$/); commit = i === -1 ? seg : seg.slice(0, i);
          const lb = commit.lastIndexOf("["); if (lb !== -1 && !/\]\([^)]*\)/.test(commit.slice(lb))) commit = commit.slice(0, lb);
        }
        if (commit) { this.inline(commit); this.pos += commit.length; }
        if (nl === -1) return;
        // At a newline: what follows decides whether the block continues.
        const after = this.buf.slice(this.pos + 1);
        if (!this.final && after.length < 4 && !after.includes("\n")) return;
        if (/^[ \t]*\n/.test(after) || (this.final && !after.trim())) { this.pos += 1; this.closeBlock(); continue; }
        const lm = after.match(/^[ \t]*(?:[-*•]\s|\d{1,2}[.)]\s)/);
        if (lm) { this.pos += 1 + lm[0].length; if (this.list) this.newItem(); else { this.closeBlock(); this.openBlock(/\d/.test(lm[0]) ? "ol" : "ul"); } continue; }
        this.pos += 1; this.space(" "); // soft wrap
      }
    }
    async drain() {
      if (this.draining) return; this.draining = true;
      while (this.queue.length) {
        const u = this.queue.shift(); const keep = pinned();
        for (const s of u) s.classList.add("on");
        if (this.cur) this.cur.classList.remove("cur"); this.cur = u[u.length - 1]; this.cur.classList.add("cur");
        if (keep) scrollEnd();
        if (!this.instant && !skipped) {
          const w = u.map(s => s.textContent).join(""); const n = this.queue.length;
          const ms = n > 60 ? 10 : n > 25 ? 16 : pace(w, this.prevWord); this.prevWord = w;
          await sleep(ms);
        }
      }
      this.draining = false;
    }
  }

  // ---------- conversation ----------
  let busy = false;
  const convo = []; // { role, content } of what was shown, for the model
  async function ask(text, topicId) {
    if (busy) { if (streaming) streaming.skip(); return; }
    text = text.trim(); if (!text) return;
    if (text.length > 2000) text = text.slice(0, 2000);
    busy = true;
    const first = !document.body.classList.contains("talking");
    const go = () => { document.body.classList.add("talking"); if (hero) hero.classList.add("gone"); };
    if (first && document.startViewTransition && !reduce() && document.visibilityState === "visible") {
      let vt = null; try { vt = document.startViewTransition(go); } catch { go(); }
      if (vt) { vt.finished.catch(() => {}); vt.ready.catch(() => {}); await vt.updateCallbackDone.catch(() => { if (!document.body.classList.contains("talking")) go(); }); }
    } else go();
    chipsEl.replaceChildren();
    const u = el("div", "msg user"); const ub = el("div", "bubble"); ub.append(el("p", null, text)); u.append(ub); thread.append(u);
    input.value = ""; autosize();
    requestAnimationFrame(scrollEnd);
    const m = el("div", "msg bot");
    const th = SKIN.thinking ? SKIN.thinking() : el("div", "thinking", "Thinking");
    m.append(th); thread.append(m);
    requestAnimationFrame(scrollEnd);

    const id = topicId || matchTopic(text);
    const topic = A.topics[id] || A.topics.fallback;
    const attach = topicId ? artifactsOf(id) : (A.artifactTopics.includes(id) ? artifactsOf(id) : []);
    m.dataset.topic = id;
    const body = el("div", "bubble answer");
    let shown = null; // what the assistant said, for the history
    let next = topic.next;

    // 1. The model, when it's up.
    let fell = null; // why the turn fell back, if it did
    if (MODEL) { // tried every turn, even when /health failed on load (a network blip is not a visit-long verdict)
      const msgs = convo.slice(-9).concat({ role: "user", content: text });
      const conn = await MODEL.open(msgs);
      if (conn.kind === "stream") {
        let writer = null; let first = true;
        const { result, got } = await conn.read(delta => {
          if (first) { first = false; th.remove(); m.append(body); writer = new LiveWriter(body); beginReveal(); requestAnimationFrame(scrollEnd); }
          writer.feed(delta);
        });
        if (got) {
          await writer.end();
          shown = writer.text;
          if (result !== "done") { await streamInto(body, markdown("> " + A.notes.dropped + "\n\n" + topic.text)); shown += "\n\n" + wordsOf(id); }
          else { m.dataset.model = "live"; await appendArtifacts(body, attach); if (id === "fallback") next = null; }
        } else fell = result === "done" ? "unavailable" : "dropped";
      } else fell = conn.reason;
    } else fell = "none";

    // 2. The scripted answer, when the model couldn't take the turn.
    if (shown == null) {
      if (!reduce()) await sleep(500 + Math.random() * 400); // thinking holds a beat so it never flashes
      th.remove(); m.append(body); m.dataset.model = fell === "none" ? "scripted" : "fallback";
      const note = fell === "none" ? "" : fell === "rate_limited" ? "> " + A.notes.limited + "\n\n" : "> " + A.notes.busy + "\n\n";
      await streamInto(body, markdown(note + topic.text));
      shown = wordsOf(id);
    }
    endReveal();
    convo.push({ role: "user", content: text }, { role: "assistant", content: shown.slice(0, 2000) });
    setChips(next == null ? A.root : next);
    if (pinned()) requestAnimationFrame(scrollEnd);
    busy = false;
  }

  // ---------- composer ----------
  function autosize() { input.style.height = "auto"; input.style.height = Math.min(input.scrollHeight, 180) + "px"; }
  input.addEventListener("input", autosize);
  input.addEventListener("keydown", e => { if (e.key === "Enter" && !e.shiftKey && !e.isComposing) { e.preventDefault(); form.requestSubmit(); } });
  form.addEventListener("submit", e => { e.preventDefault(); if (streaming) { streaming.skip(); return; } ask(input.value); });
  setChips(A.root);
  // The on-screen keyboard: keep the dock above it (iOS keeps the layout viewport, so we measure the visual one).
  if (window.visualViewport) {
    const vv = window.visualViewport;
    const fit = () => { const kb = Math.max(0, window.innerHeight - vv.height - vv.offsetTop); document.documentElement.style.setProperty("--kb", kb + "px"); };
    vv.addEventListener("resize", fit); vv.addEventListener("scroll", fit); fit();
  }
  if (MODEL) MODEL.check();
  window.ASK = ask;
})();
