import prisma from "../../config/db";
import ApiError from "../../utils/ApiError";

export const createPropertyTypeService = async (name: string, image: string | undefined) => {
  const trimmedName = name?.trim();
  if (!trimmedName) throw new ApiError(400, "Property type name is required.");
  if (!image) throw new ApiError(400, "Property type image is required.");

  const propertyTypeExists = await prisma.propertyType.findFirst({ where: { name: trimmedName } });
  if (propertyTypeExists) throw new ApiError(409, "Property type already exists with same name");

  return prisma.propertyType.create({
    data: {
      name: trimmedName,
      image,
    },
  });
};

export const editPropertyTypeService = async (
  propertyTypeId: string,
  name?: string,
  image?: string,
) => {
  const existingPropertyType = await prisma.propertyType.findUnique({ where: { id: propertyTypeId } });
  if (!existingPropertyType) throw new ApiError(404, "No property type exists with this id");

  const nextName = name?.trim() ?? existingPropertyType.name;
  if (!nextName) throw new ApiError(400, "Property type name is required.");

  if (nextName !== existingPropertyType.name) {
    const propertyTypeExists = await prisma.propertyType.findFirst({ where: { name: nextName } });
    if (propertyTypeExists) throw new ApiError(409, "Property type already exists with same name");
  }

  const nextImage = image ?? existingPropertyType.image;

  return prisma.propertyType.update({
    where: { id: propertyTypeId },
    data: {
      name: nextName,
      image: nextImage,
    },
  });
};

export const deletePropertyTypeService = async (propertyTypeId: string) => {
  const propertyType = await prisma.propertyType.findUnique({ where: { id: propertyTypeId } });
  if (!propertyType) throw new ApiError(404, "No property type exists with this id");

  return prisma.propertyType.delete({
    where: { id: propertyTypeId },
  });
};

export const getPropertyTypeService = async ({
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
    prisma.propertyType.findMany({
      skip,
      take: limit,
      orderBy: { [safeSortBy]: safeOrder },
    }),
    prisma.propertyType.count(),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getAllPropertyTypeService = async () => {
  return prisma.propertyType.findMany({
    orderBy: { name: "asc" },
  });
};