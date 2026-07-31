import { Router } from "express";
import { authenticate } from '../../middleware/auth.middleware';
import { getHotelImageGalleryController, updateHotelImageController } from "./imageGalleryController";
import { uploads } from "../../middleware/uploads.middleware";
import { hasPermission } from '../../middleware/permission.middleware';
import { PERMISSIONS } from "../../constant/permissions";

const hotelImages = Router();

hotelImages.get("/:hotelId",getHotelImageGalleryController);
hotelImages.put("/:hotelId/images",authenticate(),hasPermission(PERMISSIONS.EDIT_IMAGE_GALLERY),uploads.array("imageGallery", 10),updateHotelImageController);

export default hotelImages;