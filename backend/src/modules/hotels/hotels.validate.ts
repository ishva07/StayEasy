import z from "zod";

export const createHotelSchema = z.object({
    body:z.object({
        name:z.string().min(2, "Hotel name should be of minimum 2 characters."),
        description:z.string().min(5, "Hotel description should be of minimum 5 characters.")
    })
})

export const editHotelSchema = z.object({
    body:z.object({
        name:z.string().min(2, "Hotel name should be of minimum 2 characters.").optional(),
        description:z.string().min(5, "Hotel description should be of minimum 5 characters.").optional()
    })
})