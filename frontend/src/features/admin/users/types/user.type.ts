export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roleId: string;
  role: {
    name: string;
  };
}

export interface UserRole {
  id: string;
  name: string;
}

export interface AdminUsersResponse {
  users: AdminUser[];
  roles: UserRole[];
}
