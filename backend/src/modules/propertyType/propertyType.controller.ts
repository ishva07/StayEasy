import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import ApiResponse from "../../utils/ApiResponse";
import { getPropertyTypeService } from "./propertyType.service";

export const getPropertyTypeController = asyncHandler(async(req:Request,res:Response)=>{
    const getPropertyType = await getPropertyTypeService();
    res.status(200).json(new ApiResponse(true, "City fetched Successfully", getPropertyType));
})