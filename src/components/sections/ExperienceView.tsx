'use client';
import { PORTFOLIO_DATA } from '@/data/portfolio';
import { Briefcase, Calendar, MapPin, Award, CheckCircle2 } from 'lucide-react';

export function ExperienceView() {
  return (
    <div className="space-y-6 font-mono text-term-text">
      {/* Section Header */}
      <div className="border-b border-term-border pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-wider text-term-accent flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            ~/experience/
          </h2>
          <p className="text-xs text-term-dim mt-0.5">
            Verified corporate engineering track record across fintech and telecom domains.
          </p>
        </div>
        <span className="text-xs px-2.5 py-1 bg-term-subtle border border-term-border rounded text-term-accent font-semibold">
          2 PRODUCTION ROLES
        </span>
      </div>

      {/* Experience Timeline */}
      <div className="space-y-6">
        {PORTFOLIO_DATA.experiences.map((exp) => (
          <div
            key={exp.id}
            className="border border-term-border rounded-lg bg-black/60 p-4 sm:p-5 space-y-4 hover:border-term-text transition-colors shadow-lg relative overflow-hidden"
          >
            {/* Active role badge banner */}
            {exp.current && (
              <div className="absolute top-0 right-0 bg-green-500/20 text-green-400 border-l border-b border-green-500/40 text-[10px] px-3 py-1 font-bold uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Active Production Role
              </div>
            )}

            {/* Header */}
            <div>
              <div className="flex flex-wrap items-baseline gap-2">
                <h3 className="text-lg font-bold text-term-accent">{exp.role}</h3>
                <span className="text-term-dim">@</span>
                <span className="text-base font-semibold text-term-text">{exp.company}</span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-term-dim mt-1.5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {exp.period}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {exp.location}
                </span>
              </div>
            </div>

            {/* Metrics Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
              {exp.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="bg-term-subtle/60 border border-term-border/60 rounded p-2 text-center"
                >
                  <div className="text-base sm:text-lg font-bold text-term-accent leading-none">
                    {m.value}
                  </div>
                  <div className="text-[10px] text-term-dim uppercase tracking-wider mt-1 truncate">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <p className="text-xs sm:text-sm text-term-text/90 leading-relaxed italic border-l-2 border-term-border pl-3">
              {exp.summary}
            </p>

            {/* Bullet Highlights */}
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-bold text-term-accent uppercase tracking-wider block">
                Engineering Highlights:
              </span>
              <ul className="space-y-1.5 text-xs sm:text-sm text-term-text/90">
                {exp.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-term-accent shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tech Stack Pills */}
            <div className="flex flex-wrap gap-1.5 pt-2 border-t border-term-border/40">
              {exp.techStack.map((t) => (
                <span
                  key={t}
                  className="px-2 py-0.5 bg-term-subtle/80 text-term-text text-[11px] rounded border border-term-border/50"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
