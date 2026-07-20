import React, { useState } from 'react';
import { motion } from 'framer-motion';

/* Small watercolor flower SVG */
function WatercolorFlower({
  x, y, scale = 1, rotate = 0, color1 = '#F8DCC8', color2 = '#D9A5A5', opacity = 0.75,
}: {
  x: number; y: number; scale?: number; rotate?: number; color1?: string; color2?: string; opacity?: number;
}) {
  const petals = [0, 60, 120, 180, 240, 300];
  return (
    <g transform={`translate(${x},${y}) rotate(${rotate}) scale(${scale})`} opacity={opacity}>
      {petals.map((angle, i) => (
        <ellipse
          key={i}
          cx={0} cy={-13}
          rx={4.5} ry={10}
          fill={i % 2 === 0 ? color1 : color2}
          opacity={0.7}
          transform={`rotate(${angle})`}
        />
      ))}
      <circle cx={0} cy={0} r={5} fill="#B85C5C" opacity={0.6} />
      <circle cx={0} cy={0} r={2.5} fill="#FFF9F3" opacity={0.5} />
    </g>
  );
}

/* Small leaf sprig */
function LeafSprig({ x, y, rotate = 0 }: { x: number; y: number; rotate?: number }) {
  return (
    <g transform={`translate(${x},${y}) rotate(${rotate})`} opacity={0.5}>
      <ellipse cx={0} cy={-10} rx={3.5} ry={8} fill="#7A9E7E" opacity={0.55} transform="rotate(-15)" />
      <ellipse cx={0} cy={-10} rx={3.5} ry={8} fill="#5E8B62" opacity={0.45} transform="rotate(15)" />
      <line x1={0} y1={0} x2={0} y2={-20} stroke="#5E8B62" strokeWidth={0.8} opacity={0.4} />
    </g>
  );
}

/* Wax seal SVG */
function WaxSealSVG({ broken }: { broken: boolean }) {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
      {/* Outer irregular wax circle */}
      <circle cx="45" cy="45" r="40" fill="#B85C5C" />
      <circle cx="45" cy="45" r="40" fill="url(#sealGrad)" />
      {/* Texture bumps around edge */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
        <circle
          key={i}
          cx={45 + 37 * Math.cos((angle * Math.PI) / 180)}
          cy={45 + 37 * Math.sin((angle * Math.PI) / 180)}
          r={3.5}
          fill="#9A4545"
          opacity={0.55}
        />
      ))}
      {/* Inner ring */}
      <circle cx="45" cy="45" r="30" fill="none" stroke="#9A4545" strokeWidth="1" opacity="0.5" />
      {/* Monogram / floral motif */}
      <text x="45" y="52" textAnchor="middle" fill="#FFF9F3" fontSize="22" fontFamily="Playfair Display, serif" opacity="0.9">
        ❤
      </text>
      <defs>
        <radialGradient id="sealGrad" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#C96666" />
          <stop offset="100%" stopColor="#8A3A3A" />
        </radialGradient>
      </defs>
      {/* Crack if broken */}
      {broken && (
        <g opacity="0.5">
          <line x1="45" y1="15" x2="40" y2="45" stroke="#FFF9F3" strokeWidth="1" />
          <line x1="45" y1="15" x2="50" y2="38" stroke="#FFF9F3" strokeWidth="0.8" />
        </g>
      )}
    </svg>
  );
}

