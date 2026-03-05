// Sound manager using Web Audio API for procedural sound synthesis
// No external audio files needed

let audioCtx = null;

function getCtx() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

function playTone({ frequency = 440, type = 'sine', duration = 0.15, gain = 0.3, delay = 0, detune = 0 }) {
    try {
        const ctx = getCtx();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, ctx.currentTime + delay);
        osc.detune.setValueAtTime(detune, ctx.currentTime + delay);

        gainNode.gain.setValueAtTime(0, ctx.currentTime + delay);
        gainNode.gain.linearRampToValueAtTime(gain, ctx.currentTime + delay + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + duration + 0.05);
    } catch (e) {
        // silently ignore
    }
}

function playNoise(duration = 0.1, gain = 0.15) {
    try {
        const ctx = getCtx();
        const bufferSize = ctx.sampleRate * duration;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

        const source = ctx.createBufferSource();
        source.buffer = buffer;

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(gain, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

        source.connect(gainNode);
        gainNode.connect(ctx.destination);
        source.start();
        source.stop(ctx.currentTime + duration + 0.05);
    } catch (e) { }
}

export const soundManager = {
    enabled: true,

    setEnabled(val) {
        this.enabled = val;
    },

    playStack() {
        if (!this.enabled) return;
        playTone({ frequency: 523, type: 'triangle', duration: 0.12, gain: 0.25 });
        playTone({ frequency: 659, type: 'triangle', duration: 0.12, gain: 0.2, delay: 0.06 });
        playTone({ frequency: 784, type: 'triangle', duration: 0.18, gain: 0.22, delay: 0.12 });
    },

    playFail() {
        if (!this.enabled) return;
        playTone({ frequency: 200, type: 'sawtooth', duration: 0.15, gain: 0.3 });
        playTone({ frequency: 150, type: 'sawtooth', duration: 0.25, gain: 0.3, delay: 0.12 });
        playNoise(0.15, 0.1);
    },

    playMilestone() {
        if (!this.enabled) return;
        const notes = [523, 659, 784, 1047];
        notes.forEach((freq, i) => {
            playTone({ frequency: freq, type: 'sine', duration: 0.2, gain: 0.2, delay: i * 0.08 });
        });
    },

    playWin() {
        if (!this.enabled) return;
        const notes = [523, 659, 784, 1047, 1319, 1047, 784, 659, 1047];
        notes.forEach((freq, i) => {
            playTone({ frequency: freq, type: 'sine', duration: 0.22, gain: 0.22, delay: i * 0.09 });
        });
    },

    playUpgrade() {
        if (!this.enabled) return;
        playTone({ frequency: 440, type: 'sine', duration: 0.1, gain: 0.2 });
        playTone({ frequency: 880, type: 'sine', duration: 0.15, gain: 0.2, delay: 0.08 });
    },
};
