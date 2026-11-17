import {loadFont} from '@remotion/google-fonts/SpaceGrotesk';
import {AbsoluteFill, OffthreadVideo, interpolate, staticFile, useCurrentFrame} from 'remotion';

const {fontFamily} = loadFont('normal', {weights: ['500', '700'], subsets: ['latin']});

// The SEN closing clip with a name and website set under its tagline.
export type ClosingProps = {clip: string; name: string; site: string};

export const Closing = ({clip, name, site}: ClosingProps) => {
  const frame = useCurrentFrame();
  const line = (delay: number) => ({
    opacity: interpolate(frame, [delay, delay + 10], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  });
  return (
    <AbsoluteFill>
      <OffthreadVideo src={staticFile(clip)} />
      <div
        style={{
          position: 'absolute',
          top: 1540,
          width: '100%',
          textAlign: 'center',
          fontFamily,
          lineHeight: 1.4,
        }}
      >
        <div style={{color: '#FFFFFF', fontSize: 54, fontWeight: 700, ...line(66)}}>{name}</div>
        <div style={{color: '#00C2FF', fontSize: 46, fontWeight: 500, ...line(74)}}>{site}</div>
      </div>
    </AbsoluteFill>
  );
};
