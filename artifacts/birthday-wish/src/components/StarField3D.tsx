import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  phase: number;
  speed: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  angle: number;
  speed: number;
  opacity: number;
  active: boolean;
  timer: number;
  nextTrigger: number;
}

export function StarField3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    // Generate stars
    const starCount = 280;
    const stars: Star[] = Array.from({ length: starCount }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      z: Math.random(),
      size: Math.random() * 1.6 + 0.3,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.4 + 0.15,
    }));

    // Shooting stars
    const shootingStars: ShootingStar[] = Array.from({ length: 10 }, () => ({
      x: 0, y: 0, length: 0, angle: 0, speed: 0, opacity: 0,
      active: false, timer: 0, nextTrigger: Math.random() * 10000 + 3000,
    }));

    let elapsed = 0;
    let lastTime = performance.now();
    let rafId: number;

    const triggerShootingStar = (s: ShootingStar) => {
      s.x = Math.random() * W * 0.7;
      s.y = Math.random() * H * 0.4;
      s.length = Math.random() * 120 + 80;
      s.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
      s.speed = Math.random() * 4 + 3;
      s.opacity = 1;
      s.active = true;
      s.timer = 0;
    };

    const draw = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;
      if (!prefersReducedMotion) elapsed += delta;

      // Clear with deep night sky
      ctx.fillStyle = '#050A14';
      ctx.fillRect(0, 0, W, H);

      // Nebula aurora blobs
      const auroraPhase = elapsed * 0.0003;
      const auroras = [
        { x: W * 0.2, y: H * 0.25, r: 300, color: 'rgba(13,31,60,0.55)' },
        { x: W * 0.75, y: H * 0.6, r: 250, color: 'rgba(15,10,40,0.45)' },
        { x: W * 0.5, y: H * 0.15, r: 200, color: 'rgba(20,8,35,0.3)' },
      ];
      auroras.forEach((a, i) => {
        const dx = Math.sin(auroraPhase + i * 1.3) * 40;
        const dy = Math.cos(auroraPhase * 0.7 + i) * 30;
        const grad = ctx.createRadialGradient(a.x + dx, a.y + dy, 0, a.x + dx, a.y + dy, a.r);
        grad.addColorStop(0, a.color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);
      });

      // Gold aurora glow (subtle)
      const goldGrad = ctx.createRadialGradient(W * 0.5, H * 0.3, 0, W * 0.5, H * 0.3, W * 0.4);
      goldGrad.addColorStop(0, `rgba(201,169,110,${0.025 + 0.01 * Math.sin(auroraPhase * 0.5)})`);
      goldGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = goldGrad;
      ctx.fillRect(0, 0, W, H);

      // Draw stars
      const t = elapsed * 0.001;
      stars.forEach(star => {
        const twinkle = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * star.speed + star.phase));
        // Slight blue-white mix based on z
        const warmth = Math.floor(200 + star.z * 55);
        const blue = Math.floor(220 + star.z * 35);
        ctx.globalAlpha = twinkle * (0.5 + star.z * 0.5);
        ctx.fillStyle = `rgb(${warmth},${warmth},${blue})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * (0.4 + star.z * 0.6), 0, Math.PI * 2);
        ctx.fill();

        // Glow for larger stars
        if (star.size > 1.2) {
          const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 4);
          glow.addColorStop(0, `rgba(220,210,255,${twinkle * 0.25})`);
          glow.addColorStop(1, 'transparent');
          ctx.globalAlpha = 1;
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size * 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      ctx.globalAlpha = 1;

      // Shooting stars
      if (!prefersReducedMotion) {
        shootingStars.forEach(s => {
          s.nextTrigger -= delta;
          if (!s.active && s.nextTrigger <= 0) {
            triggerShootingStar(s);
            s.nextTrigger = Math.random() * 12000 + 6000;
          }
          if (s.active) {
            s.timer += delta;
            s.x += Math.cos(s.angle) * s.speed;
            s.y += Math.sin(s.angle) * s.speed;
            s.opacity = Math.max(0, 1 - s.timer / 900);

            if (s.opacity <= 0) { s.active = false; return; }

            const tx = s.x - Math.cos(s.angle) * s.length;
            const ty = s.y - Math.sin(s.angle) * s.length;
            const grad = ctx.createLinearGradient(tx, ty, s.x, s.y);
            grad.addColorStop(0, `rgba(255,255,255,0)`);
            grad.addColorStop(0.7, `rgba(220,210,255,${s.opacity * 0.6})`);
            grad.addColorStop(1, `rgba(255,255,255,${s.opacity})`);
            ctx.globalAlpha = 1;
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(s.x, s.y);
            ctx.stroke();
          }
        });
      }

      rafId = requestAnimationFrame(draw);
    };

    rafId = requestAnimationFrame(draw);

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
      // Redistribute stars
      stars.forEach(star => {
        star.x = Math.random() * W;
        star.y = Math.random() * H;
      });
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: '#050A14' }}
      aria-hidden="true"
    />
  );
}
