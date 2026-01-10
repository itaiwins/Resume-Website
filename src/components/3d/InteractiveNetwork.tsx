'use client';

import { useRef, useMemo, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Html, OrbitControls } from '@react-three/drei';
import { MotionValue } from 'framer-motion';

// Node styling
const NODE_SIZE = 0.08;
const NODE_COLOR = '#d4af37';
const SECTION_NODE_SIZE = 0.18;

// Section nodes embedded in the network
const SECTION_NODES = [
  { id: 'about', label: 'ABOUT', position: [-3, 1.5, 2] as [number, number, number] },
  { id: 'projects', label: 'PROJECTS', position: [3, 2, -1] as [number, number, number] },
  { id: 'skills', label: 'SKILLS', position: [-2, -2, -2] as [number, number, number] },
  { id: 'experience', label: 'EXPERIENCE', position: [2.5, -1.5, 2.5] as [number, number, number] },
  { id: 'contact', label: 'CONTACT', position: [0, -3, 0] as [number, number, number] },
];

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
}

// Generate spherical network nodes using Fibonacci distribution
function generateNetworkNodes() {
  const nodes: Array<{ position: [number, number, number]; id: string }> = [];

  const shells = [
    { count: 20, radius: 2.5 },
    { count: 40, radius: 4 },
    { count: 60, radius: 5.5 },
    { count: 40, radius: 7 },
  ];

  let idx = 0;
  shells.forEach((shell) => {
    for (let i = 0; i < shell.count; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / shell.count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const x = shell.radius * Math.sin(phi) * Math.cos(theta);
      const y = shell.radius * Math.sin(phi) * Math.sin(theta);
      const z = shell.radius * Math.cos(phi);

      nodes.push({
        id: `node-${idx}`,
        position: [x, y, z],
      });
      idx++;
    }
  });

  return nodes;
}

const NETWORK_NODES = generateNetworkNodes();

// Generate connections between nearby nodes
function generateConnections() {
  const connections: Array<{ start: [number, number, number]; end: [number, number, number]; id: string }> = [];

  // Connect network nodes
  NETWORK_NODES.forEach((node, i) => {
    const nodePos = new THREE.Vector3(...node.position);

    NETWORK_NODES.forEach((other, j) => {
      if (i >= j) return;

      const otherPos = new THREE.Vector3(...other.position);
      const dist = nodePos.distanceTo(otherPos);

      if (dist < 3) {
        connections.push({
          start: node.position,
          end: other.position,
          id: `conn-${i}-${j}`,
        });
      }
    });
  });

  // Connect section nodes to nearby network nodes
  SECTION_NODES.forEach((sNode) => {
    const sPos = new THREE.Vector3(...sNode.position);

    NETWORK_NODES.forEach((node, i) => {
      const nodePos = new THREE.Vector3(...node.position);
      const dist = sPos.distanceTo(nodePos);

      if (dist < 2.5) {
        connections.push({
          start: sNode.position,
          end: node.position,
          id: `section-conn-${sNode.id}-${i}`,
        });
      }
    });
  });

  return connections;
}

const CONNECTIONS = generateConnections();

// Simple network node with animated opacity
function NetworkNode({ position, opacity }: { position: [number, number, number]; opacity: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, opacity, 0.1);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[NODE_SIZE, 12, 12]} />
      <meshBasicMaterial color={NODE_COLOR} transparent opacity={opacity} />
    </mesh>
  );
}

