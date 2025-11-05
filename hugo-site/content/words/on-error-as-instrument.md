---
title: "On Error as Instrument"
date: 2024-05-12
type: "words"
tags: ["glitch", "error", "livecoding", "electronic-music", "systems", "design"]
description: "Treating software and hardware failures as playable, composable materials—methods, patterns, and ethics for embracing error."
summary: "A field guide to composing with failure: timing drift, buffer misreads, wraparound arithmetic, and other beautiful bugs."
---

The beauty of digital systems lies not in their perfection, but in their spectacular failures. When we circuit-bend hardware or introduce intentional glitches into code, we're not breaking instruments—we're discovering new ones.

Traditional instruments are refined over centuries. A violin's imperfections are smoothed away, its resonances carefully controlled. Electronic instruments live on a different timeline. They evolve in months, sometimes days, and their rough edges change with every update. Their imperfections aren’t mistakes to be patched; they’re timbres waiting to be played.

I’ve spent years building tools designed to fail gracefully—to surf the edge where systems stop behaving. A buffer overrun becomes a rhythm. A denormalized float becomes a breath. A race condition draws a pattern the composer didn’t intend but immediately recognizes. The crash is (sometimes) the composition.

This isn’t chaos for chaos’s sake. It’s the musical space between control and randomness, intention and accident. The most alive moments in performance are the ones I didn’t program—they’re the ones the system revealed.

## Friction as tone

Every instrument has friction. On a violin it’s rosin; on a modular rig it’s ground loops; in code it’s latency, clock skew, and numeric limits. Technique is the art of turning friction into tone.

If we define sound as the audible result of energy meeting constraint, then software errors are simply constraints we didn’t anticipate. When we learn their shape, we can phrase against them. We can compose with them.

## A small taxonomy of beautiful bugs

- Timing drift: Two clocks disagree by a few samples per second. Left alone, the phase walks; nudged periodically, it breathes. In my Euclidean sequencer, I intentionally mix host and local clocks so patterns “miscount” and re-sync on bar boundaries, creating long polyrhythms that feel human.
- Buffer misaddress: Reading slightly outside a grain window produces little shards of yesterday’s audio. With a shallow low-pass and soft saturation, the error becomes a dust that binds otherwise clinical synthesis.
- Wraparound arithmetic: In fixed-width math, adding 1 to the maximum value rolls to zero. Map that wrap to pitch or filter index and you get staircases with unexpected landings—lovely for arpeggios that refuse to resolve.
- Denormals and silence: Extremely small floats can stall DSP on some CPUs. Injecting a touch of noise (−120 dBFS) prevents the stall and doubles as a microscopic “air” signal—silence with weather.
- Race conditions: Two processes contend for a shared resource. Carefully fenced, this becomes a generative “stutter,” where the winner writes the phrase. The piece is the arbitration.

Each of these failures has a signature. Learn the signature, and you have a timbre. Give it boundaries, and you have an instrument.

## Design patterns for playable failure

- Soft walls: Never hard-clip. When an internal value exceeds its expected range, compress, fold, or wander back. The mistake becomes motion, not a halt.
- Bounded randomness: Errors should live within musical fences—key, tempo domain, spectral mask. The audience hears surprise, not contradiction.
- Two-tier clocks: Drive structure with a stable clock, micro-variation with an unruly one. Crossfade authority.
- Watchdogs and escapes: One gesture returns the system to safety. A held key, a footswitch, a hard low-pass. Always have a way home.
- Record your faults: Log, seed, or capture the glitch path. Reproducible accidents become repertoire.

These are less “best practices” than compositional ethics: invite misbehavior, but never strand your collaborators—or your audience—inside a failure state they didn’t consent to.

## Practice techniques

- Rehearse the failure: Practice triggering the exact condition that scares you—CPU spikes, allocator stalls, MIDI floods. Learn how long the system takes to return. Tempo your phrasing around that.
- Map entropy: Put error magnitude on a knob or fader. Zero is pristine; ten is freefall. Now you can phrase error like volume.
- Layer safety nets: A brick-wall limiter, a DC filter, a quick mute. The louder the experiment, the more invisible the safety should be.
- Score with logs: In livecoding sets, I keep a tiny log window. The scroll becomes a score—a line of poetry that only I can read while I play.

## Case notes from my tools

- Grain Synth: Early versions smeared transients when the grain pointer slipped between windows. I kept the smear, added a tilt EQ, and mapped it to pressure. It became the instrument’s “sigh.”
- Euclidean Sequencer: A rounding error caused step counts to drift on long cycles. Instead of fixing it, I quantized the drift to bar lines and exposed a “tide” control. Long forms emerged that I wouldn’t have written.
- CV Controller: Overdriving the DAC produced soft asymmetry—CV went higher than expected, lower than safe. I padded the output and kept the asymmetry as a performance accent. The module learned to blush.

None of these “features” arrived via a product roadmap. They appeared as errors, and survived because they made the instrument more itself.

## Ethics of failing in public

Audiences are generous, but trust is finite. The difference between risk and negligence is preparation. If your system can emit dangerous levels or freeze a shared clock, it’s not a risk—it’s a liability. Build guardrails, rehearse the exits, disclose the premise: we’re going to surf an unstable thing together.

There’s also authorship. If a system surprises you, who wrote the music? I’ve come to like the term co-authorship for these moments. The code wrote a line; I accepted or rejected it in real time. The authorship is dialog.

## Implementation sketch: a friendly misread

Here’s a tiny pseudo-patch of a deliberate buffer misread. It’s language-agnostic; the point is the pattern.

```
// parameters
grainSize = 80..200 ms
jitterMs  = 0..12 ms
spray     = small probability of reading ±1 grain outside window

for each grain:
	start = window.start + rand(-jitterMs, +jitterMs)
	if chance(spray):
		start += sign(rand()) * grainSize  // hop to neighbor
	read buffer at start..start+grainSize
	windowed, filtered, mixed
```

Three lines turn a correct algorithm into a character. The mistake is not random—it’s targeted, small, and recoverable. Most importantly, it’s on a control you can play.

## Why this matters

Digital music can be so perfectly correct that it forgets to be alive. Error restores metabolism. It introduces murmurs and eddies that suggest agency. The point isn’t to worship failure; it’s to recognize that the edge where systems fail is also the place where they start to speak.

The craft is to make that edge safe, repeatable, and expressive—to turn exception into expression.

---
