# Implementation Plan — Linux Terminal 3D Portfolio

## 1. Executive Summary & Vision

Transform Rithik Agrawal's developer portfolio into a **fully interactive, retro-futuristic 3D Linux Terminal experience**. 
Instead of a standard landing page, visitors arrive at a floating 3D CRT monitor in a dark atmospheric cosmos. The terminal is a living CLI with a custom command engine, virtual Unix filesystem (`/home/rithik`), interactive 3D CRT shaders (curvature, scanlines, bloom, chromatic aberration), authentic audio feedback (synthesized mechanical keypress clicks & boot chime), and seamless transitions into terminal-styled GUI showcase views.

### Confirmed Specifications
- **Framework:** Next.js 14+ (App Router, TypeScript, Tailwind CSS)
- **Primary Aesthetic & Default Theme:** **Amber CRT** (`#ffb000` phosphor on obsidian `#0a0800`), with on-the-fly theme switching (`matrix`, `cyber`, `dracula`).
- **3D Environment:** Three.js + React Three Fiber (`@react-three/fiber`, `@react-three/drei`, postprocessing) featuring a floating CRT monitor with screen curvature, scanline shaders, subtle mouse-reactive tilt, and ambient starfield.
- **Audio System:** Web Audio API procedural sound engine (no heavy audio files needed; instant load) for mechanical keyclicks, carriage returns, and hardware boot chime.
- **Resume Source:** Copied directly from `/Users/rithikagrawal/Development/Projects/agent/master_resume.pdf`.

---

## 2. Visual Architecture & Modes

```
┌───────────────────────────────────────────────────────────────────────┐
│                                                                       │
│         ╔═══════════════════════════════════════════════════╗         │
│         ║                                                   ║         │
│         ║  rithik@portfolio:~$ neofetch                     ║         │
│         ║                                                   ║         │
│         ║    ██████╗  ██╗████████╗██╗  ██╗██╗██╗  ██╗       ║         │
│         ║    ██╔══██╗ ██║╚══██╔══╝██║  ██║██║██║ ██╔╝       ║         │
│         ║    ██████╔╝ ██║   ██║   ███████║██║█████╔╝        ║         │
│         ║    ██╔══██╗ ██║   ██║   ██╔══██║██║██╔═██╗        ║         │
│         ║    ██║  ██║ ██║   ██║   ██║  ██║██║██║  ██╗       ║         │
│         ║    ╚═╝  ╚═╝ ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝       ║         │
│         ║                                                   ║         │
│         ║    OS:        PortfolioOS v2.0                    ║         │
│         ║    Host:      Rithik Agrawal                      ║         │
│         ║    Role:      Full Stack Software Engineer        ║         │
│         ║    Uptime:    4+ years in production              ║         │
│         ║    Shell:     amber-bash 5.2                      ║         │
│         ║    Audio:     WebAudio Synth [ACTIVE]             ║         │
│         ║    Stack:     Python, Flask, Angular, Next.js     ║         │
│         ║    Scale:     15M+ Users (JioMeet), 30+ Countries ║         │
│         ║                                                   ║         │
│         ║  rithik@portfolio:~$ █                            ║         │
│         ║                                                   ║         │
│         ╚═══════════════════════════════════════════════════╝         │
│                          ┌──────────────┐                             │
│                          │ 3D CRT Base  │                             │
│                          └──────────────┘                             │
│               [ Ambient stars · Grid floor · CRT bloom ]              │
└───────────────────────────────────────────────────────────────────────┘
```

### Dual Interaction Paradigm
1. **Pure Terminal Mode:** 
   - Commands like `help`, `whoami`, `neofetch`, `ls`, `cat about.md`, `history`, `tree` print formatted ANSI colored text directly inside the monitor stream.
2. **GUI Extended Mode:**
   - Commands like `cd experience`, `cd projects`, or `gui` smoothly animate the 3D camera and reveal visual terminal-chrome cards (rich project grids, interactive timeline cards, live links) while keeping the CLI accessible via a persistent HUD prompt.

---

## 3. Virtual Filesystem Hierarchy

The portfolio data structure behaves like a genuine Unix filesystem:

```bash
/home/rithik/
├── .profile                  # Shell config & quick stats
├── about.md                  # Comprehensive bio & background
├── resume.pdf                # Master resume (downloadable & previewable)
├── experience/
│   ├── power-financial.md    # Full Stack Dev at Power Financial Wellness (30+ countries)
│   └── jio-platforms.md      # Team Lead at Jio Platforms (JioMeet 15M+ users)
├── projects/
│   ├── neural-commerce.md    # AI e-commerce platform
│   ├── datastream-pipeline.md# Real-time Kafka/Spark pipeline
│   ├── cloudorch.md          # K8s CI/CD orchestration suite
│   ├── sentiment-ai.md       # NLP transformer pipeline
│   ├── authvault.md          # Zero-trust biometric authentication
│   └── financeflow.md        # Personal finance ML dashboard
├── skills/
│   ├── languages.json        # Python, TypeScript, Go, JavaScript, SQL
│   ├── frameworks.json       # FastAPI, Flask, Angular, React, Next.js
│   ├── databases.json        # PostgreSQL, Redis, MongoDB, ClickHouse
│   ├── devops.json           # Docker, Kubernetes, AWS, Jenkins, CI/CD
│   └── architecture.json     # Microservices, REST APIs, TDD/BDD
├── contact/
│   ├── email.txt             # Direct email link & mailto trigger
│   ├── github.url            # https://github.com/rithikagrawal
│   ├── linkedin.url          # https://linkedin.com/in/rithik-agrawal
│   └── twitter.url           # https://twitter.com/rithik_agrawal_
└── .easter-eggs/
    ├── matrix.sh             # Digital rain animation
    ├── cowsay.sh             # ASCII talking cow
    ├── audio.sh              # Toggle click/hum sounds
    └── sudo.sh               # Easter egg elevator
```

