'use client';
import { Scene } from '@/components/3d/Scene';
import { GUIModal } from '@/components/sections/GUIModal';
import { MatrixRain } from '@/components/terminal/MatrixRain';
import { useTerminalStore } from '@/store/terminal';
import { useEffect } from 'react';
import { Terminal, Briefcase, Code2, Cpu, Mail, FileText, Volume2, VolumeX } from 'lucide-react';
import { sound } from '@/lib/audio';

export default function Home() {
  const { isMatrixActive, theme, soundEnabled, viewMode, activeSection, setViewMode, toggleSound, setTheme } = useTerminalStore();

  // Restore stored theme & sound on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('term_theme') as 'amber' | 'matrix' | 'cyber' | 'dracula' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, [setTheme]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-term-bg select-none">
      {/* Matrix rain easter egg */}
      {isMatrixActive && <MatrixRain />}

      {/* Top persistent engineering HUD */}
      <header className="absolute top-0 left-0 right-0 z-30 px-3 sm:px-6 py-2.5 flex items-center justify-between text-xs font-mono bg-black/60 backdrop-blur-md border-b border-term-border/40 text-term-text/90">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 font-bold text-term-accent tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-term-text animate-pulse" />
            <span className="hidden sm:inline">RITHIK AGRAWAL</span>
            <span className="text-term-dim hidden md:inline">|</span>
            <span className="text-term-dim text-[11px] hidden md:inline">SENIOR SOFTWARE ENGINEER</span>
          </div>
        </div>

        {/* Global Navigation HUD */}
        <div className="flex items-center gap-1.5 sm:gap-3 text-xs">
          <button
            onClick={() => setViewMode('terminal', null)}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-term-subtle text-term-text hover:text-term-accent transition-colors font-semibold"
            title="Terminal CLI Mode"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Terminal</span>
          </button>

          <button
            onClick={() => setViewMode('gui', 'experience')}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-term-subtle text-term-text hover:text-term-accent transition-colors font-semibold"
            title="Experience Timeline"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Experience</span>
          </button>

          <button
            onClick={() => setViewMode('gui', 'projects')}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-term-subtle text-term-text hover:text-term-accent transition-colors font-semibold"
            title="Production Projects"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Projects</span>
          </button>

          <button
            onClick={() => setViewMode('gui', 'skills')}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-term-subtle text-term-text hover:text-term-accent transition-colors font-semibold"
            title="Skills Matrix"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Skills</span>
          </button>

          <button
            onClick={() => setViewMode('gui', 'contact')}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-term-subtle text-term-text hover:text-term-accent transition-colors font-semibold"
            title="Contact Portal"
          >
            <Mail className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Contact</span>
          </button>

          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2 py-1 rounded border border-term-border hover:bg-term-text hover:text-black transition-colors font-bold text-term-accent text-[11px]"
            title="Download Master PDF Resume"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>RESUME</span>
          </a>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Mute Mechanical Audio' : 'Unmute Mechanical Audio'}
            className="p-1 rounded hover:bg-term-subtle text-term-text/70 hover:text-term-accent transition-colors ml-1"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-term-accent" /> : <VolumeX className="w-3.5 h-3.5 opacity-40" />}
          </button>
        </div>
      </header>

      {/* 3D CRT Monitor Scene */}
      <div className={`w-full h-full pt-10 transition-opacity duration-300 ${viewMode === 'gui' ? 'opacity-0 pointer-events-none invisible' : 'opacity-100 visible'}`}>
        <Scene />
      </div>

      {/* GUI Modal Showcase Overlay */}
      <GUIModal />

      {/* Bottom Footer Telemetry */}
      <footer className="absolute bottom-0 left-0 right-0 z-20 px-4 py-1.5 flex items-center justify-between text-[10px] font-mono text-term-dim bg-black/60 border-t border-term-border/30">
        <div className="flex items-center gap-2">
          <span>PORTFOLIO_OS [v2.0]</span>
          <span>•</span>
          <span>THEME: {theme.toUpperCase()}</span>
          <span>•</span>
          <span>AUDIO: {soundEnabled ? 'ACTIVE' : 'MUTED'}</span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <span>HINT: Type &apos;help&apos; or &apos;cd experience&apos;</span>
          <span>•</span>
          <span className="text-term-accent">TAB autocompletes</span>
        </div>
      </footer>
    </main>
  );
}
