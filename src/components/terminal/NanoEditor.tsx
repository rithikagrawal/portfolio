'use client';
import { useState, useEffect, useRef } from 'react';
import { useTerminalStore } from '@/store/terminal';
import { getNodeByPath, writeFileToFS } from '@/lib/filesystem';
import { sound } from '@/lib/audio';

export function NanoEditor() {
  const setActiveApp = useTerminalStore((s) => s.setActiveApp);
  const activeFilePath = useTerminalStore((s) => s.activeFilePath) || '/home/rithik/notes.txt';

  const [content, setContent] = useState('');
  const [isModified, setIsModified] = useState(false);
  const [statusMsg, setStatusMsg] = useState('File loaded');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load existing file content on mount
  useEffect(() => {
    const node = getNodeByPath(activeFilePath);
    if (node && node.content) {
      setContent(node.content);
      setStatusMsg(`Loaded ${node.content.split('\n').length} lines`);
    } else {
      setContent('# New File\n');
      setStatusMsg('[ New Buffer ]');
    }
    textareaRef.current?.focus();
  }, [activeFilePath]);

  const handleSave = () => {
    sound.playEnter();
    const success = writeFileToFS(activeFilePath, content);
    if (success) {
      setIsModified(false);
      const lineCount = content.split('\n').length;
      setStatusMsg(`[ Wrote ${lineCount} lines to ${activeFilePath} ]`);
    } else {
      setStatusMsg(`[ Error: Failed to write to ${activeFilePath} ]`);
    }
  };

  const handleExit = () => {
    sound.playEnter();
    setActiveApp(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl+O = Save
    if (e.ctrlKey && e.key.toLowerCase() === 'o') {
      e.preventDefault();
      handleSave();
    }
    // Ctrl+X = Exit
    else if (e.ctrlKey && e.key.toLowerCase() === 'x') {
      e.preventDefault();
      handleExit();
    }
    // Escape = Exit
    else if (e.key === 'Escape') {
      e.preventDefault();
      handleExit();
    } else {
      if (!['Shift', 'Control', 'Alt', 'Meta'].includes(e.key)) {
        sound.playKeypress();
        setIsModified(true);
      }
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-black/95 text-term-text font-mono text-xs select-none p-1.5 space-y-1">
      {/* Nano Header */}
      <div className="bg-term-text text-black px-2 py-0.5 font-bold flex justify-between items-center text-[11px]">
        <span>GNU nano 7.2</span>
        <span className="truncate max-w-xs">{activeFilePath}</span>
        <span>{isModified ? '[Modified]' : ''}</span>
      </div>

      {/* Main Text Buffer */}
      <div className="flex-1 relative border border-term-border/40 rounded bg-black/80 overflow-hidden">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setIsModified(true);
          }}
          onKeyDown={handleKeyDown}
          spellCheck={false}
          className="w-full h-full bg-transparent p-2 text-term-text outline-none resize-none font-mono text-xs leading-relaxed caret-term-accent select-text"
        />
      </div>

      {/* Status Bar */}
      <div className="text-[11px] text-term-accent font-semibold px-2 py-0.5 truncate">
        {statusMsg}
      </div>

      {/* Bottom Shortcuts Legend */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 bg-term-subtle/30 p-1 rounded border border-term-border/30 text-[10px] text-black">
        <button
          onClick={handleSave}
          className="bg-term-text px-1 py-0.5 font-bold hover:opacity-80 rounded flex items-center justify-center gap-1"
        >
          <span>^O</span>
          <span>WriteOut</span>
        </button>
        <button
          onClick={handleExit}
          className="bg-term-accent px-1 py-0.5 font-bold hover:opacity-80 rounded flex items-center justify-center gap-1"
        >
          <span>^X</span>
          <span>Exit</span>
        </button>
        <div className="hidden sm:flex items-center justify-center gap-1 text-term-dim">
          <span>^R</span>
          <span>Read File</span>
        </div>
        <div className="hidden sm:flex items-center justify-center gap-1 text-term-dim">
          <span>^W</span>
          <span>Where Is</span>
        </div>
        <div className="hidden sm:flex items-center justify-center gap-1 text-term-dim">
          <span>^K</span>
          <span>Cut Text</span>
        </div>
        <div className="hidden sm:flex items-center justify-center gap-1 text-term-dim">
          <span>^U</span>
          <span>Paste</span>
        </div>
      </div>
    </div>
  );
}
