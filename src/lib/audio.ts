// Procedural Web Audio API Synthesizer
// Zero external MP3 files: synthesized live in the browser for zero latency and instant load

export type SwitchProfile = 'blue' | 'model-m' | 'red' | 'teletype';

class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  public switchProfile: SwitchProfile = 'blue';

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('term_sound');
      if (saved !== null) {
        this.enabled = saved === 'true';
      }
      const savedProfile = localStorage.getItem('term_switch_profile') as SwitchProfile | null;
      if (savedProfile && ['blue', 'model-m', 'red', 'teletype'].includes(savedProfile)) {
        this.switchProfile = savedProfile;
      }
    }
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggle(): boolean {
    this.enabled = !this.enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('term_sound', String(this.enabled));
    }
    if (this.enabled) {
      this.playKeypress();
    }
    return this.enabled;
  }

  public setSwitchProfile(profile: SwitchProfile): void {
    this.switchProfile = profile;
    if (typeof window !== 'undefined') {
      localStorage.setItem('term_switch_profile', profile);
    }
    this.playKeypress();
  }

  // Realistic mechanical keyboard click according to switch profile
  public playKeypress() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;

      if (this.switchProfile === 'model-m') {
        // IBM Model M: Solenoid snap + metallic spring resonance ring
        const snap = this.ctx.createOscillator();
        const snapGain = this.ctx.createGain();
        const spring = this.ctx.createOscillator();
        const springFilter = this.ctx.createBiquadFilter();
        const springGain = this.ctx.createGain();

        // Sharp buckling snap
        snap.type = 'triangle';
        snap.frequency.setValueAtTime(1400 + Math.random() * 400, t);
        snap.frequency.exponentialRampToValueAtTime(120, t + 0.02);

        snapGain.gain.setValueAtTime(0.08, t);
        snapGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);

        snap.connect(snapGain);
        snapGain.connect(this.ctx.destination);
        snap.start(t);
        snap.stop(t + 0.035);

        // Metallic spring resonance ring (~480Hz)
        spring.type = 'sine';
        spring.frequency.setValueAtTime(460 + Math.random() * 40, t);
        springFilter.type = 'bandpass';
        springFilter.frequency.setValueAtTime(480, t);
        springFilter.Q.setValueAtTime(12, t);

        springGain.gain.setValueAtTime(0.035, t + 0.005);
        springGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.075);

        spring.connect(springFilter);
        springFilter.connect(springGain);
        springGain.connect(this.ctx.destination);
        spring.start(t);
        spring.stop(t + 0.08);

      } else if (this.switchProfile === 'red') {
        // Cherry MX Red (Linear): Soft dampened bottom-out thud
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(280 + Math.random() * 40, t);
        osc.frequency.exponentialRampToValueAtTime(90, t + 0.02);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(700, t);

        gain.gain.setValueAtTime(0.06, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.03);

      } else if (this.switchProfile === 'teletype') {
        // ASR-33 Teletype: Heavy mechanical metallic punch + clatter
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const noise = this.ctx.createOscillator();
        const noiseFilter = this.ctx.createBiquadFilter();
        const noiseGain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(600 + Math.random() * 300, t);
        osc.frequency.exponentialRampToValueAtTime(80, t + 0.035);

        gain.gain.setValueAtTime(0.08, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);

        noise.type = 'square';
        noise.frequency.setValueAtTime(2200, t);
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(1800, t);
        noiseFilter.Q.setValueAtTime(4, t);

        noiseGain.gain.setValueAtTime(0.04, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.05);
        noise.start(t);
        noise.stop(t + 0.035);

      } else {
        // Default: Cherry MX Blue (Crisp tactile switch click)
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        const baseFreq = 1800 + Math.random() * 600;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(baseFreq, t);
        osc.frequency.exponentialRampToValueAtTime(300, t + 0.025);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2500, t);
        filter.Q.setValueAtTime(3, t);

        gain.gain.setValueAtTime(0.045, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.04);
      }
    } catch {
      // AudioContext policy handled gracefully
    }
  }

  // Mechanical return/Enter key (deeper solenoid thud)
  public playEnter() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.exponentialRampToValueAtTime(40, t + 0.06);

      gain.gain.setValueAtTime(0.09, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.08);
    } catch {
      // Silent fail
    }
  }

  // Vintage hardware power-on boot chime
  public playBootChime() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const notes = [220, 277.18, 329.63, 440, 554.37, 659.25]; // A major 7th chord
      const t = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t + idx * 0.06);

        gain.gain.setValueAtTime(0.0001, t + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.04, t + idx * 0.06 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t + idx * 0.06);
        osc.stop(t + 1.3);
      });
    } catch {
      // Ignore
    }
  }

  // CRT degauss power up sound
  public playPowerUp() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Degauss 60Hz hum rising to harmonic
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(60, t);
      osc.frequency.exponentialRampToValueAtTime(240, t + 0.2);
      osc.frequency.exponentialRampToValueAtTime(120, t + 0.5);

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.6);
    } catch {
      // Ignore
    }
  }

  // CRT power collapse discharge sound
  public playPowerDown() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(8000, t);
      osc.frequency.exponentialRampToValueAtTime(120, t + 0.35);

      gain.gain.setValueAtTime(0.09, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.45);
    } catch {
      // Ignore
    }
  }

  // 8-bit game sounds
  public playGameEat() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(440, t);
      osc.frequency.setValueAtTime(880, t + 0.05);

      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.13);
    } catch {
      // Ignore
    }
  }

  public playGameOver() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const notes = [440, 415.3, 392, 349.2];
      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t + i * 0.12);
        gain.gain.setValueAtTime(0.05, t + i * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + (i + 1) * 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t + i * 0.12);
        osc.stop(t + (i + 1) * 0.13);
      });
    } catch {
      // Ignore
    }
  }

  public playPongHit() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(540, t);
      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.045);
    } catch {
      // Ignore
    }
  }

  public playPongScore() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(780, t);
      osc.frequency.exponentialRampToValueAtTime(1040, t + 0.1);
      gain.gain.setValueAtTime(0.07, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.2);
    } catch {
      // Ignore
    }
  }

  // Error bell / beep
  public playBeep() {
    if (!this.enabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(440, t);

      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.13);
    } catch {
      // Ignore
    }
  }

  // Procedural Chiptune Radio Engine
  private radioInterval: ReturnType<typeof setInterval> | null = null;
  public isRadioRunning: boolean = false;
  public radioTrackIndex: number = 0;

  private TRACK_FREQS = [
    // Track 1: Amber Waves (A minor arpeggio)
    [220, 261.63, 329.63, 392.00, 440.00, 523.25, 392.00, 329.63],
    // Track 2: Phosphor Dream (C major 7th)
    [261.63, 329.63, 392.00, 493.88, 523.25, 392.00, 329.63, 261.63],
    // Track 3: Silicon Highway (G minor synthwave)
    [196.00, 233.08, 293.66, 349.23, 392.00, 466.16, 392.00, 293.66],
    // Track 4: Midnight Terminal (E minor ambient)
    [164.81, 196.00, 246.94, 293.66, 329.63, 246.94, 196.00, 164.81],
  ];

  public startRadio(trackIdx: number = 0) {
    if (!this.enabled) return;
    this.stopRadio();
    this.initContext();
    if (!this.ctx) return;

    this.isRadioRunning = true;
    this.radioTrackIndex = trackIdx % this.TRACK_FREQS.length;
    let step = 0;

    const pattern = this.TRACK_FREQS[this.radioTrackIndex];

    this.radioInterval = setInterval(() => {
      if (!this.isRadioRunning || !this.enabled || !this.ctx) return;
      try {
        const t = this.ctx.currentTime;
        const freq = pattern[step % pattern.length];
        step++;

        // Lead note
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = step % 4 === 0 ? 'square' : 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.018, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.24);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(t);
        osc.stop(t + 0.25);

        // Sub bass note every 4 steps
        if (step % 4 === 1) {
          const bass = this.ctx.createOscillator();
          const bassGain = this.ctx.createGain();
          bass.type = 'sine';
          bass.frequency.setValueAtTime(freq / 2, t);
          bassGain.gain.setValueAtTime(0.03, t);
          bassGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
          bass.connect(bassGain);
          bassGain.connect(this.ctx.destination);
          bass.start(t);
          bass.stop(t + 0.46);
        }
      } catch {
        // Ignore audio glitch
      }
    }, 220);
  }

  public stopRadio() {
    this.isRadioRunning = false;
    if (this.radioInterval) {
      clearInterval(this.radioInterval);
      this.radioInterval = null;
    }
  }
}


export const sound = new SoundEngine();
