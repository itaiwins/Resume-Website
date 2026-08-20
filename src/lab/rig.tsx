'use client';

import {
  createContext,
  useContext,
  useRef,
  useEffect,
  useMemo,
  type ReactNode,
  type MutableRefObject,
} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export const FONTS = {
  sans: '/fonts/Inter-Regular.ttf',
  sansMedium: '/fonts/Inter-SemiBold.ttf',
  sansBlack: '/fonts/Inter-ExtraBold.ttf',
  mono: '/fonts/JetBrainsMono-Regular.ttf',
  monoBold: '/fonts/JetBrainsMono-Bold.ttf',
  serif: '/fonts/InstrumentSerif-Regular.ttf',
  serifItalic: '/fonts/InstrumentSerif-Italic.ttf',
} as const;

/* ------------------------------------------------------------------ *
 * Scroll plumbing
 *
 * Scroll lives in a ref, never in state. The old site pushed scroll
 * through useState on every scroll event, which re-rendered the whole
 * React tree ~60x/sec while three.js was already drawing. Here the DOM
 * writes a number, and useFrame reads it. Zero re-renders.
 * ------------------------------------------------------------------ */

type ScrollCtx = {
  /** 0 at top of page, 1 at bottom. */
  progress: MutableRefObject<number>;
  /** Total scrollable height, in viewport multiples. */
  pages: number;
};

const ScrollContext = createContext<ScrollCtx | null>(null);

export function useScroll() {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error('useScroll must be used inside <ScrollStage>');
  return ctx;
}

/**
 * Frame-rate independent exponential damping.
 * lambda is "how fast it catches up" — 10+ tracks scroll almost exactly
 * while still killing wheel-notch jitter. The old site used a fixed
 * `lerp(x, 0.06)` per frame, which is both frame-rate dependent and slow
 * enough to visibly trail the scrollbar. That trailing is what read as
 * "floaty".
 */
export function damp(current: number, target: number, lambda: number, dt: number) {
  return THREE.MathUtils.lerp(current, target, 1 - Math.exp(-lambda * dt));
}

export function dampVec(
  current: THREE.Vector3,
  target: THREE.Vector3,
  lambda: number,
  dt: number,
) {
  const t = 1 - Math.exp(-lambda * dt);
  current.lerp(target, t);
  return current;
}

/* ------------------------------------------------------------------ *
 * Camera rigs
 * ------------------------------------------------------------------ */

export type Waypoint = {
  /** Camera position. */
  at: [number, number, number];
  /** What the camera aims at. */
  look: [number, number, number];
};

/**
 * Drives the camera along two Catmull-Rom splines (one for position, one
 * for the aim point) sampled by scroll progress.
 *
 * Why splines instead of the old per-chapter lerp: sampling a curve at
 * `getPointAt(t)` is arc-length parameterised, so a given amount of
 * scroll always moves the camera the same distance through space. The
 * old waypoint approach gave each chapter an equal slice of scroll
 * regardless of how far apart the waypoints were, so the camera lurched
 * between fast and slow for no reason the viewer could see.
 */
export function SplineCamera({
  waypoints,
  lambda = 9,
  /** Scroll range this rig is responsible for. */
  range = [0, 1] as [number, number],
  onProgress,
}: {
  waypoints: Waypoint[];
  lambda?: number;
  range?: [number, number];
  onProgress?: (t: number) => void;
}) {
  const { progress } = useScroll();
  const { camera } = useThree();

  const { path, aim } = useMemo(() => {
    const path = new THREE.CatmullRomCurve3(
      waypoints.map((w) => new THREE.Vector3(...w.at)),
      false,
      'catmullrom',
      0.4,
    );
    const aim = new THREE.CatmullRomCurve3(
      waypoints.map((w) => new THREE.Vector3(...w.look)),
      false,
      'catmullrom',
      0.4,
    );
    return { path, aim };
  }, [waypoints]);

  const posTarget = useRef(new THREE.Vector3());
  const aimTarget = useRef(new THREE.Vector3());
  const aimCurrent = useRef(new THREE.Vector3());
  const started = useRef(false);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const raw = progress.current;
    const t = THREE.MathUtils.clamp(
      (raw - range[0]) / Math.max(1e-6, range[1] - range[0]),
      0,
      1,
    );

    path.getPointAt(t, posTarget.current);
    aim.getPointAt(t, aimTarget.current);

    if (!started.current) {
      // Snap on the first frame so the camera never flies in from origin.
      camera.position.copy(posTarget.current);
      aimCurrent.current.copy(aimTarget.current);
      started.current = true;
    } else {
      dampVec(camera.position, posTarget.current, lambda, dt);
      dampVec(aimCurrent.current, aimTarget.current, lambda, dt);
    }

    camera.lookAt(aimCurrent.current);
    onProgress?.(t);
  });

  return null;
}

