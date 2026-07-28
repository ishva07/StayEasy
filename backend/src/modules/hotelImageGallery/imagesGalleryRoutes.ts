import { Router } from "express";
import { authenticate } from '../../middleware/auth.middleware';
import { getHotelImageGalleryController, updateHotelImageController } from "./imageGalleryController";
import { uploads } from "../../middleware/uploads.middleware";

const hotelImages = Router();

hotelImages.get("/:hotelId",authenticate(),getHotelImageGalleryController);
hotelImages.put("/:hotelId/images",authenticate(),uploads.array("imageGallery", 10),updateHotelImageController);

export default hotelImages;