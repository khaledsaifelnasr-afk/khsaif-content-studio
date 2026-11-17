import type React from 'react';
import {loadFont} from '@remotion/google-fonts/IBMPlexSansArabic';
import {loadFont as loadNumberFont} from '@remotion/google-fonts/SpaceGrotesk';
import {
  AbsoluteFill,
  Audio,
  Easing,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const {fontFamily} = loadFont('normal', {
  weights: ['500', '700'],
  subsets: ['arabic', 'latin'],
});

const {fontFamily: numberFont} = loadNumberFont('normal', {
  weights: ['700'],
  subsets: ['latin'],
});

const headingFont = (direction: Direction) =>
  direction === 'ltr' ? `${numberFont}, ${fontFamily}` : fontFamily;

export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;

// SEN brand colours: Cyan and Gold are never both loud in one view.
const MIDNIGHT = '#0D1B2A';
const CYAN = '#00C2FF';
const GOLD = '#D9A441';
const STEEL = '#3E5A75';
const WHITE = '#FFFFFF';
const LINE_HEIGHT_AR = 1.7;
const CROSSFADE = 8;
const OUT = Easing.bezier(0.16, 1, 0.3, 1);
const CLAMP = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export type Step = {date: string; label: string};

// Brand backgrounds for text scenes, all from the guideline's gradients and supergraphic.
export const BG_VARIANTS = ['glow', 'rings', 'grid', 'gradient', 'midnight'] as const;
export type Background = (typeof BG_VARIANTS)[number];

export type Scene = {
  type: 'visual' | 'screen' | 'card' | 'counter' | 'timeline' | 'law' | 'list';
  start: number;
  end: number;
  src?: string;
  text?: string;
  keyValue?: string;
  // A short line under a card's text, such as a service's scope.
  kicker?: string;
  // card: the full logo above the text, and a bar chart under it.
  logo?: string;
  bars?: number[];
  // card: a service icon above the text, and two linked badges under it (e.g. UAE and KSA).
  icon?: IconName;
  // visual: a stamp-style label laid over the lower middle of the frame, e.g. to cover text a model rendered badly.
  label?: string;
  pair?: [string, string];
  // Text scenes without a photo; when left out, scenes rotate through BG_VARIANTS.
  bg?: Background;
  // counter
  from?: number;
  to?: number;
  prefix?: string;
  suffix?: string;
  // timeline: the last step is the highlighted one
  steps?: Step[];
  // law
  source?: string;
  // list
  items?: string[];
};

export type Word = {text: string; start: number; end: number; emphasis?: boolean};

export type Direction = 'rtl' | 'ltr';

export type ReelProps = {
  voice?: string;
  voiceVolume?: number;
  music?: string;
  musicVolume?: number;
  tick?: string;
  tickVolume?: number;
  scenes: Scene[];
  captions: Word[];
  outro?: string;
  outroSeconds?: number;
  // Keep the music playing under the closing clip, for reels scored to one track.
  musicThroughOutro?: boolean;
  watermark?: string;
  direction?: Direction;
};

const bodySeconds = (p: ReelProps) =>
  Math.max(0, ...p.scenes.map((s) => s.end), ...p.captions.map((c) => c.end));

export const totalSeconds = (p: ReelProps) =>
  Math.max(1, bodySeconds(p) + (p.outro ? p.outroSeconds ?? 0 : 0));

const isVideo = (src: string) => /\.(mp4|mov|webm)$/i.test(src);

const Headline = ({
  text,
  direction,
  first,
}: {
  text: string;
  direction: Direction;
  first: boolean;
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: '340px 80px 520px',
        background:
          'linear-gradient(180deg, rgba(13,27,42,0.35) 0%, rgba(13,27,42,0.72) 55%, rgba(13,27,42,0.9) 100%)',
      }}
    >
      <div
        style={{
          direction,
          textAlign: 'center',
          fontFamily: headingFont(direction),
          color: WHITE,
          fontSize: 104,
          fontWeight: 700,
          lineHeight: LINE_HEIGHT_AR,
          scale: first ? 1 : interpolate(frame, [0, 10], [1.12, 1], {...CLAMP, easing: OUT}),
          opacity: first ? 1 : interpolate(frame, [0, 6], [0, 1], CLAMP),
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

const StampLabel = ({text}: {text: string}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{justifyContent: 'flex-start', alignItems: 'center', paddingTop: 1010}}>
      <div
        style={{
          fontFamily,
          direction: 'rtl',
          color: WHITE,
          fontSize: 120,
          fontWeight: 700,
          lineHeight: 1.5,
          padding: '105px 0',
          width: 980,
          textAlign: 'center',
          borderRadius: 18,
          border: `6px solid ${GOLD}`,
          backgroundColor: 'rgba(13,27,42,0.92)',
          rotate: '-4deg',
          scale: interpolate(frame, [0, 6], [1.6, 1], {...CLAMP, easing: OUT}),
          opacity: interpolate(frame, [0, 3], [0, 1], CLAMP),
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

const Media = ({
  scene,
  frames,
  index,
  direction,
}: {
  scene: Scene;
  frames: number;
  index: number;
  direction: Direction;
}) => {
  const frame = useCurrentFrame();
  // Alternate zoom in and out so consecutive stills never move the same way.
  const zoom = index % 2 === 0 ? [1, 1.1] : [1.1, 1];
  const src = staticFile(scene.src as string);
  const style = {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    scale: interpolate(frame, [0, frames], zoom, CLAMP),
  };
  // Screens keep the whole page visible; visuals fill the frame.
  if (scene.type === 'screen') {
    return (
      <AbsoluteFill style={{backgroundColor: MIDNIGHT, padding: '370px 48px 420px'}}>
        <Img
          src={src}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'top',
            borderRadius: 18,
            border: `3px solid ${STEEL}`,
          }}
        />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{backgroundColor: MIDNIGHT}}>
      {isVideo(scene.src as string) ? (
        <OffthreadVideo src={src} muted style={style} />
      ) : (
        <Img src={src} style={style} />
      )}
      {scene.text ? <Headline text={scene.text} direction={direction} first={index === 0} /> : null}
      {scene.label ? <StampLabel text={scene.label} /> : null}
    </AbsoluteFill>
  );
};

// The ring and four ticks of the SEN mark, drawn large and quiet behind card text.
const BrandRing = () => {
  const frame = useCurrentFrame();
  return (
    <svg
      viewBox="0 0 200 200"
      style={{
        position: 'absolute',
        top: 330,
        left: 90,
        width: 900,
        height: 900,
        opacity: 0.5,
        rotate: interpolate(frame, [0, 300], ['0deg', '12deg']),
      }}
    >
      <circle cx="100" cy="100" r="88" fill="none" stroke={STEEL} strokeWidth="1.5" />
      <path d="M100 4V20M100 180V196M4 100H20M180 100H196" stroke={STEEL} strokeWidth="1.5" />
    </svg>
  );
};

// The clock ring repeated as a pattern, without the hand, as the guideline allows.
const RingPattern = ({quiet}: {quiet: boolean}) => {
  const frame = useCurrentFrame();
  const rings = [
    [180, 420, 300],
    [900, 260, 220],
    [820, 1180, 340],
    [120, 1500, 240],
    [560, 1720, 180],
  ];
  return (
    <svg
      viewBox="0 0 1080 1920"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity: quiet ? 0.18 : 0.4,
        translate: interpolate(frame, [0, 300], ['0px 0px', '0px -60px']),
      }}
    >
      {rings.map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={STEEL} strokeWidth="6" />
      ))}
    </svg>
  );
};

