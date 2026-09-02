import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import {
  getRolePermissionsService,
  assignPermissionService,
  unassignPermissionService,
} from "./role-permission.service";
import ApiResponse from "../../utils/ApiResponse";
import { updateRolePermissionsService } from "./role-permission.service";


export const getRolePermissionsController = asyncHandler(async (req: Request, res: Response) => {
  const roleId = req.params.roleId.toString();
  const permissions = await getRolePermissionsService(roleId);
  res.status(200).json(new ApiResponse(true, "Role permissions fetched successfully", permissions));
});

export const assignPermissionController = asyncHandler(async (req: Request, res: Response) => {
  const roleId = req.params.roleId.toString();
  const permissionId = req.body.permissionId;
  const result = await assignPermissionService(roleId, permissionId);
  res.status(200).json(new ApiResponse(true, "Permission assigned successfully", result));
});

export const unassignPermissionController = asyncHandler(async (req: Request, res: Response) => {
  const roleId = req.params.roleId.toString();
  const permissionId = req.params.permissionId.toString();
  const result = await unassignPermissionService(roleId, permissionId);
  res.status(200).json(new ApiResponse(true, "Permission unassigned successfully", result));
});


export const updateRolePermissionsController = asyncHandler(async (req: Request, res: Response) => {
  const roleId = req.params.roleId.toString();
  const permissionIds = req.body.permissionIds;
  const result = await updateRolePermissionsService(roleId, permissionIds);
  res.status(200).json(new ApiResponse(true, "Role permissions updated successfully", result));
});