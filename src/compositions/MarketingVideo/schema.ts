import { z } from 'zod';

export const marketingVideoSchema = z.object({
  tagline: z.string().default('The ATS for\nBrazilian talent.'),
  cta: z.string().default('amplifyit.io'),
  ctaLabel: z.string().default('Start hiring today →'),
});

export type MarketingVideoProps = z.infer<typeof marketingVideoSchema>;
