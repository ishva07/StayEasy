import {z} from "zod";

export const aiFilterSchema = z.object({
  intent: z.enum(["search", "unclear"]),
  cityId: z.string().nullable().optional(),
  propertyTypeId: z.string().nullable().optional(),
  amenityIds: z.array(z.string()).optional().default([]),
  guests: z.number().int().positive().nullable().optional(),
  checkIn: z.string().nullable().optional(),
  checkOut: z.string().nullable().optional(),
  minRating: z.number().nullable().optional(),
  minPrice: z.number().nullable().optional(),
  maxPrice: z.number().nullable().optional(),
  keywordFallback: z.string().nullable().optional(),
});
 
export type AiFilterResult = z.infer<typeof aiFilterSchema>;