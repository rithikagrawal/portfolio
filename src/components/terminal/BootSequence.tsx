'use client';
import { useEffect, useState } from 'react';
import { sound } from '@/lib/audio';

const BOOT_LOGS = [
  '[    0.000000] Linux version 6.8.0-portfolio-arch (x86_64)',
  '[    0.012491] Command line: BOOT_IMAGE=/vmlinuz-linux root=UUID=portfolio-arch ro quiet',
  '[    0.024810] CPU: Senior Full Stack Engineer (Python/FastAPI/Angular) @ 4.80GHz',
  '[    0.038102] Memory: 15M+ active users served | 30+ international countries supported',
  '[    0.052194] ACPI: Core architectures initialized (Microservices, RESTful APIs, TDD)',
  '[    0.068411] Loading kernel modules: [flask] [fastapi] [postgresql] [angular] [docker]',
  '[    0.082103] Initializing network interfaces: [https://github.com/rithik-agrawal]',
  '[    0.098492] System security: JWT / OAuth 2.0 / RBAC zero-trust protocols [ACTIVE]',
  '[    0.114820] PostgreSQL cluster connected: P95 query latency reduced by 35%',
  '[    0.131201] CI/CD automated blue-green pipeline [HEALTHY] — 50% cycle time reduction',
  '[    0.148902] Audio synthesizer initialized: Web Audio procedural engine [OK]',
  '[    0.165410] CRT Display Engine: Phosphor Amber 3D WebGL renderer [ACTIVE]',
  '[    0.180291] System services started: 100% services online.',
  '[    0.198210] Welcome to Rithik Agrawal\'s Engineering Dossier.',
  '[    0.210000] Type \'help\' or click chips below to navigate.',
];

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    sound.playBootChime();
    let currentLine = 0;

    const interval = setInterval(() => {
      if (currentLine < BOOT_LOGS.length) {
        setLines((prev) => [...prev, BOOT_LOGS[currentLine]]);
        setProgress(Math.round(((currentLine + 1) / BOOT_LOGS.length) * 100));
        currentLine++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 350);
      }
    }, 70);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="font-mono text-xs text-term-text/90 leading-relaxed p-4 select-none">
      <div className="mb-3 text-term-accent font-bold tracking-widest text-sm flex items-center justify-between">
        <span>[ PORTFOLIO_OS KERNEL INITIALIZATION ]</span>
        <span>{progress}%</span>
      </div>

      <div className="w-full bg-term-subtle h-1.5 rounded mb-4 overflow-hidden">
        <div
          className="bg-term-text h-full transition-all duration-75"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="space-y-1 overflow-hidden">
        {lines.map((line, idx) => (
          <div key={idx} className="whitespace-pre-wrap font-mono text-[11px] opacity-90">
            {line}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-2 text-term-accent text-xs">
        <span className="inline-block w-2.5 h-4 bg-term-text animate-caret" />
        <span>Bootstrapping interactive shell...</span>
      </div>
    </div>
  );
}
