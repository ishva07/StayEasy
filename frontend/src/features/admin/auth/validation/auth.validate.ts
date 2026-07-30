import {z} from "zod";

export const loginSchema = z.object({
    email:z.email(),
    password:z.string().min(6,"password must be less than 6 characters.")
})

export type loginInput = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type registerInput = z.infer<typeof registerSchema>;