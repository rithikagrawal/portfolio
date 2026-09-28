'use client';
import { useState, useEffect } from 'react';
import { useTerminalStore } from '@/store/terminal';
import { sound } from '@/lib/audio';
import { Radio, Play, Pause, SkipForward, ArrowLeft, Volume2 } from 'lucide-react';

const TRACK_NAMES = [
  '01. Amber Waves — Cyberpunk Arpeggio (8-Bit)',
  '02. Phosphor Dream — Lo-Fi Chiptune (C Major)',
  '03. Silicon Highway — High-Throughput Synthwave',
  '04. Midnight Terminal — Deep Ambient Phosphor',
];

const BARS_COUNT = 16;
const CHARS = [' ', ' ', '▂', '▃', '▄', '▅', '▆', '▇', '█'];

export function RadioView() {
  const setActiveApp = useTerminalStore((s) => s.setActiveGame);
  const isPlaying = useTerminalStore((s) => s.isRadioPlaying);
  const toggleRadioStore = useTerminalStore((s) => s.toggleRadio);
  const trackIndex = useTerminalStore((s) => s.radioTrackIndex);
  const nextTrackStore = useTerminalStore((s) => s.nextRadioTrack);

  const [spectrum, setSpectrum] = useState<number[]>(new Array(BARS_COUNT).fill(1));

  // Keydown listener for q/Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'q' || e.key === 'Escape') {
        sound.playEnter();
        setActiveApp(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveApp]);

  // Dancing ASCII spectrum simulation
  useEffect(() => {
    if (!isPlaying) {
      setSpectrum(new Array(BARS_COUNT).fill(1));
      return;
    }

    const timer = setInterval(() => {
      setSpectrum(
        Array.from({ length: BARS_COUNT }, () => Math.floor(Math.random() * (CHARS.length - 2)) + 1)
      );
    }, 120);

    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleTogglePlay = () => {
    const next = toggleRadioStore();
    if (next) {
      sound.startRadio(trackIndex);
    } else {
      sound.stopRadio();
    }
  };

  const handleNextTrack = () => {
    const nextTrack = nextTrackStore();
    if (isPlaying) {
      sound.startRadio(nextTrack);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-black/95 text-term-text font-mono text-xs select-none p-4 space-y-4">
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
            <Radio className="w-4 h-4 text-term-accent animate-pulse" />
            PROCEDURAL CHIPTUNE RADIO
          </span>
        </div>
        <span className="text-[11px] text-green-400 font-bold flex items-center gap-1">
          <Volume2 className="w-3.5 h-3.5" />
          {isPlaying ? 'STREAMING ACTIVE' : 'PAUSED'}
        </span>
      </div>

      {/* Track Info Card */}
      <div className="border border-term-border/50 rounded-lg p-4 bg-black/80 space-y-3">
        <div className="text-[10px] text-term-dim uppercase tracking-wider font-bold">Now Playing:</div>
        <div className="text-sm font-bold text-term-accent truncate">
          {TRACK_NAMES[trackIndex]}
        </div>
        <div className="text-[11px] text-term-dim">
          Synthesized in real-time via Web Audio API oscillators · Zero MP3 latency
        </div>

        {/* Dancing ASCII Spectrum (cava style) */}
        <div className="border border-term-border/30 rounded p-3 bg-term-subtle/20 text-center font-mono">
          <div className="text-xl sm:text-2xl text-term-accent tracking-widest font-bold select-none h-12 flex items-center justify-center gap-1">
            {spectrum.map((val, idx) => (
              <span key={idx} className="transition-all duration-75">
                {CHARS[val]}
              </span>
            ))}
          </div>
          <div className="text-[10px] text-term-dim uppercase tracking-wider mt-1">
            60Hz · 120Hz · 250Hz · 500Hz · 1kHz · 2kHz · 4kHz · 8kHz · 16kHz
          </div>
        </div>

        {/* Radio Controls */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={handleTogglePlay}
            className="px-4 py-2 bg-term-text text-black font-bold text-xs rounded hover:opacity-90 uppercase flex items-center gap-1.5"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Play Radio'}</span>
          </button>

          <button
            onClick={handleNextTrack}
            className="px-3 py-2 bg-term-subtle border border-term-border text-term-text font-bold text-xs rounded hover:bg-term-text hover:text-black uppercase flex items-center gap-1.5 transition-colors"
          >
            <SkipForward className="w-3.5 h-3.5" />
            <span>Next Track</span>
          </button>
        </div>
      </div>
    </div>
  );
}
