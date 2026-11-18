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

const trim = 'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.15';
const clean = [
  'highpass=f=80',                        // rumble, desk knocks, AC hum
  'lowpass=f=14000',                      // hiss above the voice
  `afftdn=nf=${strong ? -20 : -28}:tn=1`, // steady background noise
  // Quiet the gaps between sentences so the noise does not rise with the level.
  'agate=threshold=0.015:ratio=4:attack=5:release=200:range=0.1',
  'deesser=i=0.4',                        // harsh "s" and "sh"
  'equalizer=f=250:t=q:w=1.2:g=-2',       // boxy room sound
  'equalizer=f=3000:t=q:w=1.5:g=2.5',     // clarity of Arabic consonants
  'acompressor=threshold=-20dB:ratio=3:attack=10:release=150:makeup=3dB',
  'speechnorm=e=6:r=0.0001:l=1',          // lift quiet words, keep loud ones
  trim, 'areverse', trim, 'areverse',     // trim silence at both ends only
].join(',');
const encode = ['-ar', '44100', '-ac', '1', '-c:a', 'libmp3lame', '-b:a', '192k', path.resolve(output)];

if (fullFfmpeg) {
  // Clean once, then raise the level towards -16 LUFS (spoken-word standard)
  // with a limiter that keeps peaks under -1.5 dB after MP3 encoding.
  const tmp = path.join(os.tmpdir(), `clean-voice-${process.pid}.wav`);
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-i', path.resolve(input), '-af', clean, tmp], {stdio: 'inherit'});
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
