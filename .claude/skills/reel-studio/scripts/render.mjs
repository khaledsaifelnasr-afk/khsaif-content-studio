// Usage: node render.mjs <reel-folder>
// Expects <reel-folder>/reel.json and <reel-folder>/assets/.
// Writes <reel-folder>/reel.mp4 and one review frame per scene in <reel-folder>/qa/.
import {execFileSync} from 'node:child_process';
import {copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const template = path.join(here, '..', 'template');
const reelDir = path.resolve(process.argv[2] ?? '');
const propsFile = path.join(reelDir, 'reel.json');
if (!existsSync(propsFile)) throw new Error(`Missing ${propsFile}`);

const props = JSON.parse(readFileSync(propsFile, 'utf8'));

// Problems stop the render; warnings are printed for the review step.
const checkReel = ({scenes, captions = []}) => {
  const problems = [];
  const banned = ['world-class', 'one-stop', 'guaranteed', 'مضمون', 'الأفضل في العالم'];
  scenes.forEach((s, i) => {
    const next = scenes[i + 1];
    if (next && Math.abs(next.start - s.end) > 0.02) {
      problems.push(`Gap or overlap between scenes ${i + 1} and ${i + 2}`);
    }
    if (s.end - s.start > 4.5) {
      console.warn(`WARNING: scene ${i + 1} runs ${(s.end - s.start).toFixed(1)}s; cut it under 4.5s`);
    }
    if ((s.type === 'visual' || s.type === 'screen') && !s.src) problems.push(`Scene ${i + 1} has no src`);
    if (s.src && !existsSync(path.join(reelDir, 'assets', s.src))) problems.push(`Missing asset ${s.src}`);
  });
  if (scenes[0]?.start !== 0) problems.push('The first scene must start at 0');
  // Two or more shots in the first 5 seconds (Google ABCD, Attract).
  if (scenes.length > 1 && scenes[0].end > 2.5) {
    console.warn(`WARNING: the first cut comes at ${scenes[0].end.toFixed(1)}s; cut the hook by 2.5s so two shots land in the first 5s`);
  }
  const lastEnd = scenes[scenes.length - 1]?.end ?? 0;
  const lastWord = captions[captions.length - 1]?.end ?? 0;
  if (lastWord > lastEnd + 0.05) problems.push('Captions run past the last scene');
  const allText = JSON.stringify({scenes, captions}).toLowerCase();
  banned.forEach((b) => allText.includes(b) && problems.push(`Banned brand phrase: ${b}`));
  if (problems.length) throw new Error(problems.join('\n'));
};
checkReel(props);
const assets = path.join(reelDir, 'assets');
mkdirSync(assets, {recursive: true});

const remotion = path.join(template, 'node_modules', '@remotion', 'cli', 'remotion-cli.js');
const run = (args) =>
  execFileSync(process.execPath, [remotion, ...args], {cwd: template, encoding: 'utf8'});

// Brand files are copied in so each reel folder is complete on its own.
const brand = path.join(here, '..', 'brand');
const brandFile = (name) => {
  copyFileSync(path.join(brand, name), path.join(assets, name));
  return name;
};
if (props.tick === undefined) props.tick = brandFile('sen-tick-single.wav');
if (props.watermark === undefined) props.watermark = brandFile('sen-mark-reversed-clear.svg');
// Chrome first: Edge can exit at launch while it is mid-update.
const browser = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  // Claude Code cloud sessions ship this Chromium with Playwright.
  '/opt/pw-browsers/chromium',
].find((b) => existsSync(b));
// No local browser at all: Remotion downloads its own headless Chrome.

// Default closing: the three-tick logo clip with the name and website set under it.
if (props.outro === undefined) {
  brandFile('sen-intro-reels-1080x1920-sound-ledger.mp4');
  const closingProps = path.join(reelDir, '.closing.json');
  writeFileSync(
    closingProps,
    JSON.stringify({
      clip: 'sen-intro-reels-1080x1920-sound-ledger.mp4',
      name: props.closingName ?? 'Khaled Saif',
      site: props.closingSite ?? 'khsaif.com',
    }),
  );
  execFileSync(
    process.execPath,
    [
      remotion, 'render', 'src/index.ts', 'Closing', path.join(assets, 'closing.mp4'),
      `--props=${closingProps}`, `--public-dir=${assets}`, '--codec=h264', '--crf=16',
      ...(browser ? [`--browser-executable=${browser}`] : []), '--log=error',
    ],
    {cwd: template, stdio: 'inherit'},
  );
  props.outro = 'closing.mp4';
}

if (props.outro) {
  const probe = run([
    'ffprobe', path.join(assets, props.outro),
    '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0',
  ]);
  props.outroSeconds = parseFloat(probe.trim().split(/\s+/).pop());
}

// Neither Instagram nor YouTube recommends vertical videos over 3 minutes.
const bodySeconds = props.scenes[props.scenes.length - 1]?.end ?? 0;
const totalSeconds = bodySeconds + (props.outroSeconds ?? 0);
if (totalSeconds > 180) {
  throw new Error(`The reel runs ${totalSeconds.toFixed(1)}s with its closing; keep it at 3 minutes or less`);
}
// A YouTube Short over 1 minute with any copyright claim is blocked worldwide.
if (totalSeconds > 60 && props.music) {
  console.warn(`WARNING: the reel runs ${totalSeconds.toFixed(1)}s with music; use only ElevenLabs music or the YouTube Audio Library`);
}

const built = path.join(reelDir, '.reel.resolved.json');
writeFileSync(built, JSON.stringify(props, null, 2));


const output = path.join(reelDir, 'reel.mp4');
execFileSync(
  process.execPath,
  [
    remotion, 'render', 'src/index.ts', 'Reel', output,
    `--props=${built}`, `--public-dir=${assets}`, '--codec=h264',
    '--crf=18', '--audio-codec=aac', ...(browser ? [`--browser-executable=${browser}`] : []),
    '--log=warn',
  ],
  {cwd: template, stdio: 'inherit'},
);

// Master the mix to -14 LUFS (the level Instagram and YouTube play at), peaks under -1.5 dB.
const mastered = path.join(reelDir, '.reel.mastered.mp4');
run([
  'ffmpeg', '-y', '-v', 'error', '-i', output, '-c:v', 'copy',
  '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-c:a', 'aac', '-b:a', '192k', mastered,
]);
renameSync(mastered, output);

const qa = path.join(reelDir, 'qa');
mkdirSync(qa, {recursive: true});
props.scenes.forEach((s, i) => {
  // Late in the scene, so entrances have finished and captions are showing.
  const at = s.start + (s.end - s.start) * 0.7;
  const shot = path.join(qa, `scene-${String(i + 1).padStart(2, '0')}.png`);
  run(['ffmpeg', '-y', '-v', 'error', '-ss', String(at), '-i', output, '-frames:v', '1', shot]);
});
console.log(output);
