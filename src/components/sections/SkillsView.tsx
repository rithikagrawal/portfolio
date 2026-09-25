'use client';
import { PORTFOLIO_DATA } from '@/data/portfolio';
import { Cpu, CheckSquare } from 'lucide-react';

export function SkillsView() {
  return (
    <div className="space-y-6 font-mono text-term-text">
      {/* Section Header */}
      <div className="border-b border-term-border pb-3 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-wider text-term-accent flex items-center gap-2">
            <Cpu className="w-5 h-5" />
            ~/skills/
          </h2>
          <p className="text-xs text-term-dim mt-0.5">
            Technical competencies, frameworks, distributed databases, and cloud engineering standards.
          </p>
        </div>
      </div>

      {/* Skills Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PORTFOLIO_DATA.skills.map((category) => (
          <div
            key={category.category}
            className="border border-term-border rounded-lg bg-black/60 p-4 space-y-3"
          >
            <h3 className="text-sm font-bold text-term-accent border-b border-term-border/40 pb-1.5 flex items-center justify-between">
              <span>{category.category}</span>
              <span className="text-[10px] text-term-dim uppercase">PROD EXPERIENCE</span>
            </h3>

            <div className="space-y-2.5">
              {category.skills.map((s) => (
                <div key={s.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-term-text">{s.name}</span>
                    <span className="text-term-dim text-[11px]">{s.experience}</span>
                  </div>
                  <div className="w-full bg-term-subtle h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-term-text h-full transition-all duration-500 rounded-full"
                      style={{ width: `${s.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Architecture & Engineering Standards Checklist */}
      <div className="border border-term-border rounded-lg bg-black/60 p-4 space-y-3">
        <h3 className="text-sm font-bold text-term-accent border-b border-term-border/40 pb-1.5">
          Production Architecture & Engineering Disciplines
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {PORTFOLIO_DATA.architecturePractices.map((practice, idx) => (
            <div key={idx} className="flex items-start gap-2 p-1.5 rounded bg-term-subtle/40 border border-term-border/40">
              <CheckSquare className="w-3.5 h-3.5 text-term-accent shrink-0 mt-0.5" />
              <span className="text-term-text/90">{practice}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
