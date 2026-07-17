import {Router} from "express"
import hotelRoute from "../modules/hotels/hotel.route";
import roomRoute from "../modules/rooms/room.route";
import authRoute from "../modules/auth/auth.route";
import bookingRoute from "../modules/booking/booking.routes";
import hotelAmenities from "../modules/hotelAmenities/hotelAmenities.route";
import amenities from "../modules/amenities/amenities.route";

const route = Router();

route.use("/auth",authRoute);
route.use("/hotels",hotelRoute);
route.use("/hotels",roomRoute);
route.use("/bookings",bookingRoute);
route.use("/hotels",hotelAmenities);
route.use("/amenities",amenities);

export default route;