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
        return tx.hotel.findUnique({
          where: { id: hotel.id },
          include: { imageGallery: true },
        });
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

// ---- Shared param shape (import this in controller too, instead of duplicating) ----
export interface GetHotelParams {
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
  minRating?: string;
  minPrice?: string;
  maxPrice?: string; 
}
 
function buildHotelFilters({
  search,
  featured,
  amenityIds,
  city,
  propertyType,
  minRating,
}: {
  search?: string;
  featured?: string;
  amenityIds?: string;
  city?: string;
  propertyType?: string;
  minRating?: string;
}) {
  const where: any = {};
 
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { city: { name: { contains: search, mode: "insensitive" } } },
    ];
  }
 
  if (featured === "true") where.isFeatured = true;
  if (city) where.cityId = city;
  if (propertyType) where.propertyTypeId = propertyType;
 
  if (amenityIds) {
    const ids = amenityIds.split(",").filter(Boolean);
    if (ids.length > 0) {
      where.AND = ids.map((id) => ({
        hotelAmenities: { some: { amenitiesId: id } },
      }));
    }
  }
 
  if (minRating) {
    const rating = Number(minRating);
    if (!Number.isNaN(rating)) {
      where.avgReview = { gte: rating };
    }
  }
 
  return where;
}
 
function buildRoomFilters({
  guests,
  checkIn,
  checkOut,
  minPrice,
  maxPrice,
}: {
  guests?: string;
  checkIn?: string;
  checkOut?: string;
  minPrice?: string;
  maxPrice?: string;
}) {
  const roomWhere: any = {};

  if (guests) {
    roomWhere.capacity = { gte: Number(guests) };
  }

  if (checkIn && checkOut) {
    roomWhere.booking = {
      none: {
        status: { not: "CANCELED" },
        checkIn: { lt: new Date(checkOut) },
        checkOut: { gt: new Date(checkIn) },
      },
    };
  }

  if (minPrice || maxPrice) {
    let min = minPrice && !Number.isNaN(Number(minPrice)) ? Number(minPrice) : undefined;
    let max = maxPrice && !Number.isNaN(Number(maxPrice)) ? Number(maxPrice) : undefined;

    if (min !== undefined && max !== undefined && min > max) {
      [min, max] = [max, min];
    }

    roomWhere.price = {
      ...(min !== undefined && { gte: min }),
      ...(max !== undefined && { lte: max }),
    };
  }

  return roomWhere;
}
 
// ---- 3. Decides how results should be sorted ----
function buildOrderBy(
  sortBy: string,
  order: string
) {
  if (sortBy === "popular") {
    return [{ reviewCount: "desc" as const }, { avgReview: "desc" as const }];
  }
 
  const allowedSortBy = ["name", "createdAt"] as const;
  const allowedOrder = ["asc", "desc"] as const;
 
  const safeSortBy = (allowedSortBy as readonly string[]).includes(sortBy)
    ? (sortBy as (typeof allowedSortBy)[number])
    : "createdAt";
  const safeOrder = (allowedOrder as readonly string[]).includes(order)
    ? (order as (typeof allowedOrder)[number])
    : "desc";
 
  return { [safeSortBy]: safeOrder };
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
  minRating,
  minPrice,
  maxPrice,
}: GetHotelParams) => {
  const skip = (page - 1) * limit;
 
  const where = buildHotelFilters({ search, featured, amenityIds, city, propertyType, minRating });
  const roomWhere = buildRoomFilters({ guests, checkIn, checkOut, minPrice, maxPrice });
 
  if (Object.keys(roomWhere).length > 0) {
    where.room = { some: roomWhere };
  }
 
  const orderBy = buildOrderBy(sortBy, order);
 
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
 