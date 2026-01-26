// Simple synth sounds using Web Audio API
const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

const playTone = (freq: number, type: 'sine' | 'square' | 'sawtooth' | 'triangle', duration: number, delay = 0) => {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);

    gain.gain.setValueAtTime(0.1, audioCtx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + delay + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(audioCtx.currentTime + delay);
    osc.stop(audioCtx.currentTime + delay + duration);
};

export const playSuccess = () => {
    playTone(600, 'sine', 0.1);
    playTone(800, 'sine', 0.2, 0.1);
};

export const playError = () => {
    playTone(300, 'sawtooth', 0.3);
    playTone(200, 'sawtooth', 0.4, 0.2);
};

export const playClick = () => {
    playTone(400, 'triangle', 0.05);
};

export const playLifeline = () => {
    playTone(1200, 'sine', 0.5);
};
