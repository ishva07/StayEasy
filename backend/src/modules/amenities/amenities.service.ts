import prisma from "../../config/db";
import ApiError from "../../utils/ApiError";

export const getAllAmenitiesService = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.amenities.findMany({
      skip,
      take: limit,
      orderBy: { name: "desc" },
    }),
    prisma.amenities.count(),
  ]);

  return {
    data,
    total,
    page,
    limit,
    totalPage: Math.ceil(total / limit),
  };
};

export const getAllAmenitiesOptionService = async () => {
  const data = await prisma.amenities.findMany({
    select: { name: true, id: true },
    orderBy: { name: "desc" },
  });

  return data;
};