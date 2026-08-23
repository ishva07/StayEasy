import { Router } from "express";
import validate from "../../middleware/validate.middleware";
import { loginAuthController, logoutController, meController, refreshController, registerAuthController } from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.validate";
import { authenticate } from '../../middleware/auth.middleware';
import { loginLimiter } from "../../middleware/rateLimit.middleware";

const authRoute = Router();

authRoute.post("/login", loginLimiter,validate(loginSchema), loginAuthController);
authRoute.post("/register", loginLimiter, validate(registerSchema), registerAuthController);
authRoute.post("/refresh", loginLimiter, refreshController);
authRoute.post("/logout", logoutController);
authRoute.get("/me", authenticate(), meController);

export default authRoute;