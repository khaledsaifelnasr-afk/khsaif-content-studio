// Usage: node clean-voice.mjs <input audio> <output .mp3> [--strong]
// Cleans Khaled's own voice recording for a reel, for free: removes rumble and hiss, softens harsh "s"
// sounds, adds a little presence, evens out the level, trims silence at the
// start and end, and sets spoken-word loudness (about -16 LUFS, peaks under -1.5 dB).
// --strong uses a heavier noise reduction for noisy rooms.
import {execFileSync, spawnSync} from 'node:child_process';
import {existsSync, rmSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const [input, output] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const strong = process.argv.includes('--strong');
if (!input || !output) throw new Error('Usage: node clean-voice.mjs <input> <output.mp3> [--strong]');
if (!existsSync(input)) throw new Error(`Missing ${input}`);

// A full ffmpeg (on PATH, as in cloud sessions) has the cleanup filters.
// Remotion's bundled ffmpeg is minimal: it can only set loudness, so on a PC
// without ffmpeg the voice is levelled but not denoised (install ffmpeg, or use
// ElevenLabs Voice Isolator for a noisy room).
let fullFfmpeg = false;
try {
  fullFfmpeg = execFileSync('ffmpeg', ['-hide_banner', '-filters'], {encoding: 'utf8'}).includes(' afftdn ');
} catch {}

const here = path.dirname(fileURLToPath(import.meta.url));
const template = path.join(here, '..', 'template');
const remotion = path.join(template, 'node_modules', '@remotion', 'cli', 'remotion-cli.js');

// The quietest 10% of 50 ms frames approximate the room's background noise;
// the noise reducer is set to that level (a fixed level misses noisy rooms).
let noiseFloor = -40;
if (fullFfmpeg) {
  const out = spawnSync('ffmpeg', ['-hide_banner', '-i', path.resolve(input), '-vn', '-af',
    'aresample=48000,asetnsamples=2400,astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level',
    '-f', 'null', '-'], {encoding: 'utf8'}).stderr;
  const frames = [...out.matchAll(/RMS_level=(-?[0-9.]+)/g)].map((m) => parseFloat(m[1])).filter(Number.isFinite).sort((a, b) => a - b);
  if (frames.length) noiseFloor = Math.round(Math.min(-20, Math.max(-80, frames[Math.floor(frames.length * 0.1)])));
}

const gateThreshold = Math.pow(10, (noiseFloor + 6) / 20).toFixed(4);
const trim = 'silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.15';
const clean = [
  'highpass=f=80',                        // rumble, desk knocks, AC hum
  'lowpass=f=14000',                      // hiss above the voice
  // Quiet the gaps between sentences: a gate 6 dB above the measured noise.
  `agate=threshold=${gateThreshold}:ratio=20:attack=5:release=250:range=0.05`,
  `afftdn=nr=${strong ? 24 : 14}:nf=${noiseFloor}:tn=1`, // steady background noise, at its measured level
  'deesser=i=0.4',                        // harsh "s" and "sh"
  'equalizer=f=250:t=q:w=1.2:g=-2',       // boxy room sound
  'equalizer=f=3000:t=q:w=1.5:g=2.5',     // clarity of Arabic consonants
  'acompressor=threshold=-20dB:ratio=3:attack=10:release=150:makeup=3dB',
  trim, 'areverse', trim, 'areverse',     // trim silence at both ends only
].join(',');
const encode = ['-ar', '44100', '-ac', '1', '-c:a', 'libmp3lame', '-b:a', '192k', path.resolve(output)];

if (fullFfmpeg) {
  // Clean once, then raise the level towards -16 LUFS (spoken-word standard)
  // with a limiter that keeps peaks under -1.5 dB after MP3 encoding.
  const tmp = path.join(os.tmpdir(), `clean-voice-${process.pid}.wav`);
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', path.resolve(input), '-vn', '-af', clean, tmp], {stdio: 'inherit'});
  const loudness = (file) => {
    const err = spawnSync('ffmpeg', ['-hide_banner', '-i', file, '-af', 'loudnorm=print_format=json', '-f', 'null', '-'],
      {encoding: 'utf8'}).stderr;
    return parseFloat(JSON.parse(err.slice(err.lastIndexOf('{'))).input_i);
  };
  const render = (gain) => execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', tmp,
    '-af', `volume=${gain.toFixed(1)}dB,alimiter=limit=0.6:attack=1:release=40:level=false,apad=pad_dur=0.25`,
    ...encode], {stdio: 'inherit'});
  let gain = Math.min(20, -16 - loudness(tmp));
  render(gain);
  const after = loudness(path.resolve(output));
  if (after < -17) {
    gain = Math.min(24, gain + (-16 - after) / 2);
    render(gain);
  }
  rmSync(tmp, {force: true});
} else {
  console.warn('WARNING: no full ffmpeg found; only loudness was set. Install ffmpeg or use ElevenLabs Voice Isolator to remove noise.');
  execFileSync(process.execPath,
    [remotion, 'ffmpeg', '-y', '-v', 'error', '-i', path.resolve(input), '-af', 'loudnorm=I=-16:TP=-1.5:LRA=9', ...encode],
    {cwd: template, stdio: 'inherit'});
}
console.log(path.resolve(output));
