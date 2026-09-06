import { Router } from "express";
import validate from "../../middleware/validate.middleware";
import { bookingSchema, initiateBookingSchema } from "./booking.validate";
import { cancelBookingController, changeBookingStatusController, getAllBookingsController, getBookingByIdController, getBookingConfirmationStatusController, getBookingStatusTransitionsController, getMyBookingsController, initiateBookingController } from "./booking.controller";
import { authenticate } from '../../middleware/auth.middleware';
import { hasPermission } from "../../middleware/permission.middleware";
import { PERMISSIONS } from "../../constant/permissions";
import { writeLimiter } from "../../middleware/rateLimit.middleware";

const bookingRoute = Router();

bookingRoute.post("/initiate", authenticate(), hasPermission(PERMISSIONS.ADD_BOOKiNG), writeLimiter, validate(initiateBookingSchema), initiateBookingController);
bookingRoute.patch("/:bookingId/cancel",authenticate(),hasPermission(PERMISSIONS.CANCEL_BOOKING),cancelBookingController);
bookingRoute.put("/:bookingId/status",authenticate(),hasPermission(PERMISSIONS.CHANGE_BOOKiNG_STATUS),changeBookingStatusController);
bookingRoute.get("/myBookings",authenticate(),hasPermission(PERMISSIONS.VIEW_MY_BOOKING),getMyBookingsController);
bookingRoute.get("/",authenticate(),hasPermission(PERMISSIONS.VIEW_BOOKiNG),getAllBookingsController);
bookingRoute.get("/:bookingId", authenticate(),hasPermission(PERMISSIONS.VIEW_MY_BOOKING), getBookingByIdController);
bookingRoute.get("/confirmation-status/:holdId", authenticate(), getBookingConfirmationStatusController);
bookingRoute.get("/status-transitions", authenticate(), hasPermission(PERMISSIONS.CHANGE_BOOKiNG_STATUS),  getBookingStatusTransitionsController);

export default bookingRoute;