const BrandBackground = ({bg, quiet}: {bg: Background; quiet: boolean}) => {
  const frame = useCurrentFrame();
  if (bg === 'gradient') {
    return (
      <AbsoluteFill
        style={{
          background: `linear-gradient(${interpolate(frame, [0, 300], [160, 200])}deg, #0D1B2A 0%, #1E3550 100%)`,
        }}
      />
    );
  }
  if (bg === 'glow') {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: MIDNIGHT,
          background: `radial-gradient(circle at 50% ${interpolate(frame, [0, 300], [34, 46])}%, #17405F 0%, rgba(13,27,42,0) 62%), ${MIDNIGHT}`,
        }}
      />
    );
  }
  if (bg === 'rings') {
    return (
      <AbsoluteFill style={{backgroundColor: MIDNIGHT}}>
        <RingPattern quiet={quiet} />
      </AbsoluteFill>
    );
  }
  if (bg === 'grid') {
    // Ledger lines on the social grid: 4 columns inside 60px margins.
    return (
      <AbsoluteFill
        style={{
          backgroundColor: MIDNIGHT,
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(62,90,117,0.28) 0px, rgba(62,90,117,0.28) 2px, transparent 2px, transparent 120px), repeating-linear-gradient(90deg, rgba(62,90,117,0.16) 0px, rgba(62,90,117,0.16) 2px, transparent 2px, transparent 240px)',
          backgroundPosition: `60px ${interpolate(frame, [0, 300], [0, 120])}px`,
        }}
      />
    );
  }
  return (
    <AbsoluteFill style={{backgroundColor: MIDNIGHT}}>{quiet ? null : <BrandRing />}</AbsoluteFill>
  );
};

