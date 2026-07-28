import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { getHotelImageGalleryService, updateHotelImageService } from "./imageGalleryService";
import ApiResponse from "../../utils/ApiResponse";
import ApiError from "../../utils/ApiError";

export const getHotelImageGalleryController = asyncHandler(async(req:Request,res:Response)=>{
    const hotelId = req.params.hotelId.toString();
    const getAllImagesOfHotel = await getHotelImageGalleryService(hotelId);
    res.status(200).json(new ApiResponse(true,"Images fetched successfully.",getAllImagesOfHotel));
})

export const updateHotelImageController = asyncHandler(async (req: Request, res: Response) => {
    const hotelId = req.params.hotelId.toString();

    const files = req.files as Express.Multer.File[];
    if (!files?.length) {
        throw new ApiError(400, "At least one image is required");
    }

    const urls = files.map((file) => `/uploads/${file.filename}`);

    const updatedImagesOfHotel = await updateHotelImageService(hotelId, urls);
    res.status(200).json(new ApiResponse(true, "Gallery images updated successfully.", updatedImagesOfHotel));
});