import { useMutation, useQueryClient } from "@tanstack/react-query";
import { roleService } from "../service/role.service";
import { toast } from "sonner";

export function useCreateRole() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ name }: { name: string }) => roleService.createRoleApi({ name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      toast.success("Role added successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message ?? "something went wrong";
      toast.error(message);
    },
  });
  return {
    createRole: mutation.mutate,
    isPending: mutation.isPending,
  };
}