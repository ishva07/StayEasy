import prisma from "../../config/db";
import ApiError from "../../utils/ApiError";
import { CreateHotelInterface, UpdateHotelInterface } from "./hotels.types";

export const createHotelsService = async(data:CreateHotelInterface) =>{
    const {amenitiesIds,imageGallery, ...hotelData} = data;

    const hotelExist = await prisma.hotel.findFirst({where:{name:hotelData.name}});
    if(hotelExist)
        throw new ApiError(409, "already hotel exist with same name.");

    const newHotel = await prisma.$transaction(async(tx)=>{
        const hotel = await tx.hotel.create({data:hotelData});

        if(amenitiesIds?.length){
            await tx.hotelAmenities.createMany({
                data:amenitiesIds.map((amenity:string)=>({
                    hotelId:hotel.id,
                    amenitiesId:amenity
                }))
            })
        }

        if(imageGallery?.length){
            await tx.hotelImages.createMany({
                data:imageGallery.map((url:string)=>({
                    url,
                    hotelId:hotel.id
                }))
            })
        }
        return hotel;
    });

    return newHotel;
}

export const editHotelsService=async(id:string, data:UpdateHotelInterface)=>{
    const hotelId = await prisma.hotel.findUnique({where:{id}})

    if(!hotelId)
        throw new ApiError(404,"No hotel available on given id")

    if(data.name){
        const hotelExist = await prisma.hotel.findFirst({where:{name:data.name,NOT:{id}}})
    if(hotelExist)
        throw new ApiError(409, "Hotel name already exist on given id .. try different name")
    }

    const updatedHotel = await prisma.hotel.update({where:{id},data});
    return updatedHotel;
}

export const deleteHotelService = async(id:string)=>{
     const hotel = await prisma.hotel.findFirst({where:{id},select:{room:true}})

    if(!hotel)
        throw new ApiError(404,"No hotel available on given id")

    const deletedHotel = await prisma.hotel.delete({where:{id}})
    return deletedHotel;
}

export const getHotelsByIdService = async(id:string)=>{
    const hotelsById = await prisma.hotel.findUnique({where:{id},
    include:{
        room:true,
        hotelAmenities:{include:{amenities:true}},
        imageGallery:true,
        city:true,
        propertyType:true
    }});
    return hotelsById;
}

export const getHotelService = async ({
  page = 1,
  limit = 10,
  sortBy = "createdAt",
  order = "desc",
  search = "",
  featured,
  amenityIds,
  city,
  propertyType,
  guests,
  checkIn,
  checkOut,
}: {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: string;
  search?: string;
  featured?: string;
  amenityIds?: string;
  city?: string;
  propertyType?: string;
  guests?: string;
  checkIn?: string;
  checkOut?: string;
}) => {
  const skip = (page - 1) * limit;
  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { city: { name: { contains: search, mode: "insensitive" } } },
    ];
  }
  if (featured === "true") where.isFeatured = true;
  if (amenityIds) {
    where.hotelAmenities = { some: { amenitiesId: { in: amenityIds.split(",") } } };
  }
  if (city) where.cityId = city;
  if (propertyType) where.propertyTypeId = propertyType;

  const roomWhere: any = {};
  if (guests) roomWhere.capacity = { gte: Number(guests) };
  if (checkIn && checkOut) {
    roomWhere.booking = {
      none: {
        status: { not: "CANCELED" },
        checkIn: { lt: new Date(checkOut) },
        checkOut: { gt: new Date(checkIn) },
      },
    };
  }
  if (Object.keys(roomWhere).length > 0) where.room = { some: roomWhere };

  // Special case: "popular" sort — most reviewed first, avgReview as tiebreaker.
  // Not part of allowedSortBy since it's a fixed multi-field sort, not a single dynamic column.
  let orderBy: any;
  if (sortBy === "popular") {
    orderBy = [{ reviewCount: "desc" }, { avgReview: "desc" }];
  } else {
    const allowedSortBy = ["name", "createdAt", "city"];
    const sortByFilter = allowedSortBy.includes(sortBy) ? sortBy : "createdAt";
    const allowedOrder = ["asc", "desc"];
    const orderFilter = allowedOrder.includes(order) ? order : "desc";
    orderBy = { [sortByFilter]: orderFilter };
  }

  const [data, total] = await Promise.all([
    prisma.hotel.findMany({
      skip,
      take: limit,
      where,
      orderBy,
      include: {
        room: true,
        hotelAmenities: { include: { amenities: true } },
        city: { select: { name: true } },
        propertyType: { select: { name: true } },
      },
    }),
    prisma.hotel.count({ where }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};