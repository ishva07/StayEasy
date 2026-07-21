import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { createHotelsService, deleteHotelService, editHotelsService, getHotelsByIdService, getHotelService } from "./hotels.service";
import ApiResponse from "../../utils/ApiResponse";

export const createHotelController = asyncHandler(async (req: Request, res: Response) => {
  const { name, description, city, address, isFeatured, amenitiesIds } = req.body;

  const files = req.files as {
    heroImage?: Express.Multer.File[];
    imageGallery?: Express.Multer.File[];
  };

  const heroImage = files?.heroImage?.[0] ? `/uploads/${files.heroImage[0].filename}` : "";
  const imageGallery = files?.imageGallery?.length
    ? files.imageGallery.map((file) => `/uploads/${file.filename}`)
    : [];

  const newHotel = await createHotelsService({
    name, description, city, address, isFeatured, heroImage, amenitiesIds, imageGallery,
  });

  res.status(201).json(new ApiResponse(true, "hotel created successfully", newHotel));
});

export const editHotelController = asyncHandler(async(req:Request,res:Response)=>{
    const id = req.params.id.toString();
    const {name,description,city,address,isFeatured} = req.body;
    const heroImage = req.file? `/uploads/${req.file.filename}` : undefined;

    const updatedHotel = await editHotelsService(id,{name,description,city,address,isFeatured,heroImage})
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
