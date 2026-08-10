import z from "zod";

export const createReviewSchema = z.object({
  body: z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().optional(),
    bookingId: z.string(),
  }),
});

export const updateReviewSchema = z.object({
  body: z.object({
    rating: z.number().min(1).max(5).optional(),
    comment: z.string().optional(),
  }),
});

export const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(["PUBLISH", "REJECT"]),
  }),
});