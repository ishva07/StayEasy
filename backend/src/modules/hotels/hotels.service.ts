import prisma from "../../config/db";
import ApiError from "../../utils/ApiError";
import { CreateHotelInterface, UpdateHotelInterface } from "./hotels.types";

export const createHotelsService = async(data:CreateHotelInterface) =>{
    const {amenitiesIds, ...hotelData} = data;

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
        return hotel;
    })
    return newHotel;
}

export const editHotelsService=async(id:string, data:UpdateHotelInterface)=>{
    const hotelId = await prisma.hotel.findUnique({where:{id}})

    if(!hotelId)
        throw new ApiError(404,"No hotel available on given id")

    if(data.name){
        const hotelExist = await prisma.hotel.findUnique({where:{id,name:data.name}})
    if(hotelExist)
        throw new ApiError(409, "Hotel name already exist on given id .. try different name")
    }

    const updatedHotel = await prisma.hotel.update({where:{id},data});
    return updatedHotel;
}

export const deleteHotelService = async(id:string)=>{
     const hotelId = await prisma.hotel.findUnique({where:{id}})

    if(!hotelId)
        throw new ApiError(404,"No hotel available on given id")

    const deletedHotel = await prisma.hotel.delete({where:{id}})
    return deletedHotel;
}

export const getHotelsByIdService = async(id:string)=>{
    const hotelsById = await prisma.hotel.findUnique({where:{id}});
    return hotelsById;
}

export const getHotelService = async({page=1,limit=10,sortBy="createdAt",order="desc",search=""})=>{
    const skip = (page-1)*limit;

//    const where = search ? {
//     OR:[
//         {name:{contains:search,mode:"insensitive" as const}},
//         {description:{contains:search,mode:"insensitive" as const}}
//     ]
//    } : {}

    const [ data, total] = await Promise.all([
        prisma.hotel.findMany({
            skip,
            take:limit,
            orderBy:{[sortBy]:order}
        }),
        prisma.hotel.count()
    ])

    return{
        data,
        total,
        page,
        limit,
        totalPages:Math.ceil(total/limit)
    }
}