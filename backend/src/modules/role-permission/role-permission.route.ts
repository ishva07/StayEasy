import { Router } from "express";
import { PERMISSIONS } from "../../constant/permissions";
import { authenticate } from "../../middleware/auth.middleware";
import { hasPermission } from "../../middleware/permission.middleware";
import validate from "../../middleware/validate.middleware";
import {
  getRolePermissionsController,
  updateRolePermissionsController,
} from "./role-permission.controller";
import { updateRolePermissionsSchema } from "./role-permission.validation";

const rolePermissionRoute = Router();

rolePermissionRoute.get("/:roleId/permissions", authenticate(), hasPermission(PERMISSIONS.VIEW_ROLE), getRolePermissionsController);
rolePermissionRoute.put("/:roleId/permissions", authenticate(), hasPermission(PERMISSIONS.EDIT_ROLE), validate(updateRolePermissionsSchema), updateRolePermissionsController);

export default rolePermissionRoute;