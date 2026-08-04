import z from "zod";

export const createHotelSchema = z.object({
  name: z.string().min(2, "Hotel name should be of minimum 2 characters."),
  description: z.string().min(5, "Hotel description should be of minimum 5 characters."),
  cityId: z.string().min(1, "City is required"),
  address: z.string().min(1, "Address is required"),
  isFeatured: z.boolean().optional(),
  amenitiesIds: z.array(z.string()).optional(),
  heroImage: z.instanceof(File, { message: "Hero image is required" }),
  imageGallery: z.array(z.instanceof(File)).optional(),
  propertyTypeId: z.string().min(1, "property type is required"),
});

export const editHotelSchema = z.object({
  name: z
    .string()
    .min(2, "Hotel name should be of minimum 2 characters.")
    .optional(),
  description: z
    .string()
    .min(5, "Hotel description should be of minimum 5 characters.")
    .optional(),
  cityId: z.string().min(1, "City is required"),
  address: z.string().optional(),
  isFeatured: z.boolean().optional(),
  amenitiesIds: z.array(z.string()).optional(),
  heroImage: z
    .instanceof(File, { message: "Hero Image is Required" })
    .optional(),
  imageGallery: z.array(z.instanceof(File)).optional(),
  propertyTypeId: z.string().min(1, "property type is required"),
});

export type createHotelInputData = z.infer<typeof createHotelSchema>;
export type editHotelInputData = z.infer<typeof editHotelSchema>;