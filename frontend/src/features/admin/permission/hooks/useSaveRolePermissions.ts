import { useMutation, useQueryClient } from "@tanstack/react-query";
import { permissionService } from "../service/permission.service";
import { toast } from "sonner";

export function useSaveRolePermissions() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ roleId, permissionIds }: { roleId: string; permissionIds: string[] }) =>
      permissionService.updateRolePermissionsApi(roleId, permissionIds),
    onSuccess: (_, { roleId }) => {
      queryClient.invalidateQueries({ queryKey: ["role-permissions", roleId] });
      toast.success("Permissions saved successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message ?? "something went wrong";
      toast.error(message);
    },
  });
  return {
    savePermissions: mutation.mutate,
    isPending: mutation.isPending,
  };
}