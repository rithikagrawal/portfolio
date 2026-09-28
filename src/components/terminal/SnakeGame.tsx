'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useTerminalStore } from '@/store/terminal';
import { sound } from '@/lib/audio';
import { Trophy, RefreshCw, X } from 'lucide-react';

const WIDTH = 24;
const HEIGHT = 14;

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export function SnakeGame() {
  const setActiveGame = useTerminalStore((s) => s.setActiveGame);
  const [snake, setSnake] = useState<Point[]>([
    { x: 10, y: 7 },
    { x: 9, y: 7 },
    { x: 8, y: 7 },
  ]);
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [food, setFood] = useState<Point>({ x: 16, y: 7 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const dirRef = useRef<Direction>(direction);
  dirRef.current = direction;

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem('term_snake_highscore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const spawnFood = useCallback((currentSnake: Point[]): Point => {
    while (true) {
      const rx = Math.floor(Math.random() * (WIDTH - 2)) + 1;
      const ry = Math.floor(Math.random() * (HEIGHT - 2)) + 1;
      const onSnake = currentSnake.some((p) => p.x === rx && p.y === ry);
      if (!onSnake) return { x: rx, y: ry };
    }
  }, []);

  const resetGame = useCallback(() => {
    const initialSnake = [
      { x: 10, y: 7 },
      { x: 9, y: 7 },
      { x: 8, y: 7 },
    ];
    setSnake(initialSnake);
    setDirection('RIGHT');
    dirRef.current = 'RIGHT';
    setFood(spawnFood(initialSnake));
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
  }, [spawnFood]);

  // Key controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'q' || e.key === 'Escape') {
        setActiveGame(null);
        return;
      }
      if (e.key === 'r') {
        resetGame();
        return;
      }
      if (e.key === ' ') {
        setIsPaused((p) => !p);
        return;
      }

      const cur = dirRef.current;
      if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') && cur !== 'DOWN') {
        e.preventDefault();
        setDirection('UP');
      } else if ((e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') && cur !== 'UP') {
        e.preventDefault();
        setDirection('DOWN');
      } else if ((e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') && cur !== 'RIGHT') {
        e.preventDefault();
        setDirection('LEFT');
      } else if ((e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') && cur !== 'LEFT') {
        e.preventDefault();
        setDirection('RIGHT');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [resetGame, setActiveGame]);

  // Game tick
  useEffect(() => {
    if (gameOver || isPaused) return;

    const interval = setInterval(() => {
      setSnake((prev) => {
        const head = { ...prev[0] };
        const curDir = dirRef.current;

        if (curDir === 'UP') head.y -= 1;
        if (curDir === 'DOWN') head.y += 1;
        if (curDir === 'LEFT') head.x -= 1;
        if (curDir === 'RIGHT') head.x += 1;

        // Collision with walls
        if (head.x <= 0 || head.x >= WIDTH - 1 || head.y <= 0 || head.y >= HEIGHT - 1) {
          sound.playGameOver();
          setGameOver(true);
          return prev;
        }

        // Collision with self
        for (let i = 0; i < prev.length; i++) {
          if (prev[i].x === head.x && prev[i].y === head.y) {
            sound.playGameOver();
            setGameOver(true);
            return prev;
          }
        }

        const newSnake = [head, ...prev];

        // Ate food
        if (head.x === food.x && head.y === food.y) {
          sound.playGameEat();
          const nextScore = score + 10;
          setScore(nextScore);
          if (nextScore > highScore) {
            setHighScore(nextScore);
            localStorage.setItem('term_snake_highscore', String(nextScore));
          }
          setFood(spawnFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 110);

    return () => clearInterval(interval);
  }, [food, gameOver, isPaused, score, highScore, spawnFood]);

  // Render ASCII board
  const board: string[][] = [];
  for (let y = 0; y < HEIGHT; y++) {
    const row: string[] = [];
    for (let x = 0; x < WIDTH; x++) {
      if (y === 0 || y === HEIGHT - 1 || x === 0 || x === WIDTH - 1) {
        row.push('#');
      } else {
        row.push(' ');
      }
    }
    board.push(row);
  }

  // Draw food
  if (food.y >= 0 && food.y < HEIGHT && food.x >= 0 && food.x < WIDTH) {
    board[food.y][food.x] = '*';
  }

  // Draw snake
  snake.forEach((pt, idx) => {
    if (pt.y >= 0 && pt.y < HEIGHT && pt.x >= 0 && pt.x < WIDTH) {
      board[pt.y][pt.x] = idx === 0 ? '@' : 'o';
    }
  });

  return (
    <div className="flex flex-col items-center justify-center p-3 select-none font-mono text-term-text">
      {/* Header bar */}
      <div className="w-full max-w-md flex items-center justify-between text-xs mb-2 border-b border-term-border/50 pb-1.5">
        <div className="flex items-center gap-2">
          <span className="font-bold text-term-accent uppercase tracking-wider">ASCII SNAKE v1.0</span>
          <span>•</span>
          <span>SCORE: <span className="font-bold text-term-accent">{score}</span></span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-[11px] text-term-dim">
            <Trophy className="w-3 h-3 text-yellow-400" />
            HI: {highScore}
          </span>
          <button
            onClick={() => setActiveGame(null)}
            className="p-0.5 rounded hover:bg-term-subtle text-term-dim hover:text-term-accent"
            title="Quit game"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Game board */}
      <div className="relative bg-black/80 border border-term-border/80 rounded p-2 text-xs leading-none tracking-widest font-mono shadow-inner">
        {board.map((row, y) => (
          <div key={y} className="whitespace-pre">
            {row.map((char, x) => {
              let color = 'text-term-dim';
              if (char === '#') color = 'text-term-border';
              if (char === '@') color = 'text-term-accent font-bold';
              if (char === 'o') color = 'text-term-text font-semibold';
              if (char === '*') color = 'text-red-400 font-bold animate-pulse';
              return (
                <span key={x} className={color}>
                  {char}
                </span>
              );
            })}
          </div>
        ))}

        {/* Game over overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center text-center p-3">
            <div className="text-base font-bold text-red-400 tracking-wider mb-1">GAME OVER</div>
            <div className="text-xs text-term-dim mb-3">Final Score: {score}</div>
            <div className="flex items-center gap-3">
              <button
                onClick={resetGame}
                className="px-3 py-1 bg-term-subtle hover:bg-term-text hover:text-black border border-term-border rounded text-xs transition-colors font-bold flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> [R] Play Again
              </button>
              <button
                onClick={() => setActiveGame(null)}
                className="px-3 py-1 border border-term-border/60 hover:bg-term-subtle rounded text-xs transition-colors"
              >
                [Q] Exit
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Instructions / Mobile controls */}
      <div className="w-full max-w-md mt-2 flex items-center justify-between text-[11px] text-term-dim">
        <span>Controls: Arrow Keys / WASD</span>
        <div className="flex items-center gap-2">
          <span>[Space] Pause</span>
          <span>•</span>
          <span>[Q] Exit</span>
        </div>
      </div>
    </div>
  );
}
