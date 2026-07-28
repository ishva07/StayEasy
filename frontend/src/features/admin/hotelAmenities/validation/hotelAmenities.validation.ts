import {z} from "zod"

export const updateHotelAmenitiesSchema = z.object({
    amenitiesId:z.array(z.string()).min(1,"at least one amenity required to select")
})

export type updateHotelAmenitiesInput = z.infer<typeof updateHotelAmenitiesSchema>;