---

## 4. Comprehensive Command Engine (40+ Commands)

| Category | Commands | Behavior |
|---|---|---|
| **Filesystem & Nav** | `ls`, `ls -la`, `cd <dir>`, `cd ..`, `cd ~`, `pwd`, `cat <file>`, `tree`, `find <term>`, `head <file>`, `grep <pattern>` | Traverses `/home/rithik/` with realistic error codes (`No such file or directory`, `Is a directory`) |
| **Identity & Stats** | `whoami`, `hostname`, `neofetch`, `fastfetch`, `uname -a`, `uptime`, `id`, `man rithik` | Outputs ASCII badge, system metrics, years in production, scale stats |
| **Shell Utilities** | `help`, `clear`, `history`, `echo <str>`, `date`, `wc <file>`, `alias`, `which <cmd>` | Standard bash command simulation with history stack and output formatting |
| **Actions & External**| `open resume`, `open github`, `open linkedin`, `open twitter`, `mail`, `curl <url>` | Launches modals, downloads, or external links safely |
| **Sound & Visuals** | `sound on/off`, `theme amber`, `theme matrix`, `theme cyber`, `theme dracula` | Live re-theming and audio synth toggle |
| **Easter Eggs** | `sudo hire-me`, `matrix`, `cowsay <msg>`, `fortune`, `sl`, `vim`, `nano`, `rm -rf /`, `exit` | Playful developer easter eggs, animated steam locomotive, permission denials |

### Shell Features:
- **Tab Auto-completion:** Autocompletes commands, directories, and file paths.
- **History Navigation:** `ArrowUp` and `ArrowDown` navigate command history buffer.
- **Control Shortcuts:** `Ctrl+L` to clear, `Ctrl+C` to cancel current line.
- **Dynamic Mobile HUD:** Tappable command chips for touch screens (`[help]`, `[neofetch]`, `[projects]`, `[experience]`, `[resume]`).

---

## 5. 3D CRT & Audio Engine Specs

### 3D Scene (`@react-three/fiber` & `@react-three/drei`)
- **CRT Monitor Mesh:** Procedural rounded-bezel monitor housing with curved face plate.
- **Procedural Screen Shader:**
  - Barrel distortion (convex glass curvature)
  - Horizontal phosphor scanlines with subtle flicker
  - Vignette darkening towards edges
  - Chromatic aberration (slight RGB offset at peripheral pixels)
  - Postprocessing Bloom pass for phosphor glow
- **Dynamic Camera & Floating Physics:**
  - Gentle idle float (`Math.sin` oscillation)
  - Interactive mouse parallax (monitor angles slightly toward cursor)
  - Smooth camera dolly zoom into the screen when typing or expanding GUI view

### Procedural Web Audio Engine
- **Keypress Synthesis:** Dual-frequency bandpassed noise bursts mimicking mechanical keyboard click + clack switch rebound (zero external audio files).
- **Enter/Carriage Return:** Satisfying low-frequency solenoid thud.
- **Boot Chime:** Multi-oscillator harmonic chord inspired by vintage terminal power-on.
- **Sound Toggle:** Accessible via icon in header or `sound on`/`sound off` command.

---

## 6. Color Themes

### 1. Amber Monochrome (Default)
- Primary Text: `#ffb000` (Amber Phosphor P3)
- Background: `#0a0800` (Deep CRT Obsidian)
- Accent/Highlight: `#ffd000`
- Dim / Borders: `rgba(255, 176, 0, 0.2)`
- Glow: `0 0 12px rgba(255, 176, 0, 0.5)`

### 2. Matrix Green
- Primary Text: `#00ff41`
- Background: `#050d06`
- Accent/Highlight: `#33ff66`
- Dim: `rgba(0, 255, 65, 0.2)`

### 3. Cyberpunk Cyan
- Primary Text: `#00d4ff`
- Background: `#080c14`
- Accent/Highlight: `#ff007f`
- Dim: `rgba(0, 212, 255, 0.2)`

### 4. Dracula
- Primary Text: `#f8f8f2`
- Background: `#1e1f29`
- Accent/Highlight: `#bd93f9`
- Dim: `rgba(189, 147, 249, 0.2)`

---

## 7. Execution Roadmap (Phased Plan)

