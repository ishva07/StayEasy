import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { createRoomService, deleteRoomService, editRoomService, getRoomByIdService, getRoomService } from "./rooms.service";
import ApiResponse from "../../utils/ApiResponse";


export const createRoomsController = asyncHandler(async(req:Request,res:Response)=>{
    const {name,capacity,price,hotelId} = req.body;
    const roomImage = req.file ? `/uploads/${req.file.filename}` : null;
    const newRoom = await createRoomService({name,capacity,hotelId,price,roomImage});
    res.status(201).json(new ApiResponse(true,"Room Created Successfully",newRoom));
})

export const updateRoomController  = asyncHandler(async(req:Request,res:Response)=>{
    const id = req.params.id.toString();
    const data = req.body;
    const updatedRoom = await editRoomService(id,data);
    res.status(200).json(new ApiResponse(true,"Room Updated Successfully",updatedRoom));
})

export const deleteRoomController = asyncHandler(async(req:Request,res:Response)=>{
    const id = req.params.id.toString();
    const deletedRoom = await deleteRoomService(id);
    res.status(200).json(new ApiResponse(true,"Room Deleted Successfully.", deletedRoom));
})


export const getRoomByIdController = asyncHandler(async(req:Request,res:Response)=>{
    const id = req.params.id.toString();
    const getRoom = await getRoomByIdService(id);
    res.status(200).json(new ApiResponse(true,"Room Fetched Successfully.", getRoom));
})


export const getRoomController = asyncHandler(async(req:Request,res:Response)=>{
    const hotelId = req.params.id.toString();
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 10);
    const sortBy = (req.query.sortBy || "createdAt").toString();
    const order = (req.query.order || "desc").toString();
    const search = (req.query.search || "").toString();
    
    const getRooms = await getRoomService(hotelId,{page,limit,sortBy,order,search,});
    res.status(200).json(new ApiResponse(true,"Room fetched Successfully.", getRooms));
})