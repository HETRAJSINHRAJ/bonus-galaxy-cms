import { z } from 'zod';

/**
 * Mission validation schemas using Zod
 */

export const MissionRequirementsSchema = z.object({
  type: z.enum(['receipt_scan', 'point_threshold', 'voucher_purchase', 'daily_login', 'social_share', 'partner_visit', 'custom']),
  targetValue: z.number().optional(),
  details: z.record(z.string(), z.any()).optional(),
});

export const MissionValidationRulesSchema = z.object({
  minAmount: z.number().optional(),
  maxAmount: z.number().optional(),
  requiredTaxId: z.string().optional(),
  allowedCategories: z.array(z.string()).optional(),
  customRules: z.record(z.string(), z.any()).optional(),
});

export const CreateMissionSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1),
  shortDescription: z.string().max(500).optional(),
  type: z.enum(['daily', 'weekly', 'monthly', 'one-time', 'recurring']),
  category: z.enum(['shopping', 'social', 'engagement', 'partner', 'special']),
  difficulty: z.enum(['easy', 'medium', 'hard']).default('medium'),
  pointsReward: z.number().int().positive(),
  bonusReward: z.number().int().default(0),
  
  requirements: MissionRequirementsSchema,
  validationRules: MissionValidationRulesSchema.optional(),
  
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  isActive: z.boolean().default(false),
  isScheduled: z.boolean().default(false),
  
  imageUrl: z.string().url().optional(),
  iconName: z.string().optional(),
  displayOrder: z.number().int().default(0),
  isFeatured: z.boolean().default(false),
  isHidden: z.boolean().default(false),
  
  maxCompletions: z.number().int().positive().optional(),
  totalLimit: z.number().int().positive().optional(),
  
  tags: z.array(z.string()).default([]),
  targetAudience: z.string().optional(),
  partnerName: z.string().optional(),
  partnerLogoUrl: z.string().url().optional(),
});

export const UpdateMissionSchema = CreateMissionSchema.partial();

export const BulkMissionActionSchema = z.object({
  missionIds: z.array(z.string()).min(1),
  action: z.enum(['activate', 'deactivate', 'delete', 'duplicate', 'feature', 'unfeature']),
  updates: z.record(z.string(), z.any()).optional(),
});

export const MissionFilterSchema = z.object({
  type: z.enum(['daily', 'weekly', 'monthly', 'one-time', 'recurring']).optional(),
  category: z.enum(['shopping', 'social', 'engagement', 'partner', 'special']).optional(),
  isActive: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  isScheduled: z.boolean().optional(),
  createdBy: z.string().optional(),
  search: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sortBy: z.enum(['createdAt', 'updatedAt', 'displayOrder', 'pointsReward', 'currentCompletions']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const AnalyticsQuerySchema = z.object({
  missionId: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  groupBy: z.enum(['day', 'week', 'month']).default('day'),
});

export type CreateMissionInput = z.infer<typeof CreateMissionSchema>;
export type UpdateMissionInput = z.infer<typeof UpdateMissionSchema>;
export type BulkMissionAction = z.infer<typeof BulkMissionActionSchema>;
export type MissionFilter = z.infer<typeof MissionFilterSchema>;
export type AnalyticsQuery = z.infer<typeof AnalyticsQuerySchema>;
