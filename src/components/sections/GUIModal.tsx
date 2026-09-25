'use client';
import { useTerminalStore, GUISection } from '@/store/terminal';
import { ExperienceView } from './ExperienceView';
import { ProjectsView } from './ProjectsView';
import { SkillsView } from './SkillsView';
import { ContactView } from './ContactView';
import { Briefcase, Code2, Cpu, Mail, X, Terminal, ChevronRight } from 'lucide-react';
import { sound } from '@/lib/audio';

export function GUIModal() {
  const { viewMode, activeSection, setViewMode } = useTerminalStore();

  if (viewMode !== 'gui') return null;

  const currentSection = activeSection || 'experience';

  const handleTabChange = (section: GUISection) => {
    sound.playKeypress();
    setViewMode('gui', section);
  };

  const handleClose = () => {
    sound.playKeypress();
    setViewMode('terminal', null);
  };

  return (
    <div className="fixed inset-0 z-40 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
      <div className="relative w-full max-w-5xl h-[92vh] flex flex-col bg-[#0a0800]/98 border border-term-border rounded-lg shadow-2xl crt-curved-frame overflow-hidden">
        {/* CRT Scanline overlay */}
        <div className="crt-overlay pointer-events-none" />

        {/* Modal Window Top Bar */}
        <div className="relative z-30 flex items-center justify-between px-4 py-2.5 bg-black/90 border-b border-term-border text-xs select-none">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 mr-2">
              <button
                onClick={handleClose}
                className="w-3 h-3 rounded-full bg-red-500 hover:opacity-80 transition-opacity border border-red-700/50"
                title="Close GUI view"
              />
              <span className="w-3 h-3 rounded-full bg-yellow-500 border border-yellow-700/50" />
              <span className="w-3 h-3 rounded-full bg-green-500 border border-green-700/50" />
            </div>

            {/* Breadcrumb */}
            <span className="text-term-dim flex items-center gap-1 font-mono text-xs">
              <span>portfolio</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-term-accent uppercase font-bold">{currentSection}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Tabs */}
            <nav className="flex items-center gap-1">
              {[
                { id: 'experience', label: 'Experience', icon: Briefcase },
                { id: 'projects', label: 'Projects', icon: Code2 },
                { id: 'skills', label: 'Skills', icon: Cpu },
                { id: 'contact', label: 'Contact', icon: Mail },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = currentSection === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id as GUISection)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs transition-colors font-mono font-semibold ${
                      isActive
                        ? 'bg-term-text text-black font-bold'
                        : 'text-term-dim hover:text-term-text hover:bg-term-subtle/50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Switch back to pure CLI */}
            <button
              onClick={handleClose}
              className="ml-2 flex items-center gap-1 px-2.5 py-1 rounded bg-term-subtle/80 hover:bg-term-text hover:text-black border border-term-border text-term-text text-xs transition-colors font-mono font-bold"
              title="Return to interactive 3D terminal"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span className="hidden md:inline">CLI MONITOR</span>
            </button>

            <button
              onClick={handleClose}
              className="p-1 hover:text-term-accent text-term-dim transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scroll Content */}
        <div className="relative z-10 flex-1 p-4 sm:p-6 overflow-y-auto">
          {currentSection === 'experience' && <ExperienceView />}
          {currentSection === 'projects' && <ProjectsView />}
          {currentSection === 'skills' && <SkillsView />}
          {currentSection === 'contact' && <ContactView />}
        </div>
      </div>
    </div>
  );
}
