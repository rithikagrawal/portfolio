'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useTerminalStore } from '@/store/terminal';
import { sound } from '@/lib/audio';
import { Trophy, RefreshCw, X } from 'lucide-react';

const WIDTH = 30;
const HEIGHT = 13;
const PADDLE_HEIGHT = 3;

export function PongGame() {
  const setActiveGame = useTerminalStore((s) => s.setActiveGame);
  const [playerY, setPlayerY] = useState(5);
  const [cpuY, setCpuY] = useState(5);
  const [ball, setBall] = useState({ x: 15, y: 6, vx: 1, vy: 0.5 });
  const [playerScore, setPlayerScore] = useState(0);
  const [cpuScore, setCpuScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<'PLAYER' | 'CPU' | null>(null);

  const playerYRef = useRef(playerY);
  playerYRef.current = playerY;
  const cpuYRef = useRef(cpuY);
  cpuYRef.current = cpuY;

  const resetBall = (direction: 1 | -1) => {
    setBall({
      x: 15,
      y: 6,
      vx: direction * (Math.random() > 0.5 ? 1 : 0.9),
      vy: (Math.random() - 0.5) * 1.2,
    });
  };

  const resetMatch = useCallback(() => {
    setPlayerScore(0);
    setCpuScore(0);
    setPlayerY(5);
    setCpuY(5);
    setGameOver(false);
    setWinner(null);
    resetBall(1);
  }, []);

  // Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'q' || e.key === 'Escape') {
        setActiveGame(null);
        return;
      }
      if (e.key === 'r') {
        resetMatch();
        return;
      }

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        setPlayerY((y) => Math.max(1, y - 1));
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setPlayerY((y) => Math.min(HEIGHT - 1 - PADDLE_HEIGHT, y + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [resetMatch, setActiveGame]);

  // Game loop
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      // Move CPU paddle toward ball with slight reaction delay
      setCpuY((cy) => {
        const target = ball.y - Math.floor(PADDLE_HEIGHT / 2);
        if (cy < target && Math.random() > 0.25) {
          return Math.min(HEIGHT - 1 - PADDLE_HEIGHT, cy + 1);
        } else if (cy > target && Math.random() > 0.25) {
          return Math.max(1, cy - 1);
        }
        return cy;
      });

      setBall((prev) => {
        let nx = prev.x + prev.vx;
        let ny = prev.y + prev.vy;
        let nvx = prev.vx;
        let nvy = prev.vy;

        // Bounce top/bottom walls
        if (ny <= 1) {
          ny = 1;
          nvy = Math.abs(nvy);
          sound.playPongHit();
        } else if (ny >= HEIGHT - 2) {
          ny = HEIGHT - 2;
          nvy = -Math.abs(nvy);
          sound.playPongHit();
        }

        // Left paddle collision (Player)
        const py = playerYRef.current;
        if (nx <= 2 && nx >= 1) {
          if (ny >= py && ny <= py + PADDLE_HEIGHT) {
            nvx = Math.abs(nvx) * 1.05; // slight speedup
            nvy += (ny - (py + PADDLE_HEIGHT / 2)) * 0.4;
            nx = 2;
            sound.playPongHit();
          }
        }

        // Right paddle collision (CPU)
        const cy = cpuYRef.current;
        if (nx >= WIDTH - 3 && nx <= WIDTH - 2) {
          if (ny >= cy && ny <= cy + PADDLE_HEIGHT) {
            nvx = -Math.abs(nvx) * 1.05;
            nvy += (ny - (cy + PADDLE_HEIGHT / 2)) * 0.4;
            nx = WIDTH - 3;
            sound.playPongHit();
          }
        }

        // Left wall miss (CPU scores)
        if (nx < 1) {
          sound.playGameOver();
          setCpuScore((s) => {
            const next = s + 1;
            if (next >= 5) {
              setGameOver(true);
              setWinner('CPU');
            } else {
              setTimeout(() => resetBall(1), 300);
            }
            return next;
          });
          return { x: 15, y: 6, vx: 0, vy: 0 };
        }

        // Right wall miss (Player scores)
        if (nx > WIDTH - 2) {
          sound.playPongScore();
          setPlayerScore((s) => {
            const next = s + 1;
            if (next >= 5) {
              setGameOver(true);
              setWinner('PLAYER');
            } else {
              setTimeout(() => resetBall(-1), 300);
            }
            return next;
          });
          return { x: 15, y: 6, vx: 0, vy: 0 };
        }

        return { x: nx, y: ny, vx: nvx, vy: nvy };
      });
    }, 85);

    return () => clearInterval(interval);
  }, [ball.y, gameOver]);

  // Construct ASCII court
  const court: string[][] = [];
  for (let y = 0; y < HEIGHT; y++) {
    const row: string[] = [];
    for (let x = 0; x < WIDTH; x++) {
      if (y === 0 || y === HEIGHT - 1) {
        row.push('-');
      } else if (x === 0 || x === WIDTH - 1) {
        row.push('|');
      } else if (x === Math.floor(WIDTH / 2)) {
        row.push(':');
      } else {
        row.push(' ');
      }
    }
    court.push(row);
  }

  // Draw player paddle
  for (let i = 0; i < PADDLE_HEIGHT; i++) {
    if (playerY + i < HEIGHT - 1 && playerY + i >= 1) {
      court[playerY + i][1] = ']';
    }
  }

  // Draw CPU paddle
  for (let i = 0; i < PADDLE_HEIGHT; i++) {
    if (cpuY + i < HEIGHT - 1 && cpuY + i >= 1) {
      court[cpuY + i][WIDTH - 2] = '[';
    }
  }

  // Draw ball
  const bx = Math.round(ball.x);
  const by = Math.round(ball.y);
  if (by >= 1 && by < HEIGHT - 1 && bx >= 1 && bx < WIDTH - 1) {
    court[by][bx] = 'O';
  }

  return (
    <div className="flex flex-col items-center justify-center p-3 select-none font-mono text-term-text">
      {/* Header bar */}
      <div className="w-full max-w-lg flex items-center justify-between text-xs mb-2 border-b border-term-border/50 pb-1.5">
        <span className="font-bold text-term-accent tracking-wider">ASCII PONG — FIRST TO 5</span>
        <div className="flex items-center gap-3">
          <span className="text-xs">
            YOU <span className="font-bold text-term-accent">{playerScore}</span> : <span className="font-bold text-red-400">{cpuScore}</span> CPU
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

      {/* Court */}
      <div className="relative bg-black/80 border border-term-border/80 rounded p-2 text-xs leading-none tracking-widest font-mono shadow-inner">
        {court.map((row, y) => (
          <div key={y} className="whitespace-pre">
            {row.map((char, x) => {
              let color = 'text-term-dim';
              if (char === '-' || char === '|') color = 'text-term-border';
              if (char === ':') color = 'text-term-dim/40';
              if (char === ']') color = 'text-term-accent font-bold';
              if (char === '[') color = 'text-red-400 font-bold';
              if (char === 'O') color = 'text-white font-bold';
              return (
                <span key={x} className={color}>
                  {char}
                </span>
              );
            })}
          </div>
        ))}

        {/* Winner overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center text-center p-3">
            <div className={`text-base font-bold tracking-wider mb-1 ${winner === 'PLAYER' ? 'text-green-400' : 'text-red-400'}`}>
              {winner === 'PLAYER' ? 'VICTORY! YOU WIN!' : 'CPU DEFEATED YOU!'}
            </div>
            <div className="text-xs text-term-dim mb-3">Score: {playerScore} - {cpuScore}</div>
            <div className="flex items-center gap-3">
              <button
                onClick={resetMatch}
                className="px-3 py-1 bg-term-subtle hover:bg-term-text hover:text-black border border-term-border rounded text-xs transition-colors font-bold flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> [R] Rematch
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

      <div className="w-full max-w-lg mt-2 flex items-center justify-between text-[11px] text-term-dim">
        <span>Controls: Up/Down Arrows or W/S</span>
        <div className="flex items-center gap-2">
          <span>[R] Reset</span>
          <span>•</span>
          <span>[Q] Exit</span>
        </div>
      </div>
    </div>
  );
}
