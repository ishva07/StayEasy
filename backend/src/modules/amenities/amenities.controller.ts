import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import {  getAllAmenitiesOptionService, getAllAmenitiesService } from "./amenities.service";
import ApiResponse from "../../utils/ApiResponse";

export const getAllAmenitiesController = asyncHandler(async(req:Request,res:Response)=>{
    const page = Number(req.query.page) ||1;
    const limit = Number(req.query.limit) ||10;
    const getAllAmenities = await getAllAmenitiesService({page,limit});
    res.status(200).json(new ApiResponse(true, "Amenities fetched successfully.",getAllAmenities))
})


export const getAllAmenitiesOptionsController = asyncHandler(async(req:Request,res:Response)=>{
    const getAllAmenities = await getAllAmenitiesOptionService();
    res.status(200).json(new ApiResponse(true, "Amenities fetched successfully.",getAllAmenities))
})
