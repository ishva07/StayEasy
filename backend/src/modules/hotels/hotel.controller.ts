import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { createHotelsService, deleteHotelService, editHotelsService, getHotelsByIdService, getHotelService } from "./hotels.service";
import ApiResponse from "../../utils/ApiResponse";

export const createHotelController = asyncHandler(async(req:Request,res:Response)=>{
    const data = req.body;
    const newHotel = await createHotelsService(data);
    res.status(201).json(new ApiResponse(true,"hotel created successfully",newHotel))
})

export const editHotelController = asyncHandler(async(req:Request,res:Response)=>{
    const id = req.params.id.toString();
    const data= req.body;

    const updatedHotel = await editHotelsService(id,data)
    res.status(200).json(new ApiResponse(true,"hotel updated successfully",updatedHotel));
})

export const deletedHotelController = asyncHandler(async(req:Request,res:Response)=>{
        const id = req.params.id.toString();
    const deletedHotel = await deleteHotelService(id)
    res.status(200).json(new ApiResponse(true,"hotel deleted successfully",deletedHotel));

})

export const getHotelByIdController = asyncHandler(async(req:Request,res:Response)=>{
        const id = req.params.id.toString();    
    const getHotelById = await getHotelsByIdService(id)
    res.status(200).json(new ApiResponse(true,"Hotel fetched successfully.",getHotelById))
})

export const getHotelController = asyncHandler(async(req:Request,res:Response)=>{

    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const sortBy = (req.query.sortBy || "createdAt").toString();
    const order = (req.query.order || "desc").toString();
    const search = (req.query.search || "").toString();

    const getHotels = await getHotelService({page,limit,sortBy,order,search})
    res.status(200).json(new ApiResponse(true,"Hotel fetched successfully.",getHotels))
})
