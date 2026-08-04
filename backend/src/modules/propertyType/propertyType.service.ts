import prisma from "../../config/db";

export const getPropertyTypeService = async () => {
  const propertyType = await prisma.propertyType.findMany();
  return propertyType;
};