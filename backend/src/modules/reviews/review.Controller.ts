import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import {
  addReviewService,
  updateReviewService,
  DeleteReviewService,
  updateStatusService,
  getAllReviewsService,
  getAllMyReviewsService,
  getHotelReviewsService,
} from "./reviews.service";
import ApiResponse from "../../utils/ApiResponse";
import { ReviewStatus } from "@prisma/client";

export const createReviewController = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body;
  const userId = req.user.id;
  const newReview = await addReviewService(data, userId);
  res.status(201).json(new ApiResponse(true, "Review added successfully", newReview));
});

export const updateReviewController = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body;
  const id = req.params.id.toString();
  const userId = req.user.id;
  const updateReview = await updateReviewService(data, id, userId);
  res.status(200).json(new ApiResponse(true, "Review updated successfully", updateReview));
});

export const deleteReviewController = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id.toString();
  const userId = req.user.id;
  const deleteReview = await DeleteReviewService(id, userId);
  res.status(200).json(new ApiResponse(true, "Review deleted successfully", deleteReview));
});

export const updateStatusController = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id.toString();
  const { status } = req.body;
  const updateStatusReview = await updateStatusService(id, status as ReviewStatus);
  res
    .status(200)
    .json(new ApiResponse(true, "Review status updated successfully", updateStatusReview));
});

export const getAllReviewController = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const status = (req.query.status?.toString() as ReviewStatus) || undefined;
  const allReview = await getAllReviewsService(page, limit, status);
  res.status(200).json(new ApiResponse(true, "Reviews fetched successfully", allReview));
});

export const getAllMyReviewController = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const status = (req.query.status?.toString() as ReviewStatus) || undefined;
  const userId = req.user.id;
  const allMyReview = await getAllMyReviewsService(page, limit, userId, status);
  res.status(200).json(new ApiResponse(true, "Reviews fetched successfully", allMyReview));
});

export const getHotelReviewsController = asyncHandler(async (req: Request, res: Response) => {
  const hotelId = req.params.hotelId.toString();
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const reviews = await getHotelReviewsService(hotelId, page, limit);
  res.status(200).json(new ApiResponse(true, "Reviews fetched successfully", reviews));
});