// Section node with label - simple smooth fade transition
function SectionNode({
  label,
  position,
  isActive,
  isNearby,
  opacity,
  enterProgress,
}: {
  label: string;
  position: [number, number, number];
  isActive: boolean;
  isNearby: boolean;
  opacity: number;
  enterProgress: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const showLabel = (isNearby || isActive) && opacity > 0.2 && enterProgress < 0.3;

  // Smooth fade out as we enter the world
  const fadeOpacity = opacity * Math.max(0, 1 - enterProgress * 1.5);

  return (
    <group ref={groupRef} position={position}>
      {/* Core node - simple fade */}
      <mesh>
        <sphereGeometry args={[SECTION_NODE_SIZE, 16, 16]} />
        <meshBasicMaterial
          color={NODE_COLOR}
          transparent
          opacity={fadeOpacity}
        />
      </mesh>

      {/* Subtle glow effect */}
      <mesh>
        <sphereGeometry args={[SECTION_NODE_SIZE * 1.5, 16, 16]} />
        <meshBasicMaterial
          color={NODE_COLOR}
          transparent
          opacity={0.2 * fadeOpacity}
        />
      </mesh>

      {/* Label */}
      {showLabel && (
        <Html
          position={[0, SECTION_NODE_SIZE + 0.4, 0]}
          center
          style={{ pointerEvents: 'none' }}
        >
          <div
            className="font-mono text-xs tracking-[0.2em] whitespace-nowrap px-3 py-1.5 rounded"
            style={{
              color: '#ffd700',
              background: 'rgba(0, 0, 0, 0.9)',
              border: `1px solid rgba(212, 175, 55, ${isActive ? 0.8 : 0.4})`,
              textShadow: '0 0 10px rgba(212, 175, 55, 0.5)',
              transform: `scale(${isActive ? 1.05 : 1})`,
              transition: 'all 0.3s ease',
              opacity: Math.max(0, 1 - enterProgress * 3),
            }}
          >
            {label}
          </div>
        </Html>
      )}
    </group>
  );
}

// Connection line with animated opacity
function ConnectionLine({ start, end, opacity }: { start: [number, number, number]; end: [number, number, number]; opacity: number }) {
  const lineRef = useRef<THREE.Line>(null);

  useFrame(() => {
    if (lineRef.current) {
      const mat = lineRef.current.material as THREE.LineBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, opacity, 0.1);
    }
  });

  const lineObject = useMemo(() => {
    const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color: NODE_COLOR,
      transparent: true,
      opacity: opacity,
    });
    return new THREE.Line(geo, mat);
  }, [start, end, opacity]);

  return <primitive ref={lineRef} object={lineObject} />;
}

// Camera controller - simple zoom in/out for sections
function ScrollCameraController({
  scrollProgress,
  chapters,
  isIntro,
  onSectionChange,
}: {
  scrollProgress: MotionValue<number>;
  chapters: Chapter[];
  isIntro: boolean;
  onSectionChange: (section: string | null, progress: number) => void;
}) {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3(0, 0, 22));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const introRotation = useRef(0);
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((_, delta) => {
    if (isIntro) {
      // Slow ambient rotation during intro
      introRotation.current += delta * 0.15;
      const radius = 12;
      targetPosition.current.set(
        Math.sin(introRotation.current) * 2,
        Math.cos(introRotation.current * 0.7) * 1.5 - 3,
        radius
      );
      targetLookAt.current.set(0, 2, 0);
      camera.position.lerp(targetPosition.current, 0.02);
      currentLookAt.current.lerp(targetLookAt.current, 0.02);
      onSectionChange(null, 0);
    } else {
      const progress = scrollProgress.get();

      // Find current chapter
      let currentChapter = chapters[0];
      let nextChapter = chapters[1];
      let chapterProgress = 0;

      for (let i = 0; i < chapters.length; i++) {
        const chapter = chapters[i];
        if (progress >= chapter.scrollStart && progress < chapter.scrollEnd) {
          currentChapter = chapter;
          nextChapter = chapters[i + 1] || chapter;
          chapterProgress = (progress - chapter.scrollStart) / chapter.duration;
          break;
        }
      }

      // Smooth easing
      const easeInOutCubic = (t: number) => {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      };

      const easedProgress = easeInOutCubic(Math.min(1, chapterProgress));

      // For section chapters - simple zoom into the node
      if (currentChapter.sectionId) {
        const section = SECTION_NODES.find(s => s.id === currentChapter.sectionId);
        if (section) {
          const nodePos = new THREE.Vector3(...section.position);

          // Simple zoom: start from chapter camera position, zoom into node
          const startPos = new THREE.Vector3(
            currentChapter.camera.position[0],
            currentChapter.camera.position[1],
            currentChapter.camera.position[2]
          );

          // Zoom progress (0-30% of chapter = zoom in, rest = stay zoomed)
          const zoomProgress = Math.min(1, chapterProgress / 0.3);
          const zoomedPos = nodePos.clone().add(new THREE.Vector3(0, 0, 1.5)); // Close to node

          targetPosition.current.lerpVectors(startPos, zoomedPos, zoomProgress);
          targetLookAt.current.copy(nodePos);

          onSectionChange(currentChapter.sectionId, chapterProgress);
        }
      } else {
        // Regular transition between chapters
        targetPosition.current.set(
          currentChapter.camera.position[0] + (nextChapter.camera.position[0] - currentChapter.camera.position[0]) * easedProgress,
          currentChapter.camera.position[1] + (nextChapter.camera.position[1] - currentChapter.camera.position[1]) * easedProgress,
          currentChapter.camera.position[2] + (nextChapter.camera.position[2] - currentChapter.camera.position[2]) * easedProgress
        );

        targetLookAt.current.set(
          currentChapter.camera.target[0] + (nextChapter.camera.target[0] - currentChapter.camera.target[0]) * easedProgress,
          currentChapter.camera.target[1] + (nextChapter.camera.target[1] - currentChapter.camera.target[1]) * easedProgress,
          currentChapter.camera.target[2] + (nextChapter.camera.target[2] - currentChapter.camera.target[2]) * easedProgress
        );

        onSectionChange(null, 0);
      }

      // Smooth camera movement
      camera.position.lerp(targetPosition.current, 0.06);
      currentLookAt.current.lerp(targetLookAt.current, 0.06);
    }

    camera.lookAt(currentLookAt.current);
  });

  return null;
}

