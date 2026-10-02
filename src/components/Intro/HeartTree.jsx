import React, { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';

export default function HeartTree({ phase, onAnimationComplete }) {
  // Generate highly dense, organic heart tree
  const { leaves, trunkPath, branches } = useMemo(() => {
    // 1. Organic Trunk & Branches (viewBox 0 0 800 1000)
    const trunkPath = "M 370 950 C 375 800, 390 650, 400 550 C 410 650, 425 800, 430 950 Z";
    
    const branches = [
      "M 400 600 Q 350 500 250 400", // Mid Left
      "M 400 600 Q 450 500 550 400", // Mid Right
      "M 400 550 Q 380 400 300 250", // High Left
      "M 400 550 Q 420 400 500 250", // High Right
      "M 400 520 Q 400 350 400 200", // Center top
      "M 390 650 Q 300 600 200 500", // Lower Left
      "M 410 650 Q 500 600 600 500", // Lower Right
    ];

    // 2. Canopy Clusters (cx, cy, radius)
    // Designed to form a STRICT dense heart shape
    const clusters = [
      // Left Lobe
      { cx: 280, cy: 260, r: 130 },
      { cx: 220, cy: 320, r: 110 },
      { cx: 320, cy: 320, r: 120 },
      
      // Right Lobe
      { cx: 520, cy: 260, r: 130 },
      { cx: 580, cy: 320, r: 110 },
      { cx: 480, cy: 320, r: 120 },
      
      // Mid Section
      { cx: 400, cy: 350, r: 100 },
      { cx: 300, cy: 420, r: 120 },
      { cx: 500, cy: 420, r: 120 },
      
      // Lower Taper
      { cx: 360, cy: 520, r: 100 },
      { cx: 440, cy: 520, r: 100 },
      { cx: 400, cy: 600, r: 80 },
      { cx: 400, cy: 660, r: 60 },
    ];

    const colors = [
      { id: 'pink-soft', weight: 35 },
      { id: 'pink-rose', weight: 25 },
      { id: 'pink-blush', weight: 15 },
      { id: 'yellow-warm', weight: 12 },
      { id: 'yellow-gold', weight: 5 },
      { id: 'peach-soft', weight: 8 }
    ];

    const pickColor = () => {
      let r = Math.random() * 100;
      for (let c of colors) {
        if (r < c.weight) return c.id;
        r -= c.weight;
      }
      return 'pink-soft';
    };

    // Responsive leaf count: more on desktop, fewer on mobile
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const targetLeaves = isMobile ? 600 : 1200;
    const leavesPerCluster = Math.floor(targetLeaves / clusters.length);

    const generatedLeaves = [];
    let idCounter = 0;

    clusters.forEach(cluster => {
      for (let i = 0; i < leavesPerCluster; i++) {
        // Random point in circle using sqrt for even area distribution
        const angle = Math.random() * Math.PI * 2;
        const radius = cluster.r * Math.sqrt(Math.random());
        
        const x = cluster.cx + radius * Math.cos(angle);
        const y = cluster.cy + radius * Math.sin(angle);

        // Size: smaller, dense hearts to form a cohesive shape
        const sizePx = 14 + Math.random() * 14; 
        const scale = sizePx / 20;

        // Rotation: -15deg to +15deg
        const rotation = (Math.random() - 0.5) * 30;

        // Growth delay: Bottom grows first (y ~ 650), top grows last (y ~ 100)
        // Normalize Y from 650->100 into a 0->1 value
        const normalizedY = Math.max(0, Math.min(1, (650 - y) / 550));
        const delayGrow = 1.5 + normalizedY * 2.5 + Math.random() * 0.5;

        // Falling delay: Top falls first, bottom falls last
        const delayFall = (1 - normalizedY) * 3 + Math.random() * 2;

        generatedLeaves.push({
          id: `leaf-${idCounter++}`,
          x, y, scale, rotation,
          colorId: pickColor(),
          delayGrow, delayFall,
          willFall: Math.random() > 0.65 // About 35% of leaves will fall
        });
      }
    });

    // Sort by Y so they draw nicely (bottom to top, or top to bottom)
    generatedLeaves.sort((a, b) => a.y - b.y);

    return { leaves: generatedLeaves, trunkPath, branches };
  }, []);

  useEffect(() => {
    if (phase === 'growing') {
      const t = setTimeout(() => {
        onAnimationComplete('falling');
      }, 7000);
      return () => clearTimeout(t);
    }
    
    if (phase === 'falling') {
      const t = setTimeout(() => {
        onAnimationComplete('message');
      }, 7000); 
      return () => clearTimeout(t);
    }
  }, [phase, onAnimationComplete]);

  // Framer Motion variants
  const trunkVariants = {
    hidden: { opacity: 0, pathLength: 0, fillOpacity: 0 },
    visible: { 
      opacity: 1, 
      pathLength: 1, 
      fillOpacity: 1,
      transition: { duration: 2, ease: "easeInOut" }
    }
  };

  const branchVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: i => ({
      pathLength: 1,
      opacity: 1,
      transition: { duration: 1.5, ease: "easeOut", delay: 1 + i * 0.2 }
    })
  };

  return (
    <div className="relative w-full max-w-2xl aspect-[4/5] mx-auto">
      <svg viewBox="0 0 800 1000" className="w-full h-full drop-shadow-2xl overflow-visible">
        {/* DEFINITIONS FOR GLOSSY HEARTS */}
        <defs>
          {/* Gradients */}
          <linearGradient id="pink-soft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDF2F8" />
            <stop offset="100%" stopColor="#F9A8D4" />
          </linearGradient>
          <linearGradient id="pink-rose" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCE7F3" />
            <stop offset="100%" stopColor="#F472B6" />
          </linearGradient>
          <linearGradient id="pink-blush" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFE4E6" />
            <stop offset="100%" stopColor="#FDA4AF" />
          </linearGradient>
          <linearGradient id="yellow-warm" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF9C3" />
            <stop offset="100%" stopColor="#FDE047" />
          </linearGradient>
          <linearGradient id="yellow-gold" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF3C7" />
            <stop offset="100%" stopColor="#FCD34D" />
          </linearGradient>
          <linearGradient id="peach-soft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFEDD5" />
            <stop offset="100%" stopColor="#FB923C" />
          </linearGradient>

          {/* Base Glossy Heart Geometry (20x20) */}
          <g id="glossy-heart">
            {/* Shadow */}
            <path d="M10 18 C 10 18, 2 11, 2 6 C 2 3, 6 1.5, 10 5.5 C 14 1.5, 18 3, 18 6 C 18 11, 10 18, 10 18 Z" fill="rgba(0,0,0,0.1)" transform="translate(0, 1.5)" />
            {/* Main Body (Color applied via CSS/fill in <use>) */}
            <path d="M10 18 C 10 18, 2 11, 2 6 C 2 3, 6 1.5, 10 5.5 C 14 1.5, 18 3, 18 6 C 18 11, 10 18, 10 18 Z" />
            {/* Glossy Highlight */}
            <path d="M10 5.5 C 6 1.5, 2 3, 2 6 C 2 8, 4.5 11.5, 7.5 14 C 7.5 14, 3 8.5, 6.5 4 C 7.5 2.5, 9 3.5, 10 5.5 Z" fill="white" opacity="0.5" />
          </g>
        </defs>

        {/* TRUNK */}
        <g strokeLinecap="round">
          <motion.path 
            d={trunkPath} 
            fill="#3E2723" 
            stroke="none"
            variants={trunkVariants}
            initial="hidden"
            animate={phase !== 'hidden' ? "visible" : "hidden"}
          />
        </g>

        {/* HEART LEAVES */}
        {leaves.map((leaf) => {
          const isFallingPhase = phase === 'falling' || phase === 'message';
          const shouldFallNow = isFallingPhase && leaf.willFall;

          return (
            <motion.g
              key={leaf.id}
              initial={{ scale: 0, opacity: 0, x: leaf.x, y: leaf.y, rotate: leaf.rotation }}
              animate={
                shouldFallNow 
                  ? { 
                      y: leaf.y + 600 + Math.random() * 300, 
                      x: leaf.x + (Math.random() - 0.5) * 250, 
                      rotate: leaf.rotation + (Math.random() * 180 - 90),
                      opacity: [1, 1, 0],
                      scale: leaf.scale
                    } 
                  : { 
                      scale: phase !== 'hidden' ? leaf.scale : 0, 
                      opacity: phase !== 'hidden' ? 0.95 : 0,
                      rotate: leaf.rotation,
                      x: leaf.x,
                      y: phase !== 'hidden' ? [leaf.y, leaf.y - 3, leaf.y] : leaf.y
                    }
              }
              transition={
                shouldFallNow
                  ? {
                      duration: 5 + Math.random() * 4,
                      delay: leaf.delayFall,
                      ease: [0.4, 0, 1, 1], // ease-in for realistic falling
                    }
                  : {
                      scale: { duration: 0.6, delay: leaf.delayGrow, type: "spring", bounce: 0.4 },
                      opacity: { duration: 0.6, delay: leaf.delayGrow },
                      // Subtle organic floating loop
                      y: { repeat: Infinity, duration: 3 + Math.random() * 2, ease: "easeInOut", delay: leaf.delayGrow }
                    }
              }
            >
              <use 
                href="#glossy-heart" 
                fill={`url(#${leaf.colorId})`}
                // Offset by half of SVG size (10) so it scales from center
                x="-10" 
                y="-10" 
              />
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
