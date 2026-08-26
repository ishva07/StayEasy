import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { createCityService, deleteCityService, editCityService, getCityService, getAllCityService } from "./city.service";
import ApiResponse from "../../utils/ApiResponse";

export const createCityController = asyncHandler(async(req:Request,res:Response)=>{
    const name = req.body.name;
    const cityImage = req.file? req.file.path : undefined
    const newCity = await createCityService(name,cityImage);
    res.status(201).json(new ApiResponse(true, "City created Successfully", newCity));
})

export const editCityController = asyncHandler(async(req:Request,res:Response)=>{
    const name = req.body.name;
    const cityId = req.params.cityId.toString();
    const cityImage = req.file? req.file.path : undefined
    const updatedCity = await editCityService(cityId,name,cityImage);
    res.status(200).json(new ApiResponse(true, "City updated Successfully", updatedCity));
})

export const deleteCityController = asyncHandler(async(req:Request,res:Response)=>{
    const cityId = req.params.cityId.toString();
    const deletedCity = await deleteCityService(cityId);
    res.status(200).json(new ApiResponse(true, "City deleted Successfully", deletedCity));
})

export const getCityController = asyncHandler(async(req:Request,res:Response)=>{
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const sortBy = (req.query.sortBy || "name").toString();
    const order = (req.query.order || "asc").toString();

    const getCity = await getCityService({ page, limit, sortBy, order });
    res.status(200).json(new ApiResponse(true, "City fetched Successfully", getCity));
})

export const getAllCityController = asyncHandler(async(req:Request,res:Response)=>{
    const cities = await getAllCityService();
    res.status(200).json(new ApiResponse(true, "City list fetched successfully", cities));
})