const Panel = ({
  children,
  direction,
  bg = 'midnight',
  ring = true,
}: {
  children: React.ReactNode;
  direction: Direction;
  bg?: Background;
  ring?: boolean;
}) => (
  <AbsoluteFill
    style={{
      backgroundColor: MIDNIGHT,
      justifyContent: 'center',
      alignItems: 'center',
      padding: '340px 80px 520px',
      direction,
      textAlign: 'center',
      fontFamily: headingFont(direction),
    }}
  >
    <BrandBackground bg={bg} quiet={!ring} />
    {children}
  </AbsoluteFill>
);

const Counter = ({scene, direction}: {scene: Scene; direction: Direction}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const value = interpolate(frame, [0, 1.1 * fps], [scene.from ?? 0, scene.to ?? 0], {
    ...CLAMP,
    easing: OUT,
  });
  // Long amounts drop a size so they stay inside the 60px brand margin.
  const amount = `${scene.prefix ?? ''} ${(scene.to ?? 0).toLocaleString('en-US')}${scene.suffix ?? ''}`;
  return (
    <Panel direction={direction} bg={scene.bg}>
      <div
        style={{
          position: 'relative',
          direction: 'ltr',
          color: GOLD,
          fontFamily: `${numberFont}, ${fontFamily}`,
          fontSize: amount.length > 11 ? 124 : 150,
          fontWeight: 700,
          lineHeight: 1.3,
        }}
      >
        {scene.prefix ? `${scene.prefix} ` : ''}
        {Math.round(value).toLocaleString('en-US')}
        {scene.suffix ?? ''}
      </div>
      {scene.text ? (
        <div
          style={{
            position: 'relative',
            color: WHITE,
            fontSize: 76,
            fontWeight: 700,
            lineHeight: LINE_HEIGHT_AR,
          }}
        >
          {scene.text}
        </div>
      ) : null}
    </Panel>
  );
};

