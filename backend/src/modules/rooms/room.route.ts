import { Router } from "express";
import { createRoomsController, deleteRoomController, getRoomByIdController, getRoomController, updateRoomController } from "./room.controller";
import validate from "../../middleware/validate.middleware";
import { createRoomSchema, editRoomSchema } from "./rooms.validate";
import { uploads } from '../../middleware/uploads.middleware';

const roomRoute = Router();

roomRoute.post("/",uploads.single("roomImage"),validate(createRoomSchema),createRoomsController);
roomRoute.patch("/:id",validate(editRoomSchema),updateRoomController);
roomRoute.delete("/:id",deleteRoomController);
roomRoute.get("/:id",getRoomController);
roomRoute.get("/:id",getRoomByIdController);

export default roomRoute;