# Amplify IT Video Challenge Submission

## Repository

TODO: Add public GitHub repository URL.

## Rendered video

Local renders:

- `out/amplify-ats.mp4` - ATS / talent signal version
- `out/amplify-ats-website.mp4` - FDE / secure AI agents version inspired by https://amplifyit.io/fde

TODO: Add public video URL or attach the MP4 to the repository/submission.

## Build in public post

https://x.com/vmzucher/status/2070637162584822126

## Approach

I built a new 17.98-second Remotion video around the idea that hiring is a signal problem, not a resume problem. The story moves from resume noise to a natural-language hiring brief, then shows Amplify AI turning that brief into a LATAM talent map, ranked shortlist, visual pipeline, and a clear 12-day hiring outcome.

Technically, the video is generated entirely in code with Remotion using custom scene components, `spring()` and `interpolate()` animations, SVG path drawing, animated score rings, moving pipeline cards, typed copy, static brand assets, and layered music/SFX from the repository.

## Render commands

```bash
npm install
npm run typecheck
npm run render
```
