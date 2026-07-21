import { Router } from "express";
import validate from "../../middleware/validate.middleware";
import { loginAuthController, logoutController, meController, registerAuthController } from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.validate";
import { authenticate } from '../../middleware/auth.middleware';

const authRoute = Router();

authRoute.post("/login",validate(loginSchema),loginAuthController);
authRoute.post("/register",validate(registerSchema),registerAuthController);
authRoute.post("/logout",logoutController);
authRoute.get("/me",authenticate(),meController);

export default authRoute;