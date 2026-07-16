import React, { useEffect, useRef } from 'react';

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const mouse = { x: width / 2, y: height / 2 };
    const dots: { x: number, y: number, size: number, opacity: number }[] = [];
    const DOT_COUNT = 10;
    
    for (let i = 0; i < DOT_COUNT; i++) {
      dots.push({ x: mouse.x, y: mouse.y, size: 10 * Math.pow(0.8, i), opacity: 1 - i * 0.1 });
    }

    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    
    const onResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('resize', onResize);

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      dots[0].x += (mouse.x - dots[0].x) * 0.4;
      dots[0].y += (mouse.y - dots[0].y) * 0.4;

      for (let i = 1; i < DOT_COUNT; i++) {
        dots[i].x += (dots[i - 1].x - dots[i].x) * 0.4;
        dots[i].y += (dots[i - 1].y - dots[i].y) * 0.4;
      }

      dots.forEach((dot, index) => {
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 169, 110, ${dot.opacity})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-50 mix-blend-screen hidden md:block"
    />
  );
}
