
// A simple, dependency-free procedural audio synthesizer for Victorian soundscapes.

let audioCtx: AudioContext | null = null;
let masterVolume = 0.5;

export const setMasterVolume = (vol: number) => {
    masterVolume = Math.max(0, Math.min(1, vol));
};

const initAudio = () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    return audioCtx;
};

// Sound Generators

export const playSound = (type: 'TYPEWRITER' | 'STEP' | 'BUMP' | 'STEAM' | 'CHIME' | 'UI_HOVER' | 'UI_CLICK') => {
    if (masterVolume <= 0) return; // Muted

    const ctx = initAudio();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);

    switch (type) {
        case 'UI_HOVER':
            osc.type = 'sine';
            osc.frequency.setValueAtTime(400, t);
            osc.frequency.exponentialRampToValueAtTime(600, t + 0.05);
            gain.gain.setValueAtTime(0.02 * masterVolume, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
            osc.start(t);
            osc.stop(t + 0.05);
            break;

        case 'UI_CLICK':
            // Mechanical switch sound
            osc.type = 'square';
            osc.frequency.setValueAtTime(150, t);
            osc.frequency.exponentialRampToValueAtTime(40, t + 0.1);
            gain.gain.setValueAtTime(0.05 * masterVolume, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
            osc.start(t);
            osc.stop(t + 0.1);
            break;

        case 'TYPEWRITER':
            // Quick burst of noise (Simulated by random frequency modulation)
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(800, t);
            // Add noise buffer (better typewriter)
            const bufferSize = ctx.sampleRate * 0.05; // 50ms
            const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = ctx.createBufferSource();
            noise.buffer = buffer;
            const noiseGain = ctx.createGain();
            noiseGain.gain.setValueAtTime(0.2 * masterVolume, t);
            noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
            noise.connect(noiseGain);
            noiseGain.connect(ctx.destination);
            noise.start(t);
            break;

        case 'STEP':
            // Low thud
            osc.type = 'sine';
            osc.frequency.setValueAtTime(100, t);
            osc.frequency.exponentialRampToValueAtTime(20, t + 0.15);
            gain.gain.setValueAtTime(0.1 * masterVolume, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
            osc.start(t);
            osc.stop(t + 0.15);
            break;

        case 'STEAM':
            // Long white noise hiss
            const sBufSize = ctx.sampleRate * 2; 
            const sBuf = ctx.createBuffer(1, sBufSize, ctx.sampleRate);
            const sData = sBuf.getChannelData(0);
            for (let i = 0; i < sBufSize; i++) {
                sData[i] = (Math.random() * 2 - 1) * 0.5;
            }
            const steam = ctx.createBufferSource();
            steam.buffer = sBuf;
            const sGain = ctx.createGain();
            // Low pass filter for muffled steam
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 800;

            steam.connect(filter);
            filter.connect(sGain);
            sGain.connect(ctx.destination);

            sGain.gain.setValueAtTime(0.0, t);
            sGain.gain.linearRampToValueAtTime(0.05 * masterVolume, t + 0.5);
            sGain.gain.linearRampToValueAtTime(0, t + 2);
            steam.start(t);
            break;
            
        case 'CHIME':
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, t); // A5
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.1 * masterVolume, t + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 2);
            osc.start(t);
            osc.stop(t + 2);
            break;
    }
};

// Ambient Loop Manager
let ambientOsc: OscillatorNode | null = null;
let ambientGain: GainNode | null = null;

export const setAmbience = (zone: string) => {
    if (masterVolume <= 0) {
        if (ambientOsc) {
            ambientOsc.stop();
            ambientOsc = null;
        }
        return;
    }

    const ctx = initAudio();
    if (ambientOsc) {
        ambientGain?.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
        ambientOsc.stop(ctx.currentTime + 1);
        ambientOsc = null;
    }

    // Create new drone based on zone
    ambientOsc = ctx.createOscillator();
    ambientGain = ctx.createGain();
    ambientOsc.connect(ambientGain);
    ambientGain.connect(ctx.destination);

    // Defaults
    ambientGain.gain.value = 0;
    ambientGain.gain.linearRampToValueAtTime(0.02 * masterVolume, ctx.currentTime + 2);
    
    if (zone === 'MACHINES') {
        ambientOsc.type = 'sawtooth';
        ambientOsc.frequency.value = 50; // Low hum
    } else if (zone === 'TOWER') {
        ambientOsc.type = 'sine'; // Wind-like
        ambientOsc.frequency.value = 100; 
        // Need noise for wind really, but simple drone works for "height"
    } else {
        // General city drone
        ambientOsc.type = 'triangle';
        ambientOsc.frequency.value = 60;
    }

    ambientOsc.start();
};
