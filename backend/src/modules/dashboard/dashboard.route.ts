import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { getBookingStatusStatsController, getDashboardStatsController, getMonthlyBookingsController } from "./dashboard.controller";

const dashboardRoute = Router();

dashboardRoute.get("/stats", authenticate(), getDashboardStatsController);
dashboardRoute.get("/monthly-bookings", authenticate(), getMonthlyBookingsController);
dashboardRoute.get("/booking-status", authenticate(), getBookingStatusStatsController);

export default dashboardRoute;
