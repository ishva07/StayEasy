import { z } from "zod";

export const bookingSchema = z.object({
  body: z.object({
    checkIn: z.coerce.date(),
    checkOut: z.coerce.date(),
    roomId: z.string(),
  }),
});