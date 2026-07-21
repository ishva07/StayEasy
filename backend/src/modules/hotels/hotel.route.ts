import {Router} from "express"
import { createHotelController, deletedHotelController, editHotelController, getHotelByIdController, getHotelController } from "./hotel.controller";
import validate from "../../middleware/validate.middleware";
import { createHotelSchema, editHotelSchema } from "./hotels.validate";
import { uploads } from '../../middleware/uploads.middleware';
import { authenticate } from '../../middleware/auth.middleware';

const hotelRoute = Router();

hotelRoute.post("/",authenticate(),uploads.fields([{name:"heroImage",maxCount:1},{name:"imageGallery",maxCount:10}]),validate(createHotelSchema),createHotelController);
hotelRoute.patch("/:id",authenticate(),uploads.single("heroImage"),validate(editHotelSchema),editHotelController);
hotelRoute.delete("/:id",authenticate(),deletedHotelController);
hotelRoute.get("/:id",authenticate(),getHotelByIdController);
hotelRoute.get("/",authenticate(),getHotelController);

export default hotelRoute;