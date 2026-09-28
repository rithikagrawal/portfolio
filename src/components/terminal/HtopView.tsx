'use client';
import { useState, useEffect } from 'react';
import { useTerminalStore } from '@/store/terminal';
import { sound } from '@/lib/audio';

interface ProcessItem {
  pid: number;
  user: string;
  pri: number;
  ni: number;
  virt: string;
  res: string;
  shr: string;
  s: string;
  cpu: number;
  mem: number;
  time: string;
  command: string;
}

const INITIAL_PROCESSES: ProcessItem[] = [
  { pid: 1024, user: 'rithik', pri: 20, ni: 0, virt: '1.4G', res: '412M', shr: '64M', s: 'S', cpu: 18.4, mem: 2.6, time: '1420:12', command: 'fastapi-core --workers 8 --host 0.0.0.0 --port 8000' },
  { pid: 1088, user: 'rithik', pri: 20, ni: 0, virt: '2.6G', res: '890M', shr: '128M', s: 'S', cpu: 14.8, mem: 5.5, time: '892:44', command: 'kafka-consumer-group --topic telemetry.v2 --partitions 16' },
  { pid: 1140, user: 'rithik', pri: 20, ni: 0, virt: '1.1G', res: '380M', shr: '48M', s: 'S', cpu: 11.2, mem: 2.4, time: '520:18', command: 'jiomeet-signaling-mesh --concurrency 50000 --webrtc' },
  { pid: 1205, user: 'rithik', pri: 20, ni: 0, virt: '1.9G', res: '640M', shr: '92M', s: 'S', cpu: 8.6, mem: 4.0, time: '615:20', command: 'power-financial-ledger --region us-east-1,eu-west-1' },
  { pid: 1290, user: 'rithik', pri: 20, ni: 0, virt: '620M', res: '210M', shr: '36M', s: 'S', cpu: 5.1, mem: 1.3, time: '310:05', command: 'postgres-pool --max-connections 200 --pgbouncer' },
  { pid: 1340, user: 'rithik', pri: 20, ni: 0, virt: '380M', res: '120M', shr: '24M', s: 'S', cpu: 3.4, mem: 0.8, time: '142:14', command: 'redis-sentinel --cluster-active --tiered-cache' },
  { pid: 1420, user: 'rithik', pri: 20, ni: 0, virt: '480M', res: '160M', shr: '32M', s: 'S', cpu: 1.8, mem: 1.0, time: '58:32', command: 'nextjs-portfolio-engine --crt-bloom-active' },
  { pid: 1512, user: 'rithik', pri: 20, ni: 0, virt: '240M', res: '84M', shr: '18M', s: 'S', cpu: 0.9, mem: 0.5, time: '22:10', command: 'procedural-audio-synth --webaudio-active' },
];

