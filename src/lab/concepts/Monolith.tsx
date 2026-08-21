'use client';

/**
 * CONCEPT B — MONOLITH
 *
 * A canyon of black slabs. Each project is a monolith the size of a
 * building, faced with its own name set enormous in a serif. The camera
 * flies down the middle at eye level, so the work literally towers.
 *
 * The bet: scale is the cheapest way to make something feel important,
 * and nobody sets type this big on a portfolio. Where concept A is
 * precise and quiet, this is loud and physical — same facts, opposite
 * register. Acid lime instead of gold: the same "premium accent" job
 * done with a colour that reads 2026 rather than 2014.
 */

import { useState, useMemo } from 'react';
import { Html } from '@react-three/drei';
import {
  ScrollStage,
  StationCamera,
  PointerParallax,
  FitPanel,
  useViewport,
  panelScale,
  type Station,
} from '../rig';
import { FactSheet, FactSheetTrigger, type Theme } from '../FactSheet';
import { IDENTITY, PROJECTS, FACTS, type Project } from '../content';

const VOID = '#08090C';
const SLAB = '#1C2129';
const BONE = '#F3F1EC';
const DIM = '#7E8290';
const LIME = '#CBFF48';

const theme: Theme = {
  bg: VOID,
  fg: BONE,
  muted: DIM,
  line: 'rgba(243,241,236,0.14)',
  accent: LIME,
  accentFg: '#08090C',
};

const mono = 'var(--lab-mono), ui-monospace, monospace';
const sans = 'var(--lab-sans), system-ui, sans-serif';
const serif = 'var(--lab-serif), Georgia, serif';

const SLAB_W = 13;
const SLAB_H = 26;
const SLAB_D = 2.2;
const GAP = 26;
const CANYON = 9; // half-width of the corridor the camera flies down
/** Standoff from a slab face; FitPanel solves the panel fit at this distance. */
const VIEW_D = 13;

function slabTransform(i: number) {
  const side = i % 2 === 0 ? -1 : 1;
  return {
    position: [side * (CANYON + SLAB_D / 2), 0, -22 - i * GAP] as [number, number, number],
    // Faces turn inward toward the corridor. Rotating +Z by +90° about Y
    // sends the normal to +X, so a slab sitting at -X needs +90°.
    rotation: [0, -side * Math.PI * 0.5, 0] as [number, number, number],
    side,
  };
}

