export interface RolePermission {
  id: string;
  name: string;
}

export interface AdminRole {
  id: string;
  name: string;
  permissionIds: string[];
}

export interface RolesAndPermissions {
  roles: AdminRole[];
  permissions: RolePermission[];
}
