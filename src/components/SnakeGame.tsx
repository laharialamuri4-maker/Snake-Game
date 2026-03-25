import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = 'UP';
const BASE_SPEED = 160;
const MIN_SPEED = 60;

export const SnakeGame: React.FC<SnakeGameProps> = ({ onScoreChange }) => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState<string>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const currentSpeed = Math.max(MIN_SPEED, BASE_SPEED - Math.floor(score / 50) * 5);

  const generateFood = useCallback(() => {
    const newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setIsGameOver(false);
    setScore(0);
    onScoreChange(0);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      if (newHead.x === food.x && newHead.y === food.y) {
        const newScore = score + 10;
        setScore(newScore);
        onScoreChange(newScore);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, score, generateFood, onScoreChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused(prev => !prev); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, currentSpeed);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, isPaused, isGameOver, currentSpeed]);

  return (
    <div className="relative w-full max-w-[400px] aspect-square bg-[#000000] border-4 border-[#ff00ff] overflow-hidden">
      {/* Grid */}
      <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 opacity-20 pointer-events-none">
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
          <div key={i} className="border-[0.5px] border-[#00ffff]/30" />
        ))}
      </div>

      {/* Snake */}
      {snake.map((segment, i) => (
        <motion.div
          key={`${segment.x}-${segment.y}-${i}`}
          initial={false}
          animate={{ x: segment.x * (100 / GRID_SIZE) + '%', y: segment.y * (100 / GRID_SIZE) + '%' }}
          className="absolute w-[5%] h-[5%] p-[1px]"
        >
          <div className={`w-full h-full ${i === 0 ? 'bg-[#00ffff] border-2 border-[#ffffff]' : 'bg-[#00ffff]/60'}`} />
        </motion.div>
      ))}

      {/* Food */}
      <motion.div
        animate={{ scale: [1, 1.5, 1], rotate: [0, 90, 180, 270, 360] }}
        transition={{ repeat: Infinity, duration: 0.5 }}
        className="absolute w-[5%] h-[5%] p-[1px]"
        style={{ left: food.x * (100 / GRID_SIZE) + '%', top: food.y * (100 / GRID_SIZE) + '%' }}
      >
        <div className="w-full h-full bg-[#ff00ff] border-2 border-white" />
      </motion.div>

      {/* Overlays */}
      <AnimatePresence>
        {(isPaused || isGameOver) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#000000]/90 flex flex-col items-center justify-center z-10"
          >
            {isGameOver ? (
              <>
                <h2 className="text-5xl font-black text-[#ff00ff] mb-4 tracking-tighter italic glitch-text">SYS_CRASH</h2>
                <p className="text-[#00ffff] mb-8 font-bold text-xl uppercase">SCORE_DUMP: {score}</p>
                <button
                  onClick={resetGame}
                  className="jarring-button text-2xl"
                >
                  REBOOT_SYS
                </button>
              </>
            ) : (
              <>
                <h2 className="text-5xl font-black text-[#00ffff] mb-8 tracking-tighter italic glitch-text">PROC_HALT</h2>
                <button
                  onClick={() => setIsPaused(false)}
                  className="jarring-button text-2xl"
                >
                  RESUME_PROC
                </button>
                <p className="mt-6 text-sm text-[#ff00ff] font-bold uppercase tracking-[0.2em]">INPUT SPACE TO OVERRIDE</p>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
