import prisma from "../../config/db";
import ApiError from "../../utils/ApiError";
import { PERMISSIONS } from "../../constant/permissions";

const PROTECTED_ROLE_NAME = "admin";
const PROTECTED_PERMISSIONS = [PERMISSIONS.VIEW_ROLE, PERMISSIONS.EDIT_ROLE];

export const getRolePermissionsService = async (roleId: string) => {
  const role = await prisma.role.findUnique({ where: { id: roleId } });
  if (!role) throw new ApiError(404, "no role exist with this id");

  const [allPermissions, rolePermissions] = await Promise.all([
    prisma.permission.findMany({ orderBy: { name: "asc" } }),
    prisma.rolePermission.findMany({ where: { roleId } }),
  ]);

  const assignedIds = new Set(rolePermissions.map((rp) => rp.permissionId));

  return allPermissions.map((permission) => ({
    id: permission.id,
    name: permission.name,
    assigned: assignedIds.has(permission.id),
  }));
};

export const assignPermissionService = async (roleId: string, permissionId: string) => {
  const role = await prisma.role.findUnique({ where: { id: roleId } });
  if (!role) throw new ApiError(404, "no role exist with this id");

  const permission = await prisma.permission.findUnique({ where: { id: permissionId } });
  if (!permission) throw new ApiError(404, "no permission exist with this id");

  const rolePermission = await prisma.rolePermission.upsert({
    where: { roleId_permissionId: { roleId, permissionId } },
    update: {},
    create: { roleId, permissionId },
  });
  return rolePermission;
};

export const unassignPermissionService = async (roleId: string, permissionId: string) => {
  const role = await prisma.role.findUnique({ where: { id: roleId } });
  if (!role) throw new ApiError(404, "no role exist with this id");

  const permission = await prisma.permission.findUnique({ where: { id: permissionId } });
  if (!permission) throw new ApiError(404, "no permission exist with this id");

  if (
    role.name === PROTECTED_ROLE_NAME &&
    PROTECTED_PERMISSIONS.includes(permission.name as typeof PROTECTED_PERMISSIONS[number])
  ) {
    throw new ApiError(
      403,
      `Cannot remove "${permission.name}" from the "${PROTECTED_ROLE_NAME}" role — this would lock all admins out of role management`
    );
  }

  const existing = await prisma.rolePermission.findUnique({
    where: { roleId_permissionId: { roleId, permissionId } },
  });
  if (!existing) throw new ApiError(404, "this permission is not assigned to the role");

  const deleted = await prisma.rolePermission.delete({
    where: { roleId_permissionId: { roleId, permissionId } },
  });
  return deleted;
};

export const updateRolePermissionsService = async (roleId: string, permissionIds: string[]) => {
  const role = await prisma.role.findUnique({ where: { id: roleId } });
  if (!role) throw new ApiError(404, "no role exist with this id");

  const validPermissions = await prisma.permission.findMany({
    where: { id: { in: permissionIds } },
  });
  if (validPermissions.length !== permissionIds.length) {
    throw new ApiError(400, "one or more permissionIds are invalid");
  }

  const currentRolePermissions = await prisma.rolePermission.findMany({
    where: { roleId },
    include: { permission: true },
  });
  const currentIds = new Set(currentRolePermissions.map((rp) => rp.permissionId));
  const newIds = new Set(permissionIds);

  const toAdd = permissionIds.filter((id) => !currentIds.has(id));
  const toRemove = currentRolePermissions.filter((rp) => !newIds.has(rp.permissionId));

  if (role.name === PROTECTED_ROLE_NAME) {
    const removingProtected = toRemove.some((rp) =>
      PROTECTED_PERMISSIONS.includes(rp.permission.name as typeof PROTECTED_PERMISSIONS[number])
    );
    if (removingProtected) {
      throw new ApiError(
        403,
        `Cannot remove "${PROTECTED_PERMISSIONS.join('" or "')}" from the "${PROTECTED_ROLE_NAME}" role — this would lock all admins out of role management`
      );
    }
  }

  await prisma.$transaction([
    prisma.rolePermission.deleteMany({
      where: { roleId, permissionId: { in: toRemove.map((rp) => rp.permissionId) } },
    }),
    prisma.rolePermission.createMany({
      data: toAdd.map((permissionId) => ({ roleId, permissionId })),
      skipDuplicates: true,
    }),
  ]);

  return getRolePermissionsService(roleId);
};