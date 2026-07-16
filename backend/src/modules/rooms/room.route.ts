import { Router } from "express";
import { createRoomsController, deleteRoomController, getRoomByIdController, getRoomController, updateRoomController } from "./room.controller";
import validate from "../../middleware/validate.middleware";
import { createRoomSchema, editRoomSchema } from "./rooms.validate";
import { uploads } from '../../middleware/uploads.middleware';

const roomRoute = Router();

roomRoute.post("/:hotelId/rooms",uploads.single("roomImage"),validate(createRoomSchema),createRoomsController);
roomRoute.patch("/:hotelId/rooms/:roomId",validate(editRoomSchema),updateRoomController);
roomRoute.delete("/:hotelId/rooms/:roomId",deleteRoomController);
roomRoute.get("/:hotelId/rooms",getRoomController);
roomRoute.get("/:hotelId/rooms/:roomId",getRoomByIdController);

export default roomRoute;