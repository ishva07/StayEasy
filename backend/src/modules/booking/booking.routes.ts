import { Router } from "express";
import validate from "../../middleware/validate.middleware";
import { bookingSchema } from "./booking.validate";
import { bookingController, cancelBookingController, changeBookingStatusController, checkRoomAvailabilityController, getAllBookingsController, getMyBookingsController } from "./booking.controller";
import { authenticate } from '../../middleware/auth.middleware';
import { hasPermission } from "../../middleware/permission.middleware";
import { PERMISSIONS } from "../../constant/permissions";

const bookingRoute = Router();

bookingRoute.post("/",authenticate(),hasPermission(PERMISSIONS.ADD_BOOKiNG),validate(bookingSchema),bookingController);
bookingRoute.patch("/:bookingId/cancel",authenticate(),hasPermission(PERMISSIONS.CANCEL_BOOKING),cancelBookingController);
bookingRoute.put("/:bookingId/status",authenticate(),hasPermission(PERMISSIONS.CHANGE_BOOKiNG_STATUS),changeBookingStatusController);
bookingRoute.get("/myBookings",authenticate(),hasPermission(PERMISSIONS.VIEW_MY_BOOKING),getMyBookingsController);
bookingRoute.get("/",authenticate(),hasPermission(PERMISSIONS.VIEW_BOOKiNG),getAllBookingsController);
bookingRoute.get("/check/available",authenticate(),checkRoomAvailabilityController)

export default bookingRoute;