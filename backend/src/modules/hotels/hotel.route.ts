import {Router} from "express"
import { createHotelController, deletedHotelController, editHotelController, getHotelByIdController, getHotelController } from "./hotel.controller";
import validate from "../../middleware/validate.middleware";
import { createHotelSchema, editHotelSchema } from "./hotels.validate";
import { uploads } from '../../middleware/uploads.middleware';

const hotelRoute = Router();

hotelRoute.post("/",uploads.fields([{name:"heroImage",maxCount:1},{name:"imageGallery",maxCount:10}]),validate(createHotelSchema),createHotelController);
hotelRoute.patch("/:id",uploads.single("heroImage"),validate(editHotelSchema),editHotelController);
hotelRoute.delete("/:id",deletedHotelController);
hotelRoute.get("/:id",getHotelByIdController);
hotelRoute.get("/",getHotelController);

export default hotelRoute;