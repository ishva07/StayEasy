import { useMutation, useQueryClient } from "@tanstack/react-query";
import { roleService } from "../service/role.service";
import { toast } from "sonner";

export function useEditRole() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ roleId, name }: { roleId: string; name: string }) =>
      roleService.editRoleApi(roleId, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role updated successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message ?? "something went wrong";
      toast.error(message);
    },
  });
  return {
    editRole: mutation.mutate,
    isPending: mutation.isPending,
  };
}