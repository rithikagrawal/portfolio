'use client';
import { useState, useEffect } from 'react';
import { useTerminalStore } from '@/store/terminal';
import { sound } from '@/lib/audio';
import { BookOpen, Send, ArrowLeft, Sparkles } from 'lucide-react';

export interface GuestbookEntry {
  id: string;
  name: string;
  role: string;
  message: string;
  timestamp: string;
}

const DEFAULT_ENTRIES: GuestbookEntry[] = [
  {
    id: 'gb-1',
    name: 'Sarah Chen',
    role: 'Staff Infrastructure Engineer @ Stripe',
    message: 'The 3D CRT amber phosphor aesthetic and mechanical switch sounds are next level. Great work on the JioMeet WebRTC architecture!',
    timestamp: '2026-09-24 14:22',
  },
  {
    id: 'gb-2',
    name: 'Marcus Vance',
    role: 'Engineering Director @ Datadog',
    message: 'One of the most creative and technically sound portfolios I have seen. Tested the P95 query optimization notes—super solid engineering instincts.',
    timestamp: '2026-09-25 09:45',
  },
  {
    id: 'gb-3',
    name: 'Alex Rivera',
    role: 'Senior Backend Engineer',
    message: 'Playing Snake on an amber CRT in space while reading about distributed systems is peak developer art.',
    timestamp: '2026-09-26 18:10',
  },
];

export function GuestbookView() {
  const setActiveApp = useTerminalStore((s) => s.setActiveGame);
  const [entries, setEntries] = useState<GuestbookEntry[]>(DEFAULT_ENTRIES);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('term_guestbook');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEntries([...parsed, ...DEFAULT_ENTRIES]);
        }
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Keyboard shortcut listener to exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInputFocused = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName || '');
      if (e.key === 'Escape' || (e.key === 'q' && !isInputFocused)) {
        sound.playEnter();
        setActiveApp(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveApp]);

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    sound.playEnter();
    const newEntry: GuestbookEntry = {
      id: 'gb-' + Date.now().toString(36),
      name: name.trim(),
      role: role.trim() || 'Software Engineer',
      message: message.trim(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);

    try {
      const customOnly = updated.filter((e) => !DEFAULT_ENTRIES.some((d) => d.id === e.id));
      localStorage.setItem('term_guestbook', JSON.stringify(customOnly));
    } catch {
      // Ignore localStorage errors
    }

    setName('');
    setRole('');
    setMessage('');
    setStatusMsg('✓ Message written to guestbook ledger!');
    setTimeout(() => setStatusMsg(null), 3000);
  };

  return (
    <div className="flex flex-col h-full w-full bg-black/95 text-term-text font-mono text-xs select-none p-3 space-y-3 overflow-hidden">
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
            <BookOpen className="w-4 h-4" />
            GLOBAL VISITOR GUESTBOOK
          </span>
        </div>
        <span className="text-term-dim text-[11px]">Entries: {entries.length}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1 overflow-hidden">
        {/* Left: Sign Form */}
        <div className="border border-term-border/40 rounded-lg p-3 bg-black/60 space-y-2.5 flex flex-col justify-between">
          <form onSubmit={handleSign} className="space-y-2">
            <div className="font-bold text-term-accent text-xs flex items-center gap-1 border-b border-term-border/30 pb-1">
              <Sparkles className="w-3 h-3" /> Sign the Ledger
            </div>

            <div>
              <label className="text-[10px] text-term-dim uppercase block">Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Linus Torvalds"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/80 border border-term-border/60 rounded px-2 py-1 text-term-text text-xs outline-none focus:border-term-text"
              />
            </div>

            <div>
              <label className="text-[10px] text-term-dim uppercase block">Role / Company (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Tech Lead @ Linux Foundation"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-black/80 border border-term-border/60 rounded px-2 py-1 text-term-text text-xs outline-none focus:border-term-text"
              />
            </div>

            <div>
              <label className="text-[10px] text-term-dim uppercase block">Message</label>
              <textarea
                rows={3}
                required
                placeholder="Leave an endorsement or greeting..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-black/80 border border-term-border/60 rounded px-2 py-1 text-term-text text-xs outline-none focus:border-term-text resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-1.5 bg-term-subtle border border-term-border hover:bg-term-text hover:text-black rounded font-bold uppercase text-[11px] transition-colors flex items-center justify-center gap-1.5"
            >
              <Send className="w-3 h-3" />
              <span>Record Signature</span>
            </button>
          </form>

          {statusMsg && (
            <div className="text-[11px] text-green-400 font-bold bg-green-500/10 border border-green-500/30 p-1.5 rounded text-center">
              {statusMsg}
            </div>
          )}
        </div>

        {/* Right: Scrolling Entries Feed */}
        <div className="md:col-span-2 border border-term-border/40 rounded-lg p-2.5 bg-black/80 overflow-y-auto space-y-2">
          {entries.map((entry) => (
            <div key={entry.id} className="border border-term-border/30 rounded p-2 bg-term-subtle/20 space-y-1">
              <div className="flex items-baseline justify-between">
                <span className="font-bold text-term-accent text-xs">{entry.name}</span>
                <span className="text-[10px] text-term-dim">{entry.timestamp}</span>
              </div>
              <div className="text-[10px] text-term-dim font-semibold">{entry.role}</div>
              <p className="text-xs text-term-text/95 leading-relaxed pt-0.5">{entry.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
