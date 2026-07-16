import React from 'react';
import { motion } from 'framer-motion';

/* Each block: either a paragraph (string) or a special fragment */
interface Block {
  text: string;
  style?: 'normal' | 'short' | 'italic' | 'emphasis' | 'signature' | 'heading';
}

const blocks: Block[] = [
  { text: 'Happy Birthday.', style: 'heading' },
  { text: 'I\'ve rewritten this letter in my head countless times.', style: 'normal' },
  { text: 'Every version sounded different.', style: 'short' },
  { text: 'But every one of them began with you.', style: 'italic' },
  { text: 'People often say that time teaches us how to move on.', style: 'normal' },
  { text: 'Maybe that\'s true for many people.', style: 'short' },
  { text: 'I don\'t know.', style: 'short' },
  { text: 'I\'m still trying to understand it.', style: 'normal' },
  { text: 'Because if I\'m completely honest...', style: 'italic' },
  { text: 'moving on has never been something my heart knew how to do.', style: 'emphasis' },
  { text: 'I don\'t remember you only today.', style: 'normal' },
  { text: 'Not only on birthdays.', style: 'short' },
  { text: 'Not only when I see old photographs.', style: 'short' },
  { text: 'I remember you every single day.', style: 'emphasis' },
  { text: 'There hasn\'t been one day where you didn\'t quietly cross my mind.', style: 'normal' },
  { text: 'Sometimes through a song.', style: 'short' },
  { text: 'Sometimes through a place.', style: 'short' },
  { text: 'Sometimes through silence.', style: 'short' },
  { text: 'Sometimes for absolutely no reason.', style: 'short' },
  { text: 'You simply exist in so many little corners of my life.', style: 'italic' },
  { text: 'There is something I\'ve never stopped missing.', style: 'normal' },
  { text: 'The way you called me...', style: 'italic' },
  { text: 'Piggu.', style: 'emphasis' },
  { text: 'It\'s such a tiny word.', style: 'short' },
  { text: 'To everyone else, it\'s just a nickname.', style: 'normal' },
  { text: 'To me...', style: 'italic' },
  { text: 'it became home.', style: 'emphasis' },
  { text: 'Sometimes I still hear it inside my memories.', style: 'normal' },
  { text: 'Sometimes I wish I could hear it just one more time.', style: 'italic' },
  { text: 'Life has become confusing.', style: 'normal' },
  { text: 'People tell me to move on.', style: 'short' },
  { text: 'Some tell me to wait.', style: 'short' },
  { text: 'Some tell me to forget.', style: 'short' },
  { text: 'Others tell me to hold on.', style: 'short' },
  { text: 'The truth is...', style: 'italic' },
  { text: 'I honestly don\'t know which one is right.', style: 'normal' },
  { text: 'I\'m standing somewhere between letting go and holding on.', style: 'emphasis' },
  { text: 'I don\'t know what tomorrow holds.', style: 'normal' },
  { text: 'But I do know this—', style: 'italic' },
  { text: 'what I felt for you was real.', style: 'emphasis' },
  { text: 'And because it was real, it isn\'t something I can switch off.', style: 'normal' },
  { text: 'There is only one wish my heart still quietly keeps.', style: 'normal' },
  { text: 'Not another beginning.', style: 'short' },
  { text: 'Not explanations.', style: 'short' },
  { text: 'Not arguments.', style: 'short' },
  { text: 'Not answers.', style: 'short' },
  { text: 'Just one last private meeting.', style: 'emphasis' },
  { text: 'Just once.', style: 'short' },
  { text: 'No questions.', style: 'short' },
  { text: 'No expectations.', style: 'short' },
  { text: 'No trying to fix anything.', style: 'short' },
  { text: 'Just to see you.', style: 'italic' },
  { text: 'To sit across from you.', style: 'short' },
  { text: 'To quietly look at you.', style: 'short' },
  { text: 'To fill my eyes with your face one last time.', style: 'italic' },
  { text: 'To tell my heart,', style: 'short' },
  { text: '"There you are."', style: 'emphasis' },
  { text: 'Maybe then...', style: 'italic' },
  { text: 'those memories would have one more picture to hold onto.', style: 'normal' },
  { text: 'Maybe then...', style: 'italic' },
  { text: 'my heart would finally know peace.', style: 'emphasis' },
  { text: 'I don\'t know.', style: 'short' },
  { text: 'But that\'s the truth.', style: 'normal' },
  { text: 'If life never gives me that chance,', style: 'normal' },
  { text: 'I hope it gives you everything else you\'ve ever wished for.', style: 'emphasis' },
];

