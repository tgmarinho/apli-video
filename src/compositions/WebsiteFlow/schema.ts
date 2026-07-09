import { z } from 'zod';

export const websiteFlowSchema = z.object({
  cta: z.string().default('amplifyit.io'),
  ctaLabel: z.string().default('Deploy Secure AI Agents - Get Profiles in 48h'),
});

export type WebsiteFlowProps = z.infer<typeof websiteFlowSchema>;
