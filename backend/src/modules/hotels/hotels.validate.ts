import z from "zod";

export const createHotelSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Hotel name should be of minimum 2 characters."),
    description: z
      .string()
      .min(5, "Hotel description should be of minimum 5 characters."),
    city: z.string(),
    address: z.string(),
    isFeatured: z.coerce.boolean().optional(),
    amenitiesId: z.preprocess((val) => {
      if (typeof val === "string") {
        try {
          return JSON.parse(val);
        } catch {
          return val;
        }
      }
      return val;
    }, z.array(z.string()).optional()),
  }),
});

export const editHotelSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Hotel name should be of minimum 2 characters.")
      .optional(),
    description: z
      .string()
      .min(5, "Hotel description should be of minimum 5 characters.")
      .optional(),
    city: z.string().optional(),
    address: z.string().optional(),
    isFeatured: z.coerce.boolean().optional(),
  }),
});
