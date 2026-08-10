import z from "zod";

export const createReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  bookingId: z.string(),
});

export const updateReviewSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().optional(),
});

export type createReviewType = z.infer<typeof createReviewSchema>;
export type updateReviewType = z.infer<typeof updateReviewSchema>;