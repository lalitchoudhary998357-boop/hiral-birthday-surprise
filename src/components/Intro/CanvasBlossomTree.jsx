import React, { useEffect, useRef } from 'react';

export default function CanvasBlossomTree({ phase, onAnimationComplete }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Handle resizing
    let width = canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
    let height = canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    
    let animationFrameId;
    let time = 0;
    
    // Arrays to hold our procedural data
    const branches = [];
    const blossoms = [];
    const fallingPetals = [];
    
    // Define tree colors
    const trunkColor = '#5d2938';
    
    // Colors for blossoms
    const blossomColors = [
      ['#ff80aa', '#ffb3c6'],
      ['#f4577f', '#f4a0b0'],
      ['#e23b67', '#f9d0d8'],
      ['#ffd6e0', '#ffd0e0'],
      ['#ffe1ec', '#e84d9a']
    ];

    // Generate tree structure recursively
    function generateTree(x, y, length, angle, depth, delay) {
      if (depth === 0) {
        // Spawn blossoms at the end of branches
        const numBlossoms = Math.floor(Math.random() * 3) + 2;
        for (let i = 0; i < numBlossoms; i++) {
          const colors = blossomColors[Math.floor(Math.random() * blossomColors.length)];
          blossoms.push({
            x: x + (Math.random() - 0.5) * 40,
            y: y + (Math.random() - 0.5) * 40,
            size: Math.random() * 15 + 10,
            colors: colors,
            delay: delay + Math.random() * 60,
            grown: 0
          });
        }
        return;
      }

      const endX = x + Math.cos(angle) * length;
      const endY = y + Math.sin(angle) * length;
      
      branches.push({
        x1: x, y1: y,
        x2: endX, y2: endY,
        width: depth * 1.5 + 1,
        delay: delay,
        progress: 0
      });
      
      // Calculate next branches
      const numBranches = Math.random() > 0.3 ? 2 : 3;
      for (let i = 0; i < numBranches; i++) {
        const newAngle = angle + (Math.random() - 0.5) * 1.2;
        const newLength = length * (Math.random() * 0.2 + 0.7);
        generateTree(endX, endY, newLength, newAngle, depth - 1, delay + 15);
      }
    }

    // Initialize tree starting from bottom center
    if (branches.length === 0) {
      generateTree(width / 2, height, height * 0.22, -Math.PI / 2, 7, 0);
      
      // Sort branches by delay so they grow in order
      branches.sort((a, b) => a.delay - b.delay);
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time++;
      
      // Draw Branches
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = trunkColor;
      
      branches.forEach(b => {
        if (time > b.delay) {
          b.progress = Math.min(1, b.progress + 0.05);
          
          if (b.progress > 0) {
            ctx.lineWidth = b.width;
            ctx.beginPath();
            ctx.moveTo(b.x1, b.y1);
            const currentX = b.x1 + (b.x2 - b.x1) * b.progress;
            const currentY = b.y1 + (b.y2 - b.y1) * b.progress;
            ctx.lineTo(currentX, currentY);
            ctx.stroke();
          }
        }
      });
      
      // Draw Blossoms
      blossoms.forEach(b => {
        if (time > b.delay) {
          b.grown = Math.min(1, b.grown + 0.03);
          
          if (b.grown > 0) {
            const radGrad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.size * b.grown);
            radGrad.addColorStop(0, b.colors[0]);
            radGrad.addColorStop(1, b.colors[1]);
            
            ctx.beginPath();
            ctx.arc(b.x, b.y, b.size * b.grown, 0, Math.PI * 2);
            ctx.fillStyle = radGrad;
            ctx.globalAlpha = 0.8;
            ctx.fill();
            ctx.globalAlpha = 1.0;
          }
          
          // Trigger falling petals occasionally once fully grown and in falling phase
          if (b.grown >= 1 && (phase === 'falling' || phase === 'message') && Math.random() < 0.005) {
            fallingPetals.push({
              x: b.x,
              y: b.y,
              size: b.size * (Math.random() * 0.4 + 0.4),
              colors: b.colors,
              vx: (Math.random() - 0.5) * 2,
              vy: Math.random() * 1.5 + 1,
              sway: Math.random() * Math.PI * 2,
              swaySpeed: Math.random() * 0.05 + 0.02
            });
          }
        }
      });
      
      // Draw Falling Petals
      for (let i = fallingPetals.length - 1; i >= 0; i--) {
        const p = fallingPetals[i];
        p.x += p.vx + Math.sin(p.sway) * 1.5;
        p.y += p.vy;
        p.sway += p.swaySpeed;
        
        const radGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        radGrad.addColorStop(0, p.colors[0]);
        radGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = radGrad;
        ctx.globalAlpha = 0.7;
        ctx.fill();
        ctx.globalAlpha = 1.0;
        
        // Remove if off screen
        if (p.y > height + 20) {
          fallingPetals.splice(i, 1);
        }
      }
      
      // State transition checks
      if (phase === 'growing' && time > 300) {
        onAnimationComplete('falling');
      } else if (phase === 'falling' && time > 450) {
        onAnimationComplete('message');
      }
      
      animationFrameId = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [phase, onAnimationComplete]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full block absolute inset-0 z-10"
      style={{ pointerEvents: 'none' }}
    />
  );
}
