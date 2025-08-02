import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { neuralNodes, neuralPathways, type ConsciousnessNode } from '@/data/consciousness';

interface NeuralUniverseProps {
  onNodeSelect: (node: ConsciousnessNode | null) => void;
  selectedNode: ConsciousnessNode | null;
}

// Convert 2D positions to 3D space
const convert2DTo3D = (position: { x: number; y: number }, type: string): [number, number, number] => {
  const scale = type === 'core' ? 0.8 : 1.2;
  const z = type === 'core' ? 0 : (Math.random() - 0.5) * 4;
  return [position.x * scale * 0.01, position.y * scale * 0.01, z];
};

// Neural Node Component
const NeuralNode: React.FC<{
  node: ConsciousnessNode;
  position: [number, number, number];
  isSelected: boolean;
  isActive: boolean;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}> = ({ node, position, isSelected, isActive, onClick, onHover }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const size = useMemo(() => {
    switch (node.type) {
      case 'core': return 0.8;
      case 'primary': return 0.5;
      default: return 0.35;
    }
  }, [node.type]);

  useFrame((state) => {
    if (meshRef.current) {
      // Consciousness pulse animation
      const time = state.clock.getElapsedTime();
      const pulse = Math.sin(time * 2) * 0.1 + 1;
      meshRef.current.scale.setScalar(size * (isSelected ? 1.3 : isActive || hovered ? 1.1 : 1) * pulse);
      
      // Subtle floating movement
      if (node.type !== 'core') {
        meshRef.current.position.z = position[2] + Math.sin(time + position[0] * 10) * 0.2;
      }
      
      // Rotation for core node
      if (node.type === 'core') {
        meshRef.current.rotation.y = time * 0.2;
        meshRef.current.rotation.x = Math.sin(time * 0.5) * 0.1;
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={onClick}
      onPointerOver={() => {
        setHovered(true);
        onHover(true);
      }}
      onPointerOut={() => {
        setHovered(false);
        onHover(false);
      }}
    >
      {/* Core node gets special geometry */}
      {node.type === 'core' ? (
        <>
          <icosahedronGeometry args={[size, 2]} />
          <meshStandardMaterial
            color="#00FFFF"
            emissive="#00FFFF"
            emissiveIntensity={isSelected ? 0.8 : isActive ? 0.5 : 0.2}
            transparent
            opacity={0.8}
            roughness={0.1}
            metalness={0.9}
          />
          {/* Photo placeholder for core node */}
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[size * 0.9, 32, 16]} />
            <meshStandardMaterial
              color="#ffffff"
              transparent
              opacity={0.1}
              map={null} // Photo will be added here
            />
          </mesh>
          {/* Holographic ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[size * 1.2, size * 1.4, 32]} />
            <meshBasicMaterial
              color="#00FFFF"
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
        </>
      ) : (
        <>
          <sphereGeometry args={[size, 16, 16]} />
          <meshStandardMaterial
            color={node.type === 'primary' ? "#FF00FF" : "#9AF5FF"}
            emissive={node.type === 'primary' ? "#FF00FF" : "#9AF5FF"}
            emissiveIntensity={isSelected ? 0.6 : isActive ? 0.4 : 0.1}
            transparent
            opacity={0.7}
            roughness={0.3}
            metalness={0.7}
          />
        </>
      )}
      
      {/* Energy field when active */}
      {(isActive || isSelected) && (
        <mesh>
          <sphereGeometry args={[size * 1.5, 16, 16]} />
          <meshBasicMaterial
            color="#00FFFF"
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </mesh>
  );
};

// Neural Pathway Component
const NeuralPathway: React.FC<{
  fromPos: [number, number, number];
  toPos: [number, number, number];
  isActive: boolean;
  animated: boolean;
}> = ({ fromPos, toPos, isActive, animated }) => {
  const curve = useMemo(() => {
    const start = new THREE.Vector3(...fromPos);
    const end = new THREE.Vector3(...toPos);
    const distance = start.distanceTo(end);
    
    // Create curved pathway using quadratic bezier
    const midPoint = start.clone().lerp(end, 0.5);
    midPoint.y += distance * 0.3; // Curve upward
    
    return new THREE.QuadraticBezierCurve3(start, midPoint, end);
  }, [fromPos, toPos]);

  const points = useMemo(() => curve.getPoints(50), [curve]);
  
  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color={isActive ? "#00FFFF" : "#666666"}
        transparent
        opacity={isActive ? 0.8 : 0.3}
      />
    </line>
  );
};

// Camera Controller for cinematic transitions
const CameraController: React.FC<{
  selectedNode: ConsciousnessNode | null;
  nodePositions: Map<string, [number, number, number]>;
}> = ({ selectedNode, nodePositions }) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>();

  useEffect(() => {
    if (selectedNode && nodePositions.has(selectedNode.id)) {
      const targetPos = nodePositions.get(selectedNode.id)!;
      const cameraTarget = new THREE.Vector3(targetPos[0], targetPos[1], targetPos[2] + 3);
      
      // Cinematic fly-through animation
      const startPos = camera.position.clone();
      const duration = 1500;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        
        camera.position.lerpVectors(startPos, cameraTarget, eased);
        camera.lookAt(targetPos[0], targetPos[1], targetPos[2]);
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      animate();
    } else {
      // Return to overview
      const overviewPos = new THREE.Vector3(0, 0, 10);
      camera.position.lerp(overviewPos, 0.1);
      camera.lookAt(0, 0, 0);
    }
  }, [selectedNode, nodePositions, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      maxDistance={20}
      minDistance={2}
    />
  );
};

// Particle Effects for Ambient Atmosphere
const AmbientParticles: React.FC = () => {
  const particlesRef = useRef<THREE.Points>(null);
  
  const particleCount = 200;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.01;
      particlesRef.current.rotation.x = state.clock.getElapsedTime() * 0.005;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#00FFFF"
        size={0.02}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

// Main 3D Scene Component
const Scene3D: React.FC<NeuralUniverseProps> = ({ onNodeSelect, selectedNode }) => {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  
  const nodePositions = useMemo(() => {
    const positions = new Map<string, [number, number, number]>();
    neuralNodes.forEach(node => {
      positions.set(node.id, convert2DTo3D(node.position, node.type));
    });
    return positions;
  }, []);

  const handleNodeClick = (node: ConsciousnessNode) => {
    onNodeSelect(selectedNode?.id === node.id ? null : node);
  };

  const isNodeActive = (node: ConsciousnessNode) => {
    if (!selectedNode && !hoveredNode) return false;
    const activeNodeId = selectedNode?.id || hoveredNode;
    if (node.id === activeNodeId) return true;
    
    return neuralPathways.some(pathway => 
      (pathway.from === activeNodeId && pathway.to === node.id) ||
      (pathway.to === activeNodeId && pathway.from === node.id)
    );
  };

  const isPathwayActive = (pathway: typeof neuralPathways[0]) => {
    if (!selectedNode && !hoveredNode) return false;
    const activeNodeId = selectedNode?.id || hoveredNode;
    return pathway.from === activeNodeId || pathway.to === activeNodeId;
  };

  return (
    <>
      <CameraController selectedNode={selectedNode} nodePositions={nodePositions} />
      
      {/* Cosmic Environment */}
      <Environment preset="night" />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#00FFFF" />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#FF00FF" />
      
      {/* Ambient Particles */}
      <AmbientParticles />
      
      {/* Neural Nodes */}
      {neuralNodes.map((node) => {
        const position = nodePositions.get(node.id)!;
        return (
          <NeuralNode
            key={node.id}
            node={node}
            position={position}
            isSelected={selectedNode?.id === node.id}
            isActive={isNodeActive(node)}
            onClick={() => handleNodeClick(node)}
            onHover={(hovered) => setHoveredNode(hovered ? node.id : null)}
          />
        );
      })}
      
      {/* Neural Pathways */}
      {neuralPathways.map((pathway) => {
        const fromNode = neuralNodes.find(n => n.id === pathway.from);
        const toNode = neuralNodes.find(n => n.id === pathway.to);
        
        if (!fromNode || !toNode) return null;
        
        const fromPos = nodePositions.get(fromNode.id)!;
        const toPos = nodePositions.get(toNode.id)!;
        
        return (
          <NeuralPathway
            key={pathway.id}
            fromPos={fromPos}
            toPos={toPos}
            isActive={isPathwayActive(pathway)}
            animated={pathway.animated}
          />
        );
      })}
    </>
  );
};

// Main Component with UI Overlay
const NeuralUniverse: React.FC<NeuralUniverseProps> = ({ onNodeSelect, selectedNode }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Initialize consciousness
    const timer = setTimeout(() => setIsLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene3D onNodeSelect={onNodeSelect} selectedNode={selectedNode} />
      </Canvas>
      
      {/* UI Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        className="absolute inset-0 pointer-events-none"
      >
        {/* Navigation Instructions */}
        <div className="absolute bottom-4 left-4 text-consciousness-whisper text-xs md:text-sm font-neural pointer-events-auto">
          <div className="thought-bubble px-4 py-2 space-y-1">
            <div>🖱️ Drag: Orbit • 🖱️ Wheel: Zoom • 👆 Click: Enter Thought</div>
            <div className="text-cosmic">Neural Interface Online</div>
          </div>
        </div>
        
        {/* Consciousness Indicator */}
        <div className="absolute top-4 right-4 pointer-events-auto">
          <div className="thought-bubble px-4 py-2 flex items-center gap-3">
            <div className="w-3 h-3 bg-cosmic rounded-full animate-consciousness-pulse" />
            <span className="text-consciousness-primary font-neural text-sm">
              3D Neural Matrix Active
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NeuralUniverse;