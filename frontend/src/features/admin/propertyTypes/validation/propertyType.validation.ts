import z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; 
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const createPropertyTypeSchema = z.object({
  name: z.string().min(2, "Property type name should be of atleast 2 character."),
  propertyTypeImage: z
    .instanceof(File)
    .refine((file) => !!file, { message: "Property type image is required." })
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "Image size should not exceed 5MB.",
    })
    .refine((file) => ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Only .jpg, .png, and .webp formats are supported.",
    }),
});

export const updatePropertyTypeSchema = z.object({
  name: z.string().min(2, "Property type name should be of atleast 2 character.").optional(),
  propertyTypeImage: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
      message: "Image size should not exceed 5MB.",
    })
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Only .jpg, .png, and .webp formats are supported.",
    }),
});

export type createPropertyTypeFormInput = z.infer<typeof createPropertyTypeSchema>;
export type updatePropertyTypeFormInput = z.infer<typeof updatePropertyTypeSchema>;