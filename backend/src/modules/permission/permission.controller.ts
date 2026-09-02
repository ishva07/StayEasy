import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { getAllPermissionService } from "./permission.service";
import ApiResponse from "../../utils/ApiResponse";

export const getAllPermissionController = asyncHandler(async (req: Request, res: Response) => {
  const permissions = await getAllPermissionService();
  res.status(200).json(new ApiResponse(true, "Permission list fetched successfully", permissions));
});