function Slab({
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
  const { position, rotation, side } = slabTransform(index);
  const [hover, setHover] = useState(false);

  // Panel sits just proud of the inward-facing face.
  const faceOffset = SLAB_D / 2 + 0.06;

  const href = project.href ?? project.repo;
  const live = project.status !== 'private';

  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[SLAB_W, SLAB_H, SLAB_D]} />
        <meshStandardMaterial color={SLAB} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Accent seam down the leading edge */}
      <mesh position={[-SLAB_W / 2 + 0.14, 0, faceOffset - 0.02]}>
        <planeGeometry args={[0.09, SLAB_H]} />
        <meshBasicMaterial color={LIME} />
      </mesh>

      <FitPanel
        position={[0, 0, faceOffset]}
        pxWidth={pxWidth}
        viewDistance={VIEW_D}
        fill={portrait ? 0.93 : 0.85}
        fadeNear={14}
        fadeSpan={6}
      >
        <div style={{ fontFamily: sans, color: BONE }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              fontFamily: mono,
              fontSize: 13,
              letterSpacing: '0.2em',
              color: DIM,
              borderBottom: `1px solid rgba(243,241,236,0.16)`,
              paddingBottom: 14,
            }}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            <span style={{ color: live ? LIME : DIM }}>{project.status.toUpperCase()}</span>
          </div>

          <h2
            style={{
              fontFamily: serif,
              fontSize: portrait ? 68 : 124,
              fontWeight: 400,
              lineHeight: 0.88,
              letterSpacing: '-0.02em',
              margin: '26px 0 0',
              color: BONE,
            }}
          >
            {project.name}
          </h2>

          <div
            style={{
              fontFamily: mono,
              fontSize: 13,
              letterSpacing: '0.16em',
              color: LIME,
              margin: '20px 0 24px',
            }}
          >
            {project.year} — {project.role.toUpperCase()}
          </div>

          <p
            style={{
              fontSize: portrait ? 16 : 19,
              lineHeight: 1.55,
              color: DIM,
              maxWidth: portrait ? '100%' : 660,
              margin: 0,
            }}
          >
            {project.blurb}
          </p>

          {/* Figures as a rule-separated band */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: portrait ? '1fr 1fr' : 'repeat(3, auto)',
              justifyContent: portrait ? 'stretch' : 'start',
              gap: portrait ? '18px 20px' : '0 52px',
              marginTop: portrait ? 26 : 34,
              paddingTop: 22,
              borderTop: `1px solid rgba(243,241,236,0.16)`,
            }}
          >
            {[project.metric, ...project.support].map((f, i) => (
              <div key={f.label} style={i === 0 && portrait ? { gridColumn: '1 / -1' } : undefined}>
                <div
                  style={{
                    fontFamily: sans,
                    fontSize: i === 0 ? (portrait ? 44 : 54) : portrait ? 28 : 36,
                    fontWeight: 600,
                    letterSpacing: '-0.04em',
                    lineHeight: 1,
                    color: i === 0 ? LIME : BONE,
                  }}
                >
                  {f.value}
                </div>
                <div
                  style={{
                    fontFamily: mono,
                    fontSize: 11,
                    letterSpacing: '0.16em',
                    textTransform: 'uppercase',
                    color: DIM,
                    marginTop: 10,
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
              gap: portrait ? 16 : 0,
              alignItems: portrait ? 'flex-start' : 'center',
              justifyContent: 'space-between',
              marginTop: portrait ? 22 : 30,
            }}
          >
            <span style={{ fontFamily: mono, fontSize: portrait ? 11 : 13, letterSpacing: '0.1em', color: DIM }}>
              {project.stack.join('  /  ')}
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
                  fontSize: 14,
                  letterSpacing: '0.16em',
                  padding: '15px 28px',
                  color: hover ? VOID : LIME,
                  background: hover ? LIME : 'transparent',
                  border: `1px solid ${LIME}`,
                  transition: 'all 160ms ease',
                }}
              >
                {project.href ? 'VISIT' : 'SOURCE'} ↗
              </a>
            )}
          </div>
        </div>
      </FitPanel>

      {/* Name repeated on the outer face, as signage seen on approach */}
      <Html
        transform
        position={[0, SLAB_H / 2 - 3.4, -faceOffset]}
        rotation={[0, Math.PI, 0]}
        scale={panelScale(SLAB_W - 2, 900)}
        style={{ width: 900, pointerEvents: 'none' }}
        zIndexRange={[10, 0]}
      >
        <div
          style={{
            fontFamily: mono,
            fontSize: 34,
            letterSpacing: '0.3em',
            color: 'rgba(243,241,236,0.13)',
            textAlign: side > 0 ? 'right' : 'left',
          }}
        >
          {project.name.toUpperCase()}
        </div>
      </Html>
    </group>
  );
}

function Ground({ depth }: { depth: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -SLAB_H / 2, -depth / 2]} receiveShadow>
      <planeGeometry args={[90, depth + 90]} />
      <meshStandardMaterial color="#0A0C10" roughness={0.95} metalness={0} />
    </mesh>
  );
}

