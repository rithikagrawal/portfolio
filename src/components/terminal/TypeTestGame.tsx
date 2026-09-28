'use client';
import { useState, useEffect, useRef } from 'react';
import { useTerminalStore } from '@/store/terminal';
import { sound } from '@/lib/audio';
import { Zap, RotateCcw, ArrowLeft, Trophy } from 'lucide-react';

const CODE_SNIPPETS = [
  `async def get_connection_pool():\n    return await asyncpg.create_pool(dsn=DATABASE_URL, min_size=10, max_size=50)`,
  `@app.middleware("http")\nasync def add_process_time_header(request: Request, call_next):\n    return await call_next(request)`,
  `const redisClient = createClient({ url: process.env.REDIS_URL });\nawait redisClient.connect();`,
  `func HandleSignaling(w http.ResponseWriter, r *http.Request) {\n    conn, err := upgrader.Upgrade(w, r, nil)\n}`,
];

export function TypeTestGame() {
  const setActiveApp = useTerminalStore((s) => s.setActiveGame);
  const [snippetIndex, setSnippetIndex] = useState(0);
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const targetCode = CODE_SNIPPETS[snippetIndex];
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sound.playEnter();
        setActiveApp(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveApp]);

  // Timer loop
  useEffect(() => {
    if (!startTime || isCompleted) return;
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 200);
    return () => clearInterval(interval);
  }, [startTime, isCompleted]);

  const handleInputChange = (val: string) => {
    if (!startTime) setStartTime(Date.now());
    sound.playKeypress();
    setInput(val);

    if (val === targetCode) {
      sound.playEnter();
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    sound.playKeypress();
    setInput('');
    setStartTime(null);
    setElapsed(0);
    setIsCompleted(false);
    setSnippetIndex((prev) => (prev + 1) % CODE_SNIPPETS.length);
    inputRef.current?.focus();
  };

  // Metric calculations
  const totalChars = input.length;
  let correctChars = 0;
  for (let i = 0; i < input.length; i++) {
    if (input[i] === targetCode[i]) correctChars++;
  }

  const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
  const minutes = Math.max(elapsed / 60, 0.05);
  const wpm = Math.round(correctChars / 5 / minutes);

  const getRank = (w: number) => {
    if (w >= 85) return 'Senior Kernel Hacker 🚀';
    if (w >= 65) return 'Distributed Systems Architect ⚡';
    if (w >= 45) return 'Senior Backend Engineer 💻';
    return 'Human Debugger 🛠️';
  };

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="flex flex-col h-full w-full bg-black/95 text-term-text font-mono text-xs select-none p-4 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-term-border/50 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveApp(null)}
            className="flex items-center gap-1 px-2 py-1 bg-term-subtle border border-term-border rounded text-[11px] hover:bg-term-text hover:text-black font-bold"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>EXIT (q)</span>
          </button>
          <span className="font-bold text-term-accent text-sm flex items-center gap-1.5">
            <Zap className="w-4 h-4" />
            TERMINAL CODING SPEED TEST
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold">
          <div>Time: <span className="text-term-accent">{elapsed}s</span></div>
          <div>WPM: <span className="text-term-accent">{wpm}</span></div>
          <div>Accuracy: <span className="text-term-accent">{accuracy}%</span></div>
        </div>
      </div>

      {/* Target Code Snippet Display */}
      <div className="flex-1 border border-term-border/50 rounded-lg p-4 bg-black/70 flex flex-col justify-center">
        <div className="text-[11px] text-term-dim uppercase tracking-wider mb-2">
          Snippet {snippetIndex + 1} of {CODE_SNIPPETS.length}:
        </div>

        <div className="text-sm font-mono leading-relaxed whitespace-pre font-bold p-3 bg-term-subtle/20 rounded border border-term-border/30">
          {targetCode.split('').map((char, i) => {
            const isTyped = i < input.length;
            const isCorrect = isTyped && input[i] === char;
            const isCurrent = i === input.length;

            return (
              <span
                key={i}
                className={
                  isCurrent
                    ? 'bg-term-text text-black font-bold animate-pulse'
                    : isTyped
                    ? isCorrect
                      ? 'text-green-400'
                      : 'bg-red-500/60 text-white'
                    : 'text-term-dim/60'
                }
              >
                {char}
              </span>
            );
          })}
        </div>

        {/* Hidden capturing input */}
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          className="opacity-0 absolute -top-96"
          autoFocus
        />
      </div>

      {/* Results Card if Completed */}
      {isCompleted ? (
        <div className="border border-green-500/60 rounded-lg p-3 bg-green-500/10 text-center space-y-2">
          <Trophy className="w-8 h-8 text-term-accent mx-auto" />
          <div className="text-base font-bold text-green-400">TEST COMPLETED!</div>
          <div className="text-xs text-term-text font-bold">
            Rank: <span className="text-term-accent">{getRank(wpm)}</span>
          </div>
          <div className="text-xs text-term-dim">
            Speed: <span className="font-bold text-term-text">{wpm} WPM</span> · Accuracy:{' '}
            <span className="font-bold text-term-text">{accuracy}%</span> · Time:{' '}
            <span className="font-bold text-term-text">{elapsed}s</span>
          </div>
          <button
            onClick={handleReset}
            className="px-4 py-1.5 bg-term-text text-black font-bold text-xs rounded hover:opacity-90 uppercase inline-flex items-center gap-1.5 mt-1"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Next Snippet
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between text-[11px] text-term-dim border-t border-term-border/40 pt-2">
          <span>Click anywhere and begin typing to start timer.</span>
          <button
            onClick={handleReset}
            className="hover:text-term-text underline flex items-center gap-1 font-semibold"
          >
            <RotateCcw className="w-3 h-3" /> Skip Snippet
          </button>
        </div>
      )}
    </div>
  );
}
