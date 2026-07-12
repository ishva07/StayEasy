import {Router} from "express"
import hotelRoute from "../modules/hotels/hotel.route";
import roomRoute from "../modules/rooms/room.route";
import authRoute from "../modules/auth/auth.route";

const route = Router();

route.use("/hotels",hotelRoute);
route.use("/rooms",roomRoute);
route.use("/auth",authRoute);

export default route;