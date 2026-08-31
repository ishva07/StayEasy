import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import ApiResponse from "../../utils/ApiResponse";
import { getAiSearchLogService, getAiSearchLogSummaryService } from "./aiSearchLogAdmin.service";

export const getAiSearchLogController = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const sortBy = (req.query.sortBy || "createdAt").toString();
  const order = (req.query.order || "desc").toString();

  const logs = await getAiSearchLogService({ page, limit, sortBy, order });
  res.status(200).json(new ApiResponse(true, "AI search logs fetched successfully", logs));
});

export const getAiSearchLogSummaryController = asyncHandler(async (req: Request, res: Response) => {
  const summary = await getAiSearchLogSummaryService();
  res.status(200).json(new ApiResponse(true, "AI search log summary fetched successfully", summary));
});