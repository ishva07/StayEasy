import { Router } from "express";
import { getPropertyTypeController } from "./propertyType.controller";

const propertyTypeRoute = Router();

propertyTypeRoute.get("/",getPropertyTypeController);

export default propertyTypeRoute;
