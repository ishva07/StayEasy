import {z} from "zod";

export const createRoleSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Role name is required"),
    })

});

export const editRoleSchema = z.object({
    body: z.object({
 roleId: z.string().min(1, "Role id is required"),
    name: z.string().min(1, "Role name is required"),    })
});