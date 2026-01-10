'use client';

import { Suspense, useMemo } from 'react';
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

// Detect if device is mobile/low-power
function useIsMobile() {
  return useMemo(() => {
    if (typeof window === 'undefined') return false;

    // Check for mobile user agent
    const isMobileUA = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    // Check for touch device
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // Check screen width
    const isSmallScreen = window.innerWidth < 768;

    return isMobileUA || (isTouchDevice && isSmallScreen);
  }, []);
}

export default function NetworkScene({
  scrollProgress,
  chapters,
  isIntro,
}: NetworkSceneProps) {
  const isMobile = useIsMobile();

  return (
    <div className="fixed inset-0 z-0" style={{ cursor: 'default' }}>
      <Canvas
        style={{ cursor: 'default' }}
        camera={{ position: [0, -2, 18], fov: 45 }}
        gl={{
          antialias: !isMobile, // Disable antialiasing on mobile
          alpha: true,
          powerPreference: isMobile ? 'low-power' : 'high-performance',
        }}
        dpr={isMobile ? 1 : [1, 2]} // Lower resolution on mobile
        frameloop={isMobile ? 'demand' : 'always'} // Only render when needed on mobile
      >
        <Suspense fallback={null}>
          {/* Background color */}
          <color attach="background" args={['#000000']} />

          {/* Interactive Network */}
          <InteractiveNetwork
            scrollProgress={scrollProgress}
            chapters={chapters}
            isIntro={isIntro}
            isMobile={isMobile}
          />

          {/* Post-processing effects - disabled on mobile */}
          {!isMobile && (
            <EffectComposer>
              <Bloom
                intensity={0.6}
                luminanceThreshold={0.1}
                luminanceSmoothing={0.9}
                radius={0.8}
              />
              <Vignette eskil={false} offset={0.1} darkness={0.7} />
            </EffectComposer>
          )}

          <Preload all />
        </Suspense>
      </Canvas>
    </div>
  );
}
