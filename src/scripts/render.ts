import path from 'path';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import { marketingVideoSchema } from '../compositions/MarketingVideo/schema';

async function main() {
  const inputProps = marketingVideoSchema.parse({});

  const entry = path.join(__dirname, '../index.ts');
  const bundled = await bundle({ entryPoint: entry, webpackOverride: (c) => c });
  const composition = await selectComposition({ serveUrl: bundled, id: 'AmplifyATS', inputProps });

  await renderMedia({
    composition,
    serveUrl: bundled,
    codec: 'h264',
    outputLocation: path.join(__dirname, '../../out/amplify-ats.mp4'),
    inputProps,
  });

  console.log('✅ Rendered: out/amplify-ats.mp4');
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
