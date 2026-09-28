'use client';
import { useState } from 'react';
import { PORTFOLIO_DATA } from '@/data/portfolio';
import { Mail, Github, Linkedin, Twitter, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { sound } from '@/lib/audio';

export function ContactView() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const [receipt, setReceipt] = useState<{ id: string; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sound.playEnter();
    setStatus('sending');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReceipt({ id: data.receiptId, message: data.message });
        setStatus('sent');
        return;
      }
    } catch {
      // Fallback to mailto on network or API failure
    }

    // Direct mailto fallback
    const mailto = `mailto:${PORTFOLIO_DATA.personal.email}?subject=Inquiry from ${encodeURIComponent(
      formData.name
    )}&body=${encodeURIComponent(formData.message + '\n\nReply-To: ' + formData.email)}`;

    setTimeout(() => {
      setReceipt({ id: 'MAILTO-' + Date.now().toString(36).toUpperCase(), message: 'Transmitted via direct mail protocol.' });
      setStatus('sent');
      window.open(mailto, '_blank');
    }, 500);
  };

  return (
    <div className="space-y-6 font-mono text-term-text">
      {/* Section Header */}
      <div className="border-b border-term-border pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-wider text-term-accent flex items-center gap-2">
            <Mail className="w-5 h-5" />
            ~/contact/
          </h2>
          <p className="text-xs text-term-dim mt-0.5">
            Direct communication channels. Currently open to impactful senior engineering roles.
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 bg-green-500/10 border border-green-500/40 text-green-400 rounded flex items-center gap-1.5 font-bold">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          AVAILABLE
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Coordinates */}
        <div className="border border-term-border rounded-lg bg-black/60 p-4 space-y-4">
          <h3 className="text-sm font-bold text-term-accent border-b border-term-border/40 pb-1.5">
            Verified Endpoints
          </h3>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="flex items-center gap-3 p-2 bg-term-subtle/50 rounded border border-term-border/40">
              <Mail className="w-4 h-4 text-term-accent shrink-0" />
              <div className="truncate">
                <div className="text-[10px] text-term-dim uppercase">Email Direct</div>
                <a
                  href={`mailto:${PORTFOLIO_DATA.personal.email}`}
                  className="hover:underline text-term-text font-semibold"
                >
                  {PORTFOLIO_DATA.personal.email}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2 bg-term-subtle/50 rounded border border-term-border/40">
              <Phone className="w-4 h-4 text-term-accent shrink-0" />
              <div>
                <div className="text-[10px] text-term-dim uppercase">Telephone</div>
                <a href={`tel:${PORTFOLIO_DATA.personal.phone}`} className="hover:underline text-term-text">
                  {PORTFOLIO_DATA.personal.phone}
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2 bg-term-subtle/50 rounded border border-term-border/40">
              <MapPin className="w-4 h-4 text-term-accent shrink-0" />
              <div>
                <div className="text-[10px] text-term-dim uppercase">Coordinates</div>
                <span className="text-term-text">{PORTFOLIO_DATA.personal.location}</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="pt-2 border-t border-term-border/40">
            <div className="text-xs text-term-dim uppercase mb-2">Network Channels</div>
            <div className="flex flex-wrap gap-2">
              <a
                href={PORTFOLIO_DATA.personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-term-subtle border border-term-border hover:bg-term-text hover:text-black rounded text-xs transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
              <a
                href={PORTFOLIO_DATA.personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-term-subtle border border-term-border hover:bg-term-text hover:text-black rounded text-xs transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
              <a
                href={PORTFOLIO_DATA.personal.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-term-subtle border border-term-border hover:bg-term-text hover:text-black rounded text-xs transition-colors"
              >
                <Twitter className="w-3.5 h-3.5" />
                <span>Twitter / X</span>
              </a>
            </div>
          </div>
        </div>

        {/* Transmission Console */}
        <div className="border border-term-border rounded-lg bg-black/60 p-4 space-y-3">
          <h3 className="text-sm font-bold text-term-accent border-b border-term-border/40 pb-1.5 flex items-center justify-between">
            <span>Transmission Form</span>
            <span className="text-[10px] text-term-dim">PORT: 443</span>
          </h3>

          {status === 'sent' ? (
            <div className="py-6 text-center space-y-2.5">
              <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto" />
              <div className="text-base font-bold text-green-400">Transmission Dispatched</div>
              {receipt && (
                <div className="px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded inline-block text-[11px] text-green-300 font-mono">
                  REF: {receipt.id}
                </div>
              )}
              <p className="text-xs text-term-dim max-w-xs mx-auto">
                {receipt?.message || `Transmission confirmed for ${PORTFOLIO_DATA.personal.email}.`}
              </p>
              <button
                onClick={() => {
                  setStatus('idle');
                  setFormData({ name: '', email: '', message: '' });
                }}
                className="text-xs text-term-accent underline mt-2 inline-block font-semibold"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-term-dim text-[10px] uppercase mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Linus Torvalds"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-black/70 border border-term-border rounded p-2 text-term-text outline-none focus:border-term-text"
                />
              </div>

              <div>
                <label className="block text-term-dim text-[10px] uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-black/70 border border-term-border rounded p-2 text-term-text outline-none focus:border-term-text"
                />
              </div>

              <div>
                <label className="block text-term-dim text-[10px] uppercase mb-1">Transmission Data</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Write your message or inquiry..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-black/70 border border-term-border rounded p-2 text-term-text outline-none focus:border-term-text resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full py-2 bg-term-subtle border border-term-border hover:bg-term-text hover:text-black rounded font-bold uppercase tracking-wider text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{status === 'sending' ? 'Transmitting...' : 'Send Message'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
