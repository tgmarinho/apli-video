import { z } from 'zod';

export const placementAnnouncementSchema = z.object({
  candidateName: z.string().default('André Souza'),
  candidateRole: z.string().default('Senior Full-Stack Engineer'),
  candidateAvatarUrl: z.string().url().optional(),
  orgName: z.string().default('Stripe'),
  orgLogoUrl: z.string().url().optional(),
  orgAccentColor: z.string().default('#7C3AED'),
  startDate: z.string().default('July 2025'),
  placementType: z.enum(['CONTRACTOR', 'EMPLOYEE', 'FREELANCER']).default('CONTRACTOR'),
});

export type PlacementAnnouncementProps = z.infer<typeof placementAnnouncementSchema>;
