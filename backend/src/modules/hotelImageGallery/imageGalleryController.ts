import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { getHotelImageGalleryService, updateHotelImageService } from "./imageGalleryService";
import ApiResponse from "../../utils/ApiResponse";

export const getHotelImageGalleryController = asyncHandler(async(req:Request,res:Response)=>{
    const hotelId = req.params.hotelId.toString();
    const getAllImagesOfHotel = await getHotelImageGalleryService(hotelId);
    res.status(200).json(new ApiResponse(true,"Images fetched successfully.",getAllImagesOfHotel));
})

export const updateHotelImageController = asyncHandler(async(req:Request,res:Response)=>{
    const hotelId = req.params.hotelId.toString();
    const urls = req.body;
    const updatedImagesOfHotel = await updateHotelImageService(hotelId,urls);
    res.status(200).json(new ApiResponse(true,"Images fetched successfully.",updatedImagesOfHotel));
})