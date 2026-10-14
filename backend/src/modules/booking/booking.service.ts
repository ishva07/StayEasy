import { BookingStatus } from "@prisma/client";
import prisma from "../../config/db";
import ApiError from "../../utils/ApiError";
import { CreateBooking } from "./booking.type";
import { acquireBookingHold, releaseBookingHold } from "./bookingHold";
import razorpayClient from "../../config/razorpay";
import { issueRefund } from "../payments/razorpayRefund";
import { sendEmail } from "../../utils/mail";
import { bookingCancelledTemplate, refundFailedTemplate } from "../../utils/emailTemplates";

export const initiateBookingService = async (
  userId: string,
  data: CreateBooking,
) => {
  if (data.checkOut <= data.checkIn)
    throw new ApiError(
      400,
      "checkIn date can't be greater than checkout date..",
    );

  const room = await prisma.room.findFirst({
    where: { id: data.roomId },
     select: { price: true, capacity: true },
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

  const hold = await acquireBookingHold(
    data.roomId,
    data.checkIn,
    data.checkOut,
    userId,
  );
  if (!hold.acquired) {
    throw new ApiError(
      409,
      "This room is currently being booked by someone else. Please try again shortly.",
    );
  }

  const dayCount = Math.ceil(
    (data.checkOut.getTime() - data.checkIn.getTime()) / (1000 * 60 * 60 * 24),
  );
  const totalPrice = dayCount * Number(room.price);

  let order;
  try {
    order = await razorpayClient.orders.create({
      amount: Math.round(totalPrice * 100),
      currency: "INR",
      receipt: hold.holdId,
      notes: {
        roomId: data.roomId,
        userId,
        checkIn: data.checkIn.toISOString(),
        checkOut: data.checkOut.toISOString(),
        guests: String(data.guests),
        holdId: hold.holdId!,
      },
    });
  } catch (err) {
    await releaseBookingHold(data.roomId, data.checkIn, data.checkOut);
    console.error("Razorpay order creation failed:", err);
    throw new ApiError(502, "Unable to initiate payment. Please try again.");
  }

  const quotedAmount = Number(order.amount) / 100;
  try {
    await prisma.payment.create({
      data: {
        holdId: hold.holdId,
        userId,
        razorpayOrderId: order.id,
        amount: quotedAmount,
        status: "CREATED",
      },
    });
  } catch (err) {
    await releaseBookingHold(data.roomId, data.checkIn, data.checkOut);
    console.error(
      `Failed to save checkout payment for Razorpay order ${order.id}:`,
      err,
    );
    throw new ApiError(502, "Unable to initiate payment. Please try again.");
  }

  return {
    holdId: hold.holdId,
    roomId: data.roomId,
    checkIn: data.checkIn,
    checkOut: data.checkOut,
    totalPrice: quotedAmount,
    razorpayOrderId: order.id,
    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
  };
};

 export const validTransitions: Record<string, string[]> = {
    PENDING: [],  
    CONFIRMED: ["CHECKIN", "CANCELED"],
    CHECKIN: ["CHECKOUT"],
    CHECKOUT: [],
    CANCELED: [],
  };

  export const getBookingStatusTransitionsService = () => validTransitions;

export const changeBookingStatusService = async (
  bookingId: string,
  status: BookingStatus,
) => {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw new ApiError(404, "No Booking Found");

  if (status === "PENDING") {
    throw new ApiError(400, "PENDING is not a valid target status.");
  }

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
      orderBy: { [sortByFilter]: orderByFilter },
      include: {
        room: { include: { hotel: { select: { name: true, city: true } } } },
        review: true,
        payment: { select: { status: true, refundStatus: true } }, 
      },
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

export const getAllBookingsService = async ({
  page = 1,
  limit = 10,
  sortBy = "createdAt",
  order = "desc",
}) => {
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
      include: { 
        room: { include: { hotel: { select: { name: true } } } },
          payment: { select: { status: true, refundStatus: true } }, 
    },
    }),
    prisma.booking.count(),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const getBookingByIdService = async (
  bookingId: string,
  userIds: string,
) => {
  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, userId: userIds },
    include: {
      room: { include: { hotel: { select: { name: true, city: true } } } },
    },
  });
  if (!booking) throw new ApiError(404, "not booking found");
  return booking;
};

