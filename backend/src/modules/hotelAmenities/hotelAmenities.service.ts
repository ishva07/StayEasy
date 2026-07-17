import prisma from "../../config/db";
import ApiError from "../../utils/ApiError";

export const updateAmenitiesService = async (hotelId: string, amenitiesId: string[]) => {
  const hotelExist = await prisma.hotel.findUnique({ where: { id: hotelId } });
  if (!hotelExist) throw new ApiError(404, "Hotel does not exist.");

  const updatedAmenitiesIds = await prisma.$transaction([
    prisma.hotelAmenities.deleteMany({ where: { hotelId } }),
    prisma.hotelAmenities.createMany({
      data: amenitiesId.map((amenity) => ({
        hotelId,
        amenitiesId: amenity,
      })),
    }),
  ]);

const updatedAmenities = await prisma.hotelAmenities.findFirst({where:{hotelId},select:{amenities:{select:{name:true}}}})
  return updatedAmenities;
};