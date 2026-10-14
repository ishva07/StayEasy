import prisma from "../../config/db";
import ApiError from "../../utils/ApiError";

export const getUsersService = async () => {
  const [users, roles] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        roleId: true,
        role: { select: { name: true } },
      },
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    }),
    prisma.role.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return { users, roles };
};

export const updateUserRoleService = async (
  userId: string,
  roleId: string,
) => {
  const [user, role] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId }, select: { id: true } }),
    prisma.role.findUnique({ where: { id: roleId }, select: { id: true } }),
  ]);

  if (!user) throw new ApiError(404, "User not found");
  if (!role) throw new ApiError(404, "Role not found");

  return prisma.user.update({
    where: { id: userId },
    data: { roleId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      roleId: true,
      role: { select: { name: true } },
    },
  });
};
