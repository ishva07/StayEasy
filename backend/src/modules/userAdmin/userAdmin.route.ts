import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { hasPermission } from "../../middleware/permission.middleware";
import { PERMISSIONS } from "../../constant/permissions";
import validate from "../../middleware/validate.middleware";
import {
  getUsersController,
  updateUserRoleController,
} from "./userAdmin.controller";
import { updateUserRoleSchema } from "./userAdmin.validation";

const userAdminRoute = Router();

userAdminRoute.get(
  "/",
  authenticate(),
  hasPermission(PERMISSIONS.VIEW_USERS),
  getUsersController,
);
userAdminRoute.patch(
  "/:userId/role",
  authenticate(),
  hasPermission(PERMISSIONS.EDIT_USER_ROLE),
  validate(updateUserRoleSchema),
  updateUserRoleController,
);

export default userAdminRoute;
