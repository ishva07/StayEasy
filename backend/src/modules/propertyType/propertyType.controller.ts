import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import ApiResponse from "../../utils/ApiResponse";
import {
    createPropertyTypeService,
    deletePropertyTypeService,
    editPropertyTypeService,
    getAllPropertyTypeService,
    getPropertyTypeService,
} from "./propertyType.service";

export const createPropertyTypeController = asyncHandler(async(req:Request,res:Response)=>{
    const name = req.body.name;
    const propertyTypeImage = req.file?.path;
    const newPropertyType = await createPropertyTypeService(name, propertyTypeImage);
    res.status(201).json(new ApiResponse(true, "Property type created successfully", newPropertyType));
});

export const editPropertyTypeController = asyncHandler(async(req:Request,res:Response)=>{
    const name = req.body.name;
    const propertyTypeId = req.params.propertyTypeId.toString();
    const propertyTypeImage = req.file?.path;
    const updatedPropertyType = await editPropertyTypeService(propertyTypeId, name, propertyTypeImage);
    res.status(200).json(new ApiResponse(true, "Property type updated successfully", updatedPropertyType));
});

export const deletePropertyTypeController = asyncHandler(async(req:Request,res:Response)=>{
    const propertyTypeId = req.params.propertyTypeId.toString();
    const deletedPropertyType = await deletePropertyTypeService(propertyTypeId);
    res.status(200).json(new ApiResponse(true, "Property type deleted successfully", deletedPropertyType));
});

export const getPropertyTypeController = asyncHandler(async(req:Request,res:Response)=>{
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const sortBy = (req.query.sortBy || "name").toString();
    const order = (req.query.order || "asc").toString();

    const getPropertyType = await getPropertyTypeService({ page, limit, sortBy, order });
    res.status(200).json(new ApiResponse(true, "Property type fetched successfully", getPropertyType));
})

export const getAllPropertyTypeController = asyncHandler(async(req:Request,res:Response)=>{
    const propertyTypes = await getAllPropertyTypeService();
    res.status(200).json(new ApiResponse(true, "Property type list fetched successfully", propertyTypes));
})