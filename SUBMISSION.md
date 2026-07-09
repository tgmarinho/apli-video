# Amplify IT Video Challenge Submission

## Repository

https://github.com/tgmarinho/apli-video

## Rendered video

Primary submission:

- https://github.com/tgmarinho/apli-video/blob/main/out/amplify-ats.mp4

Additional render in the repository:

- `out/amplify-ats.mp4` - ATS / talent signal version
- `out/amplify-ats-website.mp4` - FDE / secure AI agents version inspired by https://amplifyit.io/fde

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
