import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import validate from "../../middleware/validate.middleware";
import { createReviewSchema, updateReviewSchema, updateStatusSchema } from "./reviews.validate";
import { hasPermission } from '../../middleware/permission.middleware';
import {
  createReviewController,
  deleteReviewController,
  getAllMyReviewController,
  getAllReviewController,
  getHotelReviewsController,
  updateReviewController,
  updateStatusController,
} from "./review.Controller";
import { PERMISSIONS } from "../../constant/permissions";

const reviewRoute = Router();

reviewRoute.get("/hotel/:hotelId", getHotelReviewsController);

reviewRoute.post("/", authenticate(), hasPermission(PERMISSIONS.ADD_REVIEW), validate(createReviewSchema), createReviewController);
reviewRoute.get("/me", authenticate(),hasPermission(PERMISSIONS.VIEW_MY_REVIEW), getAllMyReviewController);
reviewRoute.patch("/:id", authenticate(),hasPermission(PERMISSIONS.EDIT_REVIEW), validate(updateReviewSchema), updateReviewController);
reviewRoute.delete("/:id", authenticate(), hasPermission(PERMISSIONS.DELETE_REVIEW), deleteReviewController);

reviewRoute.get("/", authenticate(), hasPermission(PERMISSIONS.VIEW_ALL_REVIEW), getAllReviewController);
reviewRoute.patch(
  "/update-status/:id",
  authenticate(),
  hasPermission(PERMISSIONS.EDIT_REVIEW_STATUS),
  validate(updateStatusSchema),
  updateStatusController,
);

export default reviewRoute;