'use client';
import { useState, useEffect } from 'react';
import { useTerminalStore } from '@/store/terminal';
import { sound } from '@/lib/audio';
import { AlertTriangle, ShieldCheck, ArrowLeft, RotateCcw } from 'lucide-react';

interface StoryNode {
  id: string;
  title: string;
  situation: string;
  metrics: { latency: string; errorRate: string; pods: number; dbLoad: string };
  choices: { text: string; nextNode: string; soundType?: 'click' | 'enter' }[];
  isEnding?: boolean;
  isVictory?: boolean;
}

const STORY_NODES: Record<string, StoryNode> = {
  start: {
    id: 'start',
    title: 'INCIDENT #4088: 2:14 AM LATENCY EMERGENCY',
    situation: `PagerDuty alarm blares on your nightstand. You jump onto your terminal.
Core API P95 latency has spiked to 3,420ms. Ingestion error rate is 4.8%. 
15M+ users are currently attempting to join morning video conferences.

What is your first triage action?`,
    metrics: { latency: '3,420ms', errorRate: '4.8%', pods: 8, dbLoad: '98%' },
    choices: [
      { text: '[1] Blindly scale Kubernetes deployment pods from 8 -> 32', nextNode: 'blind_scale' },
      { text: '[2] Inspect PostgreSQL active locks and PgBouncer connection pool', nextNode: 'check_db' },
      { text: '[3] Check Apache Kafka consumer group partition lag', nextNode: 'check_kafka' },
    ],
  },
  blind_scale: {
    id: 'blind_scale',
    title: 'FATAL: THUNDERING HERD CONNECTION STORM',
    situation: `You spun up 24 new pods without checking the database. 
Each new pod immediately spawned 20 connection threads, overwhelming PostgreSQL with 640 simultaneous connections. 
PgBouncer crashed. The entire API cluster went into 504 Gateway Timeout.`,
    metrics: { latency: '15,000ms', errorRate: '88.4%', pods: 32, dbLoad: '100% CRASH' },
    isEnding: true,
    isVictory: false,
    choices: [{ text: '› Restart Incident Simulation', nextNode: 'start' }],
  },
  check_kafka: {
    id: 'check_kafka',
    title: 'KAFKA TELEMETRY AUDIT',
    situation: `You check Kafka partition metrics: partition lag is zero. Events are flowing freely into the broker. 
The bottleneck is strictly downstream in the persistence layer. 
CPU on the primary database is pinned at 99%.`,
    metrics: { latency: '3,100ms', errorRate: '3.9%', pods: 8, dbLoad: '99%' },
    choices: [
      { text: '[1] Inspect PostgreSQL pg_stat_activity and lock contention', nextNode: 'check_db' },
      { text: '[2] Restart the Kafka broker cluster', nextNode: 'restart_kafka' },
    ],
  },
  restart_kafka: {
    id: 'restart_kafka',
    title: 'UNNECESSARY OUTAGE INDUCED',
    situation: `Restarting the healthy Kafka cluster caused leader re-elections and dropped in-flight WebRTC signaling packets! 
Always verify root cause before restarting healthy distributed components.`,
    metrics: { latency: '8,500ms', errorRate: '24.2%', pods: 8, dbLoad: '99%' },
    isEnding: true,
    isVictory: false,
    choices: [{ text: '› Restart Incident Simulation', nextNode: 'start' }],
  },
  check_db: {
    id: 'check_db',
    title: 'ROOT CAUSE IDENTIFIED: UNINDEXED LOCK CONTENTION',
    situation: `Running SELECT * FROM pg_stat_activity reveals a rogue batch report query running for 14 minutes with an EXCLUSIVE lock on the room_participants table!
142 connection requests are queued behind it.

What is your mitigation?`,
    metrics: { latency: '2,900ms', errorRate: '3.2%', pods: 8, dbLoad: '96%' },
    choices: [
      { text: '[1] Terminate the blocking PID with pg_cancel_backend() and route reports to Read-Replica', nextNode: 'kill_and_reroute' },
      { text: '[2] Drop the room_participants table and re-create it', nextNode: 'drop_table' },
    ],
  },
  drop_table: {
    id: 'drop_table',
    title: 'CATASTROPHIC DATA LOSS',
    situation: `You dropped an active production table in the middle of a live meeting surge! 
Your career as a Senior SRE flashed before your eyes.`,
    metrics: { latency: '0ms', errorRate: '100%', pods: 8, dbLoad: '0%' },
    isEnding: true,
    isVictory: false,
    choices: [{ text: '› Restart Incident Simulation', nextNode: 'start' }],
  },
  kill_and_reroute: {
    id: 'kill_and_reroute',
    title: 'LOCK CLEARED: LATENCY DROPPING FAST',
    situation: `You cancelled the rogue query. The queue flushed in 800ms! 
To ensure this never happens again under 15M+ user traffic:
You enforce strict query statement timeouts (5000ms max) and bind heavy analytics to the PostgreSQL Read-Replica.

Latency plummeted to 18ms. Error rate: 0.00%.`,
    metrics: { latency: '18ms', errorRate: '0.00%', pods: 8, dbLoad: '28%' },
    choices: [
      { text: '[1] Write automated post-mortem, add synthetic Prometheus alert, and go back to sleep', nextNode: 'victory' },
    ],
  },
  victory: {
    id: 'victory',
    title: 'INCIDENT RESOLVED: 99.99% SLA SAVED! 🏆',
    situation: `Outstanding triage, Senior Engineer! 
By avoiding knee-jerk pod scaling and methodically diagnosing the connection queue, you resolved the outage in under 6 minutes with zero data loss. 
The VP of Engineering left a commendation on Slack.`,
    metrics: { latency: '14ms', errorRate: '0.00%', pods: 8, dbLoad: '22%' },
    isEnding: true,
    isVictory: true,
    choices: [{ text: '› Play Again', nextNode: 'start' }],
  },
};

