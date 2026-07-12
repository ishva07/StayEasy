import prisma from "../../config/db";
import ApiError from "../../utils/ApiError";
import { CreateRoomInterface, UpdateRoomInterface } from './rooms.types';

export const createRoomService = async ({ name, capacity, price, roomImage, hotelId}: CreateRoomInterface) => {
  const hotelExit = await prisma.hotel.findUnique({ where: { id: hotelId } });
  if (!hotelExit)
    throw new ApiError(404, "No Hotel Exist.. provide valid hotel id.");

  const roomName = await prisma.room.findFirst({ where: { name: name } });
  if (roomName) throw new ApiError(409, "Room Already Exist");

  const newRoom = await prisma.room.create({
    data: { name, capacity, price, roomImage, hotelId },
  });
  return newRoom;
};

export const editRoomService = async (id: string, data: UpdateRoomInterface) => {
  const roomId = await prisma.room.findUnique({ where: { id } });
  if (!roomId) throw new ApiError(404, "No Room Available on this id");

  if (data.name) {
    const roomExist = await prisma.room.findFirst({
      where: { id, name: data.name },
    });
    if (roomExist) throw new ApiError(409, "Room Already Exist");
  }

  const updatedRoom = await prisma.room.update({ where: { id }, data });
  return updatedRoom;
};

export const deleteRoomService = async (id: string) => {
  const roomId = await prisma.room.findUnique({ where: { id } });
  if (!roomId) throw new ApiError(404, "No Room Available on this id");

  const deletedRoom = await prisma.room.delete({ where: { id } });
  return deletedRoom;
};

export const getRoomByIdService = async (id: string) => {
  const roomId = await prisma.room.findUnique({ where: { id } });
  if (!roomId) throw new ApiError(404, "No Room Available on this id");

  const getRoomById = await prisma.room.findUnique({ where: { id } });
  return getRoomById;
};

export const getRoomService = async (
  hotelId: string,
  { page = 1, limit = 10, sortBy = "createdAt", order = "desc", search = "" },
) => {
  const skip = (page - 1) * limit;

  const allowsSortByFields = ["name", "capacity", "price", "createdAt"];
  const sortedBy = allowsSortByFields.includes(sortBy) ? sortBy : "createdAt";

  const allowOrders = ["asc", "desc"];
  const sortOrder = allowOrders.includes(order) ? order : "desc";

  const where = {
    hotelId,
    ...(search && [{ name: { contains: search, mode: "insensitive" } }]),
  };

  const [data, total] = await Promise.all([
    prisma.room.findMany({
      skip,
      take: limit,
      orderBy: { [sortedBy]: sortOrder },
      where,
      include: {
        hotel: {
          select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
          },
        },
      },
    }),
    prisma.room.count({ where }),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};
