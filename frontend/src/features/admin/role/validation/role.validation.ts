import { z } from "zod";

export const createRoleSchema = z.object({
  name: z.string().min(1, "Role name is required"),
});

export type createRoleFormInput = z.infer<typeof createRoleSchema>;
export const updateRoleSchema = createRoleSchema;
export type updateRoleFormInput = z.infer<typeof updateRoleSchema>;