/** Small parallax offset driven by pointer, applied on top of the rig. */
export function PointerParallax({ strength = 0.35, lambda = 3 }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector2());
  const current = useRef(new THREE.Vector2());
  const applied = useRef(new THREE.Vector3());

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        (e.clientY / window.innerHeight) * 2 - 1,
      );
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30);
    current.current.x = damp(current.current.x, target.current.x, lambda, dt);
    current.current.y = damp(current.current.y, target.current.y, lambda, dt);

    // Undo last frame's offset, then apply this frame's, so the rig stays
    // authoritative over absolute position.
    camera.position.sub(applied.current);
    applied.current.set(
      current.current.x * strength,
      -current.current.y * strength,
      0,
    );
    camera.position.add(applied.current);
  });

  return null;
}

/* ------------------------------------------------------------------ *
 * Stage
 * ------------------------------------------------------------------ */

export function ScrollStage({
  pages,
  children,
  dom,
  background,
  fov = 45,
  dpr = [1, 2] as [number, number],
  onScroll,
}: {
  /** Scroll length in viewport heights. */
  pages: number;
  /** Scene contents. */
  children: ReactNode;
  /** Fixed HTML rendered above the canvas. */
  dom?: ReactNode;
  background: string;
  /** Vertical field of view, in degrees. Owned here so the camera rigs
   *  never have to mutate the camera object. */
  fov?: number;
  dpr?: [number, number];
  onScroll?: (t: number) => void;
}) {
  const progress = useRef(0);

  useEffect(() => {
    let frame = 0;
    const read = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const next = max > 0 ? window.scrollY / max : 0;
      progress.current = next;
      onScroll?.(next);
    };
    const onScrollEvent = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', onScrollEvent, { passive: true });
    window.addEventListener('resize', onScrollEvent);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScrollEvent);
      window.removeEventListener('resize', onScrollEvent);
    };
  }, [onScroll]);

  const ctx = useMemo(() => ({ progress, pages }), [pages]);

  return (
    <ScrollContext.Provider value={ctx}>
      <div style={{ background, minHeight: '100vh' }}>
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 0,
          }}
        >
          <Canvas
            dpr={dpr}
            gl={{
              antialias: true,
              powerPreference: 'high-performance',
            }}
            camera={{ position: [0, 0, 10], fov, near: 0.1, far: 400 }}
          >
            {children}
          </Canvas>
        </div>

        {dom}

        {/* Scroll driver. Nothing renders here — it only gives the page height. */}
        <div style={{ height: `${pages * 100}vh`, pointerEvents: 'none' }} />
      </div>
    </ScrollContext.Provider>
  );
}

/* ------------------------------------------------------------------ *
 * Panels — readable content as real objects in the scene
 *
 * Text is drei <Html transform>, not troika SDF geometry. Three reasons,
 * in the order that matters for a site whose job is getting someone hired:
 *   1. It stays vector-crisp at any distance, so a recruiter can actually
 *      read the numbers instead of squinting at a mip-mapped atlas.
 *   2. It's real DOM — selectable, copy-pasteable, screen-reader
 *      navigable, and indexable. SDF text in a canvas is none of those.
 *   3. It's CSS, so the typography can be as good as the rest of the web.
 *
 * The tradeoff is that HTML can't be occluded by geometry or touched by
 * fog. The concepts are laid out so panels never need to be occluded,
 * and depth is sold with an opacity ramp instead (see `fade`).
 * ------------------------------------------------------------------ */

