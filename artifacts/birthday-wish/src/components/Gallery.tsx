import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface PhotoData {
  src: string;      // REPLACE: path to image, e.g. "/photos/photo1.jpg"
  caption: string;
  rotate: number;
  side: 'left' | 'right' | 'center';
}

interface VideoData {
  src: string;      // REPLACE: path to video, e.g. "/videos/video1.mp4"
  caption: string;
  side: 'left' | 'right';
}

/* ── Photo placeholder — replace src with real image path ── */
const photos: PhotoData[] = [
  {
    src: '/photos/photo1.png', // Two of us smiling
    caption: "I don't remember what we were talking about...\nI only remember how happy I felt standing beside you.",
    rotate: -2.5,
    side: 'left',
  },
  {
    src: '/photos/photo2.png', // Home selfie together
    caption: "Some moments never leave.\nThey quietly become part of us.",
    rotate: 2,
    side: 'right',
  },
  {
    src: '/photos/photo3.png', // Dog filter together
    caption: "Two silly people.\nOne ordinary afternoon.\nA memory that somehow became extraordinary.",
    rotate: -1.5,
    side: 'center',
  },
  {
    src: '', // REPLACE: "/photos/photo4.jpg" — Looking at each other
    caption: "You looked at me...\nand for a little while,\nthe whole world felt quieter.",
    rotate: 3,
    side: 'left',
  },
  {
    src: '', // REPLACE: "/photos/photo5.jpg" — Portrait
    caption: "The eyes I'll probably remember for the rest of my life.",
    rotate: -2,
    side: 'right',
  },
  {
    src: '', // REPLACE: "/photos/photo6.jpg" — Selfie together
    caption: "Happiness looked surprisingly simple that day.",
    rotate: 1.5,
    side: 'center',
  },
  {
    src: '', // REPLACE: "/photos/photo7.jpg" — Home selfie
    caption: "Home was never a place.\nSometimes it was simply standing next to you.",
    rotate: -3,
    side: 'left',
  },
];

/* ── Video placeholder ── */
const videos: VideoData[] = [
  {
    src: '', // REPLACE: "/videos/video1.mp4" — Outdoor video
    caption: "We weren't doing anything special.\nMaybe that's why it became special.",
    side: 'right',
  },
];

/* Extra photo placeholder */
const extraPhotos: PhotoData[] = [
  {
    src: '', // REPLACE: "/photos/photo9.jpg" — Cafe picture
    caption: "If someone asked me what peace looked like,\nI'd probably show them this picture.",
    rotate: 2.5,
    side: 'right',
  },
  // Add more photos here as { src, caption, rotate, side }
];

/* ── Photo card (Polaroid) ── */
function PhotoCard({ photo, index }: { photo: PhotoData; index: number }) {
  const alignClass =
    photo.side === 'left'
      ? 'mr-auto ml-4 md:ml-16'
      : photo.side === 'right'
      ? 'ml-auto mr-4 md:mr-16'
      : 'mx-auto';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: 'easeOut', delay: index * 0.08 }}
      className={`${alignClass} mb-12`}
      style={{ maxWidth: 320, transform: `rotate(${photo.rotate}deg)` }}
    >
      <div
        className="polaroid"
        style={{
          backgroundColor: '#FEFCF8',
          padding: '12px 12px 52px 12px',
          boxShadow: '0 2px 8px rgba(61,43,31,0.12), 0 10px 30px rgba(61,43,31,0.08)',
        }}
      >
        {/* Photo area */}
        {photo.src ? (
          <img
            src={photo.src}
            alt={photo.caption.split('\n')[0]}
            loading="lazy"
            className="w-full object-cover"
            style={{ aspectRatio: '3/4', display: 'block' }}
          />
        ) : (
          <div
            className="w-full flex items-center justify-center"
            style={{
              aspectRatio: '3/4',
              background: 'linear-gradient(135deg, #F8DCC8 0%, #F4E9DD 50%, #D9A5A5 100%)',
            }}
          >
            <div className="text-center opacity-40">
              <svg width="40" height="40" viewBox="0 0 40 40" className="mx-auto mb-2">
                <rect x="2" y="2" width="36" height="36" rx="3" fill="none" stroke="#B85C5C" strokeWidth="1.5" />
                <circle cx="14" cy="15" r="4" fill="#B85C5C" opacity="0.5" />
                <path d="M2 28 L12 18 L22 26 L30 18 L38 26 L38 38 L2 38 Z" fill="#B85C5C" opacity="0.3" />
              </svg>
              <p style={{ fontFamily: 'Caveat, cursive', fontSize: '0.85rem', color: '#B85C5C' }}>
                Add photo
              </p>
            </div>
          </div>
        )}

        {/* Caption */}
        <p
          className="mt-3 text-center leading-snug"
          style={{
            fontFamily: 'Caveat, cursive',
            fontSize: '1rem',
            color: '#6B4C3B',
            whiteSpace: 'pre-line',
          }}
        >
          {photo.caption}
        </p>
      </div>
    </motion.div>
  );
}

