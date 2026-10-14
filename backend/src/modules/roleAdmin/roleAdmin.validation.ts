import { z } from "zod";

export const updateRolePermissionsSchema = z.object({
  params: z.object({
    roleId: z.string().min(1),
  }),
  body: z.object({
    permissionIds: z.array(z.string().min(1)),
  }),
});
