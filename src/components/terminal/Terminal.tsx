'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useTerminalStore } from '@/store/terminal';
import { executeCommand, getCompletions } from '@/lib/commands';
import { sound } from '@/lib/audio';
import { BootSequence } from './BootSequence';
import { Volume2, VolumeX, Palette, Layers, Terminal as TerminalIcon, Sparkles } from 'lucide-react';

export function Terminal() {
  const {
    outputs,
    cwd,
    theme,
    soundEnabled,
    viewMode,
    isBooting,
    hasBooted,
    addOutput,
    recordCommand,
    navigateHistory,
    setTheme,
    toggleSound,
    setViewMode,
    setBooting,
    setHasBooted,
  } = useTerminalStore();

  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-focus input on click anywhere in terminal
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  // Scroll to bottom on updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [outputs, hasBooted, suggestions]);

  // Initial welcome greeting if boot done
  const handleBootComplete = useCallback(() => {
    setHasBooted(true);
    setBooting(false);
    // Initial welcome banner
    addOutput({
      type: 'ascii',
      content: `
================================================================================
  PortfolioOS 2.0 (x86_64) — Amber CRT Edition
  Session initialized for rithik@portfolio. All services 100% operational.
  Type 'help' to inspect command list or click quick-action chips below.
================================================================================
`,
    });
    // Trigger initial neofetch automatically for instant visual impact
    setTimeout(async () => {
      const res = await executeCommand('neofetch');
      addOutput({
        type: res.type || 'ascii',
        content: res.content,
      });
    }, 150);
  }, [addOutput, setBooting]);

  const handleCommandSubmit = useCallback(async () => {
    const raw = input.trim();
    sound.playEnter();

    // Echo prompt into output
    const promptPath = cwd === '/home/rithik' ? '~' : cwd.replace('/home/rithik', '~');
    addOutput({
      type: 'input',
      prompt: `rithik@portfolio:${promptPath}$ `,
      content: input,
    });

    if (raw) {
      recordCommand(raw);
      const res = await executeCommand(raw);
      if (res.content) {
        addOutput({
          type: res.type || 'text',
          content: res.content,
        });
      }
    }

    setInput('');
    setSuggestions([]);
  }, [input, cwd, addOutput, recordCommand]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Sound on every keypress except modifier keys
    if (!['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) {
      sound.playKeypress();
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommandSubmit();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const completion = getCompletions(input, cwd);
      if (completion.completed !== input) {
        setInput(completion.completed);
        setSuggestions([]);
      } else if (completion.suggestions.length > 0) {
        setSuggestions(completion.suggestions);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = navigateHistory('up');
      if (prev !== null) setInput(prev);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = navigateHistory('down');
      if (next !== null) setInput(next);
    } else if (e.key === 'c' && e.ctrlKey) {
      e.preventDefault();
      const promptPath = cwd === '/home/rithik' ? '~' : cwd.replace('/home/rithik', '~');
      addOutput({
        type: 'input',
        prompt: `rithik@portfolio:${promptPath}$ `,
        content: input + '^C',
      });
      setInput('');
      setSuggestions([]);
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      useTerminalStore.getState().clearOutputs();
    }
  };

  const handleChipClick = async (cmd: string) => {
    sound.playKeypress();
    const promptPath = cwd === '/home/rithik' ? '~' : cwd.replace('/home/rithik', '~');
    addOutput({
      type: 'input',
      prompt: `rithik@portfolio:${promptPath}$ `,
      content: cmd,
    });
    recordCommand(cmd);
    const res = await executeCommand(cmd);
    if (res.content) {
      addOutput({
        type: res.type || 'text',
        content: res.content,
      });
    }
  };

  const cycleTheme = () => {
    const themes: ('amber' | 'matrix' | 'cyber' | 'dracula')[] = ['amber', 'matrix', 'cyber', 'dracula'];
    const next = themes[(themes.indexOf(theme) + 1) % themes.length];
    setTheme(next);
    sound.playKeypress();
  };

  const promptPath = cwd === '/home/rithik' ? '~' : cwd.replace('/home/rithik', '~');

  return (
    <div
      onClick={handleContainerClick}
      className="relative flex flex-col h-full w-full bg-[#0a0800]/95 text-term-text font-mono border border-term-border rounded-lg shadow-2xl overflow-hidden crt-curved-frame backdrop-blur-md"
    >
      {/* CRT Scanline and Vignette overlay */}
      <div className="crt-overlay" />

      {/* Terminal Title Bar */}
      <div className="relative z-30 flex items-center justify-between px-3 py-2 bg-black/80 border-b border-term-border text-xs select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block border border-red-700/50" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block border border-yellow-700/50" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block border border-green-700/50" />
          </div>
          <span className="ml-2 font-bold tracking-wider text-term-accent flex items-center gap-1.5">
            <TerminalIcon className="w-3.5 h-3.5" />
            rithik@portfolio: {promptPath} (bash)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Sound toggle button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSound();
            }}
            title={soundEnabled ? 'Mute Audio (or type sound off)' : 'Enable Audio (or type sound on)'}
            className="p-1 rounded hover:bg-term-subtle transition-colors text-term-text/80 hover:text-term-accent"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 opacity-50" />}
          </button>

          {/* Theme switcher */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              cycleTheme();
            }}
            title={`Current Theme: ${theme.toUpperCase()} (Click to cycle)`}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] hover:bg-term-subtle transition-colors border border-term-border/50 text-term-text/90"
          >
            <Palette className="w-3 h-3" />
            <span className="uppercase font-semibold">{theme}</span>
          </button>

          {/* GUI View Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setViewMode(viewMode === 'gui' ? 'terminal' : 'gui', 'experience');
            }}
            title="Toggle Visual GUI Showcase"
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] transition-all font-semibold ${
              viewMode === 'gui'
                ? 'bg-term-text text-black'
                : 'border border-term-border hover:bg-term-subtle text-term-text'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>{viewMode === 'gui' ? 'CLI VIEW' : 'GUI VIEW'}</span>
          </button>
        </div>
      </div>

      {/* Terminal Screen Body */}
      <div
        ref={scrollRef}
        className="relative z-10 flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-2 text-xs sm:text-sm font-mono leading-relaxed"
      >
        {!hasBooted ? (
          <BootSequence onComplete={handleBootComplete} />
        ) : (
          <>
            {/* Output History */}
            {outputs.map((out) => (
              <div key={out.id} className="whitespace-pre-wrap break-words">
                {out.type === 'input' && (
                  <div className="flex items-baseline gap-1 text-term-text font-bold">
                    <span className="text-term-prompt">{out.prompt}</span>
                    <span className="text-term-accent">{String(out.content)}</span>
                  </div>
                )}
                {out.type === 'error' && (
                  <div className="text-red-400 font-mono pl-1 border-l-2 border-red-500/70 py-0.5">
                    {String(out.content)}
                  </div>
                )}
                {out.type === 'success' && (
                  <div className="text-green-400 font-mono pl-1 border-l-2 border-green-500/70 py-0.5">
                    {String(out.content)}
                  </div>
                )}
                {out.type === 'system' && (
                  <div className="text-term-accent/90 italic pl-1 border-l-2 border-term-accent/60 py-0.5">
                    {String(out.content)}
                  </div>
                )}
                {(out.type === 'ascii' || out.type === 'text') && (
                  <div className="text-term-text/95 opacity-95 term-glow font-mono">
                    {String(out.content)}
                  </div>
                )}
              </div>
            ))}

            {/* Suggestions preview if tab was pressed */}
            {suggestions.length > 0 && (
              <div className="py-1 px-2 border border-term-border/60 bg-black/60 rounded text-xs text-term-accent flex flex-wrap gap-3">
                <span className="text-term-dim font-bold">Suggestions:</span>
                {suggestions.map((s) => (
                  <span
                    key={s}
                    onClick={() => {
                      setInput(s);
                      setSuggestions([]);
                    }}
                    className="hover:underline cursor-pointer"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}

            {/* Active Prompt Line */}
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-term-prompt font-bold whitespace-nowrap">
                rithik@portfolio:{promptPath}$
              </span>
              <div className="relative flex-1 flex items-center">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                  className="w-full bg-transparent outline-none text-term-text caret-term-accent font-mono text-xs sm:text-sm"
                />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Touch-Friendly Quick Command Chips (Mobile / Quick access) */}
      {hasBooted && (
        <div className="relative z-30 px-3 py-2 bg-black/80 border-t border-term-border/70 flex items-center gap-1.5 overflow-x-auto text-[11px] scrollbar-none">
          <span className="text-term-dim uppercase text-[10px] tracking-wider font-bold whitespace-nowrap flex items-center gap-1 mr-1">
            <Sparkles className="w-2.5 h-2.5" /> Quick:
          </span>
          {[
            { label: 'neofetch', cmd: 'neofetch' },
            { label: 'experience', cmd: 'cd experience' },
            { label: 'projects', cmd: 'cd projects' },
            { label: 'skills', cmd: 'cd skills' },
            { label: 'resume', cmd: 'open resume' },
            { label: 'contact', cmd: 'cd contact' },
            { label: 'help', cmd: 'help' },
            { label: 'sudo hire-me', cmd: 'sudo hire-me' },
            { label: 'clear', cmd: 'clear' },
          ].map((item) => (
            <button
              key={item.cmd}
              onClick={(e) => {
                e.stopPropagation();
                handleChipClick(item.cmd);
              }}
              className="px-2 py-1 bg-term-subtle/80 hover:bg-term-text hover:text-black border border-term-border/60 rounded text-term-text whitespace-nowrap transition-colors font-mono"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
