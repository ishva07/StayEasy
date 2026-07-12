import z from "zod";

export const createRoomSchema = z.object({
    body:z.object({
        name:z.string().min(2,"Room name should be of minimum 2 characters."),
        capacity:z.coerce.number(),
        price:z.coerce.number(),
        roomImage:z.string().optional(),
        hotelId:z.string()
    })
})


export const editRoomSchema = z.object({
    body:z.object({
        name:z.string().min(2,"Room name should be of minimum 2 characters.").optional(),
        capacity:z.coerce.number().optional(),
        price:z.coerce.number().optional(),
        roomImage:z.string().optional(),
        hotelId:z.string().optional()
    })
})