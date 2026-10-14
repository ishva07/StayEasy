import prisma from "../../config/db"
import ApiError from "../../utils/ApiError";
import { deleteCloudinaryImages } from "../../utils/cloudinaryImages";

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

    const previousImages = await prisma.hotelImages.findMany({
        where:{hotelId},
        select:{url:true},
    });

    await prisma.$transaction([
        prisma.hotelImages.deleteMany({where:{hotelId}}),
        prisma.hotelImages.createMany({
            data:urls.map((url)=>({
                hotelId,
                url
            }))
        })
    ]);

    await deleteCloudinaryImages(
        previousImages
            .map((image) => image.url)
            .filter((url) => !urls.includes(url)),
    );

    const updatedGalleryImage = await prisma.hotelImages.findMany({where:{hotelId},select:{url:true}})
    return updatedGalleryImage;
}