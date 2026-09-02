import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import {
  createRoleController,
  deleteRoleController,
  editRoleController,
  getRoleController,
  getAllRoleController,
} from "./role.controller";
import { hasPermission } from "../../middleware/permission.middleware";
import validate from "../../middleware/validate.middleware";
import { createRoleSchema, editRoleSchema } from "./role.validation";
import { PERMISSIONS } from "../../constant/permissions";

const roleRoute = Router();

roleRoute.post("/", authenticate(), hasPermission(PERMISSIONS.ADD_ROLE), validate(createRoleSchema), createRoleController);
roleRoute.put("/:roleId", authenticate(), hasPermission(PERMISSIONS.EDIT_ROLE), validate(editRoleSchema), editRoleController);
roleRoute.delete("/:roleId", authenticate(), hasPermission(PERMISSIONS.DELETE_ROLE), deleteRoleController);
roleRoute.get("/all", authenticate(), getAllRoleController);
roleRoute.get("/", authenticate(), hasPermission(PERMISSIONS.VIEW_ROLE), getRoleController);

export default roleRoute;