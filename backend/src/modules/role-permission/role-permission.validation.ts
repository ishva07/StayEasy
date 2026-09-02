import { z } from "zod";

export const assignPermissionSchema = z.object({
    body: z.object({
          permissionId: z.string().min(1, "permissionId is required"),
    })
});

export const updateRolePermissionsSchema = z.object({
        body: z.object({
            permissionIds: z.array(z.string()),
        })
});