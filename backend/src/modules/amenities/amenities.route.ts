import { Router } from "express";
import { authenticate } from '../../middleware/auth.middleware';
import { getAllAmenitiesController, getAllAmenitiesOptionsController } from "./amenities.controller";

const amenities = Router();

amenities.get("/",authenticate(),getAllAmenitiesController);
amenities.get("/options",authenticate(),getAllAmenitiesOptionsController);

export default amenities;