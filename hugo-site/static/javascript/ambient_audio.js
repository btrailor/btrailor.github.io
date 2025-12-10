// Ambient Audio System
// Generative ambient layer + mycelial network sonification

class AmbientAudio {
  constructor() {
    this.audioContext = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.drones = [];
    this.toggle = document.getElementById("audio-toggle");

    this.init();
  }

  init() {
    // Toggle button listener
    this.toggle.addEventListener("click", () => this.toggleAudio());

    // Listen for network events from mycelial_network.js
    window.addEventListener("mycelial-signal", (e) =>
      this.onNetworkSignal(e.detail)
    );
    window.addEventListener("mycelial-connection", (e) =>
      this.onNetworkConnection(e.detail)
    );

    // Auto-start audio
    this.toggleAudio();
  }

  toggleAudio() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = 0.15; // Keep it subtle
      this.masterGain.connect(this.audioContext.destination);
    }

    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
  }

  start() {
    this.isPlaying = true;
    this.toggle.classList.add("active");

    // Create ambient drones
    this.createDrones();
  }

  stop() {
    this.isPlaying = false;
    this.toggle.classList.remove("active");

    // Stop all drones
    this.drones.forEach((drone) => {
      drone.oscillator.stop();
      drone.lfo.stop();
    });
    this.drones = [];
  }

  createDrones() {
    const now = this.audioContext.currentTime;

    // Three drone layers with different frequencies
    const frequencies = [
      110, // A2 - low drone
      164.81, // E3 - fifth above
      220, // A3 - octave above
    ];

    frequencies.forEach((freq, i) => {
      const oscillator = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      const lfo = this.audioContext.createOscillator();
      const lfoGain = this.audioContext.createGain();

      // Main oscillator
      oscillator.type = "sine";
      oscillator.frequency.value = freq;

      // LFO for subtle amplitude modulation
      lfo.type = "sine";
      lfo.frequency.value = 0.1 + i * 0.05; // Very slow
      lfoGain.gain.value = 0.3;

      // Connect LFO to main gain
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);

      // Set base gain (very quiet)
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15 - i * 0.03, now + 3); // Fade in over 3 seconds

      // Connect to master
      oscillator.connect(gain);
      gain.connect(this.masterGain);

      // Start
      oscillator.start(now);
      lfo.start(now);

      this.drones.push({ oscillator, gain, lfo, lfoGain });
    });
  }

  onNetworkSignal(data) {
    if (!this.isPlaying || !this.audioContext) return;

    // Play a subtle click when signals move through network
    const now = this.audioContext.currentTime;
    const click = this.audioContext.createOscillator();
    const clickGain = this.audioContext.createGain();
    const filter = this.audioContext.createBiquadFilter();

    // Use signal position to determine pitch
    const freq = 1000 + data.y * 2; // Higher on screen = higher pitch

    click.type = "sine";
    click.frequency.setValueAtTime(freq, now);

    filter.type = "lowpass";
    filter.frequency.value = 2000;

    // Very short envelope
    clickGain.gain.setValueAtTime(0, now);
    clickGain.gain.linearRampToValueAtTime(0.008, now + 0.002); // Quieter than glitch sounds
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    click.connect(filter);
    filter.connect(clickGain);
    clickGain.connect(this.masterGain);

    click.start(now);
    click.stop(now + 0.04);
  }

  onNetworkConnection(data) {
    if (!this.isPlaying || !this.audioContext) return;

    // Play a softer tone when new connections form
    const now = this.audioContext.currentTime;
    const tone = this.audioContext.createOscillator();
    const toneGain = this.audioContext.createGain();

    tone.type = "triangle";
    tone.frequency.setValueAtTime(440, now);
    tone.frequency.exponentialRampToValueAtTime(220, now + 0.3);

    toneGain.gain.setValueAtTime(0, now);
    toneGain.gain.linearRampToValueAtTime(0.01, now + 0.05);
    toneGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    tone.connect(toneGain);
    toneGain.connect(this.masterGain);

    tone.start(now);
    tone.stop(now + 0.3);
  }
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => new AmbientAudio());
} else {
  new AmbientAudio();
}
