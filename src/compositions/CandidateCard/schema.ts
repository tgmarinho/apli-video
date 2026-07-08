import { z } from 'zod';

export const candidateCardSchema = z.object({
  name: z.string().default('André Souza'),
  role: z.string().default('Senior Full-Stack Engineer'),
  seniority: z.string().default('SENIOR'),
  techStack: z.array(z.string()).max(6).default(['TypeScript', 'React', 'Node.js', 'AWS', 'Postgres']),
  mlScore: z.number().min(0).max(100).default(87),
  yearsOfExperience: z.number().min(0).max(40).default(6),
  avatarUrl: z.string().url().optional(),
  accentColor: z.string().default('#7C3AED'),
  country: z.string().default('🇧🇷 Brazil'),
});

export type CandidateCardProps = z.infer<typeof candidateCardSchema>;
