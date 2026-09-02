import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { getUserController, changeUserRoleController } from "./user.controller";
import { hasPermission } from "../../middleware/permission.middleware";
import validate from "../../middleware/validate.middleware";
import { changeUserRoleSchema } from "./user.validation";
import { PERMISSIONS } from "../../constant/permissions";

const userRoute = Router();

userRoute.get("/", authenticate(), hasPermission(PERMISSIONS.VIEW_USER), getUserController);
userRoute.put("/:userId/role", authenticate(), hasPermission(PERMISSIONS.EDIT_USER_ROLE), validate(changeUserRoleSchema), changeUserRoleController);

export default userRoute;