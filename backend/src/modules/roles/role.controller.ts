import { Request, Response } from "express";
import asyncHandler from "../../utils/asyncHandler";
import {
  createRoleService,
  deleteRoleService,
  editRoleService,
  getRoleService,
  getAllRoleService,
} from "./role.service";
import ApiResponse from "../../utils/ApiResponse";

export const createRoleController = asyncHandler(async (req: Request, res: Response) => {
  const name = req.body.name;
  const newRole = await createRoleService(name);
  res.status(201).json(new ApiResponse(true, "Role created Successfully", newRole));
});

export const editRoleController = asyncHandler(async (req: Request, res: Response) => {
  const name = req.body.name;
  const roleId = req.params.roleId.toString();
  const updatedRole = await editRoleService(roleId, name);
  res.status(200).json(new ApiResponse(true, "Role updated Successfully", updatedRole));
});

export const deleteRoleController = asyncHandler(async (req: Request, res: Response) => {
  const roleId = req.params.roleId.toString();
  const deletedRole = await deleteRoleService(roleId);
  res.status(200).json(new ApiResponse(true, "Role deleted Successfully", deletedRole));
});

export const getRoleController = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const sortBy = (req.query.sortBy || "name").toString();
  const order = (req.query.order || "asc").toString();

  const getRole = await getRoleService({ page, limit, sortBy, order });
  res.status(200).json(new ApiResponse(true, "Role fetched Successfully", getRole));
});

export const getAllRoleController = asyncHandler(async (req: Request, res: Response) => {
  const roles = await getAllRoleService();
  res.status(200).json(new ApiResponse(true, "Role list fetched successfully", roles));
});