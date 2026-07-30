import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import {
    getBookingStatusStatsService,
  getDashboardStatsService,
  getMonthlyBookingsService,
} from "./dashboard.service";
import ApiResponse from "../../utils/ApiResponse";

export const getDashboardStatsController = asyncHandler(
  async (req: Request, res: Response) => {
    const stats = await getDashboardStatsService();
    res
      .status(200)
      .json(
        new ApiResponse(true, "Dashboard stats fetched successfully.", stats),
      );
  },
);

export const getMonthlyBookingsController = asyncHandler(
  async (req: Request, res: Response) => {
    const year = req.query.year ? Number(req.query.year) : undefined;
    const data = await getMonthlyBookingsService(year);
    res
      .status(200)
      .json(
        new ApiResponse(true, "Monthly bookings fetched successfully.", data),
      );
  },
);

export const getBookingStatusStatsController = asyncHandler(async (req: Request, res: Response) => {
  const data = await getBookingStatusStatsService();
  res.status(200).json(new ApiResponse(true, "Booking status stats fetched successfully.", data));
});