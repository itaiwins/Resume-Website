'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { MotionValue } from 'framer-motion';
import InteractiveNetwork from './InteractiveNetwork';

interface Chapter {
  id: string;
  phase: string;
  title: string;
  subtitle: string;
  camera: { position: number[]; target: number[] };
  duration: number;
  scrollStart: number;
  scrollEnd: number;
  sectionId?: string;
  content?: React.ComponentType;
}

interface NetworkSceneProps {
  scrollProgress: MotionValue<number>;
  chapters: Chapter[];
  isIntro: boolean;
}

export default function NetworkScene({
  scrollProgress,
  chapters,
  isIntro,
}: NetworkSceneProps) {
  return (
    <div className="fixed inset-0 z-0" style={{ cursor: 'default' }}>
      <Canvas
        style={{ cursor: 'default' }}
        camera={{ position: [0, -2, 18], fov: 45 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          {/* Background color */}
          <color attach="background" args={['#000000']} />

          {/* Interactive Network */}
          <InteractiveNetwork
            scrollProgress={scrollProgress}
            chapters={chapters}
            isIntro={isIntro}
          />

          {/* Post-processing effects */}
          <EffectComposer>
            <Bloom
              intensity={0.6}
              luminanceThreshold={0.1}
              luminanceSmoothing={0.9}
              radius={0.8}
            />
            <Vignette eskil={false} offset={0.1} darkness={0.7} />
          </EffectComposer>

          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
