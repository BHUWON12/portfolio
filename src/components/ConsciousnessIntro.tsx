import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConsciousnessIntroProps {
  onComplete: () => void;
}

const ConsciousnessIntro: React.FC<ConsciousnessIntroProps> = ({ onComplete }) => {
  const [stage, setStage] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const stages = [
    "Initializing Digital Consciousness...",
    "Establishing Neural Pathways...",
    "Calibrating Quantum Interfaces...",
    "Activating Synaptic Networks...",
    "Consciousness Online"
  ];

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    // Progress through stages
    stages.forEach((_, index) => {
      timers.push(
        setTimeout(() => {
          setStage(index);
          if (index === stages.length - 1) {
            setTimeout(() => {
              setIsComplete(true);
              setTimeout(onComplete, 1000);
            }, 1500);
          }
        }, index * 1000)
      );
    });

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit={{ opacity: 0, scale: 1.1, transition: { duration: 1 } }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-void"
        >
          {/* Cosmic Background */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-gradient-neural" />
            <motion.div 
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-cosmic-whisper rounded-full blur-3xl opacity-20"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{
                duration: 4,
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
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
          </div>

          <div className="text-center relative z-10">
            <motion.div variants={itemVariants} className="mb-8">
              {/* Central Neural Core */}
              <div className="relative w-32 h-32 mx-auto mb-6">
                {/* Outer Ring */}
                <motion.div 
                  className="absolute inset-0 border-2 border-cosmic rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Middle Ring */}
                <motion.div 
                  className="absolute inset-4 border border-cosmic-glow rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />
                
                {/* Core */}
                <motion.div 
                  className="absolute inset-8 bg-cosmic rounded-full"
                  animate={{
                    boxShadow: [
                      '0 0 20px hsl(var(--cosmic) / 0.3)',
                      '0 0 40px hsl(var(--cosmic) / 0.6)',
                      '0 0 20px hsl(var(--cosmic) / 0.3)'
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Orbital Elements */}
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-cosmic-glow rounded-full"
                    animate={{
                      rotate: 360,
                      scale: [1, 1.5, 1]
                    }}
                    transition={{
                      rotate: {
                        duration: 3 + i,
                        repeat: Infinity,
                        ease: "linear"
                      },
                      scale: {
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.5
                      }
                    }}
                    style={{
                      left: '50%',
                      top: '50%',
                      transformOrigin: `${20 + i * 15}px 0px`,
                      marginLeft: '-4px',
                      marginTop: '-4px'
                    }}
                  />
                ))}
              </div>
            </motion.div>

            <motion.h1 
              variants={itemVariants}
              className="text-3xl md:text-4xl font-consciousness text-consciousness-primary mb-4"
              style={{
                textShadow: '0 0 8px hsl(var(--cosmic) / 0.6), 0 0 16px hsl(var(--cosmic) / 0.3)'
              }}
            >
              Bhuwan Singh
            </motion.h1>

            <motion.p 
              variants={itemVariants}
              className="text-consciousness-secondary font-neural text-lg mb-8"
            >
              Backend Architect • Digital Consciousness Pioneer
            </motion.p>

            {/* Status Messages */}
            <motion.div variants={itemVariants} className="space-y-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={stage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="text-cosmic font-neural text-sm"
                >
                  {stages[stage]}
                </motion.div>
              </AnimatePresence>
              
              {/* Progress Indicators */}
              <div className="flex justify-center gap-2 mt-4">
                {stages.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-500 ${
                      index <= stage ? 'bg-cosmic' : 'bg-cosmic-whisper'
                    }`}
                    animate={index === stage ? {
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 1, 0.5]
                    } : {}}
                    transition={{
                      duration: 1,
                      repeat: index === stage ? Infinity : 0,
                      ease: "easeInOut"
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Matrix Rain Effect */}
            <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
              {Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-cosmic font-neural text-xs"
                  initial={{ y: -100, x: Math.random() * window.innerWidth }}
                  animate={{ 
                    y: window.innerHeight + 100,
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                    ease: "linear"
                  }}
                >
                  {Math.random().toString(36).substring(7)}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConsciousnessIntro;