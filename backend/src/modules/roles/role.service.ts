import prisma from "../../config/db";
import ApiError from "../../utils/ApiError";

export const createRoleService = async (name: string) => {
  const roleExist = await prisma.role.findFirst({ where: { name } });
  if (roleExist) throw new ApiError(409, "Role already exist with same name");

  const newRole = await prisma.role.create({ data: { name } });
  return newRole;
};

export const editRoleService = async (roleId: string, name: string) => {
  const role = await prisma.role.findFirst({ where: { id: roleId } });
  if (!role) throw new ApiError(404, "no role exist with this id");

  if (role.name === name && roleId != role.id)
    throw new ApiError(409, "Role already exist with same name");

  const editedRole = await prisma.role.update({
    where: { id: roleId },
    data: { name },
  });
  return editedRole;
};

export const deleteRoleService = async (roleId: string) => {
  const role = await prisma.role.findUnique({ where: { id: roleId } });
  if (!role) throw new ApiError(404, "no role exist with this id");

  const deletedRole = await prisma.role.delete({ where: { id: roleId } });
  return deletedRole;
};

export const getRoleService = async ({
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
    prisma.role.findMany({
      skip,
      take: limit,
      orderBy: { [safeSortBy]: safeOrder },
    }),
    prisma.role.count(),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const getAllRoleService = async () => {
  return prisma.role.findMany({ orderBy: { name: "asc" } });
};