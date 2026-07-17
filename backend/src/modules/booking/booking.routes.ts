import { Router } from "express";
import validate from "../../middleware/validate.middleware";
import { bookingSchema } from "./booking.validate";
import { bookingController, cancelBookingController, changeBookingStatusController, checkRoomAvailabilityController, getAllBookingsController, getMyBookingsController } from "./booking.controller";
import { authenticate } from '../../middleware/auth.middleware';

const bookingRoute = Router();

bookingRoute.post("/",authenticate(),validate(bookingSchema),bookingController);
bookingRoute.patch("/:bookingId/cancel",authenticate(),cancelBookingController);
bookingRoute.put("/:bookingId/status",authenticate(),changeBookingStatusController);
bookingRoute.get("/myBookings",authenticate(),getMyBookingsController);
bookingRoute.get("/",authenticate(),getAllBookingsController);
bookingRoute.get("/check/available",authenticate(),checkRoomAvailabilityController)

export default bookingRoute;