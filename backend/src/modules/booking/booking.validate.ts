import {z} from "zod";

export const bookingSchema = z.object({
    body:z.object({
        checkIn:z.date(),
        checkOut:z.date(),
        roomId:z.string()
    })
})