'use client';
import { useState } from 'react';
import { PORTFOLIO_DATA, ProjectItem } from '@/data/portfolio';
import { Code2, ExternalLink, Github, Terminal as TermIcon, Star } from 'lucide-react';
import { useTerminalStore } from '@/store/terminal';
import { executeCommand } from '@/lib/commands';

export function ProjectsView() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const addOutput = useTerminalStore((s) => s.addOutput);
  const setViewMode = useTerminalStore((s) => s.setViewMode);

  const categories = ['All', 'Full Stack', 'Backend', 'DevOps', 'AI / NLP'];

  const filtered = activeCategory === 'All'
    ? PORTFOLIO_DATA.projects
    : PORTFOLIO_DATA.projects.filter((p) => p.category === activeCategory);

  const handleInspectInTerminal = async (proj: ProjectItem) => {
    setViewMode('terminal', null);
    const cmd = `cat projects/${proj.filename}`;
    const res = await executeCommand(cmd);
    addOutput({
      type: 'input',
      prompt: 'rithik@portfolio:~/projects$ ',
      content: cmd,
    });
    if (res.content) {
      addOutput({
        type: res.type || 'ascii',
        content: res.content,
      });
    }
  };

  return (
    <div className="space-y-6 font-mono text-term-text">
      {/* Section Header */}
      <div className="border-b border-term-border pb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-wider text-term-accent flex items-center gap-2">
            <Code2 className="w-5 h-5" />
            ~/projects/
          </h2>
          <p className="text-xs text-term-dim mt-0.5">
            Production microservices, high-throughput distributed pipelines, and cloud systems.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded transition-colors border ${
                activeCategory === cat
                  ? 'bg-term-text text-black font-bold border-term-text'
                  : 'bg-black/50 border-term-border text-term-text/80 hover:bg-term-subtle'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((proj) => (
          <div
            key={proj.id}
            className="border border-term-border rounded-lg bg-black/60 p-4 space-y-3 flex flex-col justify-between hover:border-term-text transition-colors shadow-lg relative overflow-hidden"
          >
            {/* Top header */}
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-term-subtle border border-term-border text-term-accent font-bold">
                      {proj.category}
                    </span>
                    {proj.featured && (
                      <span className="text-[10px] text-yellow-400 flex items-center gap-1 font-semibold">
                        <Star className="w-3 h-3 fill-yellow-400" /> Featured
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-term-accent mt-2 leading-tight">
                    {proj.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {proj.github && (
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="View GitHub Repository"
                      className="p-1 hover:text-term-accent text-term-dim transition-colors"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {proj.demo && (
                    <a
                      href={proj.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Live Demonstration"
                      className="p-1 hover:text-term-accent text-term-dim transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Summary */}
              <p className="text-xs text-term-text/90 mt-2.5 leading-relaxed">
                {proj.summary}
              </p>

              {/* Key Architecture Bullets */}
              <ul className="mt-3 space-y-1 text-[11px] text-term-dim">
                {proj.description.slice(0, 2).map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-term-accent">›</span>
                    <span className="text-term-text/80">{item}</span>
                  </li>
                ))}
              </ul>

              {/* Performance Stats */}
              {proj.stats && (
                <div className="grid grid-cols-3 gap-1.5 mt-3 pt-2 border-t border-term-border/40">
                  {proj.stats.map((s, idx) => (
                    <div key={idx} className="bg-term-subtle/50 rounded p-1.5 text-center">
                      <div className="text-xs font-bold text-term-accent">{s.value}</div>
                      <div className="text-[9px] text-term-dim uppercase">{s.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Tech stack & CLI Inspect trigger */}
            <div className="pt-3 border-t border-term-border/40 space-y-2">
              <div className="flex flex-wrap gap-1">
                {proj.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-term-subtle border border-term-border/40 text-term-text/90"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <button
                onClick={() => handleInspectInTerminal(proj)}
                className="w-full text-center text-[11px] py-1 rounded bg-black border border-term-border/60 hover:bg-term-subtle text-term-accent flex items-center justify-center gap-1.5 transition-colors font-mono"
              >
                <TermIcon className="w-3 h-3" />
                cat projects/{proj.filename}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
