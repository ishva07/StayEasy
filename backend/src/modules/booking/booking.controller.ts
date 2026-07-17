import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import {
  bookingService,
  cancelBookingService,
  changeBookingStatusService,
  checkRoomAvailabilityService,
  getAllBookingsService,
  getMyBookingsService,
} from "./booking.service";
import ApiResponse from "../../utils/ApiResponse";

export const bookingController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user.id;
    const data = req.body;
    const newBooking = await bookingService(userId, data);
    res
      .status(201)
      .json(new ApiResponse(true, "Booking created Successfully.", newBooking));
  },
);

export const cancelBookingController = asyncHandler(
  async (req: Request, res: Response) => {
    const bookingId = req.params.bookingId.toString();
    const userId = req.user.id;
    const canceledBooking = await cancelBookingService(bookingId, userId);
    res
      .status(200)
      .json(
        new ApiResponse(true, "Booking canceled Successfully.", canceledBooking),
      );
  },
);

export const changeBookingStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    const bookingId = req.params.bookingId.toString();
    const status = req.body;

    const changedStatus = await changeBookingStatusService(bookingId, status);
    res
      .status(200)
      .json(
        new ApiResponse(true, "Booking changed Successfully.", changedStatus),
      );
  },
);


export const getMyBookingsController = asyncHandler(async(req:Request,res:Response)=>{
    const userId = req.user.id.toString();
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const sortBy = (req.query.sortBy)?.toString() || "createdAt";
    const order = (req.query.order)?.toString()  || "desc";
    const userBookings = await getMyBookingsService(userId,{page,limit,sortBy,order});
     res
      .status(200)
      .json(
        new ApiResponse(true, "User Booking Fetched Successfully.", userBookings),
      );
})

export const getAllBookingsController = asyncHandler(async(req:Request,res:Response)=>{
     const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const sortBy = (req.query.sortBy)?.toString() || "createdAt";
    const order = (req.query.order)?.toString()  || "desc";
    const bookings = await getAllBookingsService({page,limit,sortBy,order});
    res.status(200).json(new ApiResponse(true,"Get All Records successfully.",bookings))
})

export const checkRoomAvailabilityController = asyncHandler(async(req:Request,res:Response)=>{
  const data = req.body;
  const roomAvailable = await checkRoomAvailabilityService(data);
  res.status(200).json(new ApiResponse(true,"room Availability status.",roomAvailable));
})