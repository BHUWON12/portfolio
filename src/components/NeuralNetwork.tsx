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

interface ViewTransform {
  x: number;
  y: number;
  scale: number;
}

const NeuralNetwork: React.FC<NeuralNetworkProps> = ({ onNodeSelect, selectedNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [viewTransform, setViewTransform] = useState<ViewTransform>({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Convert node position to screen coordinates with proper scaling
  const getScreenPosition = useCallback((nodePos: Position) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    
    const centerX = containerRef.current.clientWidth / 2;
    const centerY = containerRef.current.clientHeight / 2;
    
    return {
      x: centerX + (nodePos.x + viewTransform.x) * viewTransform.scale,
      y: centerY + (nodePos.y + viewTransform.y) * viewTransform.scale,
    };
  }, [viewTransform]);

  // Get node radius for proper line connection points
  const getNodeRadius = useCallback((type: string) => {
    const baseSize = isMobile ? 0.7 : 1;
    switch (type) {
      case 'core': return (120 * baseSize) / 2;
      case 'primary': return (90 * baseSize) / 2;
      case 'secondary': return (70 * baseSize) / 2;
      default: return (70 * baseSize) / 2;
    }
  }, [isMobile]);

  // Calculate connection points on node edges
  const getConnectionPoint = useCallback((fromPos: Position, toPos: Position, nodeRadius: number) => {
    const dx = toPos.x - fromPos.x;
    const dy = toPos.y - fromPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance === 0) return fromPos;
    
    const unitX = dx / distance;
    const unitY = dy / distance;
    
    return {
      x: fromPos.x + unitX * nodeRadius * viewTransform.scale,
      y: fromPos.y + unitY * nodeRadius * viewTransform.scale,
    };
  }, [viewTransform.scale]);

  // Create smooth bezier curve
  const createSmoothPath = useCallback((start: Position, end: Position) => {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Dynamic control point calculation for smoother curves
    const curvature = Math.min(distance * 0.4, 200 * viewTransform.scale);
    
    // Create perpendicular offset for natural curve
    const perpX = -dy / distance;
    const perpY = dx / distance;
    
    // Control points for smooth bezier curve
    const cp1x = start.x + dx * 0.3 + perpX * curvature * 0.3;
    const cp1y = start.y + dy * 0.3 + perpY * curvature * 0.3;
    const cp2x = end.x - dx * 0.3 + perpX * curvature * 0.3;
    const cp2y = end.y - dy * 0.3 + perpY * curvature * 0.3;
    
    return `M ${start.x.toFixed(2)} ${start.y.toFixed(2)} C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${end.x.toFixed(2)} ${end.y.toFixed(2)}`;
  }, [viewTransform.scale]);

  // Handle mouse interactions
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - viewTransform.x, y: e.clientY - viewTransform.y });
    }
  }, [viewTransform]);

  // Handle touch interactions for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.target === e.currentTarget && e.touches.length === 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX - viewTransform.x, y: touch.clientY - viewTransform.y });
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

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isDragging && e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      setViewTransform(prev => ({
        ...prev,
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      }));
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    setViewTransform(prev => ({
      ...prev,
      scale: Math.max(0.2, Math.min(3, prev.scale * zoomFactor)),
    }));
  }, []);

  // Auto-center and responsive scaling
  useEffect(() => {
    const centerView = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const baseScale = isMobile ? 0.4 : 0.8;
        setViewTransform({
          x: 0,
          y: 0,
          scale: Math.min(baseScale, rect.width / 1200, rect.height / 800),
        });
      }
    };

    centerView();
    window.addEventListener('resize', centerView);
    return () => window.removeEventListener('resize', centerView);
  }, [isMobile]);

  // Node click handler
  const handleNodeClick = useCallback((node: ConsciousnessNode) => {
    onNodeSelect(selectedNode?.id === node.id ? null : node);
  }, [onNodeSelect, selectedNode]);

  // Get node size based on type and screen size
  const getNodeSize = (type: string) => {
    const baseSize = isMobile ? 0.7 : 1;
    switch (type) {
      case 'core': return Math.round(120 * baseSize);
      case 'primary': return Math.round(90 * baseSize);
      case 'secondary': return Math.round(70 * baseSize);
      default: return Math.round(70 * baseSize);
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
      className="relative w-full h-full overflow-hidden cursor-grab select-none touch-pan-x touch-pan-y"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Flowing Data Streams Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="data-stream" />
        <div className="data-stream" style={{ animationDelay: '1s', transform: 'rotate(45deg)' }} />
        <div className="data-stream" style={{ animationDelay: '2s', transform: 'rotate(-45deg)' }} />
      </div>

      {/* Neural Pathways */}
      <svg 
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
        viewBox={`0 0 ${containerRef.current?.clientWidth || 800} ${containerRef.current?.clientHeight || 600}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {neuralPathways.map((pathway) => {
          const fromNode = neuralNodes.find(n => n.id === pathway.from);
          const toNode = neuralNodes.find(n => n.id === pathway.to);
          
          if (!fromNode || !toNode) return null;
          
          const fromPos = getScreenPosition(fromNode.position);
          const toPos = getScreenPosition(toNode.position);
          
          // Calculate connection points on node edges
          const fromRadius = getNodeRadius(fromNode.type);
          const toRadius = getNodeRadius(toNode.type);
          
          const fromConnection = getConnectionPoint(fromPos, toPos, fromRadius);
          const toConnection = getConnectionPoint(toPos, fromPos, toRadius);
          
          const pathData = createSmoothPath(fromConnection, toConnection);
          const isActive = isPathwayActive(pathway);
          
          return (
            <g key={pathway.id}>
              {/* Pathway glow effect */}
              {isActive && (
                <path
                  d={pathData}
                  stroke="hsl(var(--cosmic))"
                  strokeWidth={6}
                  opacity={0.3}
                  fill="none"
                  filter="url(#glow)"
                  strokeLinecap="round"
                />
              )}
              
              {/* Main pathway */}
              <path
                d={pathData}
                stroke={isActive ? "hsl(var(--cosmic))" : "hsl(var(--neural))"}
                strokeWidth={isActive ? 3 : 1.5}
                opacity={isActive ? 1 : 0.4}
                fill="none"
                strokeDasharray={pathway.animated ? "12 6" : "none"}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={pathway.animated ? "animate-neural-flow" : ""}
                style={{
                  strokeDashoffset: pathway.animated ? '0' : undefined,
                  transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                  filter: isActive ? 'drop-shadow(0 0 4px hsl(var(--cosmic) / 0.3))' : 'none',
                }}
              />
              
              {/* Data flow particles for active pathways */}
              {isActive && pathway.animated && (() => {
                return (
                  <>
                    <circle
                      r="3"
                      fill="hsl(var(--cosmic))"
                      opacity={0.9}
                      className="animate-consciousness-pulse"
                    >
                      <animateMotion
                        dur="3s"
                        repeatCount="indefinite"
                        path={pathData}
                      />
                    </circle>
                    <circle
                      r="2"
                      fill="hsl(var(--cosmic-glow))"
                      opacity={0.6}
                    >
                      <animateMotion
                        dur="2.5s"
                        repeatCount="indefinite"
                        path={pathData}
                        begin="0.5s"
                      />
                    </circle>
                  </>
                );
              })()}
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
              
              {/* Node content with better text handling */}
              <div className="relative z-10 text-center p-2 w-full h-full flex items-center justify-center">
                <div className={`font-consciousness font-medium leading-tight ${
                  node.type === 'core' 
                    ? `${isMobile ? 'text-sm' : 'text-base'} text-consciousness-primary` 
                    : node.type === 'primary'
                    ? `${isMobile ? 'text-xs' : 'text-sm'} text-consciousness-secondary`
                    : `text-xs text-consciousness-whisper`
                }`}>
                  {node.type === 'core' ? (
                    <div className="space-y-1">
                      <div className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold`}>Bhuwan</div>
                      <div className={`${isMobile ? 'text-xs' : 'text-sm'} opacity-80`}>Singh</div>
                    </div>
                  ) : (
                    <div className="leading-tight space-y-0.5">
                      {node.title.split(' ').map((word, i) => (
                        <div key={i} className="block">{word}</div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Active node energy field */}
              {isActive && (
                <div className="absolute inset-0 rounded-full border border-cosmic-glow animate-neural-pulse" />
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
      <div className="absolute bottom-4 left-4 text-consciousness-whisper text-xs md:text-sm font-neural">
        <div className="flex flex-col gap-1">
          <div>{isMobile ? 'Touch: Navigate' : 'Mouse: Navigate • Wheel: Zoom'}</div>
          <div>Tap: Explore Node</div>
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