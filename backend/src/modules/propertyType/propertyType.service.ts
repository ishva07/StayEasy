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

export const getPropertyTypeService = async () => {
  const propertyType = await prisma.propertyType.findMany();
  return propertyType;
};