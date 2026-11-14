// A dimensional drawing of the day view, in the manner of Apple's accessory
// dimensional drawings: monochrome, slots not content, codes not numbers.
// Source: the published description of the app (data.js). No published
// metrics exist, so every value is [TBD] and the views are proportional
// schematics; the only closed formula is R1 = H3 ÷ 2 (a pill bar).
(() => {
  const NS = "http://www.w3.org/2000/svg";
  const sv = (tag, attrs = {}, text) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); if (text != null) n.textContent = text; return n; };

  function sheet() {
    const W = 1200, H = 760;
    const svg = sv("svg", { viewBox: `0 0 ${W} ${H}`, class: "dd-sheet", role: "img", "aria-label": "Dimensional drawing of the app's day view: plan view with slot regions, assistant bar detail, row detail and variable tables. All values TBD." });
    const defs = sv("defs");
    const marker = sv("marker", { id: "dd-arrow", viewBox: "0 0 10 10", refX: "9", refY: "5", markerWidth: "7", markerHeight: "7", orient: "auto-start-reverse" });
    marker.append(sv("path", { d: "M0 0L10 5L0 10z", fill: "#000" })); defs.append(marker);
    const hatch = sv("pattern", { id: "dd-hatch", width: "6", height: "6", patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" });
    hatch.append(sv("line", { x1: 0, y1: 0, x2: 0, y2: 6, stroke: "#000", "stroke-width": "0.6" })); defs.append(hatch);
    svg.append(defs);
    svg.append(sv("rect", { x: 1, y: 1, width: W - 2, height: H - 2, rx: 14, fill: "#fff", stroke: "#000", "stroke-width": "1.2" }));
    const g = cls => { const n = sv("g", { class: cls }); svg.append(n); return n; };
    const lines = g("dd-lines"), dims = g("dd-dims"), text = g("dd-text");

    const txt = (x, y, s, cls = "dd-t", anchor = "start", extra = {}) => { const t = sv("text", { x, y, class: cls, "text-anchor": anchor, ...extra }, s); text.append(t); return t; };
    const line = (x1, y1, x2, y2, cls = "dd-dim") => dims.append(sv("line", { x1, y1, x2, y2, class: cls }));
    const dimH = (x1, x2, y, extY, label, below) => {
      line(x1, extY, x1, y + (below ? 5 : -5), "dd-ext"); line(x2, extY, x2, y + (below ? 5 : -5), "dd-ext");
      const l = sv("line", { x1, y1: y, x2, y2: y, class: "dd-dim", "marker-start": "url(#dd-arrow)", "marker-end": "url(#dd-arrow)" }); dims.append(l);
      txt((x1 + x2) / 2, y + (below ? 14 : -5), label, "dd-dt", "middle");
    };
    const dimV = (y1, y2, x, extX, label, side = "l") => {
      line(extX, y1, x + (side === "l" ? -5 : 5), y1, "dd-ext"); line(extX, y2, x + (side === "l" ? -5 : 5), y2, "dd-ext");
      const l = sv("line", { x1: x, y1, x2: x, y2, class: "dd-dim", "marker-start": "url(#dd-arrow)", "marker-end": "url(#dd-arrow)" }); dims.append(l);
      txt(x + (side === "l" ? -6 : 6), (y1 + y2) / 2 + 4, label, "dd-dt", side === "l" ? "end" : "start");
    };
    const slot = (x, y, w, h, label, sub) => { lines.append(sv("rect", { x, y, width: w, height: h, class: "dd-slot" })); if (label) txt(x + w / 2, y + h / 2 + (sub ? 0 : 3), label, "dd-slot-t", "middle"); if (sub) txt(x + w / 2, y + h / 2 + 12, sub, "dd-slot-s", "middle"); };
    const rad = (cx, cy, r, label, dx, dy) => { lines.append(sv("path", { d: `M${cx - r} ${cy}A${r} ${r} 0 0 1 ${cx} ${cy - r}`, class: "dd-rad" })); const px = cx - r * 0.7071, py = cy - r * 0.7071; dims.append(sv("line", { x1: px, y1: py, x2: px + dx, y2: py + dy, class: "dd-dim" })); txt(px + dx + (dx < 0 ? -4 : 4), py + dy + 4, label, "dd-dt", dx < 0 ? "end" : "start"); };
    const nb = (x, y, n) => { lines.append(sv("rect", { x: x - 7, y: y - 8, width: 14, height: 14, class: "dd-nb" })); txt(x, y + 3, String(n), "dd-nb-t", "middle"); };
    const title = (x, y, t, s) => { txt(x, y, t, "dd-vt"); txt(x, y + 13, s, "dd-vs"); };
    const table = (x, y, name, rows) => {
      txt(x, y, name, "dd-vt"); let yy = y + 10; const cw = [44, 110, 92]; const w = cw.reduce((a, b) => a + b, 0);
      lines.append(sv("line", { x1: x, y1: yy, x2: x + w, y2: yy, class: "dd-rule" }));
      for (const r of rows) { yy += 17; let cx = x; r.forEach((c, i) => { txt(cx + 4, yy - 4, c, i === 2 ? "dd-tv" : "dd-tc"); cx += cw[i]; }); lines.append(sv("line", { x1: x, y1: yy, x2: x + w, y2: yy, class: "dd-rule" })); }
      return yy + 22;
    };

    // Notes, top-left
    txt(40, 44, "NOTES: (UNLESS OTHERWISE SPECIFIED)", "dd-vt");
    const notes = [
      [0, "DO NOT SCALE DRAWING. UNITS: PT [TBD]."],
      [0, "SLOTS ARE PLACEHOLDERS; NO REAL COPY IS DRAWN."],
      [0, "ALL DIMENSIONS ARE VARIABLES; VALUES NOT PUBLISHED = [TBD]."],
      [0, "HUG = SIZED BY CONTENT · FLEX = REMAINING SPACE · FILL = PARENT WIDTH."],
      [1, "ASSISTANT BAR: TYPED OR SPOKEN INPUT, FILED AS EVENT, TASK OR HABIT."],
      [2, "LIST ROWS: TASK, EVENT (IPHONE CALENDARS), HABIT (STREAK / TALLY)."],
      [3, "SUMMARY: WEATHER SLOT, NEXT-EVENT SLOT; LAYOUT [TBD]."],
      [0, "STATUS BAR AND SAFE AREAS: SYSTEM, [TBD]."]
    ];
    notes.forEach(([n, s], i) => { const y = 66 + i * 16; if (n) nb(46, y - 4, n); txt(n ? 60 : 40, y, s, "dd-n"); });

    // Plan view: screen W × screen H, centred
    const sx = 470, sy = 112, sw = 270, sh = 500, S1 = 18;
    title(sx, 50, "PLAN VIEW · DAY VIEW", "SCALE NTS · SLOTS ONLY");
    lines.append(sv("rect", { x: sx, y: sy, width: sw, height: sh, rx: 28, class: "dd-obj" }));
    // regions
    const H0 = 34, H1 = 74, H2 = 86, H3 = 48;
    let y = sy;
    lines.append(sv("rect", { x: sx, y, width: sw, height: H0, class: "dd-hatch" })); txt(sx + sw / 2, y + 21, "STATUS · SYSTEM [TBD]", "dd-slot-t", "middle"); y += H0;
    slot(sx + S1, y + 14, sw - 2 * S1, H1 - 24, "GREETING SLOT · FLEX"); nb(sx + sw - 10, y + 10, 3); y += H1;
    slot(sx + S1, y + 6, (sw - 2 * S1 - 12) / 2, H2 - 12, "WEATHER SLOT", "HUG"); slot(sx + S1 + (sw - 2 * S1 - 12) / 2 + 12, y + 6, (sw - 2 * S1 - 12) / 2, H2 - 12, "NEXT SLOT", "HUG"); y += H2;
    lines.append(sv("line", { x1: sx + S1, y1: y, x2: sx + sw - S1, y2: y, class: "dd-phantom" }));
    const listY = y + 10, rowH = 40, rows = ["TASK ROW", "EVENT ROW", "HABIT ROW", "ROW · ×n"];
    rows.forEach((r, i) => { const ry = listY + i * (rowH + 8); lines.append(sv("rect", { x: sx + S1, y: ry, width: 16, height: 16, transform: `translate(0 ${(rowH - 16) / 2})`, class: "dd-slot" })); slot(sx + S1 + 26, ry, sw - 2 * S1 - 26, rowH, r + " · FILL"); });
    nb(sx + sw - 10, listY + 12, 2);
    const barY = sy + sh - S1 - H3;
    lines.append(sv("rect", { x: sx + S1, y: barY, width: sw - 2 * S1, height: H3, rx: H3 / 2, class: "dd-obj dd-fill" }));
    txt(sx + S1 + 40, barY + H3 / 2 + 3, "FIELD SLOT · FLEX", "dd-slot-t"); lines.append(sv("rect", { x: sx + S1 + 8, y: barY + 8, width: H3 - 16, height: H3 - 16, rx: 6, class: "dd-slot" })); lines.append(sv("circle", { cx: sx + sw - S1 - H3 / 2, cy: barY + H3 / 2, r: (H3 - 16) / 2, class: "dd-slot" }));
    nb(sx + sw - 10, barY - 10, 1);
    // dims around the plan
    dimH(sx, sx + S1, sy - 14, sy, "S1"); dimH(sx + S1, sx + sw - S1, sy - 14, sy, "W − 2·S1"); dimH(sx + sw - S1, sx + sw, sy - 14, sy, "S1");
    dimH(sx, sx + sw, sy + sh + 22, sy + sh, "W · SCREEN [REF]", true);
    dimV(sy, sy + H0, sx - 22, sx, "H0"); dimV(sy + H0, sy + H0 + H1, sx - 22, sx, "H1"); dimV(sy + H0 + H1, sy + H0 + H1 + H2, sx - 22, sx, "H2"); dimV(sy + H0 + H1 + H2, barY - S1, sx - 22, sx, "FLEX"); dimV(barY, barY + H3, sx - 22, sx, "H3"); dimV(barY + H3, sy + sh, sx - 22, sx, "S1");
    dimV(sy, sy + sh, sx - 60, sx, "H · SCREEN [REF]");
    dimV(listY, listY + rowH, sx + sw + 22, sx + sw, "H4", "r"); dimV(listY + rowH, listY + rowH + 8, sx + sw + 22, sx + sw, "S3", "r");
    rad(sx + 28, sy + 28, 28, "R0 [TBD]", -40, -22); rad(sx + S1 + H3 / 2, barY + H3 / 2, H3 / 2, "R1 = H3 ÷ 2", -48, 30);
    // centerline
    lines.append(sv("line", { x1: sx + sw / 2, y1: sy - 30, x2: sx + sw / 2, y2: sy + sh + 40, class: "dd-center" }));
    // detail circles
    lines.append(sv("circle", { cx: sx + sw / 2, cy: barY + H3 / 2, r: 44, class: "dd-detail" })); txt(sx + sw / 2 + 50, barY + 50, "DETAIL A", "dd-dt");
    lines.append(sv("circle", { cx: sx + S1 + 60, cy: listY + rowH / 2, r: 34, class: "dd-detail" })); txt(sx + S1 - 6, listY - 10, "DETAIL B", "dd-dt", "end");

    // Detail A: assistant bar at 2:1, bottom-left
    const ax = 70, ay = 500, aw = 280, ah = 96;
    title(ax, 432, "DETAIL A · ASSISTANT BAR", "SCALE 2:1");
    lines.append(sv("rect", { x: ax, y: ay, width: aw, height: ah, rx: ah / 2, class: "dd-obj dd-fill" }));
    lines.append(sv("rect", { x: ax + 16, y: ay + 16, width: ah - 32, height: ah - 32, rx: 12, class: "dd-slot" })); txt(ax + 16 + (ah - 32) / 2, ay + ah / 2 + 3, "Z1", "dd-slot-t", "middle");
    txt(ax + ah + 10, ay + ah / 2 + 3, "FIELD SLOT · FLEX", "dd-slot-t");
    lines.append(sv("circle", { cx: ax + aw - ah / 2, cy: ay + ah / 2, r: (ah - 32) / 2, class: "dd-slot" })); txt(ax + aw - ah / 2, ay + ah / 2 + 3, "Z2", "dd-slot-t", "middle");
    dimH(ax, ax + 16, ay - 12, ay, "S2"); dimH(ax + 16, ax + ah - 16, ay - 12, ay, "Z1 · HUG"); dimH(ax + ah - 16, ax + aw - ah + 16, ay - 12, ay, "FLEX"); dimH(ax + aw - ah + 16, ax + aw - 16, ay - 12, ay, "Z2"); dimH(ax + aw - 16, ax + aw, ay - 12, ay, "S2");
    dimV(ay, ay + 16, ax - 16, ax, "S2"); dimV(ay + 16, ay + ah - 16, ax - 16, ax, "Z1"); dimV(ay + ah - 16, ay + ah, ax - 16, ax, "S2");
    dimV(ay, ay + ah, ax + aw + 18, ax + aw, "H3", "r");
    rad(ax + ah / 2, ay + ah / 2, ah / 2, "R1 = H3 ÷ 2", 30, 70);
    txt(ax, ay + ah + 54, "Z1 = H3 − 2·S2  ·  Z2 = Z1  ·  T1 ≥ Z1 (TOUCH MIN [TBD])", "dd-n");

    // Detail B: row at 2:1, bottom-centre
    const bx = 470, by = 690, bw = 270, bh = 44;
    title(bx, 662, "DETAIL B · LIST ROW", "SCALE 1.5:1");
    lines.append(sv("rect", { x: bx, y: by, width: bw, height: bh, class: "dd-slot" }));
    lines.append(sv("rect", { x: bx + 12, y: by + (bh - 22) / 2, width: 22, height: 22, rx: 6, class: "dd-obj" })); txt(bx + 23, by + bh / 2 + 3, "Z3", "dd-slot-t", "middle");
    txt(bx + 48, by + bh / 2 + 3, "LABEL SLOT · FLEX", "dd-slot-t"); txt(bx + bw - 12, by + bh / 2 + 3, "META · HUG", "dd-slot-t", "end");
    dimH(bx, bx + 12, by - 10, by, "S4"); dimH(bx + 12, bx + 34, by - 10, by, "Z3"); dimH(bx + 34, bx + 48, by - 10, by, "S4");
    dimV(by, by + bh, bx + bw + 16, bx + bw, "H4", "r");

    // Tables, right column
    let ty = 60; const tx = 830;
    ty = table(tx, ty, "SPACING", [["S1", "screen-pad", "[TBD]"], ["S2", "bar-inset", "[TBD]"], ["S3", "row-gap", "[TBD]"], ["S4", "row-inset", "[TBD]"]]);
    ty = table(tx, ty, "SIZE", [["H0", "status-h", "SYSTEM [TBD]"], ["H1", "greeting-h", "HUG [TBD]"], ["H2", "summary-h", "HUG [TBD]"], ["H3", "bar-h", "[TBD]"], ["H4", "row-h", "[TBD]"], ["Z1", "bar-icon", "H3 − 2·S2"], ["Z2", "bar-mic", "= Z1"], ["Z3", "row-lead", "[TBD]"], ["W", "screen-w", "DEVICE [REF]"]]);
    ty = table(tx, ty, "RADIUS", [["R0", "screen", "DEVICE [TBD]"], ["R1", "bar", "H3 ÷ 2"], ["R2", "card", "[TBD]"]]);
    ty = table(tx, ty, "SLOTS", [["A", "greeting", "FLEX"], ["B", "weather", "HUG"], ["C", "next event", "HUG"], ["D", "rows ×n", "FILL"], ["E", "assistant bar", "FILL"]]);

    // footer
    lines.append(sv("line", { x1: 1, y1: H - 26, x2: W - 1, y2: H - 26, class: "dd-rule" }));
    txt(40, H - 10, "2026-11-13  |  UI SCREEN REFERENCE", "dd-f"); txt(W - 40, H - 10, "UI-SCREEN-001, ARCHITECTURE  |  1", "dd-f", "end");
    return svg;
  }

  function tendDrawing() {
    const wrap = document.createElement("figure"); wrap.className = "dd";
    const tb = document.createElement("div"); tb.className = "dd-title";
    tb.innerHTML = `<div class="dd-title-main"><span class="dd-title-big">DAY VIEW, ARCHITECTURE</span><span class="dd-title-scope">Screen regions, assistant bar, list row · slots and variables only</span></div>
      <dl class="dd-title-cells"><div><dt>DWG NO.</dt><dd>UI-SCREEN-001</dd></div><div><dt>REV</dt><dd>A</dd></div><div><dt>SHEETS</dt><dd>1</dd></div><div><dt>UNITS</dt><dd>PT [TBD]</dd></div><div><dt>SCALE</dt><dd>NTS</dd></div><div><dt>SOURCE</dt><dd>PUBLISHED DESCRIPTION, 2026-11-13</dd></div></dl>`;
    const frame = document.createElement("div"); frame.className = "dd-frame"; frame.append(sheet());
    const cap = document.createElement("figcaption"); cap.className = "dd-cap"; cap.textContent = "Nothing here is measured from the app: no metrics are published, so every value is [TBD] and the views are proportional schematics.";
    wrap.append(tb, frame, cap);
    return wrap;
  }
  window.DRAWING = { tend: tendDrawing };
})();