/**
 * drei's Html transform mode hard-codes `ratio = (distanceFactor || 10) / 400`,
 * i.e. one CSS pixel is 0.025 world units at scale 1. That constant is
 * independent of viewport and fov, so panel geometry stays put on resize.
 */
export const HTML_PX_RATIO = 400 / 10;

/** Scale that makes a `pxWidth`-wide element span `worldWidth` units. */
export function panelScale(worldWidth: number, pxWidth: number) {
  return (HTML_PX_RATIO * worldWidth) / pxWidth;
}

/* ------------------------------------------------------------------ *
 * Station camera
 *
 * A spline sampled by arc length spreads scroll evenly through SPACE,
 * which is wrong for a presentation: it gives a panel you need 8 seconds
 * to read the same scroll budget as an empty corridor, and it never
 * actually stops. Stations invert that — scroll is budgeted in TIME, and
 * every station gets an explicit dwell where the camera parks dead still
 * and square-on so the content can be read.
 *
 * dwell/travel weights are relative, not absolute, so adding a project
 * re-proportions the whole timeline instead of breaking it.
 * ------------------------------------------------------------------ */

export type Station = {
  at: [number, number, number];
  look: [number, number, number];
  /** Relative scroll spent parked here. */
  dwell?: number;
  /** Relative scroll spent travelling here from the previous station. */
  travel?: number;
};

const smootherstep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

/** Resolves relative weights into absolute [0,1] scroll windows. */
export function buildTimeline(stations: Station[]) {
  const segs: { kind: 'travel' | 'dwell'; index: number; weight: number }[] = [];
  stations.forEach((s, i) => {
    if (i > 0) segs.push({ kind: 'travel', index: i, weight: s.travel ?? 1 });
    segs.push({ kind: 'dwell', index: i, weight: s.dwell ?? 1 });
  });
  const total = segs.reduce((a, s) => a + s.weight, 0) || 1;
  let acc = 0;
  return segs.map((s) => {
    const start = acc / total;
    acc += s.weight;
    return { ...s, start, end: acc / total };
  });
}

export function StationCamera({
  stations,
  lambda = 12,
}: {
  stations: Station[];
  lambda?: number;
}) {
  const { progress } = useScroll();
  const { camera } = useThree();

  const timeline = useMemo(() => buildTimeline(stations), [stations]);
  const points = useMemo(
    () => ({
      at: stations.map((s) => new THREE.Vector3(...s.at)),
      look: stations.map((s) => new THREE.Vector3(...s.look)),
    }),
    [stations],
  );

  const posTarget = useRef(new THREE.Vector3());
  const aimTarget = useRef(new THREE.Vector3());
  const aimCurrent = useRef(new THREE.Vector3());
  const started = useRef(false);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const t = THREE.MathUtils.clamp(progress.current, 0, 1);

    let seg = timeline[timeline.length - 1];
    for (const s of timeline) {
      if (t >= s.start && t < s.end) {
        seg = s;
        break;
      }
    }

    if (seg.kind === 'dwell') {
      posTarget.current.copy(points.at[seg.index]);
      aimTarget.current.copy(points.look[seg.index]);
    } else {
      const local = THREE.MathUtils.clamp(
        (t - seg.start) / Math.max(1e-6, seg.end - seg.start),
        0,
        1,
      );
      const e = smootherstep(local);
      posTarget.current.lerpVectors(points.at[seg.index - 1], points.at[seg.index], e);
      aimTarget.current.lerpVectors(points.look[seg.index - 1], points.look[seg.index], e);
    }

    if (!started.current) {
      camera.position.copy(posTarget.current);
      aimCurrent.current.copy(aimTarget.current);
      started.current = true;
    } else {
      dampVec(camera.position, posTarget.current, lambda, dt);
      dampVec(aimCurrent.current, aimTarget.current, lambda, dt);
    }
    camera.lookAt(aimCurrent.current);
  });

  return null;
}
