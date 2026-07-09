import { z } from 'zod';

export const talentSignalSchema = z.object({
  cta: z.string().default('amplifyit.io'),
  ctaLabel: z.string().default('Hire LATAM engineers in 12 days'),
});

export type TalentSignalProps = z.infer<typeof talentSignalSchema>;
