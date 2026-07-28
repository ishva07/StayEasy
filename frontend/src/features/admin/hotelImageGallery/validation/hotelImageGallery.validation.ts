import z from "zod";

export const updateHotelImageGallerySchema = z.object({
    imageGallery:z.array(z.instanceof(File,{message:"image are required while updating hotel image gallery"}))
})

export  type updateHotelImageGalleryInput = z.infer<typeof updateHotelImageGallerySchema>;