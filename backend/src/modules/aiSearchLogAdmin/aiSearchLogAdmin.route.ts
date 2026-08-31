import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { hasPermission } from "../../middleware/permission.middleware";
import { PERMISSIONS } from "../../constant/permissions";
import { getAiSearchLogController, getAiSearchLogSummaryController } from "./aiSearchLogAdmin.controller";

const aiSearchLogAdminRoute = Router();

aiSearchLogAdminRoute.get(
  "/summary",
  authenticate(),
  hasPermission(PERMISSIONS.VIEW_AI_SEARCH_LOG),
  getAiSearchLogSummaryController
);
aiSearchLogAdminRoute.get(
  "/",
  authenticate(),
  hasPermission(PERMISSIONS.VIEW_AI_SEARCH_LOG),
  getAiSearchLogController
);

export default aiSearchLogAdminRoute;