// Usage: node clean-voice.mjs <input audio> <output .mp3> [--strong]
// Cleans Khaled's own voice recording for a reel, for free: removes rumble and hiss, softens harsh "s"
// sounds, adds a little presence, evens out the level, trims silence at the
// start and end, and sets social-media loudness (-14 LUFS, peaks under -1 dB).
// --strong uses a heavier noise reduction for noisy rooms.
import {execFileSync} from 'node:child_process';
import {existsSync} from 'node:fs';
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
const filters = [
  'highpass=f=80',                       // rumble, desk knocks, AC hum
  'lowpass=f=14000',                     // hiss above the voice
  `afftdn=nf=${strong ? -20 : -28}:tn=1`, // steady background noise
  'deesser=i=0.4',                       // harsh "s" and "sh"
  'equalizer=f=250:t=q:w=1.2:g=-2',      // boxy room sound
  'equalizer=f=3500:t=q:w=1.5:g=2.5',    // clarity of Arabic consonants
  'acompressor=threshold=-20dB:ratio=3:attack=10:release=150:makeup=3dB',
  trim, 'areverse', trim, 'areverse',    // trim silence at both ends only
  'apad=pad_dur=0.25',                   // a short tail so the last word is not clipped
  'loudnorm=I=-14:TP=-1.0:LRA=9',
].join(',');
const args = ['-y', '-v', 'error', '-i', path.resolve(input),
  '-af', fullFfmpeg ? filters : 'loudnorm=I=-14:TP=-1.0:LRA=9',
  '-ar', '44100', '-ac', '1', '-c:a', 'libmp3lame', '-b:a', '192k', path.resolve(output)];

if (fullFfmpeg) {
  execFileSync('ffmpeg', args, {stdio: 'inherit'});
} else {
  console.warn('WARNING: no full ffmpeg found; only loudness was set. Install ffmpeg or use ElevenLabs Voice Isolator to remove noise.');
  execFileSync(process.execPath, [remotion, 'ffmpeg', ...args], {cwd: template, stdio: 'inherit'});
}
console.log(path.resolve(output));
