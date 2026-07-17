import { Router } from "express";
import { updateAmenitiesController } from "./hotelAmenities.controller";
import { authenticate } from '../../middleware/auth.middleware';

const hotelAmenities = Router();

hotelAmenities.put("/:hotelId/amenities",authenticate(),updateAmenitiesController)

export default hotelAmenities;