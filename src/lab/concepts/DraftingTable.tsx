'use client';

/**
 * CONCEPT A — DRAFTING TABLE
 *
 * A bone-white architectural void. Every project is a technical drawing
 * sheet hanging in space: ruled border, title block, dimension lines,
 * status stamp. The camera dollies down the hall of sheets and turns to
 * face each one square-on.
 *
 * The bet: almost every 3D portfolio is dark and glowing. A light,
 * precise, drawn world is instantly differentiating — and a drawing sheet
 * is already an information design solved for dense specs read fast,
 * which is exactly the recruiter problem. Spectacle and legibility point
 * the same way instead of fighting.
 */

import { useRef, useState, useMemo } from 'react';
import { Line, Html } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ScrollStage, StationCamera, PointerParallax, panelScale, damp, type Station } from '../rig';
import { FactSheet, FactSheetTrigger, type Theme } from '../FactSheet';
import { IDENTITY, PROJECTS, FACTS, type Project } from '../content';

const PAPER = '#E9E5DC';
const SHEET_BG = '#F7F5EF';
const INK = '#15171B';
const GRAPHITE = '#75736C';
const RED = '#D8402A';
const RULE = 'rgba(21,23,27,0.22)';

const theme: Theme = {
  bg: PAPER,
  fg: INK,
  muted: GRAPHITE,
  line: 'rgba(21,23,27,0.16)',
  accent: RED,
  accentFg: '#FFFFFF',
};

const SHEET_W = 7.6;
const SHEET_PX = 950;
const SPACING = 17;
const SCALE = panelScale(SHEET_W, SHEET_PX);

function sheetTransform(i: number) {
  const side = i % 2 === 0 ? 1 : -1;
  return {
    position: [side * 2.4, (i % 3) * 0.3 - 0.3, -19 - i * SPACING] as [number, number, number],
    rotation: [0, -side * 0.3, 0] as [number, number, number],
    side,
  };
}

const mono = 'var(--lab-mono), ui-monospace, monospace';
const sans = 'var(--lab-sans), system-ui, sans-serif';

/**
 * Fades a panel by camera distance. HTML can't take fog, so depth gets
 * sold with an opacity ramp written straight to the DOM node — no React
 * state, so it costs nothing per frame.
 */
function useDistanceFade(ref: React.RefObject<HTMLDivElement | null>, worldZ: number, x: number) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(x, 0, worldZ), [x, worldZ]);
  const current = useRef(0);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const d = camera.position.distanceTo(target);
    // Solid at the 7.6-unit viewing standoff, fully gone by 14 — well
    // before the next sheet's station at ~25. HTML panels can't be
    // occluded, so an out-of-range panel has to reach exactly zero or it
    // ghosts through the one in front.
    const want = THREE.MathUtils.clamp(1 - (d - 9) / 5, 0, 1);
    current.current = damp(current.current, want, 5, Math.min(delta, 1 / 30));
    ref.current.style.opacity = String(current.current);
  });
}

function StatusStamp({ status }: { status: Project['status'] }) {
  const live = status !== 'private';
  return (
    <span
      style={{
        fontFamily: mono,
        fontSize: 12,
        letterSpacing: '0.16em',
        color: live ? RED : GRAPHITE,
        border: `1px solid ${live ? RED : RULE}`,
        padding: '3px 9px',
        textTransform: 'uppercase',
      }}
    >
      {status}
    </span>
  );
}

function Figure({ value, label, big }: { value: string; label: string; big?: boolean }) {
  return (
    <div style={{ textAlign: 'right' }}>
      <div
        style={{
          fontFamily: sans,
          fontSize: big ? 68 : 26,
          fontWeight: 600,
          letterSpacing: '-0.04em',
          lineHeight: 1,
          color: INK,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: mono,
          fontSize: big ? 11 : 10,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: GRAPHITE,
          marginTop: big ? 8 : 4,
        }}
      >
        {label}
      </div>
    </div>
  );
}

