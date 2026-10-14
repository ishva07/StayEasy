import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import ApiResponse from "../../utils/ApiResponse";
import ApiError from "../../utils/ApiError";
import { getUsersService, updateUserRoleService } from "./userAdmin.service";

export const getUsersController = asyncHandler(
  async (_req: Request, res: Response) => {
    const users = await getUsersService();
    res
      .status(200)
      .json(new ApiResponse(true, "Users fetched successfully", users));
  },
);

export const updateUserRoleController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.params.userId;
    if (typeof userId !== "string") {
      throw new ApiError(400, "Invalid user ID");
    }

    const user = await updateUserRoleService(
      userId,
      req.body.roleId,
    );
    res
      .status(200)
      .json(new ApiResponse(true, "User role updated successfully", user));
  },
);
