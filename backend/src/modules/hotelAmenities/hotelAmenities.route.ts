import { Router } from "express";
import { updateAmenitiesController } from "./hotelAmenities.controller";
import { authenticate } from '../../middleware/auth.middleware';
import { hasPermission } from "../../middleware/permission.middleware";
import { PERMISSIONS } from "../../constant/permissions";

const hotelAmenities = Router();

hotelAmenities.put("/:hotelId/amenities",authenticate(),hasPermission(PERMISSIONS.EDIT_AMENITIES),updateAmenitiesController)

export default hotelAmenities;