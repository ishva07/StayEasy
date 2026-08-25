import z from "zod";

const multipartBoolean = z.preprocess(
  (value) => (typeof value === "string" ? value === "true" : value),
  z.boolean().optional(),
);

export const createHotelSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Hotel name should be of minimum 2 characters."),
    description: z
      .string()
      .min(5, "Hotel description should be of minimum 5 characters."),
    cityId: z.string(),
    propertyTypeId: z.string(),
    address: z.string(),
    isFeatured: multipartBoolean,
    amenitiesIds: z.preprocess((val) => {
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
    cityId: z.string().optional(),
    propertyTypeId: z.string(),
    address: z.string().optional(),
    isFeatured: multipartBoolean,
  }),
});