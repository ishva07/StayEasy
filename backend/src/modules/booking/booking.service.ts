import { BookingStatus } from "@prisma/client";
import prisma from "../../config/db";
import ApiError from "../../utils/ApiError";
import { CreateBooking } from "./booking.type";

export const bookingService = async (userId: string, data: CreateBooking) => {
  if (data.checkOut <= data.checkIn)
    throw new ApiError(
      404,
      "checkIn date can't be grater then checkout Date..",
    );

  const room = await prisma.room.findFirst({
    where: { id: data.roomId },
    select: { price: true },
  });

  if (!room) throw new ApiError(404, "No Room Exist..");

  const dateOverlapping = await prisma.booking.findFirst({
    where: {
      roomId: data.roomId,
      status: { not: "CANCELED" },
      checkIn: { lt: data.checkOut },
      checkOut: { gt: data.checkIn },
    },
  });

  if (dateOverlapping)
    throw new ApiError(400, "room already booked.. try different date");

  const dayCount = Math.ceil(
    (data.checkOut.getTime() - data.checkIn.getTime()) / (1000 * 60 * 60* 24),
  );
  const totalPrice = dayCount * Number(room.price);

  const newBooking = await prisma.booking.create({
    data: {
      roomId: data.roomId,
      checkIn: new Date(data.checkIn),
      checkOut: new Date(data.checkOut),
      userId,
      totalPrice,
    },
  });

  return newBooking;
};

export const cancelBookingService = async (
  bookingId: string,
  userId: string,
) => {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw new ApiError(404, "No Booking Found");

  if (booking.userId !== userId)
    throw new ApiError(404, "No Booking available for this user.");

  if (booking.status != "PENDING")
    throw new ApiError(400, "Only pending status room can be cancel");

  const updatedStatus = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELED" },
  });
  return updatedStatus;
};

export const changeBookingStatusService = async (
  bookingId: string,
  status: BookingStatus,
) => {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw new ApiError(404, "No Booking Found");

  const validTransitions: Record<string, string[]> = {
    PENDING: ["CONFIRMED", "CANCELED"],
    CONFIRMED: ["CHECKIN", "CANCELED"],
    CHECKIN: ["CHECKOUT"],
    CHECKOUT: [],
    CANCELED: [],
  };

  if (!validTransitions[booking.status]?.includes(status)) {
    throw new ApiError(
      400,
      `Cannot change status from ${booking.status} to ${status}`,
    );
  }

  const updatedStatus = await prisma.booking.update({
    where: { id: bookingId },
    data: { status },
  });
  return updatedStatus;
};

export const getMyBookingsService = async (
  userId: string,
  { page = 1, limit = 10, sortBy = "createdAt", order = "desc" },
) => {
  const skip = (page - 1) * limit;
  const allowedSortBy = [
    "createdAt",
    "checkIn",
    "checkOut",
    "totalPrice",
    "status",
  ];

  const sortByFilter = allowedSortBy.includes(sortBy) ? sortBy : "createdAt";

  const allowedOrderBy = ["desc", "asc"];
  const orderByFilter = allowedOrderBy.includes(order) ? order : "desc";

  const [data, total] = await Promise.all([
    prisma.booking.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: {
        [sortByFilter]: orderByFilter,
      },
      include: { room: { include: { hotel: { select: { name: true } } } } },
    }),
    prisma.booking.count({ where: { userId } }),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPage: Math.ceil(total / limit),
  };
};

export const getAllBookingsService = async (  { page = 1, limit = 10, sortBy = "createdAt", order = "desc" }) => {

  const skip = (page - 1) * limit;
  const allowedSortBy = [
    "createdAt",
    "checkIn",
    "checkOut",
    "totalPrice",
    "status",
  ];

  const sortByFilter = allowedSortBy.includes(sortBy) ? sortBy : "createdAt";

  const allowedOrderBy = ["desc", "asc"];
  const orderByFilter = allowedOrderBy.includes(order) ? order : "desc";

  const [data, total] = await Promise.all([
    prisma.booking.findMany({
      skip,
      take: limit,
      orderBy: {
        [sortByFilter]: orderByFilter,
      },
      include: { room: { include: { hotel: { select: { name: true } } } } },
    }),
    prisma.booking.count(),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPage: Math.ceil(total / limit),
  }
}


export const checkRoomAvailabilityService = async({roomId,checkIn,checkOut}:CreateBooking)=>{
  const roomExist = await prisma.room.findUnique({where:{id:roomId}})
  if(!roomExist)
    throw new ApiError(404, "No Room Exist ");

  const roomAvailable = await prisma.booking.findFirst({
    where:{
      roomId,
      status:{not:"CANCELED"},
      checkIn:{lt:checkOut},
      checkOut:{gt:checkIn}
    }
  });
  if(roomAvailable)
    return false;

  return true;
}