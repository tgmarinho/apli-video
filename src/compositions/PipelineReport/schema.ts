import { z } from 'zod';

const stageSchema = z.object({
  label: z.string(),
  count: z.number().min(0),
  color: z.string(),
});

export const pipelineReportSchema = z.object({
  weekOf: z.string().default('Jun 23–27, 2025'),
  stages: z.array(stageSchema).default([
    { label: 'New', count: 24, color: '#6366F1' },
    { label: 'Reviewing', count: 18, color: '#3B82F6' },
    { label: 'Interviewed', count: 11, color: '#F59E0B' },
    { label: 'Offered', count: 4, color: '#10B981' },
  ]),
  totalCandidates: z.number().default(89),
  placements: z.number().default(3),
  rolesOpen: z.number().default(12),
  topCandidates: z.array(z.object({
    name: z.string(),
    role: z.string(),
    score: z.number(),
  })).max(3).default([
    { name: 'André Souza', role: 'Senior Backend', score: 92 },
    { name: 'Julia Mota', role: 'Tech Lead', score: 88 },
    { name: 'Matheus Lima', role: 'DevOps', score: 84 },
  ]),
});

export type PipelineReportProps = z.infer<typeof pipelineReportSchema>;
