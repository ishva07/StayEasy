import prisma from "../../config/db"
import ApiError from "../../utils/ApiError";

export const getHotelImageGalleryService = async(hotelId:string) => {
    const hotelExist = await prisma.hotel.findUnique({where:{id:hotelId}});

    if(!hotelExist)
        throw new ApiError(404,"Hotel Does not found..");

    const hotelImage = await prisma.hotelImages.findMany({where:{hotelId}});
    return hotelImage;
}

export const updateHotelImageService = async(hotelId:string, urls:string[]) =>{
     const hotelExist = await prisma.hotel.findUnique({where:{id:hotelId}});

    if(!hotelExist)
        throw new ApiError(404,"Hotel Does not found..");

    const updatedImages = await prisma.$transaction([
        prisma.hotelImages.deleteMany({where:{hotelId}}),
        prisma.hotelImages.createMany({
            data:urls.map((url)=>({
                hotelId,
                url
            }))
        })
    ]);

    return updatedImages;
}