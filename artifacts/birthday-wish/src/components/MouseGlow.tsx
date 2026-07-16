import React, { useEffect, useState } from 'react';

export function MouseGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frame: number;

    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (opacity === 0) setOpacity(1);
    };

    const onMouseLeave = () => setOpacity(0);
    const onMouseEnter = () => setOpacity(1);

    const update = () => {
      // Lerp
      currentX += (targetX - currentX) * 0.08;
      currentY += (targetY - currentY) * 0.08;
      setPosition({ x: currentX, y: currentY });
      frame = requestAnimationFrame(update);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    frame = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(frame);
    };
  }, [opacity]);

  return (
    <div 
      className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none z-[1] hidden md:block"
      style={{
        transform: `translate(${position.x - 250}px, ${position.y - 250}px)`,
        background: 'radial-gradient(circle, rgba(201, 169, 110, 0.04) 0%, transparent 70%)',
        opacity: opacity,
        transition: 'opacity 0.5s ease',
      }}
    />
  );
}
