import React from 'react';
import { motion } from 'framer-motion';

const moments = [
  {
    icon: '🏍️',
    title: 'His Bike',
    text: 'He went and got his own bike. That independence, that quiet pride — I saw it and my heart just swelled.',
  },
  {
    icon: '🏢',
    title: 'Deloitte',
    text: 'His dream company. He didn\'t just wish for it — he worked for it, earned it, and walked right through that door. That still makes me smile.',
  },
  {
    icon: '💪',
    title: 'Taking Care of Himself',
    text: 'Physically stronger, healthier, more himself than ever. He chose to show up for his own body, and it shows.',
  },
  {
    icon: '✨',
    title: 'That Face, Though',
    text: 'Handsome. Genuinely, unfairly good-looking. I am not going to pretend I didn\'t notice.',
  },
  {
    icon: '💸',
    title: 'Earning, Growing',
    text: 'He is building something real for himself. Every month, every paycheck — that is his hard work, his discipline, his future.',
  },
  {
    icon: '🤱',
    title: 'Making His Mom Proud',
    text: 'Of everything on this list, this one means the most. A boy who makes his mother proud is already someone special.',
  },
];

export function ProudOf() {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="text-center mb-14"
        >
          <p
            style={{
              fontFamily: 'Caveat, cursive',
              fontSize: '1.15rem',
              color: '#C4906A',
              letterSpacing: '0.08em',
              marginBottom: '0.4rem',
            }}
          >
            a little note before the letter
          </p>
          <h2
            style={{
              fontFamily: '"Playfair Display", serif',
              fontSize: '2rem',
              fontStyle: 'italic',
              color: '#3D2B1F',
              lineHeight: 1.3,
            }}
          >
            Things that made me <span style={{ color: '#B85C5C' }}>so proud of you.</span>
          </h2>
          <p
            style={{
              fontFamily: '"Crimson Pro", serif',
              fontSize: '1.15rem',
              fontStyle: 'italic',
              color: '#9E7E6E',
              marginTop: '0.75rem',
            }}
          >
            I am happy for you, Karthiii. Truly, deeply, quietly happy.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="space-y-5">
          {moments.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.08 }}
              className="paper-card paper-grain flex gap-5 items-start px-7 py-6"
            >
              <span style={{ fontSize: '2rem', lineHeight: 1, flexShrink: 0, marginTop: '0.1rem' }}>
                {m.icon}
              </span>
              <div>
                <p
                  style={{
                    fontFamily: '"Playfair Display", serif',
                    fontSize: '1.2rem',
                    fontStyle: 'italic',
                    color: '#B85C5C',
                    marginBottom: '0.3rem',
                  }}
                >
                  {m.title}
                </p>
                <p
                  style={{
                    fontFamily: '"Crimson Pro", serif',
                    fontSize: '1.15rem',
                    color: '#4A3428',
                    lineHeight: 1.8,
                  }}
                >
                  {m.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Closing line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="text-center mt-14"
          style={{
            fontFamily: 'Caveat, cursive',
            fontSize: '1.6rem',
            color: '#B85C5C',
            lineHeight: 1.7,
          }}
        >
          Look how far you've come, Karthiii. ❤️<br />
          <span
            style={{
              fontFamily: '"Crimson Pro", serif',
              fontSize: '1.1rem',
              fontStyle: 'italic',
              color: '#9E7E6E',
            }}
          >
            I am so, so happy for you.
          </span>
        </motion.p>

      </div>
    </section>
  );
}
