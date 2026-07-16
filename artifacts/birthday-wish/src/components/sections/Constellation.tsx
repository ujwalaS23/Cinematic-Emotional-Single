import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const memories = [
  "I still remember this day.", "You smiled here.", "I laughed the hardest here.",
  "I didn't know those moments would become memories.", "This one stays with me.",
  "The world felt kind here.", "I was happiest in moments like this.",
  "I wish I could return to this.", "You were radiant here.",
  "Time felt generous here.", "I never wanted this one to end.",
  "We didn't know it then, but this was golden.", "This is the one I revisit most.",
  "Something shifted inside me here.", "The air felt different this day.",
  "I still feel the warmth of this.", "A moment I keep returning to.",
  "The kind of day you want to live inside.", "Quietly perfect.",
  "This made me feel like everything would be alright.", "I was fully present here.",
  "You made this ordinary into extraordinary.", "A day I've replayed a hundred times.",
  "Still golden after all this time.", "My heart felt full here."
];

interface Star {
  x: number;
  y: number;
  memory: string;
  phase: number;
}

export function Constellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [stars, setStars] = useState<Star[]>([]);
  const [hoveredStar, setHoveredStar] = useState<Star | null>(null);
  const [clickedStar, setClickedStar] = useState<Star | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Generate stars on mount
  useEffect(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    const height = Math.max(window.innerHeight * 0.8, 600);
    
    const newStars: Star[] = [];
    const padding = 50;
    
    // Seed them in a rough oval/constellation shape
    for (let i = 0; i < 25; i++) {
      const angle = (i / 25) * Math.PI * 2 + (Math.random() * 0.5 - 0.25);
      const radius = Math.random() * (Math.min(width, height) / 2.5 - padding) + 50;
      
      const x = width / 2 + Math.cos(angle) * radius * (width / height);
      const y = height / 2 + Math.sin(angle) * radius;
      
      // Ensure within bounds
      if (x > padding && x < width - padding && y > padding && y < height - padding) {
        newStars.push({
          x, y,
          memory: memories[i % memories.length],
          phase: Math.random() * Math.PI * 2
        });
      }
    }
    
    setStars(newStars);
  }, []);

  // Draw loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || stars.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = containerRef.current?.clientWidth || window.innerWidth;
    let height = Math.max(window.innerHeight * 0.8, 600);
    canvas.width = width;
    canvas.height = height;

    let animationFrameId: number;
    let startTime = Date.now();

    const render = () => {
      const time = (Date.now() - startTime) / 1000;
      ctx.clearRect(0, 0, width, height);

      // Draw lines between close stars
      ctx.strokeStyle = 'rgba(201, 169, 110, 0.15)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw stars
      stars.forEach(star => {
        const isHovered = hoveredStar === star;
        const isClicked = clickedStar === star;
        const active = isHovered || isClicked;
        
        const alpha = active ? 1 : 0.4 + 0.3 * Math.sin(time * 2 + star.phase);
        const radius = active ? 4 : 2;

        ctx.beginPath();
        ctx.arc(star.x, star.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();

        if (active) {
          const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 20);
          gradient.addColorStop(0, 'rgba(201, 169, 110, 0.8)');
          gradient.addColorStop(1, 'rgba(201, 169, 110, 0)');
          ctx.beginPath();
          ctx.arc(star.x, star.y, 20, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [stars, hoveredStar, clickedStar]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let found: Star | null = null;
    for (const star of stars) {
      const dx = star.x - x;
      const dy = star.y - y;
      if (Math.sqrt(dx * dx + dy * dy) < 20) {
        found = star;
        break;
      }
    }

    if (found !== hoveredStar) {
      setHoveredStar(found);
      if (found && !clickedStar) {
        setTooltipPos({ x: found.x, y: found.y });
      }
    }
  };

  const handleClick = () => {
    if (hoveredStar) {
      setClickedStar(hoveredStar);
      setTooltipPos({ x: hoveredStar.x, y: hoveredStar.y });
    } else {
      setClickedStar(null);
    }
  };

  const activeStar = clickedStar || hoveredStar;

  return (
    <section className="relative min-h-screen py-32 z-10 flex flex-col items-center">
      <div className="text-center mb-12">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif italic text-gold text-[clamp(2rem,5vw,3.5rem)]"
        >
          Written in the Stars
        </motion.h2>
      </div>

      <div ref={containerRef} className="w-full relative">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          onMouseLeave={() => setHoveredStar(null)}
          className="w-full cursor-crosshair"
          style={{ height: 'max(80vh, 600px)' }}
        />

        <AnimatePresence>
          {activeStar && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute pointer-events-none glass-card p-4 min-w-[200px] text-center z-20"
              style={{
                left: tooltipPos.x + 20,
                top: tooltipPos.y - 40,
                // Adjust if too close to right edge
                ...(tooltipPos.x > (containerRef.current?.clientWidth || 0) - 250 ? { left: tooltipPos.x - 220 } : {})
              }}
            >
              <p className="font-serif italic text-sm text-foreground/90">{activeStar.memory}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="font-sans italic text-gold/60 text-sm mt-8">
        ✦ Hover or click the stars to reveal memories
      </p>
    </section>
  );
}