function Sheet({ project, index }: { project: Project; index: number }) {
  const { position, rotation } = sheetTransform(index);
  const el = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState(false);
  useDistanceFade(el, position[2], position[0]);

  const href = project.href ?? project.repo;

  return (
    <group position={position} rotation={rotation}>
      <Html transform scale={SCALE} style={{ width: SHEET_PX, pointerEvents: 'none' }} zIndexRange={[20, 0]}>
        <div
          ref={el}
          style={{
            opacity: 0,
            background: SHEET_BG,
            border: `1px solid ${INK}`,
            padding: 14,
            boxShadow: hover
              ? '0 30px 60px -20px rgba(21,23,27,0.28)'
              : '0 20px 44px -24px rgba(21,23,27,0.22)',
            transition: 'box-shadow 240ms ease',
          }}
        >
          {/* inner margin rule, as on a real sheet */}
          <div style={{ border: `1px solid ${RULE}`, padding: '26px 30px 0' }}>
            {/* header row */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontFamily: mono,
                fontSize: 12,
                letterSpacing: '0.16em',
                color: GRAPHITE,
              }}
            >
              <span>
                SHEET {String(index + 1).padStart(3, '0')} /{' '}
                {String(PROJECTS.length).padStart(3, '0')}
              </span>
              <StatusStamp status={project.status} />
            </div>

            {/* body */}
            <div style={{ display: 'flex', gap: 44, marginTop: 26 }}>
              <div style={{ flex: '1 1 0', minWidth: 0 }}>
                <h2
                  style={{
                    fontFamily: sans,
                    fontSize: 58,
                    fontWeight: 600,
                    letterSpacing: '-0.035em',
                    lineHeight: 1,
                    color: INK,
                    margin: 0,
                  }}
                >
                  {project.name}
                </h2>
                <p
                  style={{
                    fontFamily: sans,
                    fontSize: 15.5,
                    lineHeight: 1.62,
                    color: GRAPHITE,
                    margin: '18px 0 0',
                  }}
                >
                  {project.blurb}
                </p>
              </div>

              <div
                style={{
                  flex: '0 0 232px',
                  borderLeft: `1px solid ${RULE}`,
                  paddingLeft: 28,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 22,
                }}
              >
                <Figure value={project.metric.value} label={project.metric.label} big />
                {project.support.map((s) => (
                  <Figure key={s.label} value={s.value} label={s.label} />
                ))}
              </div>
            </div>

            {/* title block */}
            <div
              style={{
                marginTop: 30,
                borderTop: `1px solid ${INK}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 0 22px',
                fontFamily: mono,
                fontSize: 11.5,
                letterSpacing: '0.08em',
                color: GRAPHITE,
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ color: INK }}>{project.stack.join('  ·  ')}</span>
                <span>
                  {project.role.toUpperCase()} · {project.year}
                </span>
              </div>
              {href && (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseEnter={() => setHover(true)}
                  onMouseLeave={() => setHover(false)}
                  style={{
                    pointerEvents: 'auto',
                    fontFamily: mono,
                    fontSize: 12,
                    letterSpacing: '0.14em',
                    color: hover ? '#fff' : RED,
                    background: hover ? RED : 'transparent',
                    border: `1px solid ${RED}`,
                    padding: '9px 16px',
                    transition: 'all 160ms ease',
                  }}
                >
                  {project.href ? 'VISIT' : 'SOURCE'} ↗
                </a>
              )}
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}

/** Construction lines give the void a floor to read depth against. */
function ConstructionGrid({ depth }: { depth: number }) {
  const lines = useMemo(() => {
    const out: { pts: [number, number, number][]; op: number }[] = [];
    for (let x = -12; x <= 12; x += 4) out.push({ pts: [[x, -3.6, 8], [x, -3.6, -depth]], op: 0.16 });
    for (let z = 8; z >= -depth; z -= 8) out.push({ pts: [[-12, -3.6, z], [12, -3.6, z]], op: 0.1 });
    return out;
  }, [depth]);
  return (
    <>
      {lines.map((l, i) => (
        <Line key={i} points={l.pts} color={GRAPHITE} lineWidth={1} transparent opacity={l.op} />
      ))}
    </>
  );
}

function Opening() {
  const el = useRef<HTMLDivElement>(null);
  useDistanceFade(el, 0, 0);
  return (
    <group position={[0, 0, 0]}>
      <Html transform scale={panelScale(9.4, 1000)} style={{ width: 1000, pointerEvents: 'none' }} zIndexRange={[20, 0]}>
        <div ref={el} style={{ opacity: 0, textAlign: 'center', fontFamily: sans, color: INK }}>
          <div
            style={{
              fontFamily: mono,
              fontSize: 13,
              letterSpacing: '0.34em',
              color: GRAPHITE,
              marginBottom: 26,
            }}
          >
            DRAWING SET · 2026
          </div>
          <h1 style={{ fontSize: 132, fontWeight: 600, letterSpacing: '-0.05em', lineHeight: 0.92, margin: 0 }}>
            {IDENTITY.name}
          </h1>
          <div
            style={{
              fontFamily: mono,
              fontSize: 15,
              letterSpacing: '0.2em',
              color: GRAPHITE,
              margin: '26px 0 8px',
              textTransform: 'uppercase',
            }}
          >
            {IDENTITY.role}
          </div>
          <p style={{ fontSize: 21, color: GRAPHITE, margin: 0 }}>{IDENTITY.focus}</p>

          <div style={{ width: 190, height: 2, background: RED, margin: '44px auto' }} />

          <div style={{ display: 'flex', justifyContent: 'center', gap: 68 }}>
            {FACTS.map((f) => (
              <div key={f.label}>
                <div style={{ fontSize: 46, fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1 }}>
                  {f.value}
                </div>
                <div
                  style={{
                    fontFamily: mono,
                    fontSize: 10.5,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: GRAPHITE,
                    marginTop: 9,
                  }}
                >
                  {f.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Html>
    </group>
  );
}

function Closing({ z }: { z: number }) {
  const el = useRef<HTMLDivElement>(null);
  useDistanceFade(el, z, 0);
  return (
    <group position={[0, 0, z]}>
      <Html transform scale={panelScale(8.6, 900)} style={{ width: 900, pointerEvents: 'none' }} zIndexRange={[20, 0]}>
        <div ref={el} style={{ opacity: 0, textAlign: 'center', fontFamily: sans, color: INK }}>
          <div style={{ fontFamily: mono, fontSize: 12, letterSpacing: '0.3em', color: GRAPHITE }}>
            END OF SET
          </div>
          <h2 style={{ fontSize: 92, fontWeight: 600, letterSpacing: '-0.045em', margin: '22px 0 30px' }}>
            Let&apos;s talk.
          </h2>
          <a
            href={`mailto:${IDENTITY.email}`}
            style={{
              pointerEvents: 'auto',
              display: 'inline-block',
              fontFamily: mono,
              fontSize: 18,
              letterSpacing: '0.06em',
              color: '#fff',
              background: RED,
              padding: '18px 34px',
            }}
          >
            {IDENTITY.email}
          </a>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 34,
              marginTop: 40,
              fontFamily: mono,
              fontSize: 13,
              letterSpacing: '0.1em',
              color: GRAPHITE,
            }}
          >
            <a href={IDENTITY.github} style={{ pointerEvents: 'auto', color: GRAPHITE }}>
              GITHUB ↗
            </a>
            <a href={IDENTITY.linkedin} style={{ pointerEvents: 'auto', color: GRAPHITE }}>
              LINKEDIN ↗
            </a>
            <span>{IDENTITY.location.toUpperCase()}</span>
          </div>
        </div>
      </Html>
    </group>
  );
}

export default function DraftingTable() {
  const [open, setOpen] = useState(false);
  const [pct, setPct] = useState(0);

  const endZ = -19 - PROJECTS.length * SPACING - 4;

  const stations = useMemo<Station[]>(() => {
    const out: Station[] = [{ at: [0, 0, 10.5], look: [0, 0, 0], dwell: 3 }];
    PROJECTS.forEach((_, i) => {
      const { position, side } = sheetTransform(i);
      // Stand off along the sheet's own normal so it is seen square-on.
      // 7.6 units clears both the 7.6-wide and 4.5-tall extents at fov 42.
      const yaw = -side * 0.3;
      const n: [number, number, number] = [Math.sin(yaw), 0, Math.cos(yaw)];
      const d = 7.6;
      out.push({
        at: [position[0] + n[0] * d, position[1] + n[1] * d, position[2] + n[2] * d],
        look: position,
        travel: 2.2,
        dwell: 4,
      });
    });
    out.push({ at: [0, 0, endZ + 8.5], look: [0, 0, endZ], travel: 2.2, dwell: 3 });
    return out;
  }, [endZ]);

  return (
    <div className="lab-root">
      <ScrollStage
        pages={PROJECTS.length * 2.6 + 4}
        background={PAPER}
        fov={42}
        onScroll={setPct}
        dom={
          <>
            <header
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                display: 'flex',
                justifyContent: 'space-between',
                padding: '22px 28px',
                fontFamily: mono,
                fontSize: 11,
                letterSpacing: '0.16em',
                color: GRAPHITE,
                pointerEvents: 'none',
              }}
            >
              <span style={{ color: INK }}>ITAI ROTEM</span>
              <span>A · DRAFTING TABLE</span>
            </header>

            <div
              style={{
                position: 'fixed',
                left: 28,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 100,
                height: 210,
                width: 1,
                background: RULE,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: -4,
                  width: 9,
                  height: 2,
                  background: RED,
                  top: `${pct * 100}%`,
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  left: 15,
                  top: `${pct * 100}%`,
                  transform: 'translateY(-50%)',
                  fontFamily: mono,
                  fontSize: 10,
                  color: GRAPHITE,
                }}
              >
                {String(Math.round(pct * 100)).padStart(3, '0')}
              </span>
            </div>

            <FactSheetTrigger theme={theme} onOpen={() => setOpen(true)} />
            <FactSheet theme={theme} open={open} onClose={() => setOpen(false)} />
          </>
        }
      >
        <color attach="background" args={[PAPER]} />
        <StationCamera stations={stations} lambda={11} />
        <PointerParallax strength={0.2} />
        <ConstructionGrid depth={-endZ + 20} />
        <Opening />
        {PROJECTS.map((p, i) => (
          <Sheet key={p.id} project={p} index={i} />
        ))}
        <Closing z={endZ} />
      </ScrollStage>
    </div>
  );
}
