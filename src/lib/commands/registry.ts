import { PORTFOLIO_DATA } from '@/data/portfolio';
import {
  getNodeByPath,
  normalizePath,
  generateTree,
  virtualFS,
  FSNode,
} from '@/lib/filesystem';
import { getNeofetchOutput } from './neofetch';
import { getRecruiterBriefing } from './recruiter';
import { askRithikAI } from './aiCopilot';
import { useTerminalStore, ThemeType, GUISection } from '@/store/terminal';
import { sound, SwitchProfile } from '@/lib/audio';
import confetti from 'canvas-confetti';

export interface CommandContext {
  args: string[];
  flags: Record<string, boolean | string>;
  raw: string;
}

export type CommandResult = {
  type?: 'text' | 'error' | 'success' | 'ascii' | 'table' | 'system' | 'custom';
  content: string;
};

const FORTUNES = [
  '"Simplicity is prerequisite for reliability." — Edsger W. Dijkstra',
  '"There are only two hard things in Computer Science: cache invalidation and naming things." — Phil Karlton',
  '"First, solve the problem. Then, write the code." — John Johnson',
  '"Walking on water and developing software from a specification are easy if both are frozen." — Edward V. Berard',
  '"Make it work, make it right, make it fast." — Kent Beck',
  '"99.99% availability isn’t luck; it’s defensive architecture and idempotent workflows." — Rithik Agrawal',
];

export const commandRegistry: Record<
  string,
  (ctx: CommandContext) => CommandResult | Promise<CommandResult>
