import React from 'react';
import { Composition } from 'remotion';
import { TalentSignalVideo } from './compositions/TalentSignal';
import { talentSignalSchema } from './compositions/TalentSignal/schema';
import { WebsiteFlowVideo } from './compositions/WebsiteFlow';
import { websiteFlowSchema } from './compositions/WebsiteFlow/schema';
import { loadFonts } from './lib/fonts';

loadFonts();

// Sequences: 88+110+105+115+105+105 = 628
// Transitions: 5*18 = 90
// Net: 628 - 90 = 538 frames @ 30fps, about 17.9s.
const TOTAL_FRAMES = 538;
// Sequences: 112+96+98+104+104+104 = 618
// Transitions: 5*16 = 80
// Net: 538 frames @ 30fps, about 17.9s.
const WEBSITE_FLOW_FRAMES = 538;

export function RemotionRoot() {
  return (
    <>
    <Composition
      id="AmplifyATS"
      component={TalentSignalVideo}
      durationInFrames={TOTAL_FRAMES}
      fps={30}
      width={1920}
      height={1080}
      schema={talentSignalSchema}
      defaultProps={talentSignalSchema.parse({})}
    />
    <Composition
      id="AmplifyATSWebsite"
      component={WebsiteFlowVideo}
      durationInFrames={WEBSITE_FLOW_FRAMES}
      fps={30}
      width={1920}
      height={1080}
      schema={websiteFlowSchema}
      defaultProps={websiteFlowSchema.parse({})}
    />
    </>
  );
}
