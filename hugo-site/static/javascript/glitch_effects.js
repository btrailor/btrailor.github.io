// Glitch Effects for Hero Text Links
// Adds subtle typographic glitches and sound on hover

class GlitchEffects {
  constructor() {
    this.links = document.querySelectorAll(".glitch-link");
    this.audioContext = null;
    this.originalTexts = new Map();
    this.init();
  }

  init() {
    // Initialize Web Audio API on first user interaction
    document.addEventListener(
      "click",
      () => {
        if (!this.audioContext) {
          this.audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
        }
      },
      { once: true }
    );

    // Also init on mouseenter for better UX (hover then click anywhere)
    document.addEventListener(
      "mouseenter",
      () => {
        if (!this.audioContext) {
          this.audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
        }
      },
      { once: true, capture: true }
    );

    // Store original text for each link
    this.links.forEach((link, index) => {
      this.originalTexts.set(link, link.textContent);
      link.addEventListener("mouseenter", () => this.onHover(link, index));
      link.addEventListener("mouseleave", () => this.onLeave(link));
    });

    console.log(`GlitchEffects: Found ${this.links.length} links`);
  }

  onHover(link, index) {
    // Play a subtle click/beep sound
    this.playGlitchSound(index);

    // Add random character glitch effect
    this.glitchText(link);
  }

  playGlitchSound(index) {
    if (!this.audioContext) return;

    const now = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    // Different frequencies for each link
    const frequencies = [
      220, // + sigil - A3
      293.66, // + signal - D4
      329.63, // + schema - E4
      392, // + spectra - G4
      440, // + scroll - A4
      523.25, // + sphere - C5
    ];

    // Use modulo to ensure we always get a valid frequency
    const freq = frequencies[index % frequencies.length] || 440;

    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(freq, now);

    // Very short, percussive envelope
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.03, now + 0.005); // Very quiet
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.05);
  }

  glitchText(link) {
    const originalText = this.originalTexts.get(link);
    const glitchChars = "!@#$%^&*()_+-=[]{}|;:<>?/~`";

    // Replace 1-2 random characters temporarily
    const textArray = originalText.split("");
    const numGlitches = Math.floor(Math.random() * 2) + 1;

    for (let i = 0; i < numGlitches; i++) {
      const randomIndex = Math.floor(Math.random() * textArray.length);
      const randomChar =
        glitchChars[Math.floor(Math.random() * glitchChars.length)];
      textArray[randomIndex] = randomChar;
    }

    link.textContent = textArray.join("");

    // Restore original text after brief moment
    setTimeout(() => {
      link.textContent = originalText;
    }, 50);
  }

  onLeave(link) {
    // Ensure original text is restored when mouse leaves
    link.textContent = this.originalTexts.get(link);
  }
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => new GlitchEffects());
} else {
  new GlitchEffects();
}