export function WaxSealScreen({ onOpen }: { onOpen: () => void }) {
  const [breaking, setBreaking] = useState(false);

  const handleOpen = () => {
    setBreaking(true);
    setTimeout(() => onOpen(), 900);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#FFF9F3' }}
      exit={{ y: '-100%', opacity: 0 }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
    >
      {/* Paper grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Decorative watercolor flowers — one SVG per corner for responsive placement */}

      {/* Top-left */}
      <svg className="absolute top-0 left-0 pointer-events-none" width="180" height="180" viewBox="0 0 180 180">
        <WatercolorFlower x={70} y={80} scale={1.6} rotate={-15} opacity={0.55} />
        <WatercolorFlower x={115} y={50} scale={1.1} rotate={20} color1="#D9A5A5" color2="#F8DCC8" opacity={0.45} />
        <WatercolorFlower x={40} y={135} scale={0.8} rotate={5} color1="#F8DCC8" color2="#B85C5C" opacity={0.38} />
        <LeafSprig x={98} y={95} rotate={30} />
        <LeafSprig x={58} y={68} rotate={-20} />
      </svg>

      {/* Top-right */}
      <svg className="absolute top-0 right-0 pointer-events-none" width="160" height="160" viewBox="0 0 160 160">
        <WatercolorFlower x={90} y={85} scale={1.4} rotate={25} color1="#D9A5A5" color2="#F8DCC8" opacity={0.5} />
        <WatercolorFlower x={50} y={55} scale={0.9} rotate={-10} opacity={0.38} />
        <LeafSprig x={75} y={120} rotate={-30} />
      </svg>

      {/* Bottom-left */}
      <svg className="absolute bottom-0 left-0 pointer-events-none" width="140" height="140" viewBox="0 0 140 140">
        <WatercolorFlower x={65} y={65} scale={1.2} rotate={10} color1="#F8DCC8" color2="#D9A5A5" opacity={0.42} />
        <LeafSprig x={100} y={50} rotate={15} />
      </svg>

      {/* Bottom-right */}
      <svg className="absolute bottom-0 right-0 pointer-events-none" width="140" height="140" viewBox="0 0 140 140">
        <WatercolorFlower x={75} y={70} scale={1.1} rotate={-20} opacity={0.38} />
        <LeafSprig x={45} y={55} rotate={-40} />
      </svg>

      {/* Subtle ruled lines — like writing paper */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'repeating-linear-gradient(180deg, transparent, transparent 31px, rgba(217,165,165,0.35) 31px, rgba(217,165,165,0.35) 32px)',
        }}
      />

      {/* Center content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        className="relative z-10 flex flex-col items-center text-center px-6"
      >
        {/* Small decorative line above */}
        <div className="flex items-center gap-3 mb-8 opacity-60">
          <div className="h-px w-12 bg-dusty-rose" style={{ backgroundColor: '#D9A5A5' }} />
          <svg width="16" height="16" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="3" fill="#D9A5A5" />
            <circle cx="8" cy="2" r="1.5" fill="#F8DCC8" />
            <circle cx="8" cy="14" r="1.5" fill="#F8DCC8" />
            <circle cx="2" cy="8" r="1.5" fill="#F8DCC8" />
            <circle cx="14" cy="8" r="1.5" fill="#F8DCC8" />
          </svg>
          <div className="h-px w-12" style={{ backgroundColor: '#D9A5A5' }} />
        </div>

        {/* Heading */}
        <h1
          className="font-serif text-5xl md:text-7xl mb-4 leading-tight"
          style={{ color: '#3D2B1F', fontFamily: '"Playfair Display", serif', fontStyle: 'italic' }}
        >
          Happy Birthday Karthiii..
        </h1>

        {/* Subheading */}
        <p
          className="text-xl md:text-2xl mb-14 opacity-75"
          style={{ fontFamily: 'Caveat, cursive', color: '#6B4C3B', fontSize: '1.4rem' }}
        >
          A letter I've carried in my heart.
        </p>

        {/* Wax seal button */}
        <motion.button
          onClick={handleOpen}
          className="relative flex flex-col items-center gap-3 group cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={breaking ? { scale: [1, 1.15, 0.9], rotate: [0, -3, 3, 0] } : {}}
          transition={breaking ? { duration: 0.5 } : { type: 'spring', stiffness: 300 }}
          style={{ cursor: 'pointer' }}
        >
          <div className="seal-glow rounded-full">
            <WaxSealSVG broken={breaking} />
          </div>
          <span
            style={{ fontFamily: 'Caveat, cursive', color: '#B85C5C', fontSize: '1.1rem' }}
            className="opacity-80 group-hover:opacity-100 transition-opacity"
          >
            Open
          </span>
        </motion.button>
      </motion.div>

      {/* Bottom ribbon */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(217,165,165,0.3), rgba(248,220,200,0.4), rgba(217,165,165,0.3), transparent)' }}
      />
    </motion.div>
  );
}
