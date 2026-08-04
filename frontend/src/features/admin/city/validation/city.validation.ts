import z from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const createCitySchema = z.object({
  name: z.string().min(2, "City name should be of atleast 2 character."),
  cityImage: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
      message: "Image size should not exceed 5MB.",
    })
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Only .jpg, .png, and .webp formats are supported.",
    }),
});

export const updateCitySchema = z.object({
  name: z.string().min(2, "City name should be of atleast 2 character.").optional(),
  cityImage: z
    .instanceof(File)
    .optional()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, {
      message: "Image size should not exceed 5MB.",
    })
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      message: "Only .jpg, .png, and .webp formats are supported.",
    })
    .optional(),
});

export type createCityFormInput = z.infer <typeof createCitySchema>;
export type updateCityFormInput = z.infer <typeof updateCitySchema>;