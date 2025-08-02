import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NeuralUniverse from '@/components/3d/NeuralUniverse';
import ConsciousnessPanel from '@/components/ConsciousnessPanel';
import ConsciousnessIntro from '@/components/ConsciousnessIntro';
import { type ConsciousnessNode } from '@/data/consciousness';

const Index = () => {
  const [selectedNode, setSelectedNode] = useState<ConsciousnessNode | null>(null);
  const [isIntroComplete, setIsIntroComplete] = useState(false);
  const [matrixMode, setMatrixMode] = useState(false);

  const handleIntroComplete = () => {
    setIsIntroComplete(true);
  };

  const handleNodeSelect = (node: ConsciousnessNode | null) => {
    setSelectedNode(node);
  };

  const handleClosePanel = () => {
    setSelectedNode(null);
  };

  const toggleMatrixMode = () => {
    setMatrixMode(!matrixMode);
  };

  return (
    <>
      {/* Consciousness Initialization */}
      {!isIntroComplete && (
        <ConsciousnessIntro onComplete={handleIntroComplete} />
      )}

      {/* Main Neural Interface */}
      <AnimatePresence>
        {isIntroComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-void relative overflow-hidden"
          >
            {/* Cosmic Background Gradient */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute inset-0 bg-gradient-neural" />
              <motion.div 
                className="absolute top-1/4 left-1/4 w-96 h-96 bg-cosmic-whisper rounded-full blur-3xl opacity-20"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div 
                className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-cosmic-whisper rounded-full blur-3xl opacity-15"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.15, 0.3, 0.15]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
              />
            </div>

            {/* Matrix Rain Background (toggleable) */}
            {matrixMode && (
              <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden">
                {Array.from({ length: 50 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute text-cosmic font-neural text-xs"
                    initial={{ 
                      y: -100, 
                      x: (i % 10) * (window.innerWidth / 10) + Math.random() * 100 
                    }}
                    animate={{ 
                      y: window.innerHeight + 100,
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 4 + Math.random() * 3,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                      ease: "linear"
                    }}
                  >
                    {Array.from({ length: 20 }).map(() => 
                      String.fromCharCode(0x30A0 + Math.random() * 96)
                    ).join('')}
                  </motion.div>
                ))}
              </div>
            )}

            {/* 3D Neural Universe */}
            <div className="relative z-10 h-screen">
              <NeuralUniverse onNodeSelect={setSelectedNode} selectedNode={selectedNode} />
            </div>

            {/* Consciousness Panel */}
            <ConsciousnessPanel node={selectedNode} onClose={() => setSelectedNode(null)} />

            {/* Control Panel */}
            <div className="absolute bottom-4 md:bottom-6 right-4 md:right-6 z-20">
              <div className="flex flex-col gap-3">
                {/* Matrix Mode Toggle */}
                <motion.button
                  onClick={toggleMatrixMode}
                  className={`thought-bubble px-4 py-2 text-xs font-neural transition-all ${
                    matrixMode ? 'text-cosmic border-cosmic' : 'text-consciousness-whisper'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      matrixMode ? 'bg-cosmic animate-consciousness-pulse' : 'bg-consciousness-whisper'
                    }`} />
                    Matrix Mode
                  </div>
                </motion.button>
              </div>
            </div>

            {/* Brand Signature */}
            <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 z-20">
              <motion.div 
                className="flex items-center gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <div className="w-2 h-2 bg-cosmic rounded-full animate-consciousness-pulse" />
                <span className="text-consciousness-whisper font-neural text-xs md:text-sm">
                  3D Neural Portfolio by <span className="text-cosmic">Bhuwan Singh</span>
                </span>
              </motion.div>
            </div>

            {/* Voice Control Indicator (Future Feature) */}
            <div className="absolute top-4 md:top-6 left-4 md:left-6 z-20">
              <motion.div 
                className="flex items-center gap-3 thought-bubble px-3 md:px-4 py-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="w-2 h-2 md:w-3 md:h-3 bg-cosmic rounded-full animate-consciousness-pulse" />
                <span className="text-consciousness-primary font-neural text-xs md:text-sm">
                  3D Neural Matrix Online
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Index;