export type BookingConfirmationStatus =
  | { status: "PENDING" }
  | { status: "CONFIRMED"; bookingId: string }
  | { status: "REFUND_PROCESSING" }
  | { status: "REFUND_COMPLETED" }
  | { status: "REFUND_FAILED" };

export const getBookingConfirmationStatusService = async (
  holdId: string,
): Promise<BookingConfirmationStatus> => {
  const payment = await prisma.payment.findUnique({
    where: { holdId },
    select: { bookingId: true, refundStatus: true, status: true },
  });

  if (!payment || payment.status !== "PAID") {
    return { status: "PENDING" };
  }

  if (payment.bookingId) {
    return { status: "CONFIRMED", bookingId: payment.bookingId };
  }

  switch (payment.refundStatus) {
    case "COMPLETED":
      return { status: "REFUND_COMPLETED" };
    case "FAILED":
      return { status: "REFUND_FAILED" };
    default:
      return { status: "REFUND_PROCESSING" };
  }
};

export const cancelBookingService = async (
  bookingId: string,
  userId: string,
) => {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      payment: true,
      room: { include: { hotel: { select: { name: true } } } },
      user: { select: { email: true, firstName: true } },
    },
  });
  if (!booking) throw new ApiError(404, "No Booking Found");

  if (booking.userId !== userId)
    throw new ApiError(404, "No Booking available for this user.");

  if (booking.status !== "CONFIRMED") {
    throw new ApiError(
      400,
      "Only confirmed bookings can be cancelled. This booking cannot be cancelled in its current state.",
    );
  }

  if (new Date() >= booking.checkIn) {
    throw new ApiError(400, "Cannot cancel after check-in has passed.");
  }

  if (!booking.payment || !booking.payment.razorpayPaymentId) {
    throw new ApiError(
      500,
      "No payment record found for this booking — cannot process refund.",
    );
  }

  const updatedBooking = await prisma.$transaction(async (tx) => {
    const updated = await tx.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELED" },
    });
    await tx.payment.update({
      where: { id: booking.payment!.id },
      data: { refundStatus: "PROCESSING" },
    });
    return updated;
  });

   sendEmail(
    booking.user.email,
    "Booking Cancelled — StayEasy",
    bookingCancelledTemplate({
      firstName: booking.user.firstName,
      hotelName: booking.room.hotel.name,
      roomName: booking.room.name,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guests: booking.guests,
      totalPrice: booking.totalPrice.toString(),
    }),
  ).catch((err) => {
    console.error(`Failed to send booking cancelled email to ${booking.user.email}:`, err);
  });

  try {
    const refund = await issueRefund(
      booking.payment.razorpayPaymentId,
      Number(booking.totalPrice),
    );
    await prisma.payment.update({
      where: { id: booking.payment.id },
      data: { razorpayRefundId: refund.id },
    });
  } catch (err) {
    console.error(
      `CRITICAL: refund failed for booking ${bookingId} (paymentId: ${booking.payment.razorpayPaymentId}). Manual intervention required.`,
      err,
    );
    await prisma.payment.update({
      where: { id: booking.payment.id },
      data: { refundStatus: "FAILED" },
    });

    sendEmail(
      booking.user.email,
      "Refund Issue — StayEasy",
      refundFailedTemplate({
        firstName: booking.user.firstName,
        hotelName: booking.room.hotel.name,
        bookingId: booking.id,
        totalPrice: booking.totalPrice.toString(),
      }),
    ).catch((emailErr) => {
      console.error(`Failed to send refund-failed email to ${booking.user.email}:`, emailErr);
    });
  }

  return updatedBooking;
};