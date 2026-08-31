import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import ApiResponse from "../../utils/ApiResponse";
import prisma from "../../config/db";
import { checkAiSearchQuota } from "../../middleware/aiQuota.middleware";
import { parseSearchQuery, getFallbackFilters } from "./aiSearchLog.service";
import { AiSearchResponse } from "./aiSearchLog.type";

export const aiSearchController = asyncHandler(async (req: Request, res: Response) => {
  const query = (req.body?.query ?? "").toString().trim();

  if (!query) {
    return res.status(400).json(new ApiResponse(false, "Query is required", null));
  }


  const trimmedQuery = query.slice(0, 300);

  const identifier = (req as any).user?.id ?? req.ip ?? "unknown";
  const startTime = Date.now();

  const quota = await checkAiSearchQuota(identifier);

   if (!quota.allowed) {
    const filters = await getFallbackFilters(trimmedQuery);
    await prisma.aiSearchLog.create({
      data: { rawQuery: trimmedQuery, outcome: "FALLBACK", failureReason: quota.reason, userId: (req as any).user?.id },
    });
    const responseBody: AiSearchResponse = { outcome: "FALLBACK", reason: quota.reason, filters };
    return res.status(200).json(new ApiResponse(true, "Falling back to keyword search", responseBody));
  }

  const result = await parseSearchQuery(trimmedQuery);
  const latencyMs = Date.now() - startTime;

  if (!result.ok) {
    await prisma.aiSearchLog.create({
      data: {
        rawQuery: trimmedQuery,
        outcome: "FALLBACK",
        failureReason: result.reason,
        latencyMs,
        userId: (req as any).user?.id,
      },
    });

const responseBody: AiSearchResponse = { outcome: "FALLBACK", reason: result.reason, filters: result.filters };
    return res.status(200).json(new ApiResponse(true, "Falling back to keyword search", responseBody));
  }

  await prisma.aiSearchLog.create({
    data: {
      rawQuery: trimmedQuery,
      outcome: "SUCCESS",
      latencyMs,
      userId: (req as any).user?.id,
    },
  });

  const responseBody: AiSearchResponse = { outcome: "SUCCESS", filters: result.filters };
  res.status(200).json(new ApiResponse(true, "AI search parsed successfully", responseBody));
});