import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import HeartTree from './HeartTree';
import './IntroOverlay.css';

export default function IntroExperience({ 
  onComplete, 
}) {
  const [phase, setPhase] = useState('heart');

  useEffect(() => {
    if (phase === 'burst') {
      const audio = new Audio('/tenu-sang-rakhna.mp3');
      audio.volume = 0.6; // slightly lower volume so it's pleasant
      audio.play().catch(err => console.log("Audio playback failed (usually requires user interaction first):", err));
    }
  }, [phase]);

  return (
    <div className="fixed inset-0 overflow-hidden z-50 flex items-center justify-center bg-gradient-to-br from-[#fca5a5] via-[#fbcfe8] to-[#fed7aa]">
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
            {/* The 3D-like Heart Tree */}
            <div className="absolute inset-0 flex items-end justify-center pb-[5vh] z-10 pointer-events-none">
              <HeartTree phase={phase === 'tree' ? 'growing' : phase} onAnimationComplete={setPhase} />
            </div>

            {/* Falling petals effect using Framer Motion (for extra depth) */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
              {Array.from({ length: 15 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute bg-white/40 rounded-full blur-[1px]"
                  style={{
                    width: Math.random() * 8 + 4 + 'px',
                    height: Math.random() * 8 + 4 + 'px',
                    left: Math.random() * 100 + '%',
                    top: -20
                  }}
                  animate={{
                    y: ['0vh', '100vh'],
                    x: [0, Math.random() * 100 - 50, Math.random() * 100 - 50],
                    rotate: [0, Math.random() * 360],
                    opacity: [0, Math.random() * 0.8 + 0.2, 0]
                  }}
                  transition={{
                    duration: Math.random() * 10 + 5,
                    repeat: Infinity,
                    delay: Math.random() * 10,
                    ease: 'linear'
                  }}
                />
              ))}
            </div>

            {/* Custom overlay mimicking the Blossom Tree layout */}
            <div className="om-bday-tree-wish is-in absolute left-[7%] bottom-[13%] max-w-[min(84%,440px)] z-20 pointer-events-none text-left flex flex-col items-start">
              <motion.p 
                className="om-bday-tree-eyebrow"
                initial={{ opacity: 0, y: 12, filter: 'blur(5px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 }}
              >
                it's officially your day
              </motion.p>
              
              <div className="relative inline-block">
                <motion.h1 
                  className="om-bday-tree-hero animate-tree-hero"
                >
                  Happy Birthday
                </motion.h1>
              </div>
              
              <motion.span 
                className="om-bday-tree-rule"
                initial={{ opacity: 0, y: 12, scaleX: 0.3 }}
                animate={{ opacity: 1, y: 0, scaleX: 1 }}
                transition={{ duration: 0.9, delay: 1.35, ease: [0.2, 0.7, 0.2, 1] }}
              ></motion.span>
              
              <motion.p 
                className="om-bday-tree-sub"
                initial={{ opacity: 0, y: 12, filter: 'blur(5px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, delay: 1.55, ease: 'easeOut' }}
              >
                here's to a year that blooms
              </motion.p>
            </div>

            {/* Tap to continue area */}
            <motion.div 
              className="absolute left-0 right-0 bottom-8 z-30 text-center om-bday-tree-tap cursor-pointer hover:opacity-100 transition-opacity pointer-events-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.82 }}
              transition={{ delay: 2.5, duration: 1 }}
              onClick={onComplete}
            >
              tap anywhere to continue
            </motion.div>
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
      <motion.div 
        className="relative z-10 text-[120px] mb-32 drop-shadow-2xl"
        animate={isBursting ? { scale: [1, 2, 5, 0], opacity: [1, 1, 0] } : { scale: [1, 1.05, 1] }}
        transition={isBursting ? { duration: 1 } : { repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        ❤️
        <div className="absolute inset-0 bg-red-400 rounded-full blur-3xl opacity-20 -z-10 animate-pulse"></div>
      </motion.div>

      {!isBursting && (
        <div className="absolute bottom-20 flex flex-col items-center">
          <p className="text-red-200 text-sm tracking-widest uppercase mb-4 opacity-70">Pull the arrow</p>
          <div className="h-48 w-16 relative flex justify-center items-end">
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
