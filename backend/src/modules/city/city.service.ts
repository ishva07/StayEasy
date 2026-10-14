import prisma from "../../config/db";
import ApiError from "../../utils/ApiError";
import { deleteCloudinaryImages } from "../../utils/cloudinaryImages";

export const createCityService = async (name: string,cityImage:string |undefined) => {
  const cityExist = await prisma.city.findFirst({ where: {name}  });
  if (cityExist) throw new ApiError(409, "City already exist with same name");

  const newCity = await prisma.city.create({ data:{name,images:cityImage} });
  return newCity;
};

export const editCityService = async (
  cityId: string,
  name:string,
  cityImage:string | undefined
) => {
  const city = await prisma.city.findFirst({ where: { id: cityId } });
  if (!city) throw new ApiError(404, "no city exist with this id");

  if (city.name === name && cityId != city.id)
    throw new ApiError(409, "City already exist with same name");

  const editedCity = await prisma.city.update({
    where: { id: cityId },
    data:{
        name,
        images:cityImage
    }
  });
  if (cityImage && cityImage !== city.images) {
    await deleteCloudinaryImages([city.images]);
  }
  return editedCity;
};

export const deleteCityService = async (cityId: string) => {
  const city = await prisma.city.findUnique({ where: { id: cityId } });
  if (!city) throw new ApiError(404, "no city exist with this id");

  const deletedCity = await prisma.city.delete({
    where: { id: cityId },
  });
  await deleteCloudinaryImages([city.images]);
  return deletedCity;
};


export const getCityService = async ({
  page = 1,
  limit = 10,
  sortBy = "name",
  order = "asc",
}: any) => {
  const skip = (page - 1) * limit;

  const allowedSortBy = ["name"] as const;
  const allowedOrder = ["asc", "desc"] as const;

  const safeSortBy = (allowedSortBy as readonly string[]).includes(sortBy)
    ? (sortBy as (typeof allowedSortBy)[number])
    : "name";
  const safeOrder = (allowedOrder as readonly string[]).includes(order)
    ? (order as (typeof allowedOrder)[number])
    : "asc";

  const [data, total] = await Promise.all([
    prisma.city.findMany({
      skip,
      take: limit,
      orderBy: { [safeSortBy]: safeOrder },
    }),
    prisma.city.count(),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getAllCityService = async () => {
  return prisma.city.findMany({
    orderBy: { name: "asc" },
  });
};