export function AdventureGame() {
  const setActiveApp = useTerminalStore((s) => s.setActiveApp);
  const [currentNodeId, setCurrentNodeId] = useState('start');
  const node = STORY_NODES[currentNodeId] || STORY_NODES['start'];

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

  const chooseOption = (nextNode: string) => {
    sound.playEnter();
    setCurrentNodeId(nextNode);
  };

  return (
    <div className="flex flex-col h-full w-full bg-black/95 text-term-text font-mono text-xs select-none p-3 space-y-3 overflow-y-auto">
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
            <AlertTriangle className="w-4 h-4 text-term-accent" />
            A DAY IN PRODUCTION: SRE TEXT RPG
          </span>
        </div>
      </div>

      {/* Telemetry Bar */}
      <div className="grid grid-cols-4 gap-2 bg-term-subtle/30 p-2 rounded border border-term-border/40 text-[11px] font-bold text-center">
        <div>P95 Latency: <span className="text-red-400">{node.metrics.latency}</span></div>
        <div>Error Rate: <span className="text-red-400">{node.metrics.errorRate}</span></div>
        <div>Active Pods: <span className="text-term-accent">{node.metrics.pods}</span></div>
        <div>DB Load: <span className="text-term-accent">{node.metrics.dbLoad}</span></div>
      </div>

      {/* Main Story Narrative */}
      <div className="flex-1 border border-term-border/50 rounded-lg p-3.5 bg-black/80 space-y-3 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="text-xs font-bold text-term-accent uppercase border-b border-term-border/30 pb-1">
            {node.title}
          </div>
          <p className="text-xs sm:text-sm text-term-text leading-relaxed whitespace-pre-wrap">
            {node.situation}
          </p>
        </div>

        {/* Choices */}
        <div className="space-y-2 pt-2 border-t border-term-border/30">
          <div className="text-[10px] text-term-dim uppercase font-bold">Select Decision:</div>
          {node.choices.map((choice, i) => (
            <button
              key={i}
              onClick={() => chooseOption(choice.nextNode)}
              className="w-full text-left p-2 rounded border border-term-border/60 bg-term-subtle/40 hover:bg-term-text hover:text-black transition-colors font-mono text-xs font-semibold flex items-center gap-2"
            >
              {choice.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
