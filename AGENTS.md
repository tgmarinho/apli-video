# AGENTS.md

## Project Context

This is a Remotion video project for the Amplify IT community video challenge.

There are two active compositions:

- `AmplifyATS` in `src/compositions/TalentSignal/`: primary ATS challenge submission.
- `AmplifyATSWebsite` in `src/compositions/WebsiteFlow/`: alternative FDE / secure AI agents concept inspired by `https://amplifyit.io/fde`.

Rendered videos for GitHub preview live in `out/` and are intentionally tracked.

## Commands

```bash
npm install
npm run typecheck
npm run render
npm run render:website
```

`npm run render` writes `out/amplify-ats.mp4`.

`npm run render:website` writes `out/amplify-ats-website.mp4`.

## Coding Guidelines

- Keep Remotion animation deterministic and frame-based with `useCurrentFrame()`, `interpolate()`, and `spring()`.
- Do not use CSS transitions or CSS animations for video motion.
- Reference static assets with `staticFile()` from `public/`.
- Keep hooks at the top level of React components. Do not call hooks inside loops, callbacks, or `.map()` bodies.
- Prefer named function components over `React.FC`.
- Keep text in English for challenge-facing video copy.
- Preserve the original `MarketingVideo` composition as reference unless explicitly asked to remove it.

## Review Checklist

- `npm run typecheck` passes.
- Both target compositions can render at least one still frame.
- Final videos are between 15 and 35 seconds.
- `AmplifyATS` should remain aligned with the original ATS challenge requirements.
- `AmplifyATSWebsite` should remain aligned with the FDE page concept.
