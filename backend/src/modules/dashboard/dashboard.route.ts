import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { getBookingStatusStatsController, getDashboardStatsController, getMonthlyBookingsController } from "./dashboard.controller";
import { PERMISSIONS } from '../../constant/permissions';
import { hasPermission } from "../../middleware/permission.middleware";

const dashboardRoute = Router();

dashboardRoute.get("/stats", authenticate(), hasPermission(PERMISSIONS.VIEW_DASHBOARD), getDashboardStatsController);
dashboardRoute.get("/monthly-bookings", authenticate(), hasPermission(PERMISSIONS.VIEW_DASHBOARD), getMonthlyBookingsController);
dashboardRoute.get("/booking-status", authenticate(), hasPermission(PERMISSIONS.VIEW_DASHBOARD), getBookingStatusStatsController);

export default dashboardRoute;