const blessings: string[] = [
  'May your dreams become reality.',
  'May your smile always stay the same.',
  'May your family always stay healthy.',
  'May success find you.',
  'May peace never leave you.',
  'May every birthday bring you joy.',
  'May life always be gentle with you.',
];

const gratitudes: string[] = [
  'Every memory.',
  'Every conversation.',
  'Every laugh.',
  'Every photograph.',
  'Every ordinary day that quietly became extraordinary because you were in it.',
];

function Block({ block, index }: { block: Block; index: number }) {
  const baseStyle: React.CSSProperties = { fontFamily: '"Crimson Pro", serif', color: '#4A3428' };

  if (block.style === 'heading') {
    return (
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="mt-10 mb-6"
        style={{ fontFamily: '"Playfair Display", serif', fontSize: '2rem', fontStyle: 'italic', color: '#3D2B1F' }}
      >
        {block.text}
      </motion.h2>
    );
  }

  const style: React.CSSProperties = {
    ...baseStyle,
    fontSize: block.style === 'short' ? '1.15rem' : '1.25rem',
    fontStyle: block.style === 'italic' ? 'italic' : 'normal',
    color:
      block.style === 'emphasis'
        ? '#B85C5C'
        : block.style === 'short'
        ? '#6B4C3B'
        : '#4A3428',
    lineHeight: '1.8',
  };

  return (
    <motion.p
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.04 * Math.min(index, 8) }}
      style={style}
      className={block.style === 'short' ? 'my-1' : 'my-3'}
    >
      {block.text}
    </motion.p>
  );
}

function SprigDivider() {
  return (
    <svg width="160" height="32" viewBox="0 0 160 32" className="my-10 opacity-45 mx-auto block">
      <line x1="10" y1="16" x2="68" y2="16" stroke="#D9A5A5" strokeWidth="0.8" />
      <line x1="92" y1="16" x2="150" y2="16" stroke="#D9A5A5" strokeWidth="0.8" />
      <g transform="translate(80,16)">
        <ellipse cx="0" cy="-9" rx="4" ry="8" fill="#D9A5A5" opacity="0.7" transform="rotate(-40)" />
        <ellipse cx="0" cy="-9" rx="4" ry="8" fill="#F8DCC8" opacity="0.65" transform="rotate(40)" />
        <ellipse cx="0" cy="-9" rx="4" ry="8" fill="#D9A5A5" opacity="0.6" transform="rotate(0)" />
        <circle cx="0" cy="0" r="4" fill="#B85C5C" opacity="0.5" />
      </g>
    </svg>
  );
}

export function MainLetter() {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="paper-card paper-grain px-8 md:px-14 py-12 md:py-16"
        >
          {/* Letter body */}
          {blocks.map((block, i) => (
            <Block key={i} block={block} index={i} />
          ))}

          <SprigDivider />

          {/* Blessings */}
          <div className="my-8 space-y-2">
            {blessings.map((b, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: i * 0.1 }}
                style={{ fontFamily: '"Crimson Pro", serif', fontSize: '1.2rem', color: '#6B4C3B', fontStyle: 'italic', lineHeight: 1.7 }}
              >
                {b}
              </motion.p>
            ))}
          </div>

          <SprigDivider />

          {/* Gratitude */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            style={{ fontFamily: '"Crimson Pro", serif', fontSize: '1.25rem', color: '#4A3428', marginBottom: '0.5rem' }}
          >
            Thank you.
          </motion.p>
          <div className="space-y-1 mb-8">
            {gratitudes.map((g, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                style={{ fontFamily: '"Crimson Pro", serif', fontSize: '1.15rem', color: '#6B4C3B', lineHeight: 1.7 }}
              >
                {g}
              </motion.p>
            ))}
          </div>

          {/* Closing */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="mt-6"
            style={{ fontFamily: '"Crimson Pro", serif', fontSize: '1.25rem', fontStyle: 'italic', color: '#4A3428', lineHeight: 1.9 }}
          >
            You will always be one of the most beautiful chapters of my life.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-4"
            style={{ fontFamily: '"Playfair Display", serif', fontSize: '1.6rem', fontStyle: 'italic', color: '#3D2B1F' }}
          >
            Happy Birthday.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-2"
            style={{ fontFamily: '"Crimson Pro", serif', fontSize: '1.1rem', color: '#9E7E6E' }}
          >
            Always.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.9 }}
            className="mt-4"
            style={{ fontFamily: 'Caveat, cursive', fontSize: '1.6rem', color: '#B85C5C' }}
          >
            — Your Piggu.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
