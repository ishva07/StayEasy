import z from "zod";

export const registerSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(6, "Password should be of minimum 6 characters."),
        firstName: z.string().min(1, "First name is required"),
        lastName: z.string().min(1, "Last name is required"),
    })
})


export const loginSchema = z.object({
    body:z.object({
        email:z.string().email(),
        password:z.string().min(6, "Password should be of minimum 6 characters."),
    })
})