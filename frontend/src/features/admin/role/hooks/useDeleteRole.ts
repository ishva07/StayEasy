import { useMutation, useQueryClient } from "@tanstack/react-query";
import { roleService } from "../service/role.service";
import { toast } from "sonner";

export function useDeleteRole() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ roleId }: { roleId: string }) => roleService.deleteRoleApi(roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role deleted successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message ?? "something went wrong";
      toast.error(message);
    },
  });
  return {
    deleteRole: mutation.mutate,
    isPending: mutation.isPending,
  };
}