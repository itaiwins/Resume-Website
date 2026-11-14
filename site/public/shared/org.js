// "How Itai works": the agent org as a dimensional drawing (the same sheet
// language as the Tend day-view drawing, MEXA-2140): monochrome, boxed notes,
// reference dims, a title block and a footer. The subject here is the org
// itself, so the names and roles are the content; every one of them, and every
// number, comes from more.js (pack v2). Two layouts of the same facts: a wide
// sheet for the desktop column, a stacked one that reads at 390.
//
// Motion (emil choreograph + dimensional-drawing-motion, kept calm): when the
// sheet scrolls into view the pen draws Itai first, then the control-plane bus,
// the leadership row in one beat, the teams with a short overlap, the "23"
// reference dim, and last the issue → ship chain left to right with each
// caption fading in after its step. Strokes draw (stroke-dashoffset), text and
// fills fade. Under prefers-reduced-motion the finished sheet is simply there.
(() => {
  const O = window.MORE && window.MORE.org; if (!O) return;
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs = {}, text) => { const n = document.createElementNS(NS, tag); for (const k in attrs) if (attrs[k] != null) n.setAttribute(k, attrs[k]); if (text != null) n.textContent = text; return n; };

  function sheet(narrow) {
    const W = narrow ? 360 : 800;
    const svg = sv("svg", { class: "dd-sheet dd-org-sheet", role: "img", "aria-label": `How Itai works: Itai at the top, his AI agent team on Paperclip (${O.scale[0][0]} agents: leadership, builders, security, DevOps, sales), and the flow of every task: ${O.flow.map(f => f[0]).join(" → ")}.` });
    const lines = sv("g", { class: "dd-lines" }), fills = sv("g", { class: "dd-fills" }), dims = sv("g", { class: "dd-dims" }), text = sv("g", { class: "dd-text" });
    const defs = sv("defs"); const marker = sv("marker", { id: "dd-org-arrow", viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "7", markerHeight: "7", orient: "auto-start-reverse" }); marker.append(sv("path", { d: "M0 0L10 5L0 10z", fill: "#000" })); defs.append(marker);
    const hatch = sv("pattern", { id: "dd-org-hatch", width: "6", height: "6", patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" }); hatch.append(sv("line", { x1: 0, y1: 0, x2: 0, y2: 6, stroke: "#000", "stroke-width": "0.6" })); defs.append(hatch);
    svg.append(defs, fills, lines, dims, text);
    let t = 0; // the pen's clock, seconds
    const at = s => { t = s; return t; };
    const draw = (node, d = t) => { node.classList.add("dd-draw"); node.style.setProperty("--d", d.toFixed(2) + "s"); node.setAttribute("pathLength", "1"); return node; };
    const fade = (node, d = t) => { node.classList.add("dd-fade"); node.style.setProperty("--d", d.toFixed(2) + "s"); return node; };
    const txt = (x, y, s, cls = "dd-t", anchor = "start", d = t + 0.18) => { const n = sv("text", { x, y, class: cls, "text-anchor": anchor }, s); text.append(fade(n, d)); return n; };
    // Wrap a caption to a width, in sheet units (Arimo at `fs` px ≈ 0.5·fs per char).
    const wrap = (s, width, fs, k = 0.5) => { const max = Math.max(8, Math.floor(width / (fs * k))); const out = []; let line = ""; for (const w of s.split(" ")) { if ((line + " " + w).trim().length > max && line) { out.push(line); line = w; } else line = (line + " " + w).trim(); } if (line) out.push(line); return out; };
    const para = (x, y, s, width, fs, cls, anchor = "start", d = t + 0.18, lh = fs * 1.3, k = 0.5) => { const ls = wrap(s, width, fs, k); ls.forEach((l, i) => txt(x, y + i * lh, l, cls, anchor, d)); return y + ls.length * lh; };
    const box = (x, y, w, h, { r = 6, fill = "#fafafa", cls = "dd-obj" } = {}) => { const f = sv("rect", { x, y, width: w, height: h, rx: r, fill }); fills.append(fade(f, t + 0.3)); lines.append(draw(sv("rect", { x, y, width: w, height: h, rx: r, class: cls }))); };
    const link = (d, cls = "dd-conn") => lines.append((cls.includes("dd-thin") ? fade : draw)(sv("path", { d, class: cls })));
    const arrow = (x1, y1, x2, y2) => lines.append(fade(draw(sv("path", { d: `M${x1} ${y1}L${x2} ${y2}`, class: "dd-conn", "marker-end": "url(#dd-org-arrow)" }))));
    const nb = (x, y, n, d = t + 0.1) => { lines.append(draw(sv("rect", { x: x - 7, y: y - 8, width: 14, height: 14, class: "dd-nb" }), d)); txt(x, y + 3, String(n), "dd-nb-t", "middle", d + 0.1); };
    const dimV = (y1, y2, x, label, d = t) => { dims.append(fade(draw(sv("line", { x1: x, y1, x2: x, y2, class: "dd-dim", "marker-start": "url(#dd-org-arrow)", "marker-end": "url(#dd-org-arrow)" }), d), d)); dims.append(draw(sv("line", { x1: x - 6, y1, x2: x + 6, y2: y1, class: "dd-ext" }), d)); dims.append(draw(sv("line", { x1: x - 6, y1: y2, x2: x + 6, y2, class: "dd-ext" }), d)); txt(x + 8, (y1 + y2) / 2 + 4, label, "dd-dt", "start", d + 0.25); };
    const dimH = (x1, x2, y, label, d = t) => { dims.append(draw(sv("line", { x1, y1: y, x2, y2: y, class: "dd-dim", "marker-start": "url(#dd-org-arrow)", "marker-end": "url(#dd-org-arrow)" }), d)); txt((x1 + x2) / 2, y - 5, label, "dd-dt", "middle", d + 0.25); };

    const pad = narrow ? 14 : 28;
    let H;

    if (!narrow) {
      // ---- wide sheet: Itai, the bus, leadership, the teams, the flow, then the rules as notes ----
      const x0 = pad, x1 = W - pad - 44, cw = x1 - x0, mid = x0 + cw / 2;
      at(0);
      const iw = 300, ih = 54, ix = mid - iw / 2, iy = 36;
      box(ix, iy, iw, ih, { fill: "#f2f2f2", r: 8 });
      txt(mid, iy + 23, O.human.name.toUpperCase(), "dd-name", "middle", 0.25);
      txt(mid, iy + 40, O.human.role.toUpperCase(), "dd-slot-t", "middle", 0.35);
      txt(ix - 10, iy + 31, "×1", "dd-dt", "end", 0.4);
      nb(ix + iw + 12, iy + 10, "A", 0.45);
      txt(x1, iy + 31, "A · " + O.human.does.slice(0, 2).join("; ").toUpperCase(), "dd-n", "end", 1.2);
      // bus: Paperclip
      at(0.4);
      const by = iy + ih + 44;
      link(`M${mid} ${iy + ih}V${by}`);
      lines.append(draw(sv("line", { x1: x0, y1: by, x2: x1, y2: by, class: "dd-bus" }), 0.5));
      txt(x0, by - 7, (O.controlPlane.name + " · CONTROL PLANE").toUpperCase(), "dd-vt", "start", 0.7);
      txt(x1, by - 7, "EVERY PIECE OF WORK IS A TRACKED ISSUE", "dd-n", "end", 0.8);
      // leadership row
      at(0.75);
      const lw = 224, lh = 58, lgap = (cw - 3 * lw) / 2, ly = by + 30;
      O.teams[0].members.forEach(([n, role], i) => { const x = x0 + i * (lw + lgap); const d = 0.75 + i * 0.06; at(d); link(`M${x + lw / 2} ${by}V${ly}`); box(x, ly, lw, lh); txt(x + 12, ly + 22, n.toUpperCase(), "dd-name"); para(x + 12, ly + 37, role.toUpperCase(), lw - 24, 8.5, "dd-slot-t", "start", d + 0.25, 10.5, 0.7); });
      txt(x0, ly + lh + 16, "LEADERSHIP · ×3", "dd-dt", "start", 1.0);
      // teams row: builders wide, then security / devops / sales (names; roles are in the Everything panel)
      at(1.05);
      const ty = ly + lh + 36, th = 150;
      const bw = 400, sw = (cw - bw - 3 * 16) / 3;
      // a thin rail under the leadership row; the teams hang from it (they report to the managers, not to the bus)
      const ry = ly + lh + 24;
      O.teams[0].members.forEach((m, i) => { const x = x0 + i * (lw + lgap) + lw / 2; link(`M${x} ${ly + lh}V${ry}`, "dd-conn dd-rail"); });
      link(`M${x0 + bw / 2} ${ry}H${x0 + bw + 16 + 2 * (sw + 16) + sw / 2}`, "dd-conn dd-rail");
      const cols = [["build", x0, bw], ["sec", x0 + bw + 16, sw], ["ops", x0 + bw + 16 + sw + 16, sw], ["sales", x0 + bw + 16 + 2 * (sw + 16), sw]];
      cols.forEach(([id, x, w], i) => {
        const team = O.teams.find(k => k.id === id); const d = 1.05 + i * 0.09; at(d);
        link(`M${x + w / 2} ${ry}V${ty}`, "dd-conn dd-rail");
        box(x, ty, w, th, { fill: "#fff" });
        txt(x + 10, ty + 20, team.name.toUpperCase(), "dd-vt");
        if (id === "build") txt(x + w - 10, ty + 20, "×" + team.members.length + " · " + team.note.toUpperCase(), "dd-n", "end");
        lines.append(draw(sv("line", { x1: x, y1: ty + 28, x2: x + w, y2: ty + 28, class: "dd-rule" })));
        if (id === "build") { const colw = (w - 20) / 2; team.members.forEach(([n, role], j) => { const c = j % 2, r = Math.floor(j / 2); const mx = x + 10 + c * colw, my = ty + 46 + r * 15; txt(mx, my, n.toUpperCase(), "dd-tv", "start", d + 0.3 + j * 0.02); txt(mx + 64, my, role, "dd-role", "start", d + 0.33 + j * 0.02); }); }
        else team.members.forEach(([n], j) => txt(x + 10, ty + 46 + j * 16, n.toUpperCase(), "dd-tv dd-small", "start", d + 0.3 + j * 0.03));
      });
      // the 23 reference dim on the right
      at(1.5); dimV(ly, ty + th, x1 + 14, ""); txt(x1 + 20, ly - 6, O.scale[0][0] + " AGENTS [REF]", "dd-dt", "end", 1.75);
      // flow along the bottom
      at(1.8);
      const fy = ty + th + 56, fw = 96, fh = 36, n = O.flow.length, fgap = (W - 2 * pad - n * fw) / (n - 1);
      txt(pad, fy - 18, "FLOW · EVERY TASK, IN ORDER", "dd-vt", "start", 1.8);
      nb(pad + 226, fy - 22, "B", 1.85);
      let capEnd = fy + fh + 16;
      O.flow.forEach(([name, cap], i) => {
        const x = pad + i * (fw + fgap); const d = 1.95 + i * 0.26; at(d);
        box(x, fy, fw, fh, { fill: i === 4 ? "#f2f2f2" : "#fafafa", r: fh / 2 });
        txt(x + fw / 2, fy + fh / 2 + 4, name.toUpperCase() + (i === 4 ? "'S OK" : ""), "dd-name", "middle", d + 0.15);
        if (i < n - 1) arrow(x + fw + 3, fy + fh / 2, x + fw + fgap - 3, fy + fh / 2);
        capEnd = Math.max(capEnd, para(x, fy + fh + 16, cap, fw + fgap - 12, 9.5, "dd-cap", "start", d + 0.3, 12));
      });
      // notes: the rules, with the scale table beside them
      at(3.4);
      let ny = capEnd + 30;
      txt(pad, ny, "NOTES: THE RULES ITAI SET (UNLESS OTHERWISE SPECIFIED)", "dd-vt", "start", 3.4);
      txt(pad + 460, ny, "SCALE · FROM THE CONTROL PLANE, " + O.asOf, "dd-vt", "start", 3.4);
      let sy = ny + 8; const sx = pad + 460, scw = W - pad - sx;
      lines.append(draw(sv("line", { x1: sx, y1: sy, x2: sx + scw, y2: sy, class: "dd-rule" }), 3.5));
      O.scale.forEach(([v, k], i) => { sy += 24; txt(sx + 2, sy - 8, v, "dd-big", "start", 3.55 + i * 0.08); txt(sx + 70, sy - 8, k.toUpperCase(), "dd-tc", "start", 3.6 + i * 0.08); lines.append(draw(sv("line", { x1: sx, y1: sy, x2: sx + scw, y2: sy, class: "dd-rule" }), 3.55 + i * 0.08)); });
      ny += 22;
      O.rules.forEach((r, i) => { nb(pad + 7, ny - 4, i + 1, 3.45 + i * 0.05); ny = para(pad + 22, ny, r.toUpperCase(), 410, 9.5, "dd-n", "start", 3.5 + i * 0.05, 12, 0.62) + 6; });
      H = Math.max(ny, sy) + 40;
    } else {
      // ---- narrow sheet: one column, read top to bottom at 390 ----
      const x0 = pad, x1 = W - pad - 16, cw = x1 - x0, mid = (x0 + x1) / 2; // 16 on the right for the reference dim
      at(0);
      const ih = 50, iy = 22;
      box(x0 + 20, iy, cw - 40, ih, { fill: "#f2f2f2", r: 8 });
      txt(mid, iy + 21, O.human.name.toUpperCase(), "dd-name", "middle", 0.25);
      txt(mid, iy + 37, O.human.role.toUpperCase(), "dd-slot-t", "middle", 0.35);
      txt(x0 + 12, iy + 29, "×1", "dd-dt", "end", 0.4);
      at(0.4);
      const by = iy + ih + 34;
      link(`M${mid} ${iy + ih}V${by}`);
      lines.append(draw(sv("line", { x1: x0, y1: by, x2: x1, y2: by, class: "dd-bus" }), 0.5));
      txt(x0, by - 6, (O.controlPlane.name + " · CONTROL PLANE").toUpperCase(), "dd-vt", "start", 0.7);
      txt(x0, by + 13, "EVERY PIECE OF WORK IS A TRACKED ISSUE", "dd-n", "start", 0.8);
      // leadership: three stacked rows
      at(0.75);
      let y = by + 44; const lh = 50;
      txt(x0, y - 6, "LEADERSHIP · ×3", "dd-dt", "start", 0.85);
      O.teams[0].members.forEach(([n, role], i) => { const d = 0.8 + i * 0.06; at(d); box(x0, y, cw, lh); txt(x0 + 10, y + 18, n.toUpperCase(), "dd-name"); para(x0 + 10, y + 32, role.toUpperCase(), cw - 20, 8, "dd-slot-t", "start", d + 0.25, 10, 0.7); y += lh + 8; });
      link(`M${mid} ${by}V${by + 40}`, "dd-conn dd-thin");
      // builders
      at(1.05); y += 10;
      const build = O.teams[1]; const rows = Math.ceil(build.members.length / 2), bh = 40 + rows * 15;
      box(x0, y, cw, bh, { fill: "#fff" });
      txt(x0 + 10, y + 18, build.name.toUpperCase(), "dd-vt");
      txt(x1 - 10, y + 18, "×" + build.members.length + " · " + build.note.toUpperCase(), "dd-n", "end");
      lines.append(draw(sv("line", { x1: x0, y1: y + 26, x2: x1, y2: y + 26, class: "dd-rule" })));
      build.members.forEach(([n, role], j) => { const c = j % 2, r = Math.floor(j / 2); const mx = x0 + 10 + c * (cw / 2), my = y + 42 + r * 15; txt(mx, my, n.toUpperCase(), "dd-tv", "start", 1.35 + j * 0.02); txt(mx + 58, my, role.length > 20 ? role.replace(" + back office", "").replace(" + internal tools", " + tools") : role, "dd-role", "start", 1.38 + j * 0.02); });
      const teamsTop = y; y += bh + 10;
      // security / devops / sales side by side
      const sw = (cw - 16) / 3, sh = 66;
      ["sec", "ops", "sales"].forEach((id, i) => { const team = O.teams.find(k => k.id === id); const x = x0 + i * (sw + 8); const d = 1.2 + i * 0.09; at(d); box(x, y, sw, sh, { fill: "#fff" }); txt(x + 8, y + 16, (team.name + " ×" + team.members.length).toUpperCase(), "dd-vt"); lines.append(draw(sv("line", { x1: x, y1: y + 22, x2: x + sw, y2: y + 22, class: "dd-rule" }))); team.members.forEach(([n], j) => txt(x + 8, y + 36 + j * 13, n.toUpperCase(), "dd-tv", "start", d + 0.3 + j * 0.03)); });
      y += sh;
      at(1.5); dimV(by + 44, y, x1 + 9, "", 1.5); txt(x1 + 14, y + 14, O.scale[0][0] + " AGENTS [REF]", "dd-dt", "end", 1.75);
      // flow: vertical chain, caption to the right
      at(1.8); y += 40;
      txt(x0, y - 4, "FLOW · EVERY TASK, IN ORDER", "dd-vt", "start", 1.8);
      y += 10; const fw = 84, fh = 30, step = 72;
      O.flow.forEach(([name, cap], i) => {
        const d = 1.95 + i * 0.26; at(d);
        box(x0, y, fw, fh, { fill: i === 4 ? "#f2f2f2" : "#fafafa", r: fh / 2 });
        txt(x0 + fw / 2, y + fh / 2 + 4, name.toUpperCase() + (i === 4 ? "'S OK" : ""), "dd-name", "middle", d + 0.15);
        para(x0 + fw + 12, y + 11, cap, cw - fw - 12, 10, "dd-cap", "start", d + 0.3, 12.5);
        if (i < O.flow.length - 1) arrow(x0 + fw / 2, y + fh + 3, x0 + fw / 2, y + step - 4);
        y += step;
      });
      y += 2;
      // rules as notes at the end
      at(3.4);
      txt(x0, y + 6, "NOTES: THE RULES ITAI SET", "dd-vt", "start", 3.4); y += 24;
      O.rules.forEach((r, i) => { nb(x0 + 7, y - 4, i + 1, 3.45 + i * 0.05); y = para(x0 + 22, y, r.toUpperCase(), cw - 22, 9.5, "dd-n", "start", 3.5 + i * 0.05, 12, 0.62) + 6; });
      y += 8;
      txt(x0, y, "SCALE", "dd-vt", "start", 3.9); y += 8;
      lines.append(draw(sv("line", { x1: x0, y1: y, x2: x1, y2: y, class: "dd-rule" }), 3.9));
      O.scale.forEach(([v, k], i) => { y += 22; txt(x0 + 2, y - 7, v, "dd-big", "start", 3.95 + i * 0.06); txt(x0 + 64, y - 7, k.toUpperCase(), "dd-tc", "start", 4 + i * 0.06); lines.append(draw(sv("line", { x1: x0, y1: y, x2: x1, y2: y, class: "dd-rule" }), 3.95 + i * 0.06)); });
      H = y + 40;
    }

    // frame + footer
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    lines.prepend(draw(sv("rect", { x: 1, y: 1, width: W - 2, height: H - 2, rx: 14, class: "dd-frame-line" }), 0));
    lines.append(draw(sv("line", { x1: 1, y1: H - 24, x2: W - 1, y2: H - 24, class: "dd-rule" }), 0.2));
    txt(pad, H - 9, O.asOf + "  |  AGENT ORG REFERENCE", "dd-f", "start", 0.4); txt(W - pad, H - 9, "ORG-001, ARCHITECTURE  |  1", "dd-f", "end", 0.4);
    return svg;
  }

  function orgDrawing() {
    const narrow = (document.querySelector("#thread") || document.body).getBoundingClientRect().width < 600;
    const wrap = document.createElement("figure"); wrap.className = "dd dd-org" + (narrow ? " dd-narrow" : "");
    const tb = document.createElement("div"); tb.className = "dd-title";
    tb.innerHTML = `<div class="dd-title-main"><span class="dd-title-big">HOW ITAI WORKS</span><span class="dd-title-scope">One human, ${O.scale[0][0]} AI agents on Paperclip, and the path every task takes · ${O.flow.map(f => f[0]).join(" → ")}</span></div>
      <dl class="dd-title-cells"><div><dt>DWG NO.</dt><dd>ORG-001</dd></div><div><dt>REV</dt><dd>2</dd></div><div><dt>UNITS</dt><dd>AGENTS</dd></div><div><dt>SCALE</dt><dd>NTS</dd></div><div><dt>SOURCE</dt><dd>PAPERCLIP, ${O.asOf}</dd></div></dl>`;
    const frame = document.createElement("div"); frame.className = "dd-frame"; frame.append(sheet(narrow));
    const cap = document.createElement("figcaption"); cap.className = "dd-cap"; cap.textContent = "Names and roles are the agents' real ones on Paperclip; counts are as of " + O.asOf + ". Itai is the only human.";
    wrap.append(tb, frame, cap);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) wrap.classList.add("on", "still");
    else { const io = new IntersectionObserver(es => { for (const e of es) if (e.isIntersecting) { wrap.classList.add("on"); io.disconnect(); } }, { threshold: 0.12 }); io.observe(wrap); }
    return wrap;
  }
  window.DRAWING = Object.assign(window.DRAWING || {}, { org: orgDrawing });
})();
