import { Router } from "express";
import { createRoomsController, deleteRoomController, getRoomByIdController, getRoomController, updateRoomController } from "./room.controller";
import validate from "../../middleware/validate.middleware";
import { createRoomSchema, editRoomSchema } from "./rooms.validate";
import { uploads } from '../../middleware/uploads.middleware';
import { authenticate } from '../../middleware/auth.middleware';
import { PERMISSIONS } from "../../constant/permissions";
import { hasPermission } from "../../middleware/permission.middleware";

const roomRoute = Router();

roomRoute.post("/:hotelId/rooms",authenticate(),hasPermission(PERMISSIONS.ADD_ROOM),uploads.single("roomImage"),validate(createRoomSchema),createRoomsController);
roomRoute.patch("/:hotelId/rooms/:roomId",authenticate(),hasPermission(PERMISSIONS.EDIT_ROOM),uploads.single("roomImage"),validate(editRoomSchema),updateRoomController);
roomRoute.delete("/:hotelId/rooms/:roomId",authenticate(),hasPermission(PERMISSIONS.DELETE_ROOM),deleteRoomController);
roomRoute.get("/:hotelId/rooms",getRoomController);
roomRoute.get("/:hotelId/rooms/:roomId",getRoomByIdController);

export default roomRoute;