```mermaid
flowchart TD
    subgraph Completed ["Phase 1 - 6 (Completed & Verified)"]
        C1["Next.js Foundation & Master Resume"]
        C2["Virtual FS & 40+ Command Engine"]
        C3["3D CRT Monitor & Shaders"]
        C4["Procedural Audio & Mechanical Switch Profiles"]
        C5["Playable ASCII Games (Snake, Pong)"]
        C6["CRT Phosphor Collapse & 3D Bezel Controls"]
    end

    subgraph Expansion ["Next Phases: Interactive Suite & 3D Immersion"]
        E1["Phase 7: Recruiter Suite (recruiter, htop, arch, ask-rithik, Contact API)"]
        E2["Phase 8: Terminal Tools & Games (nano/vim, guestbook, type-test, adventure)"]
        E3["Phase 9: Audio Chiptune Radio & ASCII Spectrum Visualizer (radio)"]
        E4["Phase 10: 3D Hardware, Degauss, Orbit & Desk Environment (degauss, orbit, monitor, scene)"]
    end

    Completed --> Expansion
```

### Phase 7: Recruiter & Systems Architecture Suite
1. **`recruiter` / `tldr` Executive Briefing:**
   - One-click executive summary tailored for engineering managers and recruiters.
   - Core value proposition, verified scale metrics, direct resume download, interview scheduler, and email actions.
2. **`htop` Real-Time Systems Monitor:**
   - Fullscreen live ASCII process monitor with dynamic fluctuating CPU/Memory load bars.
   - Simulated microservices: `fastapi-core`, `kafka-stream-consumer`, `power-financial-engine`, `postgres-pool`.
   - Interactive commands: `q` to quit, `k` to kill a process with humorous error handling.
3. **`arch` Interactive System Architecture Visualizer:**
   - ASCII visual block diagrams of JioMeet (15M+ users) real-time media/signaling infra and Power Financial Wellness multi-region setup.
   - Interactive simulation modes: traffic spike, worker failure, automatic failover.
4. **`ask-rithik` In-Terminal AI Career Copilot:**
   - Natural language Q&A engine trained on Rithik's complete resume and engineering career.
   - Streams answers line-by-line directly on the CRT screen.
5. **Live Contact Transmission API (`/api/contact`):**
   - Server-side Next.js route handling transmission requests with validation and feedback in `ContactView.tsx`.

### Phase 8: Terminal Interactive Tools & Story Games
6. **`nano` / `vim` In-Terminal Text Editor:**
   - Interactive editor buffer inside the CRT terminal.
   - Supports creating and editing files in `/home/rithik`, with status bar and `:wq` / `Ctrl+O` / `Ctrl+X` save-and-exit commands.
7. **`guestbook` Global Signboard:**
   - Terminal guestbook where visitors and recruiters can sign messages (`guestbook sign "Loved the 3D CRT!" --name="Alex"`).
   - Displays feed of visitor endorsements with persistent storage.
8. **`type-test` Terminal Coding Speed Test:**
   - Monkeytype-style typing test typing real Python/TypeScript backend snippets against a timer.
   - Calculates WPM, accuracy %, and shows rating comparisons.
9. **`adventure` "A Day in Production" SRE Outage RPG:**
   - Interactive multi-branch text adventure game resolving a 2:00 AM production incident (Kafka partition lag, DB deadlocks, pod scaling).

### Phase 9: Audio Chiptune Radio & Spectrum Visualizer
10. **`radio` / `lofi` Chiptune Synthesizer & Spectrum Analyzer:**
    - Procedural 8-bit multi-track audio generator using Web Audio API oscillators.
    - Real-time ASCII audio spectrum visualizer (inspired by `cava`) dancing across the terminal.
    - Play, pause, next track, and volume controls.

### Phase 10: 3D Hardware, Degauss, Orbit & Desk Environment
11. **CRT Degauss Magnetic Burst (`degauss`):**
    - Bezel button and CLI command triggering violent CRT coil wobble, chromatic aberration flash, and deep electromagnetic hum.
12. **3D Camera Orbit & Teardown Mode (`orbit` / `inspect`):**
    - Free 360° camera rotation around the 3D monitor chassis to inspect rear cooling vents, power cable, serial badge, and VGA port.
13. **Vintage Monitor Model Swapper (`monitor <model>`):**
    - Switch chassis styling between IBM 5151 Green, Amber CRT, and Cyberpunk glass.
14. **3D Desk & Room Scene Mode (`scene toggle`):**
    - Toggle between floating cosmos mode and a 3D retro desk environment with wooden desk, coffee mug, and desk lamp.

---

## 8. Verification & Acceptance Criteria
- **Build Quality:** Zero TypeScript errors, zero lint warnings, fast Next.js production bundle.
- **Command Robustness:** All commands yield accurate output; invalid commands fail gracefully.
- **3D Performance:** Stable 60 FPS animation on desktop; graceful high-performance fallback on mobile.
- **Audio Authenticity:** Procedural audio synthesis without external media latency or clipping; toggleable with `sound off`.
- **Content Accuracy:** Accurate reflection of 4+ years experience, Jio Platforms (15M+ users), Power Financial Wellness, and verified projects.

