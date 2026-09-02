import prisma from "../../config/db";
import ApiError from "../../utils/ApiError";

const PROTECTED_ROLE_NAME = "admin";

export const getUserService = async ({
  page = 1,
  limit = 10,
  sortBy = "email",
  order = "asc",
}: any) => {
  const skip = (page - 1) * limit;

  const allowedSortBy = ["email", "createdAt"] as const;
  const allowedOrder = ["asc", "desc"] as const;

  const safeSortBy = (allowedSortBy as readonly string[]).includes(sortBy)
    ? (sortBy as (typeof allowedSortBy)[number])
    : "email";
  const safeOrder = (allowedOrder as readonly string[]).includes(order)
    ? (order as (typeof allowedOrder)[number])
    : "asc";

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { [safeSortBy]: safeOrder },
      include: { role: true },
    }),
    prisma.user.count(),
  ]);

  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const changeUserRoleService = async (userId: string, roleId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { role: true } });
  if (!user) throw new ApiError(404, "no user exist with this id");

  const newRole = await prisma.role.findUnique({ where: { id: roleId } });
  if (!newRole) throw new ApiError(404, "no role exist with this id");

  if (user.role.name === PROTECTED_ROLE_NAME && newRole.name !== PROTECTED_ROLE_NAME) {
    const adminCount = await prisma.user.count({
      where: { role: { name: PROTECTED_ROLE_NAME } },
    });
    if (adminCount <= 1) {
      throw new ApiError(
        403,
        `Cannot change role — this is the last user with the "${PROTECTED_ROLE_NAME}" role`
      );
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { roleId },
    include: { role: true },
  });
  return updatedUser;
};