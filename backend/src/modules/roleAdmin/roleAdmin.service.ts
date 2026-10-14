import prisma from "../../config/db";
import ApiError from "../../utils/ApiError";

export const getRolesAndPermissionsService = async () => {
  const [roles, permissions] = await Promise.all([
    prisma.role.findMany({
      select: {
        id: true,
        name: true,
        permissions: {
          select: { permissionId: true },
        },
      },
      orderBy: { name: "asc" },
    }),
    prisma.permission.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return {
    roles: roles.map((role) => ({
      id: role.id,
      name: role.name,
      permissionIds: role.permissions.map(({ permissionId }) => permissionId),
    })),
    permissions,
  };
};

export const updateRolePermissionsService = async (
  roleId: string,
  permissionIds: string[],
) => {
  const uniquePermissionIds = [...new Set(permissionIds)];

  return prisma.$transaction(async (transaction) => {
    const [role, permissions] = await Promise.all([
      transaction.role.findUnique({
        where: { id: roleId },
        select: { id: true },
      }),
      transaction.permission.findMany({
        where: { id: { in: uniquePermissionIds } },
        select: { id: true },
      }),
    ]);

    if (!role) throw new ApiError(404, "Role not found");
    if (permissions.length !== uniquePermissionIds.length) {
      throw new ApiError(400, "One or more permissions are invalid");
    }

    await transaction.rolePermission.deleteMany({ where: { roleId } });
    if (uniquePermissionIds.length > 0) {
      await transaction.rolePermission.createMany({
        data: uniquePermissionIds.map((permissionId) => ({
          roleId,
          permissionId,
        })),
      });
    }

    return {
      roleId,
      permissionIds: uniquePermissionIds,
    };
  });
};
