import api from "@/services/api";

export const permissionService = {
  getRolePermissionsApi: async (roleId: string) => {
    const res = await api.get(`/role-permission/${roleId}/permissions`);
    return res.data.data;
  },
  updateRolePermissionsApi: async (roleId: string, permissionIds: string[]) => {
    const res = await api.put(`/role-permission/${roleId}/permissions`, { permissionIds });
    return res.data.data;
  },
};