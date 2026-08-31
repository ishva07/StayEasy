import { Router } from "express";
import { aiSearchController } from "./aiSearchLog.controller";

const aiSearchRoute = Router();

aiSearchRoute.post("/", aiSearchController);

export default aiSearchRoute;