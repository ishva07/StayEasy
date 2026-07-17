import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import {   updateAmenitiesService } from "./hotelAmenities.service";
import ApiResponse from "../../utils/ApiResponse";
import ApiError from "../../utils/ApiError";

export const updateAmenitiesController = asyncHandler(async (req: Request, res: Response) => {
  const hotelId = req.params.hotelId as string;
  const { amenitiesId } = req.body;

  if (!Array.isArray(amenitiesId)) {
    throw new ApiError(400, "amenitiesId must be an array of strings.");
  }

  const result = await updateAmenitiesService(hotelId, amenitiesId);
  res.status(200).json(new ApiResponse(true, "Amenities updated successfully.", result));
});