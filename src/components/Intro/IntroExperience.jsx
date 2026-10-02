import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Sparkles, ArrowUp } from 'lucide-react';
import HeartTree from './HeartTree';

export default function IntroExperience({ 
  onComplete, 
  messageText = "Some moments are meant to be remembered forever.", 
  buttonText = "Let's make a little magic" 
}) {
  // Phases: 'heart' -> 'burst' -> 'tree' (tree draws and grows leaves) -> 'falling' -> 'message' -> 'done'
  const [phase, setPhase] = useState('heart');

  return (
    <div className="fixed inset-0 bg-red-700 text-white overflow-hidden z-50 flex items-center justify-center bg-noise">
      <AnimatePresence mode="wait">
        {(phase === 'heart' || phase === 'burst') && (
          <HeartDragScene key="heart-scene" phase={phase} onTrigger={() => setPhase('burst')} onBurstComplete={() => setPhase('tree')} />
        )}

        {(phase === 'tree' || phase === 'falling' || phase === 'message') && (
          <motion.div 
            key="tree-scene" 
            className="w-full h-full flex flex-col items-center justify-center relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="w-full max-w-md h-[65vh] flex items-end justify-center px-4">
              <HeartTree phase={phase === 'tree' ? 'growing' : phase} onAnimationComplete={setPhase} />
            </div>

            <div className="h-[25vh] w-full flex flex-col items-center justify-start pt-8 relative z-30">
              <AnimatePresence>
                {phase === 'message' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.5 }}
                    className="text-center px-6"
                  >
                    <p className="text-xl md:text-2xl font-medium text-white italic mb-4">
                      "{messageText}"
                    </p>
                    <div className="text-2xl mb-8">❤️</div>

                    <motion.button 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1, duration: 0.5 }}
                      onClick={onComplete}
                      className="bg-white/50 backdrop-blur-md border border-peach/50 text-deep-burgundy px-8 py-4 rounded-full font-bold inline-flex items-center gap-2 shadow-lg shadow-peach/20 hover:scale-105 transition-transform"
                    >
                      {buttonText} <Sparkles size={18} className="text-gold" />
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function HeartDragScene({ phase, onTrigger, onBurstComplete }) {
  const isBursting = phase === 'burst';

  useEffect(() => {
    if (isBursting) {
      const t = setTimeout(() => {
        onBurstComplete();
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [isBursting, onBurstComplete]);

  return (
    <motion.div 
      className="flex flex-col items-center justify-center h-full w-full relative"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Target Heart */}
      <motion.div 
        className="relative z-10 text-[120px] mb-32 drop-shadow-2xl"
        animate={isBursting ? { scale: [1, 2, 5, 0], opacity: [1, 1, 0] } : { scale: [1, 1.05, 1] }}
        transition={isBursting ? { duration: 1 } : { repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        ❤️
        {/* Glow */}
        <div className="absolute inset-0 bg-red-400 rounded-full blur-3xl opacity-20 -z-10 animate-pulse"></div>
      </motion.div>

      {/* Draggable Arrow Indicator */}
      {!isBursting && (
        <div className="absolute bottom-20 flex flex-col items-center">
          <p className="text-red-200 text-sm tracking-widest uppercase mb-4 opacity-70">Pull the arrow</p>
          
          {/* Drag constraints area */}
          <div className="h-48 w-16 relative flex justify-center items-end">
            {/* The Track line */}
            <div className="absolute top-0 bottom-8 w-px bg-white/30 border-dashed border-l border-white/50"></div>
            
            <motion.div
              drag="y"
              dragConstraints={{ top: -140, bottom: 0 }}
              dragElastic={0.1}
              onDrag={(e, info) => {
                if (info.offset.y < -100) {
                  onTrigger();
                }
              }}
              whileDrag={{ scale: 1.1 }}
              className="w-12 h-12 bg-white rounded-full shadow-lg border border-red-300 flex items-center justify-center cursor-grab active:cursor-grabbing z-20"
            >
              <ArrowUp className="text-red-700" />
            </motion.div>
          </div>
        </div>
      )}

      {/* Burst Particles */}
      {isBursting && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-xl"
              initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
              animate={{
                scale: Math.random() * 2 + 1,
                x: (Math.random() - 0.5) * 400,
                y: (Math.random() - 0.5) * 400,
                opacity: 0,
                rotate: Math.random() * 360
              }}
              transition={{ duration: 1 + Math.random() * 0.5, ease: "easeOut" }}
            >
              ❤️
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
