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

import { useState, useMemo } from 'react';
import { Line } from '@react-three/drei';
import { ScrollStage, StationCamera, PointerParallax, FitPanel, useViewport, type Station } from '../rig';
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

const SPACING = 17;
/** How far the camera parks from a sheet. FitPanel solves the fit here. */
const VIEW_D = 7.6;

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

function Figure({
  value,
  label,
  big,
  compact,
  align = 'right',
}: {
  value: string;
  label: string;
  big?: boolean;
  compact?: boolean;
  align?: 'left' | 'right';
}) {
  return (
    <div style={{ textAlign: align }}>
      <div
        style={{
          fontFamily: sans,
          fontSize: big ? (compact ? 48 : 68) : 26,
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

function Sheet({
  project,
  index,
  portrait,
  pxWidth,
}: {
  project: Project;
  index: number;
  portrait: boolean;
  pxWidth: number;
}) {
  const { position, rotation } = sheetTransform(index);
  const [hover, setHover] = useState(false);

  const href = project.href ?? project.repo;

  return (
    <FitPanel
      position={position}
      // Square-on in portrait: a phone frame is too narrow to read a
      // sheet that is also turned away from you.
      rotation={portrait ? [0, 0, 0] : rotation}
      pxWidth={pxWidth}
      viewDistance={VIEW_D}
      fill={portrait ? 0.95 : 0.86}
      fadeNear={9}
      fadeSpan={5}
    >
        <div
          style={{
            background: SHEET_BG,
            border: `1px solid ${INK}`,
            padding: portrait ? 8 : 14,
            boxShadow: hover
              ? '0 30px 60px -20px rgba(21,23,27,0.28)'
              : '0 20px 44px -24px rgba(21,23,27,0.22)',
            transition: 'box-shadow 240ms ease',
          }}
        >
          {/* inner margin rule, as on a real sheet */}
          <div style={{ border: `1px solid ${RULE}`, padding: portrait ? '18px 18px 0' : '26px 30px 0' }}>
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

            {/* body — columns side by side on a wide frame, stacked on a phone */}
            <div
              style={{
                display: 'flex',
                flexDirection: portrait ? 'column' : 'row',
                gap: portrait ? 22 : 44,
                marginTop: portrait ? 18 : 26,
              }}
            >
              <div style={{ flex: '1 1 0', minWidth: 0 }}>
                <h2
                  style={{
                    fontFamily: sans,
                    fontSize: portrait ? 40 : 58,
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
                    fontSize: portrait ? 14.5 : 15.5,
                    lineHeight: 1.62,
                    color: GRAPHITE,
                    margin: portrait ? '12px 0 0' : '18px 0 0',
                  }}
                >
                  {project.blurb}
                </p>
              </div>

              <div
                style={
                  portrait
                    ? {
                        // A row of three overflows a phone; the headline
                        // figure takes its own line and the supports pair up.
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '18px 20px',
                        borderTop: `1px solid ${RULE}`,
                        paddingTop: 18,
                      }
                    : {
                        flex: '0 0 232px',
                        borderLeft: `1px solid ${RULE}`,
                        paddingLeft: 28,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 22,
                      }
                }
              >
                <div style={portrait ? { gridColumn: '1 / -1' } : undefined}>
                  <Figure
                    value={project.metric.value}
                    label={project.metric.label}
                    big
                    compact={portrait}
                    align={portrait ? 'left' : 'right'}
                  />
                </div>
                {project.support.map((s) => (
                  <Figure
                    key={s.label}
                    value={s.value}
                    label={s.label}
                    align={portrait ? 'left' : 'right'}
                  />
                ))}
              </div>
            </div>

            {/* title block */}
            <div
              style={{
                marginTop: portrait ? 20 : 30,
                borderTop: `1px solid ${INK}`,
                display: 'flex',
                flexDirection: portrait ? 'column' : 'row',
                gap: portrait ? 14 : 0,
                justifyContent: 'space-between',
                alignItems: portrait ? 'flex-start' : 'center',
                padding: portrait ? '12px 0 18px' : '14px 0 22px',
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
    </FitPanel>
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

function Opening({ portrait, pxWidth }: { portrait: boolean; pxWidth: number }) {
  return (
    <FitPanel
      position={[0, 0, 0]}
      pxWidth={pxWidth}
      viewDistance={10.5}
      fill={portrait ? 0.94 : 0.84}
      fadeNear={12}
      fadeSpan={5}
    >
        <div style={{ textAlign: 'center', fontFamily: sans, color: INK }}>
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
          <h1
            style={{
              fontSize: portrait ? 62 : 132,
              fontWeight: 600,
              letterSpacing: '-0.05em',
              lineHeight: 0.92,
              margin: 0,
            }}
          >
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
          <p style={{ fontSize: portrait ? 16 : 21, color: GRAPHITE, margin: 0 }}>{IDENTITY.focus}</p>

          <div
            style={{
              width: portrait ? 120 : 190,
              height: 2,
              background: RED,
              margin: portrait ? '30px auto' : '44px auto',
            }}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: portrait ? '1fr 1fr' : 'repeat(4, auto)',
              justifyContent: 'center',
              gap: portrait ? '24px 30px' : '0 68px',
            }}
          >
            {FACTS.map((f) => (
              <div key={f.label}>
                <div
                  style={{
                    fontSize: portrait ? 34 : 46,
                    fontWeight: 600,
                    letterSpacing: '-0.04em',
                    lineHeight: 1,
                  }}
                >
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
    </FitPanel>
  );
}

function Closing({ z, portrait, pxWidth }: { z: number; portrait: boolean; pxWidth: number }) {
  return (
    <FitPanel
      position={[0, 0, z]}
      pxWidth={pxWidth}
      viewDistance={8.5}
      fill={portrait ? 0.94 : 0.84}
      fadeNear={10}
      fadeSpan={5}
    >
        <div style={{ textAlign: 'center', fontFamily: sans, color: INK }}>
          <div style={{ fontFamily: mono, fontSize: 12, letterSpacing: '0.3em', color: GRAPHITE }}>
            END OF SET
          </div>
          <h2
            style={{
              fontSize: portrait ? 52 : 92,
              fontWeight: 600,
              letterSpacing: '-0.045em',
              margin: '22px 0 30px',
            }}
          >
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
    </FitPanel>
  );
}

export default function DraftingTable() {
  const [open, setOpen] = useState(false);
  const [pct, setPct] = useState(0);
  const { portrait, narrow, width } = useViewport();

  // Design the panel at close to the device's own CSS width, so a 15px
  // rule renders at roughly 15px on screen instead of being scaled down
  // into illegibility.
  const pxWidth = portrait ? Math.min(Math.max(width - 24, 300), 560) : 950;

  const endZ = -19 - PROJECTS.length * SPACING - 4;

  const stations = useMemo<Station[]>(() => {
    const out: Station[] = [{ at: [0, 0, 10.5], look: [0, 0, 0], dwell: 3 }];
    PROJECTS.forEach((_, i) => {
      const { position, side } = sheetTransform(i);
      // Stand off along the sheet's own normal so it is seen square-on.
      // 7.6 units clears both the 7.6-wide and 4.5-tall extents at fov 42.
      // Portrait turns the sheets square-on, so the camera comes straight
      // at them rather than along a rotated normal.
      const yaw = portrait ? 0 : -side * 0.3;
      const n: [number, number, number] = [Math.sin(yaw), 0, Math.cos(yaw)];
      out.push({
        at: [
          position[0] + n[0] * VIEW_D,
          position[1] + n[1] * VIEW_D,
          position[2] + n[2] * VIEW_D,
        ],
        look: position,
        travel: 2.2,
        dwell: 4,
      });
    });
    out.push({ at: [0, 0, endZ + 8.5], look: [0, 0, endZ], travel: 2.2, dwell: 3 });
    return out;
  }, [endZ, portrait]);

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
                padding: narrow ? '14px 16px' : '22px 28px',
                fontFamily: mono,
                fontSize: narrow ? 9.5 : 11,
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
                display: narrow ? 'none' : 'block',
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

            {narrow && (
              <div
                style={{
                  position: 'fixed',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: 2,
                  zIndex: 100,
                  background: RULE,
                }}
              >
                <div style={{ height: '100%', width: `${pct * 100}%`, background: RED }} />
              </div>
            )}

            <FactSheetTrigger theme={theme} onOpen={() => setOpen(true)} />
            <FactSheet theme={theme} open={open} onClose={() => setOpen(false)} />
          </>
        }
      >
        <color attach="background" args={[PAPER]} />
        <StationCamera stations={stations} lambda={11} />
        <PointerParallax strength={0.2} />
        <ConstructionGrid depth={-endZ + 20} />
        <Opening portrait={portrait} pxWidth={pxWidth} />
        {PROJECTS.map((p, i) => (
          <Sheet key={p.id} project={p} index={i} portrait={portrait} pxWidth={pxWidth} />
        ))}
        <Closing z={endZ} portrait={portrait} pxWidth={pxWidth} />
      </ScrollStage>
    </div>
  );
}
