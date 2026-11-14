// Faux-UI demos in the Stageshow manner, plain DOM: a believable screen,
// quiet filler bars, real words only on what the story is about, one thing
// happening per loop, every motion with a cause. Real strings come from
// data.js (Tend: the three example phrases; Unskippable: "Ready to post?",
// "post it yourself"; MCPSafe: the three vulnerability classes, "trust
// scores"). Nothing else is written on the screens.
// Each demo plays while on screen and loops with a visible reset; under
// prefers-reduced-motion it shows the payoff frame and does not move.
(() => {
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const bar = (w, cls = "") => { const b = el("i", "bar " + cls); b.style.width = typeof w === "number" ? w + "%" : w; return b; };
  const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

  // A timeline that can be cancelled (loop restarts, element leaves view).
  function runner(root, script, poster) {
    let token = 0, playing = false;
    const api = {
      wait: (ms, t) => new Promise((res, rej) => setTimeout(() => (t === token ? res() : rej("cancel")), ms)),
      cancelled: t => t !== token
    };
    async function play() {
      const t = ++token; playing = true;
      try { while (!api.cancelled(t)) { await script(api, t); } } catch (e) { if (e !== "cancel") console.error(e); }
      playing = false;
    }
    function stop() { token++; }
    if (reduce()) { poster(); return; }
    const io = new IntersectionObserver(es => { for (const e of es) { if (e.isIntersecting && !playing) play(); else if (!e.isIntersecting) { stop(); } } }, { threshold: 0.35 });
    io.observe(root);
  }

  async function typeInto(node, text, api, t, cps = 36) {
    node.textContent = "";
    for (const ch of text) { node.textContent += ch; await api.wait(cps + Math.random() * 18, t); }
  }

  // ---------- Tend: the assistant bar files what you type ----------
  function tend({ compact }) {
    const root = el("div", "demo demo-tend" + (compact ? " compact" : "")); root.setAttribute("aria-label", "Tend demo: typing “Dentist Tuesday at 3” files an event, “buy milk” a task, “read 10 pages every day” a habit.");
    const screen = el("div", "scr");
    const top = el("div", "scr-top"); top.append(bar(28, "h8"), bar(46, "h14"));
    const summary = el("div", "scr-sum"); const s1 = el("div", "scr-cell"); s1.append(bar(50, "h7"), bar(34, "h16")); const s2 = el("div", "scr-cell"); s2.append(bar(40, "h7"), bar(58, "h16")); summary.append(s1, s2);
    const list = el("div", "scr-list");
    const filler = () => { const r = el("div", "row filler"); r.append(el("i", "box"), bar(55 + Math.random() * 25, "h9")); return r; };
    list.append(filler(), filler());
    const barWrap = el("div", "abar"); const field = el("div", "abar-field"); const txt = el("span", "abar-text"); const caret = el("i", "caret"); field.append(txt, caret); const mic = el("i", "abar-mic"); barWrap.append(field, mic);
    screen.append(top, summary, list, barWrap); root.append(screen);

    const beats = [
      { text: "Dentist Tuesday at 3", kind: "event", label: "Dentist", meta: "Tuesday · 3:00" },
      { text: "buy milk", kind: "task", label: "buy milk", meta: "" },
      { text: "read 10 pages every day", kind: "habit", label: "read 10 pages", meta: "every day" }
    ];
    const makeRow = b => {
      const r = el("div", "row new " + b.kind);
      const lead = el("i", "box " + b.kind);
      if (b.kind === "habit") { lead.replaceChildren(); for (let i = 0; i < 7; i++) lead.append(el("i", "dot" + (i < 1 ? " on" : ""))); lead.className = "dots"; }
      const t = el("span", "row-text"); t.append(el("b", null, b.label)); if (b.meta) t.append(el("small", null, b.meta));
      const tag = el("span", "tag " + b.kind, b.kind);
      r.append(lead, t, tag);
      return r;
    };
    const reset = () => { for (const n of list.querySelectorAll(".row.new")) n.remove(); txt.textContent = ""; };
    const poster = () => { reset(); for (const b of [...beats].reverse()) { const r = makeRow(b); r.classList.add("open"); list.prepend(r); } caret.style.display = "none"; };

    runner(root, async (api, t) => {
      reset(); root.classList.add("live");
      await api.wait(900, t);
      for (const b of beats) {
        await typeInto(txt, b.text, api, t);
        await api.wait(420, t);
        txt.textContent = ""; field.classList.add("sent"); setTimeout(() => field.classList.remove("sent"), 220);
        const r = makeRow(b); list.prepend(r);
        await api.wait(20, t); r.classList.add("open");
        await api.wait(1100, t);
      }
      await api.wait(2600, t);
      list.classList.add("clear"); await api.wait(360, t); reset(); list.classList.remove("clear");
      await api.wait(500, t);
    }, poster);
    return root;
  }

  // ---------- Unskippable: the Ready to post? check ----------
  function unskippable({ compact }) {
    const root = el("div", "demo demo-unsk" + (compact ? " compact" : "")); root.setAttribute("aria-label", "Unskippable demo: the Ready to post? check runs down a video, then you post it yourself.");
    const card = el("div", "scr");
    const head = el("div", "chk-head"); head.append(el("b", null, "Ready to post?"), bar(30, "h7"));
    const thumb = el("div", "thumb"); thumb.append(el("i", "thumb-bar"));
    const rows = el("div", "chk-rows"); const items = [];
    for (const w of [62, 44, 70, 52]) { const r = el("div", "chk"); const m = el("i", "mark"); m.innerHTML = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8.5l3 3 6-7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'; r.append(m, bar(w, "h8")); rows.append(r); items.push(r); }
    const btn = el("div", "cta", "Post it yourself");
    card.append(head, thumb, rows, btn); root.append(card);
    const reset = () => { for (const r of items) r.classList.remove("ok"); btn.classList.remove("on"); thumb.classList.remove("scan"); };
    const poster = () => { for (const r of items) r.classList.add("ok"); btn.classList.add("on"); };
    runner(root, async (api, t) => {
      reset(); await api.wait(800, t);
      thumb.classList.add("scan");
      for (const r of items) { await api.wait(520, t); r.classList.add("ok"); }
      await api.wait(400, t); thumb.classList.remove("scan"); btn.classList.add("on");
      await api.wait(3000, t);
      card.classList.add("clear"); await api.wait(320, t); reset(); card.classList.remove("clear");
      await api.wait(500, t);
    }, poster);
    return root;
  }

  // ---------- MCPSafe: a scan ----------
  function mcpsafe({ compact }) {
    const root = el("div", "demo demo-mcp" + (compact ? " compact" : "")); root.setAttribute("aria-label", "MCPSafe demo: a server is scanned for prompt injection, data exfiltration and excessive permissions, then gets a trust score.");
    const card = el("div", "scr");
    const field = el("div", "scan-field"); field.append(bar(58, "h8"), el("span", "scan-btn", "Scan"));
    const prog = el("div", "prog"); prog.append(el("i", "prog-fill"));
    const rows = el("div", "scan-rows"); const items = [];
    for (const name of ["Prompt injection", "Data exfiltration", "Excessive permissions"]) { const r = el("div", "scan-row"); r.append(el("i", "led"), el("span", "scan-name", name), bar(18, "h7 tail")); rows.append(r); items.push(r); }
    const score = el("div", "score"); score.append(el("span", "score-k", "Trust score"), (() => { const s = el("i", "score-bar"); s.append(el("i", "score-fill")); return s; })());
    card.append(field, prog, rows, score); root.append(card);
    const reset = () => { card.classList.remove("scanning", "scored"); for (const r of items) r.classList.remove("ok"); field.classList.remove("pressed"); };
    const poster = () => { card.classList.add("scored"); for (const r of items) r.classList.add("ok"); };
    runner(root, async (api, t) => {
      reset(); await api.wait(900, t);
      field.classList.add("pressed"); await api.wait(160, t); field.classList.remove("pressed");
      card.classList.add("scanning");
      for (const r of items) { await api.wait(650, t); r.classList.add("ok"); }
      await api.wait(500, t); card.classList.add("scored");
      await api.wait(3000, t);
      card.classList.add("clear"); await api.wait(320, t); reset(); card.classList.remove("clear");
      await api.wait(500, t);
    }, poster);
    return root;
  }

  window.DEMOS = { tend, unskippable, mcpsafe };
})();