function Opening({ portrait, pxWidth }: { portrait: boolean; pxWidth: number }) {
  return (
    <FitPanel
      position={[0, 0, 0]}
      pxWidth={pxWidth}
      viewDistance={13}
      fill={portrait ? 0.93 : 0.85}
      fadeNear={14}
      fadeSpan={6}
    >
      <div style={{ fontFamily: sans, color: BONE, textAlign: 'center' }}>
        <div style={{ fontFamily: mono, fontSize: 13, letterSpacing: '0.4em', color: LIME }}>
          PORTFOLIO — 2026
        </div>
        <h1
          style={{
            fontFamily: serif,
            fontSize: portrait ? 92 : 190,
            fontWeight: 400,
            lineHeight: 0.86,
            letterSpacing: '-0.03em',
            margin: '30px 0 0',
          }}
        >
          Itai
          <br />
          <em style={{ color: LIME }}>Rotem</em>
        </h1>
        <p style={{ fontSize: portrait ? 17 : 24, color: DIM, margin: portrait ? '26px 0 0' : '38px 0 0' }}>
          {IDENTITY.role} — {IDENTITY.focus}
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: portrait ? '1fr 1fr' : 'repeat(4, auto)',
            justifyContent: 'center',
            gap: portrait ? '22px 28px' : '0 64px',
            marginTop: portrait ? 38 : 56,
          }}
        >
          {FACTS.map((f) => (
            <div key={f.label}>
              <div style={{ fontSize: portrait ? 36 : 52, fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1 }}>
                {f.value}
              </div>
              <div
                style={{
                  fontFamily: mono,
                  fontSize: 11,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: DIM,
                  marginTop: 10,
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
      viewDistance={10}
      fill={portrait ? 0.93 : 0.85}
      fadeNear={11}
      fadeSpan={6}
    >
        <div style={{ fontFamily: sans, color: BONE, textAlign: 'center' }}>
          <h2
            style={{
              fontFamily: serif,
              fontSize: portrait ? 66 : 130,
              fontWeight: 400,
              lineHeight: 0.9,
              margin: 0,
            }}
          >
            Let&apos;s <em style={{ color: LIME }}>build</em>
            <br />
            something.
          </h2>
          <a
            href={`mailto:${IDENTITY.email}`}
            style={{
              pointerEvents: 'auto',
              display: 'inline-block',
              marginTop: 48,
              fontFamily: mono,
              fontSize: 19,
              letterSpacing: '0.08em',
              color: VOID,
              background: LIME,
              padding: '20px 38px',
            }}
          >
            {IDENTITY.email}
          </a>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 36,
              marginTop: 44,
              fontFamily: mono,
              fontSize: 13,
              letterSpacing: '0.14em',
              color: DIM,
            }}
          >
            <a href={IDENTITY.github} style={{ pointerEvents: 'auto', color: DIM }}>
              GITHUB ↗
            </a>
            <a href={IDENTITY.linkedin} style={{ pointerEvents: 'auto', color: DIM }}>
              LINKEDIN ↗
            </a>
            <span>{IDENTITY.location.toUpperCase()}</span>
          </div>
        </div>
    </FitPanel>
  );
}

export default function Monolith() {
  const [open, setOpen] = useState(false);
  const [pct, setPct] = useState(0);
  const { portrait, narrow, width } = useViewport();
  const pxWidth = portrait ? Math.min(Math.max(width - 24, 300), 560) : 1000;
  const endZ = -22 - PROJECTS.length * GAP - 6;

  const stations = useMemo<Station[]>(() => {
    const out: Station[] = [
      { at: [0, 0, 13], look: [0, 0, 0], dwell: 3 },
    ];
    PROJECTS.forEach((_, i) => {
      const { position, side } = slabTransform(i);
      // Standoff is set by the panel's HEIGHT, not its width — at fov 52
      // the frame is only 0.61x as tall as it is wide, so a panel that
      // fits horizontally will still overflow top and bottom. ~13 units
      // clears a 9.4-unit-tall panel with margin.
      out.push({
        // Panel sits at side*(CANYON - 0.06); park VIEW_D in front of it,
        // which lands just past the corridor centreline on the far side.
        at: [-side * (VIEW_D - (CANYON - 0.06)), 0, position[2]],
        look: [position[0], 0, position[2]],
        travel: 2.2,
        dwell: 4,
      });
    });
    out.push({ at: [0, 0, endZ + 10], look: [0, 0, endZ], travel: 2.2, dwell: 3 });
    return out;
  }, [endZ]);

  return (
    <div className="lab-root">
      <ScrollStage
        pages={PROJECTS.length * 2.8 + 4}
        background={VOID}
        fov={52}
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
                color: DIM,
                pointerEvents: 'none',
              }}
            >
              <span style={{ color: BONE }}>ITAI ROTEM</span>
              <span>B · MONOLITH</span>
            </header>

            <div
              style={{
                position: 'fixed',
                left: 0,
                right: 0,
                bottom: 0,
                height: 2,
                zIndex: 100,
                background: 'rgba(243,241,236,0.1)',
              }}
            >
              <div style={{ height: '100%', width: `${pct * 100}%`, background: LIME }} />
            </div>

            <FactSheetTrigger theme={theme} onOpen={() => setOpen(true)} />
            <FactSheet theme={theme} open={open} onClose={() => setOpen(false)} />
          </>
        }
      >
        <color attach="background" args={[VOID]} />
        <fog attach="fog" args={[VOID, 30, 95]} />
        <ambientLight intensity={1.05} />
        <directionalLight position={[10, 24, 14]} intensity={2.4} />
        <directionalLight position={[-14, 8, 10]} intensity={0.55} />
        {/* cool rim so slab edges separate from the void */}
        <directionalLight position={[0, -6, -20]} intensity={0.6} color="#5B76FF" />
        <StationCamera stations={stations} lambda={11} />
        <PointerParallax strength={0.3} />
        <Ground depth={-endZ + 40} />
        <Opening portrait={portrait} pxWidth={pxWidth} />
        {PROJECTS.map((p, i) => (
          <Slab key={p.id} project={p} index={i} portrait={portrait} pxWidth={pxWidth} />
        ))}
        <Closing z={endZ} portrait={portrait} pxWidth={pxWidth} />
      </ScrollStage>
    </div>
  );
}
