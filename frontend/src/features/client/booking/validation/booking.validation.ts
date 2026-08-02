import { z } from "zod";

export const bookingSchema = z
  .object({
    checkIn: z.date({
      error: "Check-in date is required",
    }),
    checkOut: z.date({
      error: "Check-out date is required",
    }),
  })
  .refine((data) => data.checkOut > data.checkIn, {
    message: "Check-out must be after check-in",
    path: ["checkOut"],
  });

export type BookingInput = z.infer<typeof bookingSchema>;