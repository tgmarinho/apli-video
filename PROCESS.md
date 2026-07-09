# Process

This document records the end-to-end process used to solve the Amplify IT video challenge in this repository.

## 1. Workspace and Repository Setup

1. Checked the current Conductor workspace at `/Users/tgmarinho/conductor/workspaces/apli-video/tirana`.
2. Confirmed the local branch was `solve-amplifyit-video-challenge`.
3. Found the workspace initially contained only an empty initial commit.
4. Added the challenge repository as `upstream`:

```bash
git remote add upstream https://github.com/amplifyit-io/video.git
git fetch upstream main
```

5. Merged the upstream challenge project into the current branch with unrelated histories allowed:

```bash
git merge upstream/main --allow-unrelated-histories --no-edit
```

This brought in the Remotion project, assets, sounds, README, and base compositions.

## 2. Challenge Analysis

1. Read `README.md` to identify the challenge requirements:
   - Build a 15-35 second video in English.
   - Use Remotion only.
   - Sell Amplify ATS to companies hiring LATAM engineers.
   - Cover the AI-native ATS, LATAM talent pool, agent chat, visual pipeline, top-company candidates, salary range, and 12-day hiring velocity.
2. Reviewed the existing base composition in `src/compositions/MarketingVideo/`.
3. Decided not to make minor edits to the base video, because the challenge asks for a substantially different original submission.

## 3. Primary Video: Talent Signal

1. Created a new composition at `src/compositions/TalentSignal/`.
2. Built a new narrative around the line:

```text
Hiring is not a resume problem. It is a signal problem.
```

3. Structured the video into six scenes:
   - Resume noise.
   - Natural-language hiring brief.
   - LATAM talent map.
   - Ranked shortlist with warm intros.
   - Visual pipeline.
   - Outcome and CTA.
4. Added challenge-specific proof points:
   - AI-native ATS.
   - LATAM talent pool.
   - Brazil, Argentina, Colombia, Mexico.
   - UTC-3 to UTC-6.
   - $60K-$120K salary range.
   - 12-day close.
   - Three warm intros from one chat.
5. Registered the composition as `AmplifyATS` in `src/Root.tsx`.
6. Rendered it to:

```bash
out/amplify-ats.mp4
```

## 4. Secondary Video: FDE Concept

1. The user liked the first version and asked for another version based on Amplify's website.
2. Reviewed `https://amplifyit.io/`, then pivoted to the specific FDE page at `https://amplifyit.io/fde`.
3. Downloaded and inspected page HTML/CSS to match visual direction:
   - Geist / Geist Mono typography.
   - White background.
   - Black CTA pills.
   - Light gray borders.
   - Clean navbar.
   - Large bold headings.
4. Downloaded local font files into `public/fonts/`:

```text
public/fonts/geist-latin.woff2
public/fonts/geist-mono-latin.woff2
```

5. Created a new composition at `src/compositions/WebsiteFlow/`.
6. Built a FDE-focused story:
   - Custom AI agents for enterprise.
   - 80% of AI PoCs fail in production.
   - FDE profiles in 48h.
   - Embedded in under two weeks.
   - SOC 2 / GDPR-ready architecture.
   - Workflow DAG from Slack to AI Agent to Salesforce, Gmail, Notion, Jira, and GitHub.
7. Registered the composition as `AmplifyATSWebsite`.
8. Added a render script:

```bash
npm run render:website
```

9. Rendered it to:

```bash
out/amplify-ats-website.mp4
```

## 5. Review With Skills

The user asked to use React, TypeScript, Vercel, and Remotion skills to review the code.

The following skills were consulted:

- `typescript-react-reviewer` from `dotneet/claude-code-marketplace`
- `react-best-practices` from `vercel-labs/agent-skills`
- `composition-patterns` from `vercel-labs/agent-skills`
- `remotion` from `remotion-dev/skills`

`react-native-skills` was inspected but not applied because this is a Remotion/React web project, not React Native.

Findings and fixes:

1. Found `useS()` hooks being called inside `.map()` callbacks in the FDE composition.
2. Extracted those blocks into standalone components:
   - `PillarSummary`
   - `FdeActionCard`
   - `PlatformCard`
3. Removed `React.FC` usage from the active root and composition exports.
4. Confirmed there were no remaining `key={index}` usages in the reviewed compositions.

## 6. Validation

Ran TypeScript validation:

```bash
npm run typecheck
```

Rendered both videos:

```bash
npm run render
npm run render:website
```

Confirmed both videos are within the challenge duration window:

```text
out/amplify-ats.mp4          17.984s
out/amplify-ats-website.mp4  17.984s
```

Extracted representative frames with `ffmpeg` into `.context/frames/` and `.context/fde-frames/` for visual inspection.

Rendered smoke-test stills for both compositions:

```bash
npx remotion still src/index.ts AmplifyATS --frame=120 --image-format=png --output=.context/review-amplifyats.png
npx remotion still src/index.ts AmplifyATSWebsite --frame=120 --image-format=png --output=.context/review-fde.png
```

## 7. Documentation Updates

1. Added a `Submission Videos` section to `README.md` with embedded MP4 previews and download links.
2. Created `SUBMISSION.md` with:
   - Local render paths.
   - Build-in-public post URL.
   - Submission approach summary.
3. Created `AGENTS.md` with:
   - Project context.
   - Active compositions.
   - Render commands.
   - Coding guidelines.
   - Review checklist.
4. Removed `out/` from `.gitignore` so rendered MP4 files can be committed to GitHub.

## 8. Pull Request

1. Committed the full change set:

```bash
git commit -m "Add Amplify challenge video submissions"
```

2. Pushed the branch:

```bash
git push -u origin HEAD:solve-amplifyit-video-challenge
```

3. Created a draft PR against `main`:

```text
https://github.com/tgmarinho/apli-video/pull/1
```

4. The PR was later marked ready and merged into `main`.
5. This process document was added afterward in commit `42b7954` so the implementation path is preserved for future review.

## 9. Current Outputs

Primary ATS video:

```text
out/amplify-ats.mp4
```

FDE concept video:

```text
out/amplify-ats-website.mp4
```

Both are generated entirely with Remotion code and checked into the repository for GitHub preview and challenge submission.
