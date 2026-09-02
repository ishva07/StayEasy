import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { getUserService, changeUserRoleService } from "./user.service";
import ApiResponse from "../../utils/ApiResponse";

export const getUserController = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const sortBy = (req.query.sortBy || "email").toString();
  const order = (req.query.order || "asc").toString();

  const getUser = await getUserService({ page, limit, sortBy, order });
  res.status(200).json(new ApiResponse(true, "User fetched Successfully", getUser));
});

export const changeUserRoleController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.userId.toString();
  const roleId = req.body.roleId;
  const updatedUser = await changeUserRoleService(userId, roleId);
  res.status(200).json(new ApiResponse(true, "User role updated Successfully", updatedUser));
});