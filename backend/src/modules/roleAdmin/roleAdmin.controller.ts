import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import {
  getRolesAndPermissionsService,
  updateRolePermissionsService,
} from "./roleAdmin.service";

export const getRolesAndPermissionsController = asyncHandler(
  async (_req: Request, res: Response) => {
    const data = await getRolesAndPermissionsService();
    res
      .status(200)
      .json(new ApiResponse(true, "Roles and permissions fetched successfully", data));
  },
);

export const updateRolePermissionsController = asyncHandler(
  async (req: Request, res: Response) => {
    const roleId = req.params.roleId;
    if (typeof roleId !== "string") {
      throw new ApiError(400, "Invalid role ID");
    }

    const data = await updateRolePermissionsService(
      roleId,
      req.body.permissionIds,
    );
    res
      .status(200)
      .json(new ApiResponse(true, "Role permissions updated successfully", data));
  },
);