// Main network component
interface InteractiveNetworkProps {
  scrollProgress: MotionValue<number>;
  chapters: Chapter[];
  isIntro: boolean;
}

export default function InteractiveNetwork({
  scrollProgress,
  chapters,
  isIntro,
}: InteractiveNetworkProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [sectionProgress, setSectionProgress] = useState(0);

  // Callback from camera controller
  const handleSectionChange = (section: string | null, progress: number) => {
    setActiveSection(section);
    setSectionProgress(progress);
  };

  // Network fades out when inside a section (after 30% zoom-in complete)
  const networkOpacity = activeSection && sectionProgress > 0.3
    ? Math.max(0, 1 - (sectionProgress - 0.3) * 3)
    : 1;

  // Check if camera is near a section (for showing labels before entering)
  const getNearbySection = () => {
    if (isIntro) return null;
    const progress = scrollProgress.get();

    for (const chapter of chapters) {
      if (progress >= chapter.scrollStart && progress < chapter.scrollEnd) {
        if (chapter.sectionId) return chapter.sectionId;

        // Check if approaching a section
        const target = chapter.camera.target;
        for (const section of SECTION_NODES) {
          const dist = Math.sqrt(
            Math.pow(target[0] - section.position[0], 2) +
            Math.pow(target[1] - section.position[1], 2) +
            Math.pow(target[2] - section.position[2], 2)
          );
          if (dist < 3) return section.id;
        }
        break;
      }
    }
    return null;
  };

  return (
    <>
      {/* Orbit controls - only enabled during intro for user exploration */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enabled={isIntro}
        rotateSpeed={0.5}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI * 3 / 4}
        target={[0, 0, 0]}
      />

      {/* Scroll-driven camera - always active for smooth transitions */}
      <ScrollCameraController
        scrollProgress={scrollProgress}
        chapters={chapters}
        isIntro={isIntro}
        onSectionChange={handleSectionChange}
      />

      {/* Network - fades when entering a world */}
      <group ref={groupRef}>
        {/* Network nodes */}
        {NETWORK_NODES.map((node) => (
          <NetworkNode
            key={node.id}
            position={node.position}
            opacity={0.8 * networkOpacity}
          />
        ))}

        {/* Connections */}
        {CONNECTIONS.map((conn) => (
          <ConnectionLine
            key={conn.id}
            start={conn.start}
            end={conn.end}
            opacity={0.15 * networkOpacity}
          />
        ))}

        {/* Section nodes */}
        {SECTION_NODES.map((node) => {
          const isThisActive = activeSection === node.id;
          const enterProg = isThisActive ? Math.min(1, sectionProgress / 0.3) : 0;
          return (
            <SectionNode
              key={node.id}
              label={node.label}
              position={node.position}
              isActive={isThisActive}
              isNearby={getNearbySection() === node.id}
              opacity={networkOpacity}
              enterProgress={enterProg}
            />
          );
        })}
      </group>

      {/* Ambient light */}
      <ambientLight intensity={0.5} />
    </>
  );
}
