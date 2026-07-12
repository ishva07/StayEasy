import {Router} from "express"
import { createHotelController, deletedHotelController, editHotelController, getHotelByIdController, getHotelController } from "./hotel.controller";
import validate from "../../middleware/validate.middleware";
import { createHotelSchema, editHotelSchema } from "./hotels.validate";
import { authenticate } from "../../middleware/auth.middleware";
import { hasPermission } from '../../middleware/permission.middleware';
import { PERMISSIONS } from "../../constant/permissions";

const hotelRoute = Router();

hotelRoute.post("/",validate(createHotelSchema),createHotelController);
hotelRoute.patch("/:id",validate(editHotelSchema),editHotelController);
hotelRoute.delete("/:id",deletedHotelController);
hotelRoute.get("/:id",getHotelByIdController);
hotelRoute.get("/",getHotelController);

export default hotelRoute;