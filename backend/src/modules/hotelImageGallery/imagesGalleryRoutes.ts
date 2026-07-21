import { Router } from "express";
import { authenticate } from '../../middleware/auth.middleware';
import { getHotelImageGalleryController, updateHotelImageController } from "./imageGalleryController";

const hotelImages = Router();

hotelImages.get("/:hotelId",authenticate(),getHotelImageGalleryController);
hotelImages.put("/:hotelId/images",authenticate(),updateHotelImageController);

export default hotelImages;