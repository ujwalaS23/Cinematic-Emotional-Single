import React, { forwardRef, useState, useEffect, useImperativeHandle, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';

export const MusicPlayer = forwardRef<HTMLAudioElement, {}>((props, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const innerRef = useRef<HTMLAudioElement>(null);

  useImperativeHandle(ref, () => innerRef.current as HTMLAudioElement);

  useEffect(() => {
    const audio = innerRef.current;
    if (!audio) return;
    
    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  const togglePlay = () => {
    if (innerRef.current) {
      if (isPlaying) innerRef.current.pause();
      else innerRef.current.play();
    }
  };

  const toggleMute = () => {
    if (innerRef.current) {
      innerRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 glass-card p-3 rounded-full flex items-center gap-4 transition-all duration-300 hover:bg-white/5 group shadow-lg">
      {/* REPLACE: add your mp3 to public/music/background.mp3 */}
      <audio ref={innerRef} src="/music/background.mp3" loop />
      
      <div 
        className={`w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold transition-transform duration-700`} 
        style={{ transform: isPlaying ? 'rotate(360deg)' : 'rotate(0deg)', transitionDuration: '4s', transitionTimingFunction: 'linear', transitionProperty: isPlaying ? 'transform' : 'none' }}
      >
        <Music size={14} className={isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''} />
      </div>

      <div className="flex-col w-32 hidden md:flex transition-opacity duration-300">
        <span className="text-xs font-sans text-gold-pale truncate font-medium tracking-wide">
          {/* REPLACE: [Your Song Here] */}
          My Favorite Memory
        </span>
        <div className="w-full h-1 bg-white/10 rounded-full mt-1.5 overflow-hidden">
          <div className="h-full bg-gold transition-all duration-300 ease-linear" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button onClick={togglePlay} className="text-foreground/80 hover:text-gold transition-colors focus:outline-none p-2 cursor-none">
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
        </button>
        <button onClick={toggleMute} className="text-foreground/80 hover:text-gold transition-colors focus:outline-none p-2 cursor-none hidden md:block">
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>
    </div>
  );
});
