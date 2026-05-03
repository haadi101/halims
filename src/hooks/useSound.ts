// Web Audio API sound synthesiser — no external files needed
let _ctx: AudioContext | null = null;

function ctx(): AudioContext {
  if (!_ctx) _ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  if (_ctx.state === 'suspended') _ctx.resume();
  return _ctx;
}

/** Short wax-seal crack — noise burst */
export function playCrack() {
  try {
    const ac = ctx();
    const dur = 0.18;
    const buf = ac.createBuffer(1, ac.sampleRate * dur, ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2.5);
    }
    const src = ac.createBufferSource();
    src.buffer = buf;
    const bpf = ac.createBiquadFilter();
    bpf.type = 'bandpass';
    bpf.frequency.value = 1800;
    bpf.Q.value = 0.6;
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.35, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur);
    src.connect(bpf); bpf.connect(gain); gain.connect(ac.destination);
    src.start();
  } catch { /* silent fail */ }
}

/** Soft paper whoosh — envelope opening */
export function playWhoosh() {
  try {
    const ac = ctx();
    const dur = 0.55;
    const buf = ac.createBuffer(1, ac.sampleRate * dur, ac.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = ac.createBufferSource();
    src.buffer = buf;
    const bpf = ac.createBiquadFilter();
    bpf.type = 'bandpass';
    bpf.frequency.setValueAtTime(180, ac.currentTime);
    bpf.frequency.exponentialRampToValueAtTime(900, ac.currentTime + 0.18);
    bpf.frequency.exponentialRampToValueAtTime(80, ac.currentTime + dur);
    bpf.Q.value = 1.8;
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0, ac.currentTime);
    gain.gain.linearRampToValueAtTime(0.12, ac.currentTime + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur);
    src.connect(bpf); bpf.connect(gain); gain.connect(ac.destination);
    src.start();
  } catch { /* silent fail */ }
}

/** Soft bell ding — candles blown out */
export function playDing() {
  try {
    const ac = ctx();
    const osc = ac.createOscillator();
    const osc2 = ac.createOscillator();
    osc.type = 'sine';
    osc2.type = 'sine';
    osc.frequency.setValueAtTime(880, ac.currentTime);
    osc.frequency.exponentialRampToValueAtTime(660, ac.currentTime + 0.8);
    osc2.frequency.setValueAtTime(1320, ac.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(990, ac.currentTime + 0.8);
    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.25, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 2);
    const gain2 = ac.createGain();
    gain2.gain.setValueAtTime(0.12, ac.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 1.5);
    osc.connect(gain); gain.connect(ac.destination);
    osc2.connect(gain2); gain2.connect(ac.destination);
    osc.start(); osc.stop(ac.currentTime + 2);
    osc2.start(); osc2.stop(ac.currentTime + 1.5);
  } catch { /* silent fail */ }
}
