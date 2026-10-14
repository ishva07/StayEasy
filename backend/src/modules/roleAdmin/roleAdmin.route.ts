import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { hasPermission } from "../../middleware/permission.middleware";
import { PERMISSIONS } from "../../constant/permissions";
import validate from "../../middleware/validate.middleware";
import {
  getRolesAndPermissionsController,
  updateRolePermissionsController,
} from "./roleAdmin.controller";
import { updateRolePermissionsSchema } from "./roleAdmin.validation";

const roleAdminRoute = Router();

roleAdminRoute.get(
  "/",
  authenticate(),
  hasPermission(PERMISSIONS.VIEW_ROLES),
  getRolesAndPermissionsController,
);
roleAdminRoute.put(
  "/:roleId/permissions",
  authenticate(),
  hasPermission(PERMISSIONS.EDIT_ROLE_PERMISSIONS),
  validate(updateRolePermissionsSchema),
  updateRolePermissionsController,
);

export default roleAdminRoute;
