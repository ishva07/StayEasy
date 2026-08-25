import z from "zod";

export const createPropertyTypeSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, "Property type name should be of at least 2 characters."),
  }),
});

export const editPropertyTypeSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, "Property type name should be of at least 2 characters.").optional(),
  }),
});