export function HtopView() {
  const setActiveApp = useTerminalStore((s) => s.setActiveGame);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [processes, setProcesses] = useState<ProcessItem[]>(INITIAL_PROCESSES);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  // Dynamic CPU & memory load fluctuations
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
      setProcesses((prev) =>
        prev.map((p) => {
          const delta = (Math.random() - 0.48) * 1.5;
          return {
            ...p,
            cpu: Math.max(0.4, Number((p.cpu + delta).toFixed(1))),
          };
        })
      );
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  // Keyboard navigation & kill action
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'q' || e.key === 'Escape') {
        sound.playEnter();
        setActiveApp(null);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        sound.playKeypress();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : processes.length - 1));
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        sound.playKeypress();
        setSelectedIndex((prev) => (prev < processes.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'k' || e.key === 'F9') {
        e.preventDefault();
        sound.playKeypress();
        const target = processes[selectedIndex];
        setFeedback(`SIGTERM sent to PID ${target.pid} (${target.command.split(' ')[0]}). Auto-restarted by K8s replica controller in 8ms!`);
        setTimeout(() => setFeedback(null), 3000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [processes, selectedIndex, setActiveApp]);

  // Derived resource usage metrics
  const totalCpu = Number(processes.reduce((acc, p) => acc + p.cpu, 0).toFixed(1));
  const cpuBars = Math.min(24, Math.floor((totalCpu / 80) * 24));
  const memBars = 14;

  return (
    <div className="flex flex-col h-full w-full bg-black/95 text-term-text font-mono text-xs select-none p-2 space-y-2">
      {/* Top Telemetry Meters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border-b border-term-border/50 pb-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-12 font-bold text-term-accent">1 [CPU]</span>
            <div className="flex-1 bg-term-subtle/40 rounded h-3 overflow-hidden flex items-center px-1">
              <span className="text-term-text font-bold">
                {'|'.repeat(cpuBars)}
                <span className="text-term-dim">{'·'.repeat(Math.max(0, 24 - cpuBars))}</span>
              </span>
            </div>
            <span className="text-right w-14 font-bold">{totalCpu}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-12 font-bold text-term-accent">2 [MEM]</span>
            <div className="flex-1 bg-term-subtle/40 rounded h-3 overflow-hidden flex items-center px-1">
              <span className="text-term-text font-bold">
                {'|'.repeat(memBars)}
                <span className="text-term-dim">{'·'.repeat(Math.max(0, 24 - memBars))}</span>
              </span>
            </div>
            <span className="text-right w-14 font-bold">4.2G/16G</span>
          </div>
        </div>

        <div className="space-y-1 text-right sm:text-left sm:pl-4">
          <div className="text-[11px] text-term-dim flex justify-between">
            <span>Tasks: 58 total, 4 running</span>
            <span>Uptime: 4+ yrs prod</span>
          </div>
          <div className="text-[11px] text-term-dim flex justify-between">
            <span>Load average: 0.64 0.52 0.48</span>
            <span className="text-term-accent font-bold">Scale: 15M+ Users</span>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="px-2 py-1 bg-term-accent/20 border border-term-accent text-term-accent text-[11px] font-bold rounded animate-pulse">
          › {feedback}
        </div>
      )}

      {/* Process Table Header */}
      <div className="flex-1 overflow-y-auto font-mono text-[11px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-term-text text-black font-bold uppercase">
              <th className="px-1 py-0.5 w-14">PID</th>
              <th className="px-1 py-0.5 w-16">USER</th>
              <th className="px-1 py-0.5 w-10">PRI</th>
              <th className="px-1 py-0.5 w-10">NI</th>
              <th className="px-1 py-0.5 w-14">VIRT</th>
              <th className="px-1 py-0.5 w-14">RES</th>
              <th className="px-1 py-0.5 w-12">S</th>
              <th className="px-1 py-0.5 w-14">CPU%</th>
              <th className="px-1 py-0.5 w-14">MEM%</th>
              <th className="px-1 py-0.5 w-16">TIME+</th>
              <th className="px-1 py-0.5">COMMAND</th>
            </tr>
          </thead>
          <tbody>
            {processes.map((p, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <tr
                  key={p.pid}
                  onClick={() => setSelectedIndex(idx)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-term-accent/30 text-term-accent font-bold'
                      : 'hover:bg-term-subtle/30 text-term-text/90'
                  }`}
                >
                  <td className="px-1 py-0.5 text-term-dim">{p.pid}</td>
                  <td className="px-1 py-0.5">{p.user}</td>
                  <td className="px-1 py-0.5">{p.pri}</td>
                  <td className="px-1 py-0.5">{p.ni}</td>
                  <td className="px-1 py-0.5">{p.virt}</td>
                  <td className="px-1 py-0.5">{p.res}</td>
                  <td className="px-1 py-0.5 text-green-400">{p.s}</td>
                  <td className="px-1 py-0.5 font-bold text-term-accent">{p.cpu}</td>
                  <td className="px-1 py-0.5">{p.mem}</td>
                  <td className="px-1 py-0.5 text-term-dim">{p.time}</td>
                  <td className="px-1 py-0.5 truncate font-semibold text-term-text">{p.command}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bottom Function Bar */}
      <div className="border-t border-term-border/50 pt-1.5 flex items-center justify-between text-[10px] text-black">
        <div className="flex gap-1 flex-wrap">
          <span className="bg-term-text px-1 py-0.5 font-bold">F1 Help</span>
          <span className="bg-term-text px-1 py-0.5 font-bold">F2 Setup</span>
          <span className="bg-term-text px-1 py-0.5 font-bold">F3 Search</span>
          <span
            onClick={() => {
              const target = processes[selectedIndex];
              setFeedback(`SIGTERM sent to PID ${target.pid}. Auto-restarted by K8s in 8ms!`);
              setTimeout(() => setFeedback(null), 3000);
            }}
            className="bg-red-500 text-white px-1 py-0.5 font-bold cursor-pointer hover:bg-red-600"
          >
            F9 Kill (k)
          </span>
          <span
            onClick={() => setActiveApp(null)}
            className="bg-term-accent text-black px-1.5 py-0.5 font-bold cursor-pointer hover:opacity-80"
          >
            F10 Quit (q/Esc)
          </span>
        </div>
        <span className="text-term-dim text-[10px] font-mono hidden sm:inline">
          Use ↑ / ↓ arrows to inspect processes
        </span>
      </div>
    </div>
  );
}
