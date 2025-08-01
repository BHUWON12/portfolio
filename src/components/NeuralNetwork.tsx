import React, { useEffect, useRef, useState, useCallback } from 'react';
import { neuralNodes, neuralPathways, type ConsciousnessNode } from '@/data/consciousness';

interface NeuralNetworkProps {
  onNodeSelect: (node: ConsciousnessNode | null) => void;
  selectedNode: ConsciousnessNode | null;
}

interface Position {
  x: number;
  y: number;
}

const NeuralNetwork: React.FC<NeuralNetworkProps> = ({ onNodeSelect, selectedNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewTransform, setViewTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Convert node position to screen coordinates
  const getScreenPosition = useCallback((nodePos: Position) => {
    const centerX = (containerRef.current?.clientWidth || 0) / 2;
    const centerY = (containerRef.current?.clientHeight || 0) / 2;
    
    return {
      x: centerX + (nodePos.x * viewTransform.scale) + viewTransform.x,
      y: centerY + (nodePos.y * viewTransform.scale) + viewTransform.y,
    };
  }, [viewTransform]);

  // Handle mouse interactions
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - viewTransform.x, y: e.clientY - viewTransform.y });
    }
  }, [viewTransform]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setViewTransform(prev => ({
        ...prev,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      }));
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    setViewTransform(prev => ({
      ...prev,
      scale: Math.max(0.3, Math.min(2, prev.scale * zoomFactor)),
    }));
  }, []);

  // Auto-center on mount
  useEffect(() => {
    const centerView = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setViewTransform({
          x: 0,
          y: 0,
          scale: Math.min(1, rect.width / 1200, rect.height / 800),
        });
      }
    };

    centerView();
    window.addEventListener('resize', centerView);
    return () => window.removeEventListener('resize', centerView);
  }, []);

  // Node click handler
  const handleNodeClick = useCallback((node: ConsciousnessNode) => {
    onNodeSelect(selectedNode?.id === node.id ? null : node);
  }, [onNodeSelect, selectedNode]);

  // Get node size based on type
  const getNodeSize = (type: string) => {
    switch (type) {
      case 'core': return 120;
      case 'primary': return 80;
      case 'secondary': return 60;
      default: return 60;
    }
  };

  // Check if pathway should be highlighted
  const isPathwayActive = (pathway: typeof neuralPathways[0]) => {
    if (!selectedNode && !hoveredNode) return false;
    const activeNodeId = selectedNode?.id || hoveredNode;
    return pathway.from === activeNodeId || pathway.to === activeNodeId;
  };

  // Check if node should be highlighted
  const isNodeActive = (node: ConsciousnessNode) => {
    if (!selectedNode && !hoveredNode) return false;
    const activeNodeId = selectedNode?.id || hoveredNode;
    if (node.id === activeNodeId) return true;
    
    // Check if connected to active node
    return neuralPathways.some(pathway => 
      (pathway.from === activeNodeId && pathway.to === node.id) ||
      (pathway.to === activeNodeId && pathway.from === node.id)
    );
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden cursor-grab select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Neural Pathways */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
      >
        {neuralPathways.map((pathway) => {
          const fromNode = neuralNodes.find(n => n.id === pathway.from);
          const toNode = neuralNodes.find(n => n.id === pathway.to);
          
          if (!fromNode || !toNode) return null;
          
          const fromPos = getScreenPosition(fromNode.position);
          const toPos = getScreenPosition(toNode.position);
          const isActive = isPathwayActive(pathway);
          
          return (
            <g key={pathway.id}>
              {/* Pathway glow effect */}
              {isActive && (
                <line
                  x1={fromPos.x}
                  y1={fromPos.y}
                  x2={toPos.x}
                  y2={toPos.y}
                  stroke="hsl(var(--cosmic))"
                  strokeWidth={6}
                  opacity={0.3}
                  filter="blur(2px)"
                />
              )}
              
              {/* Main pathway */}
              <line
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                stroke={isActive ? "hsl(var(--cosmic))" : "hsl(var(--neural))"}
                strokeWidth={isActive ? 3 : 1}
                opacity={isActive ? 1 : 0.4}
                strokeDasharray={pathway.animated ? "8 4" : "none"}
                className={pathway.animated ? "animate-neural-flow" : ""}
                style={{
                  strokeDashoffset: pathway.animated ? '0' : undefined,
                  transition: 'all 0.3s ease',
                }}
              />
              
              {/* Data flow particles for active pathways */}
              {isActive && pathway.animated && (
                <circle
                  r="3"
                  fill="hsl(var(--cosmic))"
                  opacity={0.8}
                  className="animate-consciousness-pulse"
                >
                  <animateMotion
                    dur="2s"
                    repeatCount="indefinite"
                    path={`M ${fromPos.x} ${fromPos.y} L ${toPos.x} ${toPos.y}`}
                  />
                </circle>
              )}
            </g>
          );
        })}
      </svg>

      {/* Neural Nodes */}
      {neuralNodes.map((node) => {
        const position = getScreenPosition(node.position);
        const size = getNodeSize(node.type);
        const isActive = isNodeActive(node);
        const isSelected = selectedNode?.id === node.id;
        
        return (
          <div
            key={node.id}
            className={`absolute consciousness-node cursor-pointer transition-all duration-300 ${
              isActive ? 'active' : ''
            } ${isSelected ? 'scale-110' : 'hover:scale-105'}`}
            style={{
              left: position.x - size / 2,
              top: position.y - size / 2,
              width: size,
              height: size,
              zIndex: isSelected ? 10 : node.type === 'core' ? 5 : 3,
            }}
            onClick={() => handleNodeClick(node)}
            onMouseEnter={() => setHoveredNode(node.id)}
            onMouseLeave={() => setHoveredNode(null)}
          >
            {/* Node Core */}
            <div 
              className={`w-full h-full rounded-full flex items-center justify-center relative overflow-hidden ${
                node.type === 'core' ? 'animate-consciousness-pulse' : ''
              }`}
            >
              {/* Holographic background effect */}
              <div className="absolute inset-0 holographic-surface rounded-full" />
              
              {/* Pulsing energy ring for core */}
              {node.type === 'core' && (
                <div className="absolute inset-0 rounded-full border-2 border-cosmic animate-cosmic-glow" />
              )}
              
              {/* Node content */}
              <div className="relative z-10 text-center p-2">
                <div className={`font-consciousness font-medium ${
                  node.type === 'core' 
                    ? 'text-base text-consciousness-primary' 
                    : node.type === 'primary'
                    ? 'text-sm text-consciousness-secondary'
                    : 'text-xs text-consciousness-whisper'
                }`}>
                  {node.type === 'core' ? (
                    <>
                      <div className="text-lg font-semibold">Bhuwan</div>
                      <div className="text-sm opacity-80">Singh</div>
                    </>
                  ) : (
                    <div className="leading-tight">
                      {node.title.split(' ').map((word, i) => (
                        <div key={i}>{word}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Active node energy field */}
              {isActive && (
                <div className="absolute inset-0 rounded-full border border-cosmic-glow animate-synaptic-fire" />
              )}
            </div>
            
            {/* Node label on hover */}
            {hoveredNode === node.id && (
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 thought-bubble animate-thought-materialize pointer-events-none">
                <div className="text-xs font-neural text-consciousness-primary whitespace-nowrap">
                  {node.title}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Navigation hint */}
      <div className="absolute bottom-4 left-4 text-consciousness-whisper text-sm font-neural">
        <div className="flex flex-col gap-1">
          <div>Mouse: Navigate • Wheel: Zoom</div>
          <div>Click: Explore Consciousness</div>
        </div>
      </div>

      {/* Scale indicator */}
      <div className="absolute top-4 right-4 text-consciousness-whisper text-xs font-neural">
        Scale: {Math.round(viewTransform.scale * 100)}%
      </div>
    </div>
  );
};

export default NeuralNetwork;