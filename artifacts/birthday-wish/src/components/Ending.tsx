import React from 'react';
import { motion } from 'framer-motion';

/* SVG pressed flower — dried petals, muted botanical feel */
function PressedFlower({ size = 180 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Large outer petals */}
      {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((angle, i) => (
        <ellipse
          key={`outer-${i}`}
          cx={90}
          cy={90 - 38}
          rx={10}
          ry={28}
          fill={i % 3 === 0 ? '#D9A5A5' : i % 3 === 1 ? '#F8DCC8' : '#C48E8E'}
          opacity={0.55 + (i % 4) * 0.08}
          transform={`rotate(${angle}, 90, 90)`}
        />
      ))}
      {/* Medium inner petals */}
      {[20, 65, 110, 155, 200, 245, 290, 335].map((angle, i) => (
        <ellipse
          key={`mid-${i}`}
          cx={90}
          cy={90 - 24}
          rx={7}
          ry={18}
          fill={i % 2 === 0 ? '#E8C4C4' : '#F4E0D4'}
          opacity={0.5 + (i % 3) * 0.1}
          transform={`rotate(${angle}, 90, 90)`}
        />
      ))}
      {/* Leaf shapes */}
      <ellipse cx={90} cy={90 - 52} rx={7} ry={20} fill="#8FAF80" opacity={0.35} transform="rotate(-25, 90, 90)" />
      <ellipse cx={90} cy={90 - 52} rx={7} ry={20} fill="#6D9162" opacity={0.3} transform="rotate(25, 90, 90)" />
      <ellipse cx={90} cy={90 - 55} rx={6} ry={18} fill="#8FAF80" opacity={0.28} transform="rotate(155, 90, 90)" />
      {/* Center */}
      <circle cx={90} cy={90} r={13} fill="#B85C5C" opacity={0.55} />
      <circle cx={90} cy={90} r={9} fill="#C96666" opacity={0.5} />
      <circle cx={90} cy={90} r={5} fill="#FFF9F3" opacity={0.6} />
      {/* Fine veins on petals */}
      <line x1="90" y1="62" x2="90" y2="78" stroke="#B85C5C" strokeWidth="0.5" opacity="0.3" />
      <line x1="62" y1="90" x2="78" y2="90" stroke="#B85C5C" strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}

/* Small scattered petal */
function ScatteredPetal({ x, y, rotate, size = 1 }: { x: number; y: number; rotate: number; size?: number }) {
  return (
    <ellipse
      cx={x} cy={y}
      rx={5 * size} ry={12 * size}
      fill="#D9A5A5"
      opacity={0.3}
      transform={`rotate(${rotate}, ${x}, ${y})`}
    />
  );
}

export function Ending() {
  return (
    <section className="py-24 md:py-40 px-4 text-center relative overflow-hidden">
      {/* Scattered petals behind everything */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <ScatteredPetal x={80} y={60} rotate={-30} size={0.7} />
        <ScatteredPetal x={240} y={100} rotate={15} />
        <ScatteredPetal x={160} y={200} rotate={45} size={0.8} />
        <ScatteredPetal x={320} y={80} rotate={-60} size={0.6} />
        <ScatteredPetal x={60} y={250} rotate={80} size={0.9} />
      </svg>

      <div className="max-w-xl mx-auto relative z-10">
        {/* Pressed flower */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center mb-12"
        >
          <div className="petals-drift">
            <PressedFlower size={160} />
          </div>
        </motion.div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: 0.4, ease: 'easeOut' }}
          className="mb-16"
        >
          <p
            className="leading-relaxed"
            style={{
              fontFamily: 'Caveat, cursive',
              fontSize: '1.6rem',
              color: '#6B4C3B',
              lineHeight: 1.7,
            }}
          >
            "Some people become memories.
          </p>
          <p
            style={{
              fontFamily: 'Caveat, cursive',
              fontSize: '1.6rem',
              color: '#6B4C3B',
              lineHeight: 1.7,
            }}
          >
            Some memories become home."
          </p>
        </motion.div>

        {/* Horizontal rule */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.8, ease: 'easeOut' }}
          className="mx-auto mb-16"
          style={{
            height: 1,
            width: 120,
            background: 'linear-gradient(90deg, transparent, rgba(217,165,165,0.6), transparent)',
            transformOrigin: 'center',
          }}
        />

        {/* Final "Happy Birthday ❤️" */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: 1.1, ease: 'easeOut' }}
        >
          <p
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: '2.8rem',
              fontStyle: 'italic',
              color: '#3D2B1F',
              lineHeight: 1.2,
            }}
          >
            Happy Birthday
          </p>
          <p
            style={{ fontSize: '2.4rem', marginTop: '0.3rem', lineHeight: 1 }}
            aria-label="red heart"
          >
            ❤️
          </p>
        </motion.div>

        {/* Footer padding */}
        <div className="h-24" />
      </div>
    </section>
  );
}
