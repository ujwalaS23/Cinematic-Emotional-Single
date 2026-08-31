import React from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
      transition: { duration: 0.9, ease: 'easeOut' as const, delay: i * 0.12 },
  }),
};

const paragraphs = [
  'If someone had told me that one day I\'d be wishing you through a website instead of hearing your voice, I probably wouldn\'t have believed them.',
  'Life changed.',
  'Time changed.',
  'People changed.',
  'But there is one thing that never changed...',
  'I never stopped wishing good things for you.',
  'Not just today.',
  'Not only because it\'s your birthday.',
  'Every single day.',
  'There hasn\'t been one day when you didn\'t cross my mind.',
  'Sometimes only for a moment.',
  'Sometimes for hours.',
  'Sometimes because something reminded me of you.',
  'Sometimes for no reason at all.',
  'Your birthday doesn\'t make me remember you.',
  'I already do.',
  'It simply gives me a reason to tell you.',
];

/* Inline SVG — small decorative sprig divider */
function SprigDivider() {
  return (
    <svg width="120" height="30" viewBox="0 0 120 30" className="my-8 opacity-50 mx-auto block">
      <line x1="10" y1="15" x2="55" y2="15" stroke="#D9A5A5" strokeWidth="0.8" />
      <line x1="65" y1="15" x2="110" y2="15" stroke="#D9A5A5" strokeWidth="0.8" />
      <g transform="translate(60,15)">
        <ellipse cx="0" cy="-7" rx="3" ry="6" fill="#D9A5A5" opacity="0.7" transform="rotate(-30)" />
        <ellipse cx="0" cy="-7" rx="3" ry="6" fill="#F8DCC8" opacity="0.65" transform="rotate(30)" />
        <circle cx="0" cy="0" r="3" fill="#B85C5C" opacity="0.55" />
      </g>
    </svg>
  );
}

export function IntroLetter() {
  return (
    <section className="py-20 md:py-32 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Letter card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="paper-card paper-grain px-8 md:px-14 py-12 md:py-16"
          style={{ borderTop: '3px solid rgba(217,165,165,0.3)' }}
        >
          {/* Greeting */}
          <p
            className="mb-8 text-2xl md:text-3xl"
            style={{ fontFamily: 'Caveat, cursive', color: '#6B4C3B' }}
          >
            Dear Karthik,
          </p>

          {/* Paragraphs */}
          <div className="space-y-4">
            {paragraphs.map((p, i) => (
              <motion.p
                key={i}
                custom={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                className="leading-relaxed"
                style={{
                  fontFamily: '"Crimson Pro", serif',
                  fontSize: '1.2rem',
                  color: p.length < 25 ? '#B85C5C' : '#4A3428',
                  fontStyle: p.endsWith('...') ? 'italic' : 'normal',
                  marginBottom: p.length < 25 ? '0.25rem' : undefined,
                }}
              >
                {p}
              </motion.p>
            ))}
          </div>

          <SprigDivider />
        </motion.div>
      </div>
    </section>
  );
}