> = {
  help: () => {
    return {
      type: 'ascii',
      content: `
AVAILABLE COMMANDS (type any command or click touch-chips below):
================================================================================
[Navigation & Files]
  ls [-la] [dir]    List directory contents and file metadata
  cd <dir>          Change directory (e.g. 'cd experience', 'cd projects', 'cd ~')
  pwd               Print current working directory path
  cat <file>        Read file contents (e.g. 'cat about.md', 'cat resume.pdf')
  tree              Display hierarchical visual filesystem directory tree
  head <file>       Display first 10 lines of specified file
  find <pattern>    Search files matching pattern
  grep <term> <file>Search string inside a file
  wc <file>         Print line and character counts of file

[Identity & Production Stats]
  whoami            Print active user session identity
  neofetch          Display ASCII hero logo and hardware/engineering profile
  fastfetch         Compact system architecture and stack summary
  man rithik        Detailed manual page with full professional dossier
  uptime            Display production years and scale metrics
  hostname          Print current host network name
  id                Print current UID, GID and security groups
  uname -a          Print operating system kernel specifications
  date              Print current system timestamp

[Sections & GUI Showcase]
  experience        Display career timeline (or 'cd experience')
  projects          Display production projects (or 'cd projects')
  skills            Display full proficiency matrix (or 'cd skills')
  contact           Display verified contact endpoints
  resume            View or download master resume
  gui [section]     Toggle visual GUI card view ('gui experience', 'gui projects', 'gui off')

[Actions & External Links]
  open <target>     Launch external destination ('open resume', 'open github', 'open linkedin')
  mail              Open contact form dialog or mail client
  curl <url>        Simulate HTTP GET request

[Executive & Technical Architecture]
  recruiter         One-click executive briefing for hiring managers & recruiters
  htop              Interactive real-time systems monitor & process loads
  arch              Interactive system architecture visualizer (JioMeet & Power)
  ask-rithik "q"    Interview Rithik's in-terminal AI career copilot

[Interactive Tools & Terminal Apps]
  nano <file>       Interactive text editor buffer inside the terminal (or 'vim')
  guestbook         Global visitor endorsement ledger ('guestbook sign "msg"')
  type-test         Terminal coding speed test (Monkeytype style with WPM)
  adventure         SRE incident response multi-branch text RPG
  radio [play|next] Procedural chiptune radio with dancing ASCII spectrum

[3D Hardware & Audio Controls]
  degauss           Discharge CRT magnetic degaussing coil (screen shake effect)
  orbit / inspect   Toggle 360° 3D camera orbit to inspect rear chassis
  monitor <model>   Swap monitor chassis ('amber-crt', 'ibm-5151', 'cyberpunk')
  scene             Toggle 3D environment between space cosmos and retro desk
  theme <name>      Switch theme ('amber' [default], 'matrix', 'cyber', 'dracula')
  sound <on|off>    Toggle mechanical keyboard audio synthesizer
  sound switch <t>  Switch sound profile ('blue' [default], 'model-m', 'red', 'teletype')
  power             Toggle CRT screen power collapse effect
  clear             Clear terminal screen history (or Ctrl+L)
  history           List executed command history buffer
  echo <text>       Print text to standard output

[Retro Games & Easter Eggs]
  snake             Play classic retro ASCII Snake inside the CRT!
  pong              Play retro ASCII Pong vs terminal CPU
  sudo hire-me      Trigger special recruitment celebration sequence
  matrix            Start digital rain canvas animation
  cowsay <message>  ASCII cow speaks your text
  fortune           Display random senior engineering aphorism
  sl                Run ASCII steam locomotive
================================================================================
Tip: Use TAB for auto-completion and ↑/↓ keys for command history.
`,
    };
  },

  whoami: () => ({
    type: 'text',
    content: `${PORTFOLIO_DATA.personal.handle} — ${PORTFOLIO_DATA.personal.title}`,
  }),

  hostname: () => ({
    type: 'text',
    content: 'portfolio.rithikagrawal.com',
  }),

  id: () => ({
    type: 'text',
    content: 'uid=1000(rithik) gid=1000(staff) groups=1000(staff),4(adm),24(cdrom),27(sudo),100(users)',
  }),

  uname: (ctx) => {
    if (ctx.flags.a || ctx.args.includes('-a')) {
      return {
        type: 'text',
        content: 'Linux portfolio-crt 6.8.0-2026-generic #42-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux',
      };
    }
    return { type: 'text', content: 'Linux' };
  },

  uptime: () => ({
    type: 'text',
    content: `up ${PORTFOLIO_DATA.personal.uptime}, 2 enterprise companies, 15M+ users served, load average: 0.08, 0.12, 0.15`,
  }),

  date: () => ({
    type: 'text',
    content: new Date().toUTCString(),
  }),

  neofetch: () => ({
    type: 'ascii',
    content: getNeofetchOutput(),
  }),

  fastfetch: () => ({
    type: 'ascii',
    content: getNeofetchOutput(),
  }),

  pwd: () => {
    const cwd = useTerminalStore.getState().cwd;
    return { type: 'text', content: cwd };
  },

  ls: (ctx) => {
    const cwd = useTerminalStore.getState().cwd;
    const targetPath = ctx.args[0] ? normalizePath(cwd, ctx.args[0]) : cwd;
    const node = getNodeByPath(targetPath);

    if (!node) {
      return {
        type: 'error',
        content: `ls: cannot access '${ctx.args[0]}': No such file or directory`,
      };
    }

    if (node.type !== 'dir' || !node.children) {
      return { type: 'text', content: node.name };
    }

    const showDetails = ctx.flags.l || ctx.flags.la || ctx.flags.al;
    const showHidden = ctx.flags.a || ctx.flags.la || ctx.flags.al;

    const entries = Object.values(node.children).filter((item) => {
      if (item.name.startsWith('.') && !showHidden) return false;
      return true;
    });

    if (showDetails) {
      const rows = entries.map((item) => {
        const perms = item.permissions || (item.type === 'dir' ? 'drwxr-xr-x' : '-rw-r--r--');
        const size = (item.size || 4096).toString().padStart(6);
        const date = item.updatedAt || 'Sep 26 01:00';
        const name = item.type === 'dir' ? `${item.name}/` : item.name;
        return `${perms}  1 rithik staff  ${size}  ${date}  ${name}`;
      });
      return {
        type: 'ascii',
        content: `total ${entries.length * 4}\n` + rows.join('\n'),
      };
    }

    const names = entries.map((item) => (item.type === 'dir' ? `${item.name}/` : item.name));
    return { type: 'text', content: names.join('    ') };
  },

  cd: (ctx) => {
    const store = useTerminalStore.getState();
    const target = ctx.args[0] || '~';
    const resolved = normalizePath(store.cwd, target);
    const node = getNodeByPath(resolved);

    if (!node) {
      return {
        type: 'error',
        content: `bash: cd: ${target}: No such file or directory`,
      };
    }

    if (node.type !== 'dir') {
      return {
        type: 'error',
        content: `bash: cd: ${target}: Not a directory`,
      };
    }

    store.setCwd(resolved);

    // If navigating to high-level sections, prompt GUI transition or load
    if (resolved === '/home/rithik/experience') {
      store.setViewMode('gui', 'experience');
      return {
        type: 'system',
        content: `Navigated to ~/experience [GUI View engaged]. Type 'cat power-financial.md' or explore timeline cards below. Type 'gui off' to return to monitor focus.`,
      };
    } else if (resolved === '/home/rithik/projects') {
      store.setViewMode('gui', 'projects');
      return {
        type: 'system',
        content: `Navigated to ~/projects [GUI View engaged]. Type 'cat neural-commerce.md' or inspect project cards below.`,
      };
    } else if (resolved === '/home/rithik/skills') {
      store.setViewMode('gui', 'skills');
      return {
        type: 'system',
        content: `Navigated to ~/skills [GUI View engaged]. Type 'cat skills.json' or inspect proficiency radar below.`,
      };
    } else if (resolved === '/home/rithik/contact') {
      store.setViewMode('gui', 'contact');
      return {
        type: 'system',
        content: `Navigated to ~/contact [GUI View engaged]. Type 'mail' to compose message or click links below.`,
      };
    } else {
      store.setViewMode('terminal', null);
    }

    return { type: 'text', content: '' };
  },

  cat: (ctx) => {
    if (!ctx.args[0]) {
      return { type: 'error', content: 'cat: missing file operand' };
    }

    const cwd = useTerminalStore.getState().cwd;
    const resolved = normalizePath(cwd, ctx.args[0]);
    const node = getNodeByPath(resolved);

    if (!node) {
      return {
        type: 'error',
        content: `cat: ${ctx.args[0]}: No such file or directory`,
      };
    }

    if (node.type === 'dir') {
      return {
        type: 'error',
        content: `cat: ${ctx.args[0]}: Is a directory. Try 'ls ${ctx.args[0]}' or 'cd ${ctx.args[0]}'.`,
      };
    }

    if (node.name === 'resume.pdf') {
      if (typeof window !== 'undefined') {
        window.open('/resume.pdf', '_blank');
      }
      return {
        type: 'success',
        content: `Opening /home/rithik/resume.pdf in new tab... You can also download it from /resume.pdf.`,
      };
    }

    return {
      type: 'ascii',
      content: node.content || '[Empty file]',
    };
  },

  tree: (ctx) => {
    const cwd = useTerminalStore.getState().cwd;
    const target = ctx.args[0] ? normalizePath(cwd, ctx.args[0]) : cwd;
    const node = getNodeByPath(target);

    if (!node) {
      return { type: 'error', content: `tree: '${ctx.args[0]}': No such file or directory` };
    }

    const lines = [target, ...generateTree(node)];
    return { type: 'ascii', content: lines.join('\n') };
  },

  head: (ctx) => {
    if (!ctx.args[0]) {
      return { type: 'error', content: 'head: missing file operand' };
    }
    const cwd = useTerminalStore.getState().cwd;
    const resolved = normalizePath(cwd, ctx.args[0]);
    const node = getNodeByPath(resolved);

    if (!node || !node.content) {
      return { type: 'error', content: `head: cannot open '${ctx.args[0]}': No such file` };
    }

    const lines = node.content.split('\n').slice(0, 10).join('\n');
    return { type: 'text', content: lines };
  },

  grep: (ctx) => {
    if (ctx.args.length < 2) {
      return { type: 'error', content: 'usage: grep <pattern> <file>' };
    }
    const [pattern, fileName] = ctx.args;
    const cwd = useTerminalStore.getState().cwd;
    const resolved = normalizePath(cwd, fileName);
    const node = getNodeByPath(resolved);

    if (!node || !node.content) {
      return { type: 'error', content: `grep: ${fileName}: No such file` };
    }

    const matched = node.content
      .split('\n')
      .filter((line) => line.toLowerCase().includes(pattern.toLowerCase()));

    if (matched.length === 0) {
      return { type: 'text', content: '' };
    }

    return { type: 'ascii', content: matched.join('\n') };
  },

  find: (ctx) => {
    const query = ctx.args[0] || '';
    const results: string[] = [];

    const searchNode = (node: FSNode) => {
      if (node.name.toLowerCase().includes(query.toLowerCase())) {
        results.push(node.path);
      }
      if (node.children) {
        Object.values(node.children).forEach(searchNode);
      }
    };

    searchNode(virtualFS);
    return { type: 'text', content: results.join('\n') || 'No matching files.' };
  },

  wc: (ctx) => {
    if (!ctx.args[0]) return { type: 'error', content: 'wc: missing file operand' };
    const cwd = useTerminalStore.getState().cwd;
    const resolved = normalizePath(cwd, ctx.args[0]);
    const node = getNodeByPath(resolved);

    if (!node || !node.content) {
      return { type: 'error', content: `wc: ${ctx.args[0]}: No such file` };
    }

    const lines = node.content.split('\n').length;
    const words = node.content.trim().split(/\s+/).length;
    const bytes = node.content.length;
    return { type: 'text', content: `  ${lines}  ${words} ${bytes} ${node.name}` };
  },

  echo: (ctx) => ({
    type: 'text',
    content: ctx.args.join(' '),
  }),

  clear: () => {
    useTerminalStore.getState().clearOutputs();
    return { type: 'text', content: '' };
  },

  history: () => {
    const history = useTerminalStore.getState().commandHistory;
    const list = history.map((cmd, i) => `  ${(i + 1).toString().padStart(3)}  ${cmd}`);
    return { type: 'ascii', content: list.join('\n') || 'Command history is empty.' };
  },

  man: (ctx) => {
    const subject = ctx.args[0] || 'rithik';
    if (subject.toLowerCase() === 'rithik') {
      return {
        type: 'ascii',
        content: `
RITHIK(1)                 User Commands Manual                 RITHIK(1)

NAME
       rithik - Senior Software Engineer & Distributed Systems Architect

SYNOPSIS
       rithik [--full-stack] [--backend] [--scale=15M] [--hire]

DESCRIPTION
       rithik is a battle-tested Senior Software Engineer with 5+ years of
       experience engineering scalable backend architectures, high-performance
       RESTful APIs, and responsive enterprise interfaces.

       Primary operating competencies include:
       - Architecting Flask & FastAPI microservices handling 100k+ daily transactions.
       - Designing PostgreSQL indexing strategies that slashed P95 latency by 35%.
       - Leading cross-functional engineering pods on JioMeet (15M+ active users).
       - Automating blue-green CI/CD pipelines in Docker & Jenkins, cutting deploy time by 50%.
       - Enforcing 85%+ PyTest code coverage standards.

COMMANDS FOR INSPECTION
       cd experience   Examine verified corporate engineering history
       cd projects     Examine production architecture case studies
       cd skills       Inspect technical proficiency matrix
       open resume     Download master PDF dossier

BUGS & ANOMALIES
       Zero known production defects remaining unhandled.

AUTHOR
       Written by Rithik Agrawal <rithikagrawal40@gmail.com>.
`,
      };
    }
    return {
      type: 'error',
      content: `No manual entry for ${subject}. Try 'man rithik'.`,
    };
  },

  // Direct section shortcuts
  experience: () => {
    useTerminalStore.getState().setCwd('/home/rithik/experience');
    useTerminalStore.getState().setViewMode('gui', 'experience');
    return {
      type: 'system',
      content: 'Transitioned to Experience showcase. Inspecting career records below.',
    };
  },

  projects: () => {
    useTerminalStore.getState().setCwd('/home/rithik/projects');
    useTerminalStore.getState().setViewMode('gui', 'projects');
    return {
      type: 'system',
      content: 'Transitioned to Projects showcase. Inspecting technical projects below.',
    };
  },

  skills: () => {
    useTerminalStore.getState().setCwd('/home/rithik/skills');
    useTerminalStore.getState().setViewMode('gui', 'skills');
    return {
      type: 'system',
      content: 'Transitioned to Skills matrix. Inspecting tech stack breakdown below.',
    };
  },

  contact: () => {
    useTerminalStore.getState().setCwd('/home/rithik/contact');
    useTerminalStore.getState().setViewMode('gui', 'contact');
    return {
      type: 'system',
      content: 'Transitioned to Contact portal. Direct communication channels active below.',
    };
  },

  resume: () => {
    if (typeof window !== 'undefined') {
      window.open('/resume.pdf', '_blank');
    }
    return {
      type: 'success',
      content: 'Master resume opened in new tab. Download available at /resume.pdf.',
    };
  },

  gui: (ctx) => {
    const store = useTerminalStore.getState();
    const target = ctx.args[0]?.toLowerCase();
    if (target === 'off' || target === 'close') {
      store.setViewMode('terminal', null);
      return { type: 'system', content: 'GUI view minimized. Monitor focused.' };
    }
    if (['experience', 'projects', 'skills', 'contact'].includes(target)) {
      store.setViewMode('gui', target as GUISection);
      return { type: 'system', content: `GUI showcase: ${target} displayed below.` };
    }
    store.setViewMode(store.viewMode === 'gui' ? 'terminal' : 'gui', 'experience');
    return {
      type: 'system',
      content: `Toggled GUI mode: ${store.viewMode === 'gui' ? 'active' : 'terminal only'}.`,
    };
  },

  open: (ctx) => {
    const target = (ctx.args[0] || '').toLowerCase();
    if (typeof window === 'undefined') return { type: 'text', content: '' };

    if (target === 'resume' || target === 'resume.pdf') {
      window.open('/resume.pdf', '_blank');
      return { type: 'success', content: 'Launching resume PDF...' };
    }
    if (target === 'github' || target.includes('github')) {
      window.open(PORTFOLIO_DATA.personal.github, '_blank');
      return { type: 'success', content: `Opening ${PORTFOLIO_DATA.personal.github}...` };
    }
    if (target === 'linkedin' || target.includes('linkedin')) {
      window.open(PORTFOLIO_DATA.personal.linkedin, '_blank');
      return { type: 'success', content: `Opening ${PORTFOLIO_DATA.personal.linkedin}...` };
    }
    if (target === 'twitter' || target.includes('twitter')) {
      window.open(PORTFOLIO_DATA.personal.twitter, '_blank');
      return { type: 'success', content: `Opening ${PORTFOLIO_DATA.personal.twitter}...` };
    }

    return {
      type: 'error',
      content: `open: unknown target '${target}'. Try 'open resume', 'open github', 'open linkedin', or 'open twitter'.`,
    };
  },

  mail: () => {
    useTerminalStore.getState().setViewMode('gui', 'contact');
    return {
      type: 'system',
      content: `Opening contact transmission console... You can also email direct to ${PORTFOLIO_DATA.personal.email}.`,
    };
  },

  curl: async (ctx) => {
    const url = ctx.args[0];
    if (!url) return { type: 'error', content: 'curl: try \'curl --help\' or specify a URL' };

    return {
      type: 'ascii',
      content: `
HTTP/2 200 OK
server: portfolio-gateway/2.0
content-type: application/json; charset=utf-8
cache-control: public, max-age=3600

{
  "status": "online",
  "engineer": "${PORTFOLIO_DATA.personal.name}",
  "role": "${PORTFOLIO_DATA.personal.title}",
  "latency": "14ms",
  "regions_served": ["US", "EU", "APAC", "MEA"],
  "response": "Connection accepted. Ready to build high-scale systems."
}
`,
    };
  },

  theme: (ctx) => {
    const store = useTerminalStore.getState();
    const themeName = (ctx.args[0] || '').toLowerCase() as ThemeType;

    if (['amber', 'matrix', 'cyber', 'dracula'].includes(themeName)) {
      store.setTheme(themeName);
      return {
        type: 'success',
        content: `Theme switched to '${themeName}'. Phosphor palette calibrated.`,
      };
    }

    return {
      type: 'error',
      content: `Unknown theme '${ctx.args[0]}'. Available themes: amber (default), matrix, cyber, dracula.`,
    };
  },

  sound: (ctx) => {
    const store = useTerminalStore.getState();
    const arg = (ctx.args[0] || '').toLowerCase();
    const subArg = (ctx.args[1] || '').toLowerCase() as SwitchProfile;

    if (arg === 'switch' || arg === 'profile') {
      if (['blue', 'model-m', 'red', 'teletype'].includes(subArg)) {
        store.setSwitchProfile(subArg);
        return {
          type: 'success',
          content: `Mechanical switch profile set to [${subArg.toUpperCase()}]. Tactile feedback re-calibrated.`,
        };
      }
      return {
        type: 'system',
        content: `Current switch profile: [${store.switchProfile.toUpperCase()}].\nAvailable profiles: 'blue' (tactile click), 'model-m' (IBM spring solenoid), 'red' (linear soft), 'teletype' (metallic punch).\nUsage: 'sound switch <profile>'`,
      };
    }

    if (arg === 'on') {
      if (!store.soundEnabled) store.toggleSound();
      sound.enabled = true;
      sound.playKeypress();
      return { type: 'success', content: 'Mechanical audio synthesizer [ENABLED].' };
    } else if (arg === 'off') {
      if (store.soundEnabled) store.toggleSound();
      sound.enabled = false;
      return { type: 'success', content: 'Audio synthesizer [MUTED].' };
    }

    const current = store.toggleSound();
    sound.enabled = current;
    if (current) sound.playKeypress();
    return {
      type: 'system',
      content: `Audio synthesizer is now [${current ? 'ENABLED' : 'MUTED'}]. Profile: [${store.switchProfile.toUpperCase()}]. Type 'sound switch <name>' to change switch type.`,
    };
  },

  power: () => {
    useTerminalStore.getState().togglePower();
    return {
      type: 'system',
      content: 'CRT monitor power state toggled.',
    };
  },

  snake: () => {
    useTerminalStore.getState().setActiveGame('snake');
    return {
      type: 'system',
      content: 'Starting ASCII Snake... Use Arrow Keys / WASD to move. Press [Q] or [Esc] to exit.',
    };
  },

  pong: () => {
    useTerminalStore.getState().setActiveGame('pong');
    return {
      type: 'system',
      content: 'Starting ASCII Pong... Use Arrow Up/Down or W/S to move paddle. Press [Q] or [Esc] to exit.',
    };
  },

  // Easter eggs
  sudo: (ctx) => {
    const command = ctx.args.join(' ').toLowerCase();
    if (command === 'hire-me' || command === 'hire' || command === 'hire rithik') {
      if (typeof window !== 'undefined') {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#ffb000', '#ffd000', '#ffffff', '#00ff41'],
        });
      }
      useTerminalStore.getState().setViewMode('gui', 'contact');
      return {
        type: 'success',
        content: `
[AUTHENTICATION GRANTED]
Root permission elevated. Initiating candidate acquisition sequence...
Rithik Agrawal is available for impactful Senior Software Engineering roles.
Routing directly to contact channel...
`,
      };
    }

    return {
      type: 'error',
      content: `[sudo] password for ${PORTFOLIO_DATA.personal.handle}: \nrithik is not in the sudoers file. This incident will be reported to Santa Claus.`,
    };
  },

  matrix: () => {
    const store = useTerminalStore.getState();
    const next = !store.isMatrixActive;
    store.setMatrixActive(next);
    if (next) {
      store.setTheme('matrix');
      return {
        type: 'success',
        content: 'Wake up, Neo... The Matrix has you. Type `matrix` again to exit.',
      };
    }
    return {
      type: 'system',
      content: 'Matrix simulation terminated. Returning to standard terminal.',
    };
  },

  cowsay: (ctx) => {
    const msg = ctx.args.join(' ') || 'Build systems that scale to millions with clean architecture!';
    const border = '-'.repeat(msg.length + 2);
    return {
      type: 'ascii',
      content: `
 ${border}
< ${msg} >
 ${border}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
`,
    };
  },

  fortune: () => {
    const quote = FORTUNES[Math.floor(Math.random() * FORTUNES.length)];
    return {
      type: 'ascii',
      content: `\n${quote}\n`,
    };
  },

  sl: () => ({
    type: 'ascii',
    content: `
      ====        ________                ___________
  _D _|  |_______/        \\__I_I_____===__|_________|
   |(_)---  |   H\\________/ _____ |   (|) |
   /     |  |   H  |  |     |   | |      |
  |      |  |   H  |__--------------------|
  | ________|___H__/__|_____/[][]~\\_______|
  |/ |   |_____ _____ _____ _____ _____ |\\|
 @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
   CHOO CHOO! You ran 'sl' instead of 'ls'!
`,
  }),

  vim: (ctx) => {
    const file = ctx.args[0] || 'notes.txt';
    const store = useTerminalStore.getState();
    const targetPath = file.startsWith('/') ? file : store.cwd + '/' + file;
    store.setActiveApp('nano', targetPath);
    return {
      type: 'system',
      content: `Opening vim buffer for ${targetPath}...`,
    };
  },

  nano: (ctx) => {
    const file = ctx.args[0] || 'notes.txt';
    const store = useTerminalStore.getState();
    const targetPath = file.startsWith('/') ? file : store.cwd + '/' + file;
    store.setActiveApp('nano', targetPath);
    return {
      type: 'system',
      content: `Opening nano editor buffer for ${targetPath}...`,
    };
  },

  recruiter: () => ({
    type: 'ascii',
    content: getRecruiterBriefing(),
  }),

  tldr: () => ({
    type: 'ascii',
    content: getRecruiterBriefing(),
  }),

  htop: () => {
    useTerminalStore.getState().setActiveApp('htop');
    return {
      type: 'system',
      content: 'Starting interactive htop process monitor... (Press q or Esc to exit)',
    };
  },

  top: () => {
    useTerminalStore.getState().setActiveApp('htop');
    return {
      type: 'system',
      content: 'Starting interactive htop process monitor... (Press q or Esc to exit)',
    };
  },

  btop: () => {
    useTerminalStore.getState().setActiveApp('htop');
    return {
      type: 'system',
      content: 'Starting interactive htop process monitor... (Press q or Esc to exit)',
    };
  },

  arch: () => {
    useTerminalStore.getState().setActiveApp('arch');
    return {
      type: 'system',
      content: 'Launching interactive system architecture visualizer... (Press q or Esc to exit)',
    };
  },

  architecture: () => {
    useTerminalStore.getState().setActiveApp('arch');
    return {
      type: 'system',
      content: 'Launching interactive system architecture visualizer... (Press q or Esc to exit)',
    };
  },

  'ask-rithik': (ctx) => {
    const query = ctx.args.join(' ');
    const res = askRithikAI(query);
    return {
      type: 'ascii',
      content: `
================================================================================
[AI CAREER COPILOT — ${res.topic.toUpperCase()}]
================================================================================
${res.answer}
--------------------------------------------------------------------------------
Related Commands: ${res.relatedCommands.map((c) => `[${c}]`).join('  ')}
================================================================================
`,
    };
  },

  ai: (ctx) => {
    const query = ctx.args.join(' ');
    const res = askRithikAI(query);
    return {
      type: 'ascii',
      content: `
================================================================================
[AI CAREER COPILOT — ${res.topic.toUpperCase()}]
================================================================================
${res.answer}
--------------------------------------------------------------------------------
Related Commands: ${res.relatedCommands.map((c) => `[${c}]`).join('  ')}
================================================================================
`,
    };
  },

  guestbook: (ctx) => {
    if (ctx.args[0] === 'sign') {
      const msg = ctx.args.slice(1).join(' ').replace(/^["']|["']$/g, '');
      const name = (ctx.flags.name as string) || 'Visitor';
      if (!msg) {
        return {
          type: 'error',
          content: 'Usage: guestbook sign "<message>" --name="<Your Name>"',
        };
      }
      try {
        const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('term_guestbook') : null;
        const list = stored ? JSON.parse(stored) : [];
        list.unshift({
          id: 'gb-' + Date.now().toString(36),
          name,
          role: 'Tech Recruiter / Engineer',
          message: msg,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        });
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('term_guestbook', JSON.stringify(list));
        }
        return {
          type: 'success',
          content: `✓ Recorded signature from ${name}: "${msg}"\nType 'guestbook' to view the full ledger.`,
        };
      } catch {
        return {
          type: 'error',
          content: 'Failed to write to guestbook storage.',
        };
      }
    }

    useTerminalStore.getState().setActiveApp('guestbook');
    return {
      type: 'system',
      content: 'Launching interactive Guestbook ledger... (Press q or Esc to exit)',
    };
  },

  'type-test': () => {
    useTerminalStore.getState().setActiveApp('type-test');
    return {
      type: 'system',
      content: 'Starting Terminal Coding Speed Test... (Press q or Esc to exit)',
    };
  },

  speed: () => {
    useTerminalStore.getState().setActiveApp('type-test');
    return {
      type: 'system',
      content: 'Starting Terminal Coding Speed Test... (Press q or Esc to exit)',
    };
  },

  adventure: () => {
    useTerminalStore.getState().setActiveApp('adventure');
    return {
      type: 'system',
      content: 'Starting SRE Incident Response Text RPG... (Press q or Esc to exit)',
    };
  },

  rpg: () => {
    useTerminalStore.getState().setActiveApp('adventure');
    return {
      type: 'system',
      content: 'Starting SRE Incident Response Text RPG... (Press q or Esc to exit)',
    };
  },

  radio: (ctx) => {
    if (ctx.args[0] === 'play' || ctx.args[0] === 'start') {
      sound.startRadio(useTerminalStore.getState().radioTrackIndex);
      useTerminalStore.setState({ isRadioPlaying: true });
      return {
        type: 'success',
        content: 'Procedural chiptune radio started playing. Type "radio" for ASCII spectrum visualizer.',
      };
    }
    if (ctx.args[0] === 'stop' || ctx.args[0] === 'pause') {
      sound.stopRadio();
      useTerminalStore.setState({ isRadioPlaying: false });
      return {
        type: 'system',
        content: 'Procedural chiptune radio stopped.',
      };
    }
    if (ctx.args[0] === 'next') {
      const next = useTerminalStore.getState().nextRadioTrack();
      sound.startRadio(next);
      useTerminalStore.setState({ isRadioPlaying: true });
      return {
        type: 'success',
        content: `Skipped to Track ${next + 1}.`,
      };
    }
    useTerminalStore.getState().setActiveApp('radio');
    return {
      type: 'system',
      content: 'Launching interactive Chiptune Radio & ASCII spectrum visualizer... (Press q or Esc to exit)',
    };
  },

  lofi: () => {
    useTerminalStore.getState().setActiveApp('radio');
    return {
      type: 'system',
      content: 'Launching interactive Chiptune Radio & ASCII spectrum visualizer... (Press q or Esc to exit)',
    };
  },

  degauss: () => {
    useTerminalStore.getState().triggerDegauss();
    return {
      type: 'system',
      content: 'CRT degaussing coil energized. High-voltage magnetic oscillation discharged.',
    };
  },

  orbit: () => {
    const isOrbit = useTerminalStore.getState().toggleOrbitMode();
    return {
      type: 'system',
      content: isOrbit
        ? '3D Orbit Mode ENABLED. Click and drag in the 3D scene to inspect the CRT monitor chassis in 360°.'
        : '3D Orbit Mode DISABLED. Camera returned to default perspective.',
    };
  },

  inspect: () => {
    const isOrbit = useTerminalStore.getState().toggleOrbitMode();
    return {
      type: 'system',
      content: isOrbit
        ? '3D Orbit Mode ENABLED. Click and drag in the 3D scene to inspect the CRT monitor chassis in 360°.'
        : '3D Orbit Mode DISABLED. Camera returned to default perspective.',
    };
  },

  monitor: (ctx) => {
    const model = ctx.args[0]?.toLowerCase();
    if (!['amber-crt', 'ibm-5151', 'cyberpunk'].includes(model)) {
      return {
        type: 'error',
        content: 'Usage: monitor <amber-crt | ibm-5151 | cyberpunk>\nCurrent model: ' + useTerminalStore.getState().monitorModel,
      };
    }
    useTerminalStore.getState().setMonitorModel(model as any);
    if (model === 'ibm-5151') {
      useTerminalStore.getState().setTheme('matrix');
    } else if (model === 'cyberpunk') {
      useTerminalStore.getState().setTheme('cyber');
    } else {
      useTerminalStore.getState().setTheme('amber');
    }
    return {
      type: 'success',
      content: `Swapped 3D monitor chassis to [${model.toUpperCase()}].`,
    };
  },

  scene: (ctx) => {
    const next = useTerminalStore.getState().toggleSceneMode();
    return {
      type: 'success',
      content: `Swapped 3D environment scene to: [${next.toUpperCase()}].`,
    };
  },

  rm: (ctx) => {
    if (ctx.args.includes('-rf') || ctx.args.includes('/') || ctx.args.includes('*')) {
      return {
        type: 'error',
        content: 'rm: it is dangerous to operate recursively on \'/\'\nPermission denied. Portfolio safety protocols engaged.',
      };
    }
    return {
      type: 'error',
      content: 'rm: read-only filesystem. Nice try though!',
    };
  },

  exit: () => ({
    type: 'system',
    content: 'There is no exit from this terminal. You are inside Rithik’s engineering mind now.',
  }),
};

