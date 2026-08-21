'use client';

/**
 * CONCEPT C — HELIX
 *
 * Not a corridor. The work is arranged as a rising helix around a lit
 * central spine, and scrolling orbits the camera upward around it —
 * so the shape of the career is visible as a shape, and every card is
 * reached by turning rather than travelling.
 *
 * The bet: A and B are both "fly down a straight line", which is the
 * default move in scroll-driven 3D. Orbiting reads as a turntable — a
 * thing being shown to you — and it gives an overview no linear layout
 * can: from the opening you can see the whole helix at once and know
 * exactly how much there is. Warm graphite and burnt orange keep it
 * away from both the paper of A and the void of B.
 */

import { useState, useMemo } from 'react';
import { Line } from '@react-three/drei';
import {
  ScrollStage,
  StationCamera,
  PointerParallax,
  FitPanel,
  useViewport,
  type Station,
} from '../rig';
import { FactSheet, FactSheetTrigger, type Theme } from '../FactSheet';
import { IDENTITY, PROJECTS, FACTS, type Project } from '../content';

const GROUND = '#25221E';
const CARD = '#F1EBE1';
const INK = '#1B1815';
const MUTED = '#6F675D';
const EMBER = '#E2542A';
const CREAM = '#EDE6DA';

const theme: Theme = {
  bg: GROUND,
  fg: CREAM,
  muted: '#9A9186',
  line: 'rgba(237,230,218,0.16)',
  accent: EMBER,
  accentFg: '#1B1815',
};

const mono = 'var(--lab-mono), ui-monospace, monospace';
const sans = 'var(--lab-sans), system-ui, sans-serif';

const RADIUS = 7.4;
const RISE = 3.5; // vertical gain per project
const TURN = (Math.PI * 2) / 7; // ~51° of rotation between projects
const STANDOFF = 7.8;

function cardTransform(i: number) {
  const theta = i * TURN;
  const y = i * RISE;
  return {
    theta,
    y,
    // Rotating +Z by theta about Y points the face radially outward.
    position: [Math.sin(theta) * RADIUS, y, Math.cos(theta) * RADIUS] as [number, number, number],
    rotation: [0, theta, 0] as [number, number, number],
  };
}

function Card({
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
  const { position, rotation, y, theta } = cardTransform(index);
  const [hover, setHover] = useState(false);

  const href = project.href ?? project.repo;
  const live = project.status !== 'private';

  return (
    <>
      {/* Spoke tying the card back to the spine — makes the helix legible */}
      <Line
        points={[
          [0, y, 0],
          [Math.sin(theta) * (RADIUS - 0.2), y, Math.cos(theta) * (RADIUS - 0.2)],
        ]}
        color={EMBER}
        lineWidth={1}
        transparent
        opacity={0.42}
      />

      <FitPanel
        position={position}
        rotation={rotation}
        pxWidth={pxWidth}
        viewDistance={STANDOFF}
        fill={portrait ? 0.94 : 0.86}
        fadeNear={8.5}
        fadeSpan={3.5}
      >
          <div
            style={{
              background: CARD,
              color: INK,
              fontFamily: sans,
              padding: portrait ? '24px 22px 22px' : '34px 38px 30px',
              boxShadow: hover
                ? '0 40px 70px -24px rgba(0,0,0,0.55)'
                : '0 28px 54px -28px rgba(0,0,0,0.45)',
              transition: 'box-shadow 240ms ease',
              borderTop: `3px solid ${EMBER}`,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                fontFamily: mono,
                fontSize: 11.5,
                letterSpacing: '0.18em',
                color: MUTED,
              }}
            >
              <span>
                {String(index + 1).padStart(2, '0')} — {project.year}
              </span>
              <span style={{ color: live ? EMBER : MUTED }}>{project.status.toUpperCase()}</span>
            </div>

            <h2
              style={{
                fontSize: portrait ? 40 : 52,
                fontWeight: 600,
                letterSpacing: '-0.035em',
                lineHeight: 1,
                margin: portrait ? '14px 0 0' : '18px 0 0',
              }}
            >
              {project.name}
            </h2>

            <p style={{ fontSize: portrait ? 14.5 : 15, lineHeight: 1.62, color: MUTED, margin: '14px 0 0' }}>
              {project.blurb}
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: portrait ? '1fr 1fr' : 'repeat(3, auto)',
                justifyContent: portrait ? 'stretch' : 'start',
                gap: portrait ? '16px 18px' : '0 40px',
                margin: portrait ? '20px 0 0' : '26px 0 0',
                paddingTop: 20,
                borderTop: `1px solid rgba(27,24,21,0.14)`,
              }}
            >
              {[project.metric, ...project.support].map((f, i) => (
                <div key={f.label} style={i === 0 && portrait ? { gridColumn: '1 / -1' } : undefined}>
                  <div
                    style={{
                      fontSize: i === 0 ? (portrait ? 38 : 42) : 26,
                      fontWeight: 600,
                      letterSpacing: '-0.04em',
                      lineHeight: 1,
                      color: i === 0 ? EMBER : INK,
                    }}
                  >
                    {f.value}
                  </div>
                  <div
                    style={{
                      fontFamily: mono,
                      fontSize: 10,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: MUTED,
                      marginTop: 7,
                    }}
                  >
                    {f.label}
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: portrait ? 'column' : 'row',
                gap: portrait ? 14 : 0,
                alignItems: portrait ? 'flex-start' : 'center',
                justifyContent: 'space-between',
                marginTop: portrait ? 18 : 24,
              }}
            >
              <span style={{ fontFamily: mono, fontSize: 11, color: MUTED, letterSpacing: '0.06em' }}>
                {project.stack.join(' · ')}
              </span>
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
                    fontSize: 11.5,
                    letterSpacing: '0.14em',
                    padding: '11px 20px',
                    color: hover ? CARD : EMBER,
                    background: hover ? EMBER : 'transparent',
                    border: `1px solid ${EMBER}`,
                    transition: 'all 160ms ease',
                  }}
                >
                  {project.href ? 'VISIT' : 'SOURCE'} ↗
                </a>
              )}
            </div>
          </div>
      </FitPanel>
    </>
  );
}

