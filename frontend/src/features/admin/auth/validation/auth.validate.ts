import {z} from "zod";

export const loginSchema = z.object({
    email:z.email(),
    password:z.string().min(6,"password must be less than 6 characters.")
})

export type loginInput = z.infer<typeof loginSchema>;