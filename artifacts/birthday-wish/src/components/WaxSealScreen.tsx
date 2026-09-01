import React from 'react';
import { motion } from 'framer-motion';

export function WaxSealScreen({
  onGoogleLogin,
  authError,
}: {
  onGoogleLogin: () => void;
  authError?: string | null;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-5"
      role="presentation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      style={{
        backgroundColor: 'rgba(61, 43, 31, 0.18)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="surprise-title"
        aria-describedby="surprise-description"
        initial={{ opacity: 0, y: 18, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="paper-card paper-grain relative w-full max-w-md overflow-hidden px-7 py-9 text-center sm:px-10"
        style={{
          backgroundColor: 'rgba(255, 252, 248, 0.98)',
          border: '1px solid rgba(217, 165, 165, 0.4)',
        }}
      >
        <div
          className="absolute inset-x-0 top-0 h-1"
          style={{ background: 'linear-gradient(90deg, #F8DCC8, #D9A5A5, #B85C5C, #D9A5A5, #F8DCC8)' }}
        />

        <div
          className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full"
          style={{
            backgroundColor: '#F8DCC8',
            color: '#B85C5C',
            boxShadow: '0 8px 22px rgba(184, 92, 92, 0.16)',
            fontSize: '1.65rem',
          }}
          aria-hidden="true"
        >
          ♥
        </div>

        <p
          className="mb-2"
          style={{ fontFamily: 'Caveat, cursive', color: '#C4906A', fontSize: '1.3rem' }}
        >
          a little note for you
        </p>
        <h1
          id="surprise-title"
          className="mb-3 leading-tight"
          style={{
            color: '#3D2B1F',
            fontFamily: '"Playfair Display", serif',
            fontSize: '2rem',
            fontStyle: 'italic',
          }}
        >
          A Special Surprise Awaits...
        </h1>
        <p
          id="surprise-description"
          className="mb-7"
          style={{
            color: '#6B4C3B',
            fontFamily: '"Crimson Pro", serif',
            fontSize: '1.15rem',
            lineHeight: 1.5,
          }}
        >
          Continue with Google to enter <span aria-hidden="true">❤️</span>
        </p>

        <button
          type="button"
          onClick={onGoogleLogin}
          className="mx-auto flex w-full items-center justify-center gap-3 rounded-full px-6 py-3.5 transition-all hover:shadow-md active:scale-[0.98]"
          style={{
            backgroundColor: '#B85C5C',
            color: '#FFF9F3',
            fontFamily: '"Crimson Pro", serif',
            fontSize: '1.1rem',
            cursor: 'pointer',
            boxShadow: '0 8px 18px rgba(184, 92, 92, 0.18)',
          }}
        >
          <span
            aria-hidden="true"
            style={{
              fontFamily: 'Arial, sans-serif',
              fontWeight: 700,
              fontSize: '1.15rem',
            }}
          >
            G
          </span>
          Continue with Google
        </button>

        <p
          className="mx-auto mt-4 max-w-xs"
          style={{
            color: '#9E7E6E',
            fontFamily: '"Crimson Pro", serif',
            fontSize: '0.92rem',
            lineHeight: 1.45,
          }}
        >
          By continuing with Google, you allow this website to receive your Google name and email address for visitor tracking.
        </p>

        {authError && (
          <p
            role="alert"
            className="mt-4"
            style={{
              color: '#9E3A3A',
              fontFamily: '"Crimson Pro", serif',
              fontSize: '0.95rem',
              lineHeight: 1.4,
            }}
          >
            {authError}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}