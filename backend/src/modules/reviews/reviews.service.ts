import { BookingStatus, ReviewStatus } from "@prisma/client";
import prisma from "../../config/db";
import { createReviewInput, editReviewInput } from "./reviews.type";
import ApiError from "../../utils/ApiError";

export const addReviewService = async (data: createReviewInput, userId: string) => {
  const booking = await prisma.booking.findFirst({
    where: { id: data.bookingId },
    include: { room: { include: { hotel: true } } },
  });

  if (!booking) throw new ApiError(400, "Booking not found.");
  if (booking.userId !== userId) throw new ApiError(403, "This booking does not belong to you.");
  if (booking.status !== BookingStatus.CHECKOUT)
    throw new ApiError(400, "You can only review completed stays.");

  const reviewExist = await prisma.review.findFirst({
    where: { bookingId: data.bookingId },
  });
  if (reviewExist) throw new ApiError(409, "A review already exists for this stay.");

  const newReview = await prisma.review.create({
    data: {
      rating: data.rating,
      comment: data.comment,
      userId,
      bookingId: data.bookingId,
      hotelId: booking.room.hotel.id,
    },
  });

  return newReview;
};

export const updateReviewService = async (data: editReviewInput, id: string, userId: string) => {
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) throw new ApiError(404, "Review not found.");
  if (review.userId !== userId) throw new ApiError(403, "You cannot edit this review.");
  if (review.status !== ReviewStatus.PENDING)
    throw new ApiError(400, "Only pending reviews can be edited.");

  const updatedReview = await prisma.review.update({ where: { id }, data });
  return updatedReview;
};

export const DeleteReviewService = async (id: string, userId: string) => {
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) throw new ApiError(404, "Review not found.");
  if (review.userId !== userId) throw new ApiError(403, "You cannot delete this review.");

  if (review.status !== ReviewStatus.PENDING)
    throw new ApiError(400, "Only pending reviews can be moderated.");

  const deletedReview = await prisma.review.delete({ where: { id } }); 

  return deletedReview;
};

export const updateStatusService = async (id: string, status: ReviewStatus) => {
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review) throw new ApiError(404, "Review not found.");
  if (review.status !== ReviewStatus.PENDING)
    throw new ApiError(400, "Only pending reviews can be moderated.");

  const updatedStatusReview = await prisma.$transaction(async (tx) => {
    const updated = await tx.review.update({ where: { id }, data: { status } });

    if (status === ReviewStatus.PUBLISH) {
      const stats = await tx.review.aggregate({
        where: { hotelId: review.hotelId, status: ReviewStatus.PUBLISH },
        _avg: { rating: true },
        _count: true,
      });

      await tx.hotel.update({
        where: { id: review.hotelId },
        data: {
    avgReview: stats._avg.rating ?? 0,
          reviewCount: stats._count,
        },
      });
    }

    return updated;
  });

  return updatedStatusReview;
};


export const getAllReviewsService = async (page = 1, limit = 10, status?: ReviewStatus) => {
  const skip = (page - 1) * limit;
  const where = status ? { status } : {};

  const [total, data] = await Promise.all([
    prisma.review.count({ where }),
    prisma.review.findMany({
      skip,
      take: limit,
      where,
      include: { user: { select: { id: true, email: true } }, hotel: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getAllMyReviewsService = async (
  page = 1,
  limit = 10,
  userId: string,
  status?: ReviewStatus,
) => {
  const skip = (page - 1) * limit;
  const where = status ? { userId, status } : { userId };

  const [total, data] = await Promise.all([
    prisma.review.count({ where }),
    prisma.review.findMany({
      skip,
      take: limit,
      where,
      include: {
        hotel: { select: { id: true, name: true, heroImage: true, city: { select: { name: true }  } } },
        booking: {
          select: {
            checkIn: true,
            checkOut: true,
            room: { select: { id:true, name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getHotelReviewsService = async (hotelId: string, page = 1, limit = 10) => {
  const skip = (page - 1) * limit;
  const where = { hotelId, status: ReviewStatus.PUBLISH };

  const [total, data] = await Promise.all([
    prisma.review.count({ where }),
    prisma.review.findMany({
      skip,
      take: limit,
      where,
      include: { user: { select: { id: true, email: true } } },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

