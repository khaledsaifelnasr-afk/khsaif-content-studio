import {Composition} from 'remotion';
import {Closing} from './Closing';
import {FPS, HEIGHT, Reel, ReelProps, WIDTH, totalSeconds} from './Reel';

const defaults: ReelProps = {
  scenes: [{type: 'card', start: 0, end: 3, text: 'Reel Studio'}],
  captions: [],
};

export const Root = () => (
  <>
    <Composition
      id="Reel"
      component={Reel}
      width={WIDTH}
      height={HEIGHT}
      fps={FPS}
      durationInFrames={90}
      defaultProps={defaults}
      calculateMetadata={({props}) => ({
        durationInFrames: Math.ceil(totalSeconds(props) * FPS),
      })}
    />
    <Composition
      id="Closing"
      component={Closing}
      width={WIDTH}
      height={HEIGHT}
      fps={FPS}
      durationInFrames={4 * FPS}
      defaultProps={{clip: 'outro.mp4', name: 'Khaled Saif', site: 'khsaif.com'}}
    />
  </>
);
