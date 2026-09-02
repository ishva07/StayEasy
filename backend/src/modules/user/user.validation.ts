import { z } from "zod";

export const changeUserRoleSchema = z.object({
  body: z.object({
    roleId: z.string().min(1, "Role id is required"),
  })
});