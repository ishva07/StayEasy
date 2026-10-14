import { z } from "zod";

export const updateUserRoleSchema = z.object({
  params: z.object({
    userId: z.string().min(1),
  }),
  body: z.object({
    roleId: z.string().min(1),
  }),
});
