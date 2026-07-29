import z from "zod";

export const createRoomSchema = z.object({
        name:z.string().min(2,"Room name should be of minimum 2 characters."),
        capacity:z.number().min(1,"capacity can't less then 1"),
        roomImage:z.instanceof(File,{message:"room image is required"}),
        price:z.number()
})

export const updateRoomSchema = z.object({
     name:z.string().min(2,"Room name should be of minimum 2 characters.").optional(),
     capacity:z.number().min(1,"capacity can't less then 1").optional(),
     roomImage:z.instanceof(File,{message:"room image is required"}).optional(),
     price:z.number().optional()
})

export type createRoomFormInput = z.infer<typeof createRoomSchema>;
export type updateRoomFormInput = z.infer<typeof updateRoomSchema>;