/** The spine the whole thing turns around. */
function Spine({ top }: { top: number }) {
  return (
    <group>
      <mesh position={[0, top / 2 - 4, 0]}>
        <cylinderGeometry args={[0.09, 0.09, top + 14, 12]} />
        <meshBasicMaterial color={EMBER} transparent opacity={0.5} />
      </mesh>
      {/* Rings mark each rung of the helix */}
      {PROJECTS.map((_, i) => {
        const pts: [number, number, number][] = [];
        for (let a = 0; a <= 48; a++) {
          const t = (a / 48) * Math.PI * 2;
          pts.push([Math.cos(t) * RADIUS, i * RISE, Math.sin(t) * RADIUS]);
        }
        return (
          <Line key={i} points={pts} color={CREAM} lineWidth={1} transparent opacity={0.07} />
        );
      })}
    </group>
  );
}

const OPEN_THETA = -TURN;
const OPEN_Y = -RISE;
const OPEN_POS: [number, number, number] = [
  Math.sin(OPEN_THETA) * RADIUS,
  OPEN_Y,
  Math.cos(OPEN_THETA) * RADIUS,
];

function Opening({ portrait, pxWidth }: { portrait: boolean; pxWidth: number }) {
  return (
    <FitPanel
      position={OPEN_POS}
      rotation={[0, OPEN_THETA, 0]}
      pxWidth={pxWidth}
      viewDistance={STANDOFF}
      fill={portrait ? 0.94 : 0.86}
      fadeNear={9}
      fadeSpan={6}
    >
        <div style={{ fontFamily: sans, color: CREAM, textAlign: 'center' }}>
          <div style={{ fontFamily: mono, fontSize: 12, letterSpacing: '0.38em', color: EMBER }}>
            SELECTED WORK — 2026
          </div>
          <h1
            style={{
              fontSize: portrait ? 58 : 116,
              fontWeight: 600,
              letterSpacing: '-0.05em',
              lineHeight: 0.94,
              margin: '26px 0 0',
            }}
          >
            {IDENTITY.name}
          </h1>
          <p style={{ fontSize: portrait ? 16 : 20, color: '#A79D91', margin: '22px 0 0' }}>
            {IDENTITY.role} — {IDENTITY.focus}
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: portrait ? '1fr 1fr' : 'repeat(4, auto)',
              justifyContent: 'center',
              gap: portrait ? '22px 26px' : '0 54px',
              marginTop: portrait ? 34 : 46,
            }}
          >
            {FACTS.map((f) => (
              <div key={f.label}>
                <div style={{ fontSize: portrait ? 32 : 40, fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1 }}>
                  {f.value}
                </div>
                <div
                  style={{
                    fontFamily: mono,
                    fontSize: 10,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: '#8F877C',
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

function Closing({
  theta,
  y,
  portrait,
  pxWidth,
}: {
  theta: number;
  y: number;
  portrait: boolean;
  pxWidth: number;
}) {
  const pos: [number, number, number] = [Math.sin(theta) * RADIUS, y, Math.cos(theta) * RADIUS];
  return (
    <FitPanel
      position={pos}
      rotation={[0, theta, 0]}
      pxWidth={pxWidth}
      viewDistance={STANDOFF}
      fill={portrait ? 0.94 : 0.86}
      fadeNear={9}
      fadeSpan={6}
    >
        <div style={{ fontFamily: sans, color: CREAM, textAlign: 'center' }}>
          <h2 style={{ fontSize: portrait ? 46 : 78, fontWeight: 600, letterSpacing: '-0.045em', margin: 0 }}>
            Let&apos;s talk.
          </h2>
          <a
            href={`mailto:${IDENTITY.email}`}
            style={{
              pointerEvents: 'auto',
              display: 'inline-block',
              marginTop: 34,
              fontFamily: mono,
              fontSize: 17,
              letterSpacing: '0.06em',
              color: '#1B1815',
              background: EMBER,
              padding: '17px 32px',
            }}
          >
            {IDENTITY.email}
          </a>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 32,
              marginTop: 36,
              fontFamily: mono,
              fontSize: 12,
              letterSpacing: '0.12em',
              color: '#8F877C',
            }}
          >
            <a href={IDENTITY.github} style={{ pointerEvents: 'auto', color: '#8F877C' }}>
              GITHUB ↗
            </a>
            <a href={IDENTITY.linkedin} style={{ pointerEvents: 'auto', color: '#8F877C' }}>
              LINKEDIN ↗
            </a>
            <span>{IDENTITY.location.toUpperCase()}</span>
          </div>
        </div>
    </FitPanel>
  );
}

export default function Helix() {
  const [open, setOpen] = useState(false);
  const [pct, setPct] = useState(0);
  const { portrait, narrow, width } = useViewport();
  const pxWidth = portrait ? Math.min(Math.max(width - 24, 300), 560) : 880;

  const endTheta = PROJECTS.length * TURN;
  const endY = PROJECTS.length * RISE;

  const stations = useMemo<Station[]>(() => {
    const openR = RADIUS + STANDOFF;
    const out: Station[] = [
      // Name head-on...
      {
        at: [Math.sin(OPEN_THETA) * openR, OPEN_Y, Math.cos(OPEN_THETA) * openR],
        look: OPEN_POS,
        dwell: 3,
      },
      // ...then pull back far enough that every card has faded out and only
      // the structure remains, so the scale of the work reads at a glance.
      { at: [0, endY * 0.42, RADIUS + 27], look: [0, endY * 0.36, 0], travel: 2, dwell: 2 },
    ];
    PROJECTS.forEach((_, i) => {
      const { theta, y } = cardTransform(i);
      const r = RADIUS + STANDOFF;
      out.push({
        at: [Math.sin(theta) * r, y, Math.cos(theta) * r],
        look: [Math.sin(theta) * RADIUS, y, Math.cos(theta) * RADIUS],
        travel: 2.4,
        dwell: 4,
      });
    });
    const r = RADIUS + STANDOFF;
    out.push({
      at: [Math.sin(endTheta) * r, endY, Math.cos(endTheta) * r],
      look: [Math.sin(endTheta) * RADIUS, endY, Math.cos(endTheta) * RADIUS],
      travel: 2.4,
      dwell: 3,
    });
    return out;
  }, [endTheta, endY]);

  return (
    <div className="lab-root">
      <ScrollStage
        pages={PROJECTS.length * 2.8 + 5}
        background={GROUND}
        fov={45}
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
                letterSpacing: '0.18em',
                color: '#8F877C',
                pointerEvents: 'none',
              }}
            >
              <span style={{ color: CREAM }}>ITAI ROTEM</span>
              <span>C · HELIX</span>
            </header>

            {/* Progress as an arc, echoing the orbit */}
            <div
              style={{
                position: 'fixed',
                display: narrow ? 'none' : 'block',
                right: 26,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 100,
                fontFamily: mono,
                fontSize: 10,
                color: '#8F877C',
                textAlign: 'right',
              }}
            >
              <div style={{ marginBottom: 8 }}>{String(Math.round(pct * 100)).padStart(3, '0')}</div>
              <div style={{ width: 2, height: 160, background: 'rgba(237,230,218,0.14)', marginLeft: 'auto' }}>
                <div style={{ width: '100%', height: `${pct * 100}%`, background: EMBER }} />
              </div>
            </div>

            <FactSheetTrigger theme={theme} onOpen={() => setOpen(true)} />
            <FactSheet theme={theme} open={open} onClose={() => setOpen(false)} />
          </>
        }
      >
        <color attach="background" args={[GROUND]} />
        <fog attach="fog" args={[GROUND, 24, 80]} />
        <ambientLight intensity={1.1} />
        <directionalLight position={[10, 18, 10]} intensity={1.6} />
        <StationCamera stations={stations} lambda={11} />
        <PointerParallax strength={0.24} />
        <Spine top={endY} />
        <Opening portrait={portrait} pxWidth={pxWidth} />
        {PROJECTS.map((p, i) => (
          <Card key={p.id} project={p} index={i} portrait={portrait} pxWidth={pxWidth} />
        ))}
        <Closing theta={endTheta} y={endY} portrait={portrait} pxWidth={pxWidth} />
      </ScrollStage>
    </div>
  );
}
