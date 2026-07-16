import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const setCanvasSize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Stars
    const numStars = 200;
    const stars = Array.from({ length: numStars }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      baseAlpha: Math.random() * 0.5 + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.02 + 0.005,
      color: Math.random() > 0.8 ? '#E8D5A3' : '#F8F4EE'
    }));

    // Shooting stars
    interface ShootingStar {
      x: number;
      y: number;
      length: number;
      speed: number;
      angle: number;
      active: boolean;
      opacity: number;
      timer: number;
      delay: number;
    }
    const numShootingStars = 15;
    const shootingStars: ShootingStar[] = Array.from({ length: numShootingStars }).map(() => ({
      x: 0, y: 0, length: 0, speed: 0, angle: 0, active: false, opacity: 0, timer: 0,
      delay: Math.random() * 15000 + 5000
    }));

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      // Draw stars
      stars.forEach(star => {
        const alpha = star.baseAlpha + Math.sin(time * star.speed + star.phase) * 0.3;
        ctx.fillStyle = star.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw shooting stars
      ctx.globalAlpha = 1;
      shootingStars.forEach(ss => {
        if (!ss.active) {
          if (time > ss.timer + ss.delay) {
            ss.active = true;
            ss.x = Math.random() * width;
            ss.y = Math.random() * height * 0.5;
            ss.length = Math.random() * 80 + 40;
            ss.speed = Math.random() * 4 + 2;
            ss.angle = (Math.random() * Math.PI / 4) + Math.PI / 4; // Diagonal
            ss.opacity = 1;
            ss.timer = time;
          }
        } else {
          ss.x += Math.cos(ss.angle) * ss.speed;
          ss.y += Math.sin(ss.angle) * ss.speed;
          ss.opacity -= 0.01;
          
          if (ss.opacity <= 0) {
            ss.active = false;
            ss.delay = Math.random() * 15000 + 8000;
            ss.timer = time;
          } else {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(232, 213, 163, ${ss.opacity})`;
            ctx.lineWidth = 1;
            ctx.moveTo(ss.x, ss.y);
            ctx.lineTo(ss.x - Math.cos(ss.angle) * ss.length, ss.y - Math.sin(ss.angle) * ss.length);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw(0);

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#050A14]">
      <canvas ref={canvasRef} className="w-full h-full opacity-80" />
      
      {/* Aurora glowing blobs */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full blur-[120px] bg-[#C9A96E] opacity-[0.04]"
        animate={{ y: [0, 50, 0], x: [0, 30, 0] }}
        transition={{ repeat: Infinity, duration: 25, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[140px] bg-[#C9A96E] opacity-[0.05]"
        animate={{ y: [0, -60, 0], x: [0, -40, 0] }}
        transition={{ repeat: Infinity, duration: 30, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-[40%] left-[60%] w-[40vw] h-[40vw] rounded-full blur-[100px] bg-[#0D1F3C] opacity-[0.3]"
        animate={{ y: [0, 40, 0], x: [0, -30, 0] }}
        transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
      />
    </div>
  );
}