/* ── Video card ── */
function VideoCard({ video, index }: { video: VideoData; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const alignClass = video.side === 'left' ? 'mr-auto ml-4 md:ml-16' : 'ml-auto mr-4 md:mr-16';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, ease: 'easeOut', delay: index * 0.1 }}
      className={`${alignClass} mb-12`}
      style={{ maxWidth: 340 }}
    >
      <div
        style={{
          backgroundColor: '#FEFCF8',
          padding: '12px 12px 52px 12px',
          boxShadow: '0 2px 8px rgba(61,43,31,0.12), 0 10px 30px rgba(61,43,31,0.08)',
        }}
      >
        {video.src ? (
          <video
            ref={videoRef}
            src={video.src}
            muted
            loop
            playsInline
            className="w-full object-cover"
            style={{ aspectRatio: '4/3', display: 'block' }}
          />
        ) : (
          <div
            className="w-full flex items-center justify-center"
            style={{
              aspectRatio: '4/3',
              background: 'linear-gradient(135deg, #F4E9DD 0%, #F8DCC8 60%, #D9A5A5 100%)',
            }}
          >
            <div className="text-center opacity-40">
              <svg width="44" height="44" viewBox="0 0 44 44" className="mx-auto mb-2">
                <rect x="2" y="6" width="30" height="32" rx="3" fill="none" stroke="#B85C5C" strokeWidth="1.5" />
                <polygon points="18,16 34,22 18,28" fill="#B85C5C" opacity="0.5" />
              </svg>
              <p style={{ fontFamily: 'Caveat, cursive', fontSize: '0.85rem', color: '#B85C5C' }}>
                Add video
              </p>
            </div>
          </div>
        )}
        <p
          className="mt-3 text-center leading-snug"
          style={{ fontFamily: 'Caveat, cursive', fontSize: '1rem', color: '#6B4C3B', whiteSpace: 'pre-line' }}
        >
          {video.caption}
        </p>
      </div>
    </motion.div>
  );
}

/* ── Scrapbook tape decoration ── */
function Tape({ rotate = 0, color = 'rgba(248,220,200,0.65)' }: { rotate?: number; color?: string }) {
  return (
    <div
      style={{
        width: 60,
        height: 20,
        backgroundColor: color,
        transform: `rotate(${rotate}deg)`,
        margin: '-10px auto',
        position: 'relative',
        zIndex: 2,
        boxShadow: '0 1px 3px rgba(61,43,31,0.1)',
      }}
    />
  );
}

export function Gallery() {
  const allPhotos = [...photos, ...extraPhotos];

  return (
    <section className="py-8 md:py-16 px-4 overflow-hidden">
      {/* Section heading */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="text-center mb-16"
      >
        <p style={{ fontFamily: 'Caveat, cursive', color: '#B85C5C', fontSize: '1.3rem', opacity: 0.7 }}>
          — a few photographs I still love —
        </p>
      </motion.div>

      {/* Photos interspersed with tape decoration */}
      <div className="max-w-3xl mx-auto">
        {allPhotos.slice(0, 4).map((photo, i) => (
          <React.Fragment key={i}>
            {i === 2 && <Tape rotate={-2} />}
            <PhotoCard photo={photo} index={i} />
          </React.Fragment>
        ))}

        {/* Video interspersed */}
        {videos.map((video, i) => (
          <VideoCard key={`v${i}`} video={video} index={i} />
        ))}

        {allPhotos.slice(4).map((photo, i) => (
          <React.Fragment key={`b${i}`}>
            {i === 1 && <Tape rotate={3} color="rgba(217,165,165,0.5)" />}
            <PhotoCard photo={photo} index={i + 4} />
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
