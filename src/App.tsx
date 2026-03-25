import { useState } from 'react';
import { motion } from 'motion/react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Trophy, Gamepad2, Music as MusicIcon, Zap } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#00ffff] flex flex-col font-mono selection:bg-[#ff00ff]/30 relative">
      {/* Glitch Overlays */}
      <div className="noise-bg" />
      <div className="scanline" />
      <div className="crt-overlay" />

      {/* Header */}
      <header className="p-4 flex items-center justify-between border-b-2 border-[#ff00ff] bg-[#000000] z-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#ff00ff] flex items-center justify-center jarring-border">
            <Zap className="text-black fill-current" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter italic uppercase glitch-text">NEON_SNAKE.EXE</h1>
            <p className="text-xs text-[#ff00ff] font-bold tracking-[0.3em] uppercase">SYSTEM_OVERRIDE_V1.0</p>
          </div>
        </div>

        <div className="flex items-center gap-12">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-[#ff00ff] uppercase font-bold tracking-[0.2em] mb-1">DATA_STREAM</span>
            <span className="text-4xl font-bold text-[#00ffff] leading-none glitch-text">{score.toString().padStart(4, '0')}</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-[#ff00ff] uppercase font-bold tracking-[0.2em] mb-1">MAX_BUFFER</span>
            <div className="flex items-center gap-2">
              <Trophy size={20} className="text-[#ff00ff] fill-current" />
              <span className="text-4xl font-bold text-[#ff00ff] leading-none glitch-text">{highScore.toString().padStart(4, '0')}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 gap-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          {/* Left Sidebar */}
          <div className="lg:col-span-3 hidden lg:flex flex-col gap-6">
            <div className="p-6 jarring-border bg-[#000000]">
              <div className="flex items-center gap-2 mb-6 text-[#ff00ff]">
                <Gamepad2 size={20} />
                <h2 className="text-sm font-black uppercase tracking-widest">INPUT_MAP</h2>
              </div>
              <ul className="space-y-4 text-xs font-bold text-[#00ffff]">
                <li className="flex justify-between items-center border-b border-[#00ffff]/20 pb-2">
                  <span className="tracking-wider">ARROWS</span> 
                  <span className="bg-[#ff00ff] text-black px-1">VECT_MOVE</span>
                </li>
                <li className="flex justify-between items-center border-b border-[#00ffff]/20 pb-2">
                  <span className="tracking-wider">SPACE</span> 
                  <span className="bg-[#ff00ff] text-black px-1">HALT_PROC</span>
                </li>
              </ul>
            </div>
            
            <div className="p-6 jarring-border bg-[#000000]">
              <div className="flex items-center gap-2 mb-6 text-[#00ffff]">
                <MusicIcon size={20} />
                <h2 className="text-sm font-black uppercase tracking-widest">AUDIO_FEED</h2>
              </div>
              <div className="flex flex-col gap-3">
                <div className="h-3 w-full bg-[#ff00ff]/20 jarring-border" />
                <div className="h-3 w-2/3 bg-[#ff00ff]/20 jarring-border" />
              </div>
            </div>
          </div>

          {/* Center - Game */}
          <div className="lg:col-span-6 flex flex-col items-center gap-8">
            <div className="relative jarring-border p-1 bg-[#ff00ff]">
              <SnakeGame onScoreChange={handleScoreChange} />
            </div>
            
            <div className="lg:hidden w-full max-w-[400px] grid grid-cols-2 gap-6">
              <div className="p-4 jarring-border bg-[#000000] text-center">
                <p className="text-[10px] text-[#ff00ff] uppercase font-bold mb-1">SCORE</p>
                <p className="text-2xl font-bold text-[#00ffff] glitch-text">{score}</p>
              </div>
              <div className="p-4 jarring-border bg-[#000000] text-center">
                <p className="text-[10px] text-[#ff00ff] uppercase font-bold mb-1">BEST</p>
                <p className="text-2xl font-bold text-[#ff00ff] glitch-text">{highScore}</p>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-3 hidden lg:flex flex-col gap-6">
            <div className="p-6 jarring-border bg-[#000000]">
              <h2 className="text-sm font-black uppercase tracking-widest mb-6 text-[#ff00ff]">NODE_HIERARCHY</h2>
              <div className="space-y-6">
                {[
                  { name: 'CYBER_PUNK', score: 2450, color: 'text-[#00ffff]' },
                  { name: 'NEON_GHOST', score: 1820, color: 'text-[#ff00ff]' },
                  { name: 'BIT_RUNNER', score: 1540, color: 'text-[#00ffff]' },
                ].map((player, i) => (
                  <div key={i} className="flex items-center justify-between text-xs font-bold border-l-4 border-[#ff00ff] pl-3">
                    <span className={`${player.color} tracking-tighter`}>{player.name}</span>
                    <span className="text-[#ff00ff]">{player.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="sticky bottom-0 z-50 border-t-4 border-[#00ffff]">
        <MusicPlayer />
      </footer>
    </div>
  );
}
