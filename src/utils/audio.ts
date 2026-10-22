// Audio synthesizer using Web Audio API (100% offline, zero external file dependencies)

class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientSource: AudioNode | null = null;
  private ambientGain: GainNode | null = null;
  private isAmbientRunning = false;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Soft, calming completion chime (two harmonic bells with gentle envelope)
  playChime(soundEnabled = true) {
    if (!soundEnabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Base note C5 (523.25 Hz) and overtone G5 (783.99 Hz)
      const freqs = [523.25, 659.25, 783.99, 1046.5];
      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.12 / (idx + 1), now + idx * 0.08 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 2.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 2.3);
      });
    } catch {
      // AudioContext might be blocked until user gesture, safely ignore
    }
  }

  // Start calming ambient sound generators
  startAmbient(type: 'none' | 'rain' | 'binaural' | 'whitenoise', volume = 0.3) {
    this.stopAmbient();
    if (type === 'none') return;

    try {
      this.initCtx();
      if (!this.ctx) return;

      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(volume * 0.2, this.ctx.currentTime);
      masterGain.connect(this.ctx.destination);
      this.ambientGain = masterGain;

      if (type === 'rain' || type === 'whitenoise') {
        const bufferSize = this.ctx.sampleRate * 2;
        const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);

        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          if (type === 'rain') {
            // Pinkish filtered noise
            lastOut = (lastOut + 0.02 * white) / 1.02;
            output[i] = lastOut * 3.5;
          } else {
            // Softer white noise
            output[i] = white * 0.3;
          }
        }

        const whiteNoise = this.ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        // Bandpass filter for rain-like rumble
        const filter = this.ctx.createBiquadFilter();
        if (type === 'rain') {
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(600, this.ctx.currentTime);
        } else {
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(1200, this.ctx.currentTime);
        }

        whiteNoise.connect(filter);
        filter.connect(masterGain);
        whiteNoise.start();
        this.ambientSource = whiteNoise;
      } else if (type === 'binaural') {
        // Alpha wave binaural pulse (200Hz and 210Hz -> 10Hz alpha difference)
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(200, this.ctx.currentTime);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(210, this.ctx.currentTime);

        osc1.connect(masterGain);
        osc2.connect(masterGain);

        osc1.start();
        osc2.start();

        this.ambientSource = osc1;
      }

      this.isAmbientRunning = true;
    } catch {
      // AudioContext unallowed without user gesture
    }
  }

  setAmbientVolume(volume: number) {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setValueAtTime(volume * 0.2, this.ctx.currentTime);
    }
  }

  stopAmbient() {
    if (this.ambientSource) {
      try {
        if ('stop' in this.ambientSource && typeof (this.ambientSource as AudioScheduledSourceNode).stop === 'function') {
          (this.ambientSource as AudioScheduledSourceNode).stop();
        }
      } catch {
        // Already stopped
      }
      this.ambientSource.disconnect();
      this.ambientSource = null;
    }
    if (this.ambientGain) {
      this.ambientGain.disconnect();
      this.ambientGain = null;
    }
    this.isAmbientRunning = false;
  }
}

export const soundEngine = new SoundEngine();
