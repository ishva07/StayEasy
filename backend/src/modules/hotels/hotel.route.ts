import {Router} from "express"
import { createHotelController, deletedHotelController, editHotelController, getHotelByIdController, getHotelController } from "./hotel.controller";
import validate from "../../middleware/validate.middleware";
import { createHotelSchema, editHotelSchema } from "./hotels.validate";
import { uploads } from '../../middleware/uploads.middleware';
import { authenticate } from '../../middleware/auth.middleware';
import { hasPermission } from '../../middleware/permission.middleware';
import { PERMISSIONS } from "../../constant/permissions";

const hotelRoute = Router();

hotelRoute.post("/",authenticate(),hasPermission(PERMISSIONS.ADD_HOTEL),uploads.fields([{name:"heroImage",maxCount:1},{name:"imageGallery",maxCount:10}]),validate(createHotelSchema),createHotelController);
hotelRoute.patch("/:id",authenticate(),hasPermission(PERMISSIONS.EDIT_HOTEL),uploads.single("heroImage"),validate(editHotelSchema),editHotelController);
hotelRoute.delete("/:id",authenticate(),hasPermission(PERMISSIONS.DELETE_HOTEL),deletedHotelController);
hotelRoute.get("/:id",getHotelByIdController);
hotelRoute.get("/", getHotelController);

export default hotelRoute;