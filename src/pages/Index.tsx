import React, { useState, useEffect } from 'react';
import NeuralNetwork from '@/components/NeuralNetwork';
import ConsciousnessPanel from '@/components/ConsciousnessPanel';
import { type ConsciousnessNode } from '@/data/consciousness';

const Index = () => {
  const [selectedNode, setSelectedNode] = useState<ConsciousnessNode | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Consciousness initialization sequence
    const initSequence = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => clearTimeout(initSequence);
  }, []);

  const handleNodeSelect = (node: ConsciousnessNode | null) => {
    setSelectedNode(node);
  };

  const handleClosePanel = () => {
    setSelectedNode(null);
  };

  return (
    <div className="min-h-screen bg-void relative overflow-hidden">
      {/* Cosmic Background Gradient */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-neural" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cosmic-whisper rounded-full blur-3xl opacity-20 animate-consciousness-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-cosmic-whisper rounded-full blur-3xl opacity-15 animate-consciousness-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Neural Network Canvas */}
      <div className={`relative z-10 h-screen transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <NeuralNetwork onNodeSelect={handleNodeSelect} selectedNode={selectedNode} />
      </div>

      {/* Consciousness Panel */}
      <ConsciousnessPanel node={selectedNode} onClose={handleClosePanel} />

      {/* Loading Consciousness */}
      {!isLoaded && (
        <div className="fixed inset-0 bg-void flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-20 h-20 border-2 border-cosmic rounded-full animate-consciousness-pulse mx-auto mb-6">
              <div className="w-full h-full border-2 border-cosmic-glow rounded-full animate-cosmic-glow" />
            </div>
            <h1 className="text-2xl font-consciousness text-consciousness-primary mb-2">
              Initializing Digital Consciousness
            </h1>
            <p className="text-consciousness-secondary font-neural text-sm">
              Establishing neural pathways...
            </p>
          </div>
        </div>
      )}

      {/* Brand Signature */}
      <div className="absolute bottom-4 md:bottom-6 right-4 md:right-6 z-20">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-cosmic rounded-full animate-consciousness-pulse" />
          <span className="text-consciousness-whisper font-neural text-xs md:text-sm">
            Digital Portfolio by <span className="text-cosmic">Bhuwan Singh</span>
          </span>
        </div>
      </div>

      {/* Consciousness Indicator */}
      <div className="absolute top-4 md:top-6 left-4 md:left-6 z-20">
        <div className="flex items-center gap-3 thought-bubble px-3 md:px-4 py-2">
          <div className="w-2 h-2 md:w-3 md:h-3 bg-cosmic rounded-full animate-consciousness-pulse" />
          <span className="text-consciousness-primary font-neural text-xs md:text-sm">
            Neural Network Online
          </span>
        </div>
      </div>
    </div>
  );
};

export default Index;