const Timeline = ({scene, direction}: {scene: Scene; direction: Direction}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const steps = scene.steps ?? [];
  const gap = Math.max(6, Math.round((0.75 * fps) / Math.max(1, steps.length - 1)));
  return (
    <Panel direction={direction} bg={scene.bg} ring={false}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          textAlign: direction === 'rtl' ? 'right' : 'left',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 40,
            bottom: 60,
            [direction === 'rtl' ? 'right' : 'left']: 19,
            width: 4,
            backgroundColor: STEEL,
            transformOrigin: 'top',
            scale: `1 ${interpolate(frame, [0, gap * steps.length], [0, 1], {...CLAMP, easing: OUT})}`,
          }}
        />
        {steps.map((step, i) => {
          const last = i === steps.length - 1;
          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 44,
                marginBottom: last ? 0 : 56,
                opacity: interpolate(frame, [i * gap, i * gap + 8], [0, 1], CLAMP),
                translate: interpolate(frame, [i * gap, i * gap + 8], ['0px 24px', '0px 0px'], {
                  ...CLAMP,
                  easing: OUT,
                }),
              }}
            >
              <div
                style={{
                  position: 'relative',
                  flex: 'none',
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  backgroundColor: last ? GOLD : MIDNIGHT,
                  border: `4px solid ${last ? GOLD : STEEL}`,
                }}
              />
              <div>
                <div
                  style={{
                    color: last ? GOLD : WHITE,
                    fontFamily: `${numberFont}, ${fontFamily}`,
                    fontSize: last ? 76 : 56,
                    fontWeight: 700,
                    lineHeight: 1.4,
                    unicodeBidi: 'plaintext',
                  }}
                >
                  {step.date}
                </div>
                <div
                  style={{color: WHITE, fontSize: 48, fontWeight: 500, lineHeight: LINE_HEIGHT_AR}}
                >
                  {step.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
};

const Law = ({scene, direction}: {scene: Scene; direction: Direction}) => {
  const frame = useCurrentFrame();
  return (
    <Panel direction={direction} bg={scene.bg}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          padding: '44px 48px',
          borderRadius: 18,
          border: `1px solid ${STEEL}`,
          backgroundColor: 'rgba(30,53,80,0.72)',
          opacity: interpolate(frame, [0, 8], [0, 1], CLAMP),
          scale: interpolate(frame, [0, 12], [0.96, 1], {...CLAMP, easing: OUT}),
        }}
      >
        {scene.source ? (
          <div
            style={{
              color: GOLD,
              fontSize: 46,
              fontWeight: 700,
              lineHeight: LINE_HEIGHT_AR,
              unicodeBidi: 'plaintext',
            }}
          >
            {scene.source}
          </div>
        ) : null}
        <div style={{color: WHITE, fontSize: 64, fontWeight: 500, lineHeight: LINE_HEIGHT_AR}}>
          {scene.text}
        </div>
      </div>
    </Panel>
  );
};

const List = ({scene, direction}: {scene: Scene; direction: Direction}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const items = scene.items ?? [];
  // Items land across the first half of the scene so they keep pace with the voice.
  const gap = Math.max(6, Math.round(durationInFrames / 2 / Math.max(1, items.length)));
  return (
    <Panel direction={direction} bg={scene.bg}>
      {scene.text ? (
        <div
          style={{
            position: 'relative',
            color: WHITE,
            fontSize: 72,
            fontWeight: 700,
            lineHeight: LINE_HEIGHT_AR,
            marginBottom: 36,
          }}
        >
          {scene.text}
        </div>
      ) : null}
      <div
        style={{
          position: 'relative',
          width: '100%',
          textAlign: direction === 'rtl' ? 'right' : 'left',
        }}
      >
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 28,
              padding: '18px 32px',
              marginBottom: 20,
              borderRadius: 14,
              backgroundColor: 'rgba(30,53,80,0.72)',
              color: WHITE,
              fontSize: 58,
              fontWeight: 500,
              lineHeight: LINE_HEIGHT_AR,
              opacity: interpolate(frame, [i * gap, i * gap + 7], [0, 1], CLAMP),
              translate: interpolate(frame, [i * gap, i * gap + 7], ['0px 24px', '0px 0px'], {
                ...CLAMP,
                easing: OUT,
              }),
            }}
          >
            <span style={{fontFamily: numberFont, color: STEEL, fontWeight: 700}}>{i + 1}</span>
            {item}
          </div>
        ))}
      </div>
    </Panel>
  );
};

