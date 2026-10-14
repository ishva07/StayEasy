import api from "@/services/api";
import { AdminUsersResponse } from "../types/user.type";

export const usersService = {
  getAllUsers: async (): Promise<AdminUsersResponse> => {
    const response = await api.get("/users");
    return response.data.data;
  },

  updateUserRole: async (userId: string, roleId: string) => {
    const response = await api.patch(`/users/${userId}/role`, { roleId });
    return response.data.data;
  },
};
