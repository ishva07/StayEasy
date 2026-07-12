import { Router } from "express";
import validate from "../../middleware/validate.middleware";
import { loginAuthController, logoutController, registerAuthController } from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.validate";

const authRoute = Router();

authRoute.post("/login",validate(loginSchema),loginAuthController);
authRoute.post("/register",validate(registerSchema),registerAuthController);
authRoute.post("/logout",logoutController);

export default authRoute;