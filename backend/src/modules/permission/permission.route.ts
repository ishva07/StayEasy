import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { getAllPermissionController } from "./permission.controller";

const permissionRoute = Router();

permissionRoute.get("/all", authenticate(), getAllPermissionController);

export default permissionRoute;