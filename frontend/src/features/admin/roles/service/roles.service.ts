import api from "@/services/api";
import { RolesAndPermissions } from "../types/role.type";

export const rolesService = {
  getRolesAndPermissions: async (): Promise<RolesAndPermissions> => {
    const response = await api.get("/roles");
    return response.data.data;
  },

  updateRolePermissions: async (roleId: string, permissionIds: string[]) => {
    const response = await api.put(`/roles/${roleId}/permissions`, {
      permissionIds,
    });
    return response.data.data;
  },
};
