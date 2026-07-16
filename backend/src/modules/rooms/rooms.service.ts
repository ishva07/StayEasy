import prisma from "../../config/db";
import ApiError from "../../utils/ApiError";
import { CreateRoomInterface, UpdateRoomInterface } from "./rooms.types";

export const createRoomService = async ({
  name,
  capacity,
  price,
  roomImage,
  hotelId,
}: CreateRoomInterface) => {
  const hotelExit = await prisma.hotel.findUnique({ where: { id: hotelId } });
  if (!hotelExit)
    throw new ApiError(404, "No Hotel Exist.. provide valid hotel id.");

  const roomName = await prisma.room.findFirst({
    where: { name: name, hotelId },
  });
  if (roomName) throw new ApiError(409, "Room Already Exist");

  const newRoom = await prisma.room.create({
    data: { name, capacity, price, roomImage, hotelId },
  });
  return newRoom;
};

export const editRoomService = async (
  hotelId: string,
  roomId: string,
  data: UpdateRoomInterface,
) => {
  const hotelExit = await prisma.hotel.findUnique({ where: { id: hotelId } });
  if (!hotelExit)
    throw new ApiError(404, "No Hotel Exist.. provide valid hotel id.");

  const roomExist = await prisma.room.findUnique({ where: { id: roomId } });
  if (!roomExist) throw new ApiError(404, "No Room Available on this id");

  if (data.name) {
    const roomNameExist = await prisma.room.findFirst({
      where: { hotelId, NOT: { id: roomId }, name: data.name },
    });
    if (roomNameExist) throw new ApiError(409, "Room Already Exist");
  }

  const updatedRoom = await prisma.room.update({ where: { id: roomId }, data });
  return updatedRoom;
};

export const deleteRoomService = async (hotelId: string, roomId: string) => {
  const hotelExit = await prisma.hotel.findUnique({ where: { id: hotelId } });
  if (!hotelExit)
    throw new ApiError(404, "No Hotel Exist.. provide valid hotel id.");

  const roomExist = await prisma.room.findUnique({ where: { id: roomId } });
  if (!roomExist) throw new ApiError(404, "No Room Available in this hotel");

  const deletedRoom = await prisma.room.delete({ where: { id: roomId } });
  return deletedRoom;
};

export const getRoomByIdService = async (hotelId: string, roomId: string) => {
  const hotelExit = await prisma.hotel.findUnique({ where: { id: hotelId } });
  if (!hotelExit)
    throw new ApiError(404, "No Hotel Exist.. provide valid hotel id.");

  const getRoomById = await prisma.room.findUnique({
    where: { id: roomId },
    include: {
      hotel: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
    },
  });
  if (!getRoomById) throw new ApiError(404, "No Room Available on this hotel");
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

  // const where = {
  //   hotelId,
  //   ...(search && {
  //      OR:[
  //       { name: { contains: search, mode: "insensitive" as const} }
  //     ]
  //   }
  //     ),
  // };

  const [data, total] = await Promise.all([
    prisma.room.findMany({
      skip,
      take: limit,
      orderBy: { [sortedBy]: sortOrder },
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
    prisma.room.count(),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};
