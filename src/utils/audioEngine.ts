import { AmbientSoundType } from '../types';

class AudioEngine {
  private ctx: AudioContext | null = null;
  private currentType: AmbientSoundType = 'none';
  private masterGain: GainNode | null = null;
  private activeNodes: (AudioNode | number)[] = [];
  private volume: number = 0.5;

  private initContext(): boolean {
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.ctx = new AudioCtx();
      }
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return true;
    } catch (e) {
      console.warn('AudioContext initialization failed:', e);
      return false;
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      try {
        this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
      } catch {
        // ignore
      }
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getCurrentType(): AmbientSoundType {
    return this.currentType;
  }

  public isPlaying(): boolean {
    return this.currentType !== 'none';
  }

  public stop() {
    if (this.ctx && this.masterGain) {
      try {
        this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.08);
      } catch {
        // ignore
      }
    }

    setTimeout(() => {
      this.activeNodes.forEach((node) => {
        if (typeof node === 'number') {
          clearInterval(node);
        } else if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
          try {
            (node as AudioScheduledSourceNode).stop();
          } catch {
            // ignore
          }
        }
      });
      this.activeNodes = [];
      this.masterGain = null;
      this.currentType = 'none';
    }, 120);
  }

  public play(type: AmbientSoundType) {
    if (type === 'none') {
      this.stop();
      return;
    }

    if (!this.initContext() || !this.ctx) return;

    // If switching sound, stop existing nodes first
    if (this.currentType !== 'none') {
      this.stop();
    }

    this.currentType = type;

    // Create fresh master gain
    const master = this.ctx.createGain();
    master.gain.setValueAtTime(0.001, this.ctx.currentTime);
    master.gain.linearRampToValueAtTime(this.volume, this.ctx.currentTime + 0.5);
    master.connect(this.ctx.destination);
    this.masterGain = master;

    switch (type) {
      case 'rain':
        this.createRainSound(master);
        break;
      case 'waves':
        this.createWavesSound(master);
        break;
      case 'zen-drone':
        this.createZenDroneSound(master);
        break;
      case 'pink-noise':
        this.createPinkNoiseSound(master);
        break;
      case 'cafe':
        this.createCafeSound(master);
        break;
    }
  }

  // Soft mechanical flip tick for the clock
  public playFlipTick() {
    if (!this.initContext() || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.04);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);

      gain.gain.setValueAtTime(0.05 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // ignore
    }
  }

  // Gentle bell chime for starting / pausing / finishing study
  public playChime(isFinish: boolean = false) {
    if (!this.initContext() || !this.ctx) return;
    try {
      const freqs = isFinish ? [528, 660, 792, 1056] : [440, 554, 659];
      const now = this.ctx.currentTime;

      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.08 * this.volume, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 1.3);
      });
    } catch {
      // ignore
    }
  }

  // Generate pink/brown noise audio buffer
  private createNoiseBuffer(durationSec: number = 6): AudioBuffer {
    if (!this.ctx) throw new Error('No audio context');
    const bufferSize = this.ctx.sampleRate * durationSec;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // High-quality Paul Kellet pink noise filter
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  // 1. Rain Sound
  private createRainSound(target: GainNode) {
    if (!this.ctx) return;
    const buffer = this.createNoiseBuffer(6);

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, this.ctx.currentTime);

    const highpass = this.ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(250, this.ctx.currentTime);

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

    source.connect(filter);
    filter.connect(highpass);
    highpass.connect(rainGain);
    rainGain.connect(target);

    source.start();
    this.activeNodes.push(source);

    // Random soothing raindrop pitter-patter
    const dropInterval = window.setInterval(() => {
      if (!this.ctx || this.currentType !== 'rain') return;
      try {
        const osc = this.ctx.createOscillator();
        const dropGain = this.ctx.createGain();
        const freq = 1400 + Math.random() * 1600;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(350, this.ctx.currentTime + 0.06);

        dropGain.gain.setValueAtTime(0.045, this.ctx.currentTime);
        dropGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.06);

        osc.connect(dropGain);
        dropGain.connect(target);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.07);
      } catch {
        // ignore
      }
    }, 220);

    this.activeNodes.push(dropInterval);
  }

  // 2. Ocean Waves Sound
  private createWavesSound(target: GainNode) {
    if (!this.ctx) return;
    const buffer = this.createNoiseBuffer(8);

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);

    // LFO for periodic wave swell (~7.5s cycle)
    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.13, this.ctx.currentTime);

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(380, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const wavesGain = this.ctx.createGain();
    wavesGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

    source.connect(filter);
    filter.connect(wavesGain);
    wavesGain.connect(target);

    source.start();
    lfo.start();
    this.activeNodes.push(source, lfo);
  }

  // 3. Zen 432Hz Harmonic Drone
  private createZenDroneSound(target: GainNode) {
    if (!this.ctx) return;
    // Harmonic frequencies: 216Hz, 324Hz, 432Hz, 540Hz
    const freqs = [216, 324, 432, 540];

    freqs.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.detune.setValueAtTime((idx - 1.5) * 5, this.ctx.currentTime);

      const oscGain = this.ctx.createGain();
      oscGain.gain.setValueAtTime(0.25 / freqs.length, this.ctx.currentTime);

      // Tremolo breathing
      const tremolo = this.ctx.createOscillator();
      tremolo.frequency.setValueAtTime(0.1 + idx * 0.04, this.ctx.currentTime);
      const tremoloGain = this.ctx.createGain();
      tremoloGain.gain.setValueAtTime(0.06, this.ctx.currentTime);

      tremolo.connect(tremoloGain);
      tremoloGain.connect(oscGain.gain);

      osc.connect(oscGain);
      oscGain.connect(target);

      osc.start();
      tremolo.start();
      this.activeNodes.push(osc, tremolo);
    });
  }

  // 4. Soft Pink Noise
  private createPinkNoiseSound(target: GainNode) {
    if (!this.ctx) return;
    const buffer = this.createNoiseBuffer(6);

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(750, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.85, this.ctx.currentTime);

    source.connect(filter);
    filter.connect(gain);
    gain.connect(target);

    source.start();
    this.activeNodes.push(source);
  }

  // 5. Cozy Cafe Ambiance
  private createCafeSound(target: GainNode) {
    if (!this.ctx) return;
    const buffer = this.createNoiseBuffer(6);

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.1, this.ctx.currentTime);

    const cafeGain = this.ctx.createGain();
    cafeGain.gain.setValueAtTime(0.75, this.ctx.currentTime);

    source.connect(filter);
    filter.connect(cafeGain);
    cafeGain.connect(target);

    source.start();
    this.activeNodes.push(source);

    // Occasional gentle cup clinks
    const clinkInterval = window.setInterval(() => {
      if (!this.ctx || this.currentType !== 'cafe') return;
      try {
        const osc = this.ctx.createOscillator();
        const clinkGain = this.ctx.createGain();

        osc.frequency.setValueAtTime(2400 + Math.random() * 800, this.ctx.currentTime);
        clinkGain.gain.setValueAtTime(0.02, this.ctx.currentTime);
        clinkGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.14);

        osc.connect(clinkGain);
        clinkGain.connect(target);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
      } catch {
        // ignore
      }
    }, 4200);

    this.activeNodes.push(clinkInterval);
  }
}

export const soundManager = new AudioEngine();