// Each scene fades in over the one before it, which stays on screen for CROSSFADE frames.
// The first scene has nothing beneath it, so it starts solid: platforms pick covers from frame 0.
const Enter = ({children, first}: {children: React.ReactNode; first: boolean}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{
        opacity: first ? 1 : interpolate(frame, [0, CROSSFADE], [0, 1], CLAMP),
        scale: first ? 1 : interpolate(frame, [0, CROSSFADE], [1.03, 1], {...CLAMP, easing: OUT}),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Thin outline icons with rounded joins, as the guideline sets for services.
const ICONS = {
  audit: (
    <>
      <path d="M26 12h30l14 14v42a6 6 0 0 1-6 6H26a6 6 0 0 1-6-6V18a6 6 0 0 1 6-6z" />
      <path d="M30 30h22M30 42h12" />
      <circle cx="54" cy="56" r="12" />
      <path d="M63 65l13 13" />
    </>
  ),
  tax: (
    <>
      <circle cx="48" cy="48" r="36" />
      <path d="M62 34L34 62" />
      <circle cx="36" cy="36" r="6" />
      <circle cx="60" cy="60" r="6" />
    </>
  ),
  vat: (
    <>
      <path d="M24 12h48v70l-8-6-8 6-8-6-8 6-8-6-8 6z" />
      <path d="M36 28h24M36 40h14" />
      <path d="M58 52L40 68" />
      <circle cx="41" cy="54" r="3" />
      <circle cx="57" cy="66" r="3" />
    </>
  ),
  tp: (
    <>
      <circle cx="48" cy="48" r="36" />
      <path d="M12 48h72M18 30h60M18 66h60" />
      <path d="M48 12c-14 10-14 62 0 72M48 12c14 10 14 62 0 72" />
    </>
  ),
  zakat: (
    <>
      <circle cx="48" cy="48" r="36" />
      <path d="M58 30a20 20 0 1 0 0 36 16 16 0 1 1 0-36z" />
    </>
  ),
};
export type IconName = keyof typeof ICONS;

const Icon = ({name}: {name: IconName}) => {
  const frame = useCurrentFrame();
  return (
    <svg
      viewBox="0 0 96 96"
      style={{
        position: 'relative',
        width: 210,
        height: 210,
        marginBottom: 36,
        scale: interpolate(frame, [0, 10], [0.8, 1], {...CLAMP, easing: OUT}),
      }}
      fill="none"
      stroke={CYAN}
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {ICONS[name]}
    </svg>
  );
};

const Pair = ({labels}: {labels: [string, string]}) => {
  const frame = useCurrentFrame();
  const badge = (label: string, delay: number) => (
    <div
      style={{
        flex: 'none',
        width: 230,
        height: 230,
        borderRadius: '50%',
        border: `5px solid ${CYAN}`,
        backgroundColor: MIDNIGHT,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: WHITE,
        fontSize: 68,
        fontWeight: 700,
        scale: interpolate(frame, [delay, delay + 10], [0.6, 1], {...CLAMP, easing: OUT}),
        opacity: interpolate(frame, [delay, delay + 6], [0, 1], CLAMP),
      }}
    >
      {label}
    </div>
  );
  return (
    <div
      style={{
        position: 'relative',
        direction: 'ltr',
        display: 'flex',
        alignItems: 'center',
        width: 920,
        margin: '70px 0 50px',
      }}
    >
      {badge(labels[0], 8)}
      <div
        style={{
          flex: 1,
          height: 5,
          backgroundColor: CYAN,
          transformOrigin: 'left',
          scale: `${interpolate(frame, [18, 34], [0, 1], {...CLAMP, easing: OUT})} 1`,
        }}
      />
      {badge(labels[1], 30)}
    </div>
  );
};

const Card = ({scene, direction}: {scene: Scene; direction: Direction}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const enter = spring({frame, fps, config: {damping: 200}, durationInFrames: 15});
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.04]);
  return (
    <AbsoluteFill
      style={{
        backgroundColor: MIDNIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        padding: '260px 80px 460px',
        direction,
        textAlign: 'center',
        fontFamily: headingFont(direction),
        opacity: enter,
        transform: `translateY(${interpolate(enter, [0, 1], [30, 0])}px)`,
      }}
    >
      {scene.src ? (
        <>
          <Img
            src={staticFile(scene.src)}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${scale})`,
            }}
          />
          <AbsoluteFill
            style={{
              background:
                'linear-gradient(180deg, rgba(13,27,42,0.3) 0%, rgba(13,27,42,0.45) 45%, rgba(13,27,42,0.75) 100%)',
            }}
          />
        </>
      ) : null}
      {scene.src ? (
        scene.logo || scene.icon || scene.pair ? null : (
          <BrandRing />
        )
      ) : (
        <BrandBackground bg={scene.bg ?? 'midnight'} quiet={Boolean(scene.logo)} />
      )}
      {scene.logo ? (
        <Img
          src={staticFile(scene.logo)}
          style={{position: 'relative', width: 880, marginBottom: scene.text ? 40 : 0}}
        />
      ) : null}
      {scene.icon ? <Icon name={scene.icon} /> : null}
      {scene.keyValue ? (
        <div
          style={{
            position: 'relative',
            color: GOLD,
            fontFamily: `${numberFont}, ${fontFamily}`,
            fontSize: 170,
            fontWeight: 700,
            lineHeight: 1.3,
            unicodeBidi: 'plaintext',
          }}
        >
          {scene.keyValue}
        </div>
      ) : null}
      {scene.text ? (
        <div
          style={{
            position: 'relative',
            color: WHITE,
            fontSize: 84,
            fontWeight: 700,
            lineHeight: direction === 'ltr' ? 1.3 : LINE_HEIGHT_AR,
          }}
        >
          {scene.text}
        </div>
      ) : null}
      {scene.pair ? <Pair labels={scene.pair} /> : null}
      {scene.bars ? (
        <div
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-end',
            gap: 22,
            height: 300,
            marginTop: 40,
            padding: '36px 44px',
            borderRadius: 18,
            border: `1px solid ${STEEL}`,
            backgroundColor: 'rgba(30,53,80,0.72)',
          }}
        >
          {scene.bars.map((value, i) => (
            <div
              key={i}
              style={{
                width: 70,
                borderRadius: 6,
                backgroundColor: CYAN,
                height: interpolate(
                  frame,
                  [12 + i * 6, 12 + i * 6 + 14],
                  [0, (value / Math.max(...(scene.bars as number[]))) * 228],
                  {...CLAMP, easing: OUT},
                ),
              }}
            />
          ))}
        </div>
      ) : null}
      {scene.kicker ? (
        <div
          style={{
            position: 'relative',
            whiteSpace: 'pre-line',
            marginTop: 18,
            color: 'rgba(255,255,255,0.75)',
            fontSize: 44,
            fontWeight: 500,
            lineHeight: direction === 'ltr' ? 1.3 : LINE_HEIGHT_AR,
            // Arabic is never letter-spaced.
            letterSpacing: direction === 'ltr' ? '0.12em' : 0,
            textTransform: direction === 'ltr' ? 'uppercase' : 'none',
          }}
        >
          {scene.kicker}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const MAX_WORDS = 4;

const pagesOf = (words: Word[]) => {
  const pages: Word[][] = [];
  for (const word of words) {
    const last = pages[pages.length - 1];
    const gap = last ? word.start - last[last.length - 1].end : 0;
    if (!last || last.length >= MAX_WORDS || gap > 0.45) {
      pages.push([word]);
    } else {
      last.push(word);
    }
  }
  return pages;
};

const Captions = ({
  words,
  highlight,
  direction,
}: {
  words: Word[];
  highlight: string;
  direction: Direction;
}) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const page = pagesOf(words).find(
    (p) => t >= p[0].start && t < p[p.length - 1].end + 0.15,
  );
  if (!page) return null;
  const sinceStart = frame - page[0].start * FPS;
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '0 70px 400px',
        opacity: interpolate(sinceStart, [0, 3], [0, 1], CLAMP),
        translate: interpolate(sinceStart, [0, 5], ['0px 14px', '0px 0px'], {
          ...CLAMP,
          easing: OUT,
        }),
      }}
    >
      <div
        style={{
          direction,
          textAlign: 'center',
          fontFamily,
          fontSize: 76,
          fontWeight: 700,
          lineHeight: LINE_HEIGHT_AR,
          padding: '10px 34px',
          borderRadius: 18,
          backgroundColor: 'rgba(13,27,42,0.78)',
        }}
      >
        {page.map((w, i) => {
          const active = t >= w.start && t < w.end;
          const wordStart = w.start * FPS;
          // Very short words still need a rising range for the scale below.
          const wordEnd = Math.max(w.end * FPS, wordStart + 4);
          return (
            <span key={i}>
              <span
                style={{
                  display: 'inline-block',
                  // Word gaps as margins: a plain space can collapse next to inline-block words in RTL.
                  marginInline: w.emphasis ? '0.24em' : '0.12em',
                  color: active || w.emphasis ? highlight : WHITE,
                  scale: interpolate(
                    frame,
                    [wordStart, wordStart + 3, wordEnd, wordEnd + 3],
                    [1, w.emphasis ? 1.14 : 1.05, w.emphasis ? 1.14 : 1.05, 1],
                    CLAMP,
                  ),
                }}
              >
                {w.text}
              </span>
              {i < page.length - 1 ? ' ' : ''}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const Reel = (props: ReelProps) => {
  const frame = useCurrentFrame();
  const t = frame / FPS;
  const body = bodySeconds(props);
  const current = props.scenes.find((s) => t >= s.start && t < s.end);
  const goldOnScreen =
    (current?.type === 'card' && Boolean(current.keyValue)) ||
    current?.type === 'counter' ||
    current?.type === 'timeline' ||
    (current?.type === 'law' && Boolean(current.source)) ||
    // Icons, badges and charts are the screen's one cyan element, so captions stay white.
    Boolean(current?.icon || current?.pair || current?.bars);
  const direction = props.direction ?? 'rtl';
  const bodyFrames = Math.ceil(body * FPS);
  const musicFrames = props.musicThroughOutro ? Math.ceil(totalSeconds(props) * FPS) : bodyFrames;
  const fullMusic = props.musicVolume ?? 0.2;
  // Music sits low under speech and lifts in the pauses.
  const musicVolume = (f: number) => {
    const at = f / FPS;
    const gapToVoice = Math.min(
      ...props.captions.map((c) => Math.max(c.start - at, at - c.end, 0)),
      10,
    );
    const ducked = interpolate(gapToVoice, [0.1, 0.5], [fullMusic * 0.35, fullMusic], CLAMP);
    return ducked * interpolate(f, [0, 12, musicFrames - 24, musicFrames], [0, 1, 1, 0], CLAMP);
  };
  return (
    <AbsoluteFill style={{backgroundColor: MIDNIGHT}}>
      {props.scenes.map((raw, i) => {
        const scene = {...raw, bg: raw.bg ?? BG_VARIANTS[i % BG_VARIANTS.length]};
        const frames = Math.max(1, Math.round((scene.end - scene.start) * FPS));
        return (
          <Sequence
            key={i}
            from={Math.round(scene.start * FPS)}
            durationInFrames={i < props.scenes.length - 1 ? frames + CROSSFADE : frames}
          >
            <Enter first={i === 0}>
              {scene.type === 'card' ? <Card scene={scene} direction={direction} /> : null}
              {scene.type === 'counter' ? <Counter scene={scene} direction={direction} /> : null}
              {scene.type === 'timeline' ? <Timeline scene={scene} direction={direction} /> : null}
              {scene.type === 'law' ? <Law scene={scene} direction={direction} /> : null}
              {scene.type === 'list' ? <List scene={scene} direction={direction} /> : null}
              {scene.type === 'visual' || scene.type === 'screen' ? (
                <Media scene={scene} frames={frames} index={i} direction={direction} />
              ) : null}
            </Enter>
            {props.tick && i > 0 ? (
              <Sequence durationInFrames={FPS} layout="none">
                <Audio src={staticFile(props.tick)} volume={props.tickVolume ?? 0.3} />
              </Sequence>
            ) : null}
          </Sequence>
        );
      })}
      {t < body && props.watermark ? (
        <div
          style={{
            position: 'absolute',
            top: 230,
            right: 56,
            padding: 14,
            borderRadius: 18,
            backgroundColor: 'rgba(13,27,42,0.78)',
          }}
        >
          <Img src={staticFile(props.watermark)} style={{display: 'block', width: 100}} />
        </div>
      ) : null}
      {t < body && !current?.label ? (
        <Captions
          words={props.captions}
          highlight={goldOnScreen ? WHITE : CYAN}
          direction={direction}
        />
      ) : null}
      {props.voice ? <Audio src={staticFile(props.voice)} volume={props.voiceVolume ?? 1} /> : null}
      {props.music ? (
        <Sequence durationInFrames={musicFrames} layout="none">
          <Audio src={staticFile(props.music)} volume={musicVolume} loop />
        </Sequence>
      ) : null}
      {props.outro ? (
        <Sequence from={Math.round(body * FPS)}>
          <OffthreadVideo src={staticFile(props.outro)} volume={props.voiceVolume ?? 1} />
        </Sequence>
      ) : null}
    </AbsoluteFill>
  );
};
