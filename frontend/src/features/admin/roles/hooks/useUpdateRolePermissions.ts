import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { rolesService } from "../service/roles.service";

export function useUpdateRolePermissions() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      roleId,
      permissionIds,
    }: {
      roleId: string;
      permissionIds: string[];
    }) => rolesService.updateRolePermissions(roleId, permissionIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("Role permissions updated successfully");
    },
    onError: (error: unknown) => {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message ?? error.message
        : error instanceof Error
          ? error.message
          : "Unable to update role permissions";
      toast.error(message);
    },
  });

  return {
    updateRolePermissions: mutation.mutate,
    isPending: mutation.isPending,
  };
}
