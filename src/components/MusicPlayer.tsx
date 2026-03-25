import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music as MusicIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DUMMY_TRACKS = [
  {
    id: '1',
    title: "NEON_VOID.EXE",
    artist: "CYBER_GHOST",
    cover: "https://picsum.photos/seed/cyber1/400/400",
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: 184
  },
  {
    id: '2',
    title: "GLITCH_PROTOCOL",
    artist: "NULL_POINTER",
    cover: "https://picsum.photos/seed/cyber2/400/400",
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: 215
  },
  {
    id: '3',
    title: "SYNTH_REBELLION",
    artist: "BIT_CRUSHER",
    cover: "https://picsum.photos/seed/cyber3/400/400",
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: 156
  }
];

export const MusicPlayer: React.FC = () => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleTrackEnd = () => {
    handleNext();
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-md bg-[#000000] border-4 border-[#00ffff] p-6 relative overflow-hidden">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />

      {/* Background Glitch Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ff00ff] to-transparent mix-blend-overlay" />
      </div>

      <div className="relative z-10">
        {/* Track Info */}
        <div className="flex items-center gap-6 mb-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-[#ff00ff] blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative w-24 h-24 border-2 border-[#ff00ff] overflow-hidden">
              <img 
                src={currentTrack.cover} 
                alt={currentTrack.title}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-[#00ffff]/20 mix-blend-color" />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-2xl font-black text-[#00ffff] truncate tracking-tighter italic glitch-text">
              {currentTrack.title}
            </h3>
            <p className="text-[#ff00ff] font-bold text-sm uppercase tracking-widest">
              {currentTrack.artist}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-4 bg-[#111111] border-2 border-[#00ffff] relative overflow-hidden">
            <motion.div 
              className="h-full bg-[#00ffff] relative"
              initial={false}
              animate={{ width: `${progress}%` }}
              transition={{ type: 'spring', bounce: 0, duration: 0.5 }}
            >
              <div className="absolute inset-0 bg-white/30 animate-pulse" />
            </motion.div>
          </div>
          <div className="flex justify-between mt-2 text-[10px] font-mono text-[#00ffff] font-bold">
            <span>{formatTime((progress / 100) * currentTrack.duration)}</span>
            <span>{formatTime(currentTrack.duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between gap-4">
          <button 
            onClick={handlePrev}
            className="p-3 border-2 border-[#ff00ff] text-[#ff00ff] hover:bg-[#ff00ff] hover:text-black transition-all active:scale-95"
          >
            <SkipBack size={24} fill="currentColor" />
          </button>

          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="jarring-button flex-1 flex items-center justify-center gap-2 py-4"
          >
            {isPlaying ? (
              <>
                <Pause size={28} fill="currentColor" />
                <span className="text-xl font-black italic">HALT_AUDIO</span>
              </>
            ) : (
              <>
                <Play size={28} fill="currentColor" />
                <span className="text-xl font-black italic">INIT_AUDIO</span>
              </>
            )}
          </button>

          <button 
            onClick={handleNext}
            className="p-3 border-2 border-[#ff00ff] text-[#ff00ff] hover:bg-[#ff00ff] hover:text-black transition-all active:scale-95"
          >
            <SkipForward size={24} fill="currentColor" />
          </button>
        </div>

        {/* Visualizer Mockup */}
        <div className="mt-8 flex items-end justify-between h-12 gap-1">
          {Array.from({ length: 24 }).map((_, i) => (
            <motion.div
              key={i}
              className="flex-1 bg-[#00ffff]/40"
              animate={{ 
                height: isPlaying ? [
                  Math.random() * 100 + '%', 
                  Math.random() * 100 + '%', 
                  Math.random() * 100 + '%'
                ] : '10%' 
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 0.5, 
                delay: i * 0.02 
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
