import { Router } from "express";
import { authenticate } from '../../middleware/auth.middleware';
import { getAllAmenitiesController, getAllAmenitiesOptionsController } from "./amenities.controller";
import { hasPermission } from "../../middleware/permission.middleware";
import { PERMISSIONS } from "../../constant/permissions";

const amenities = Router();

amenities.get("/",authenticate(),hasPermission(PERMISSIONS.VIEW_AMENITIES),getAllAmenitiesController);
amenities.get("/options",authenticate(),hasPermission(PERMISSIONS.VIEW_AMENITIES),getAllAmenitiesOptionsController);

export default amenities;