'use client';
import { useState, useEffect } from 'react';
import { useTerminalStore } from '@/store/terminal';
import { sound } from '@/lib/audio';
import { Server, Database, Globe, Cpu, RefreshCw, Zap, ShieldAlert, ArrowLeft } from 'lucide-react';

type ArchTab = 'jiomeet' | 'power';
type SimMode = 'normal' | 'spike' | 'failover';

export function ArchVisualizer() {
  const setActiveApp = useTerminalStore((s) => s.setActiveApp);
  const [tab, setTab] = useState<ArchTab>('jiomeet');
  const [simMode, setSimMode] = useState<SimMode>('normal');

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

  const switchTab = (next: ArchTab) => {
    sound.playKeypress();
    setTab(next);
  };

  const setSimulation = (mode: SimMode) => {
    sound.playEnter();
    setSimMode(mode);
  };

  return (
    <div className="flex flex-col h-full w-full bg-black/95 text-term-text font-mono text-xs select-none p-3 space-y-3 overflow-y-auto">
      {/* Top Header & Navigation */}
      <div className="flex items-center justify-between border-b border-term-border/50 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveApp(null)}
            className="flex items-center gap-1 px-2 py-1 bg-term-subtle border border-term-border rounded text-[11px] hover:bg-term-text hover:text-black font-bold"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>EXIT (q)</span>
          </button>
          <span className="font-bold text-term-accent text-sm">
            SYSTEM ARCHITECTURE VISUALIZER
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-term-subtle/40 p-0.5 rounded border border-term-border/40">
          <button
            onClick={() => switchTab('jiomeet')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
              tab === 'jiomeet' ? 'bg-term-text text-black' : 'text-term-dim hover:text-term-text'
            }`}
          >
            JioMeet (15M+ Users)
          </button>
          <button
            onClick={() => switchTab('power')}
            className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
              tab === 'power' ? 'bg-term-text text-black' : 'text-term-dim hover:text-term-text'
            }`}
          >
            Power Financial (30+ Countries)
          </button>
        </div>
      </div>

      {/* Simulation Controls Bar */}
      <div className="flex items-center justify-between bg-black/60 p-2 rounded border border-term-border/40 text-[11px]">
        <div className="flex items-center gap-2">
          <span className="text-term-dim uppercase font-bold flex items-center gap-1">
            <Zap className="w-3 h-3 text-term-accent" /> Simulation Mode:
          </span>
          <button
            onClick={() => setSimulation('normal')}
            className={`px-2 py-0.5 rounded font-bold ${
              simMode === 'normal' ? 'bg-green-500/20 text-green-300 border border-green-500/50' : 'text-term-dim hover:text-term-text'
            }`}
          >
            Normal (10k req/s)
          </button>
          <button
            onClick={() => setSimulation('spike')}
            className={`px-2 py-0.5 rounded font-bold ${
              simMode === 'spike' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/50 animate-pulse' : 'text-term-dim hover:text-term-text'
            }`}
          >
            Traffic Spike (65k req/s)
          </button>
          <button
            onClick={() => setSimulation('failover')}
            className={`px-2 py-0.5 rounded font-bold ${
              simMode === 'failover' ? 'bg-red-500/20 text-red-300 border border-red-500/50' : 'text-term-dim hover:text-term-text'
            }`}
          >
            Replica Failover (HA Test)
          </button>
        </div>

        <div className="text-right text-term-accent font-bold">
          {simMode === 'normal' && 'STATUS: Nominal · P95: 16ms · SLA: 99.99%'}
          {simMode === 'spike' && 'STATUS: Auto-scaling +12 Pods · P95: 24ms · 0 Dropped'}
          {simMode === 'failover' && 'STATUS: Failover Recovered in 1.1s · 0 Data Loss'}
        </div>
      </div>

      {/* Interactive Topology Diagram */}
      {tab === 'jiomeet' ? (
        <div className="border border-term-border/60 rounded-lg p-3 bg-black/80 space-y-4">
          <div className="text-xs text-term-dim font-bold uppercase tracking-wider">
            Distributed WebRTC Signaling & Media Mesh
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
            {/* Tier 1: Ingestion & Edge */}
            <div className="border border-term-border/40 rounded p-2.5 bg-term-subtle/20 space-y-2">
              <Globe className="w-5 h-5 mx-auto text-term-accent" />
              <div className="font-bold text-term-text">Global DNS & Cloudflare</div>
              <div className="text-[10px] text-term-dim">Anycast Edge Routing · DDoS Shield</div>
              <div className="text-[10px] text-green-400 font-bold">
                {simMode === 'spike' ? 'Traffic: 65,400 req/s' : 'Traffic: 12,500 req/s'}
              </div>
            </div>

            {/* Tier 2: Signaling Gateway */}
            <div className="border border-term-border/40 rounded p-2.5 bg-term-subtle/20 space-y-2">
              <Server className="w-5 h-5 mx-auto text-term-accent" />
              <div className="font-bold text-term-text">Signaling Cluster</div>
              <div className="text-[10px] text-term-dim">FastAPI + Async WebSocket Brokers</div>
              <div className="text-[10px] text-term-accent font-bold">
                {simMode === 'spike' ? 'Autoscaled: 24 Pods' : 'Pods: 8 Active'}
              </div>
            </div>

            {/* Tier 3: State & Pub/Sub */}
            <div className="border border-term-border/40 rounded p-2.5 bg-term-subtle/20 space-y-2">
              <RefreshCw className="w-5 h-5 mx-auto text-term-accent animate-spin" style={{ animationDuration: '6s' }} />
              <div className="font-bold text-term-text">Redis Cluster Pub/Sub</div>
              <div className="text-[10px] text-term-dim">Room State · Ephemeral Sessions</div>
              <div className="text-[10px] text-green-400 font-bold">
                {simMode === 'failover' ? 'Replica promoted in 1.1s' : 'Sub-5ms Latency'}
              </div>
            </div>

            {/* Tier 4: Media Relay */}
            <div className="border border-term-border/40 rounded p-2.5 bg-term-subtle/20 space-y-2">
              <Cpu className="w-5 h-5 mx-auto text-term-accent" />
              <div className="font-bold text-term-text">WebRTC SFU Relays</div>
              <div className="text-[10px] text-term-dim">Dynamic Bitrate Adaptation (VP8/H.264)</div>
              <div className="text-[10px] text-term-accent font-bold">15,000,000+ Users Served</div>
            </div>
          </div>

          {/* Architecture Rationale Notes */}
          <div className="border-t border-term-border/40 pt-2 text-[11px] text-term-dim space-y-1">
            <div className="font-bold text-term-text">Rithik's Key Architectural Decisions:</div>
            <div>• Decoupled signaling from media ingestion to prevent connection drops during packet re-transmission.</div>
            <div>• Horizontal Pod Autoscaling configured on active WebSocket session count rather than solely CPU metrics.</div>
          </div>
        </div>
      ) : (
        <div className="border border-term-border/60 rounded-lg p-3 bg-black/80 space-y-4">
          <div className="text-xs text-term-dim font-bold uppercase tracking-wider">
            Multi-Region Financial Ledger & Microservices
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
            {/* Region Gateway */}
            <div className="border border-term-border/40 rounded p-2.5 bg-term-subtle/20 space-y-2">
              <Globe className="w-5 h-5 mx-auto text-term-accent" />
              <div className="font-bold text-term-text">Multi-Region Gateway</div>
              <div className="text-[10px] text-term-dim">Geo-DNS Routing across 30+ Countries</div>
              <div className="text-[10px] text-green-400 font-bold">99.99% Global SLA</div>
            </div>

            {/* Ledger Service */}
            <div className="border border-term-border/40 rounded p-2.5 bg-term-subtle/20 space-y-2">
              <ShieldAlert className="w-5 h-5 mx-auto text-term-accent" />
              <div className="font-bold text-term-text">Ledger Microservice</div>
              <div className="text-[10px] text-term-dim">Python (FastAPI) · Idempotent Transactions</div>
              <div className="text-[10px] text-term-accent font-bold">Zero Double-Spend</div>
            </div>

            {/* Event Streaming */}
            <div className="border border-term-border/40 rounded p-2.5 bg-term-subtle/20 space-y-2">
              <RefreshCw className="w-5 h-5 mx-auto text-term-accent" />
              <div className="font-bold text-term-text">Kafka Event Stream</div>
              <div className="text-[10px] text-term-dim">16 Partitions · Outbox Pattern</div>
              <div className="text-[10px] text-green-400 font-bold">Strict Event Ordering</div>
            </div>

            {/* Database & Caching */}
            <div className="border border-term-border/40 rounded p-2.5 bg-term-subtle/20 space-y-2">
              <Database className="w-5 h-5 mx-auto text-term-accent" />
              <div className="font-bold text-term-text">Postgres + Redis Caching</div>
              <div className="text-[10px] text-term-dim">PgBouncer Pool · Read Replicas</div>
              <div className="text-[10px] text-green-400 font-bold">-35% P95 Query Latency</div>
            </div>
          </div>

          <div className="border-t border-term-border/40 pt-2 text-[11px] text-term-dim space-y-1">
            <div className="font-bold text-term-text">Rithik's Key Architectural Decisions:</div>
            <div>• Implemented transactional outbox pattern to guarantee atomic synchronization between Postgres and Kafka.</div>
            <div>• Reduced P95 query times by 35% through tiered Redis caching and indexed composite keys for audit logs.</div>
          </div>
        </div>
      )}
    </div>
  );
}
