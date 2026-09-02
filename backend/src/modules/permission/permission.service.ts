import prisma from "../../config/db";

export const getAllPermissionService = async () => {
  return prisma.permission.findMany({ orderBy: { name: "asc" } });
};