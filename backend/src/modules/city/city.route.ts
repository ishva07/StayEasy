import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { createCityController, deleteCityController, editCityController, getCityController } from "./city.controller";
import { hasPermission } from '../../middleware/permission.middleware';
import validate from '../../middleware/validate.middleware';
import { createCitySchema, editCitySchema } from "./city.validation";
import { PERMISSIONS } from "../../constant/permissions";
import { uploads } from '../../middleware/uploads.middleware';

const cityRoute = Router();

cityRoute.post("/",authenticate(),uploads.single("cityImage"),validate(createCitySchema),createCityController);
cityRoute.put("/:cityId",authenticate(),hasPermission(PERMISSIONS.EDIT_CITY),uploads.single("cityImage"),validate(editCitySchema),editCityController);
cityRoute.delete("/:cityId",authenticate(),hasPermission(PERMISSIONS.DELETE_CITY),deleteCityController);
cityRoute.get("/",getCityController);

export default cityRoute;