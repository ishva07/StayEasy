import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../service/user.service";
import { toast } from "sonner";

export function useChangeUserRole() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
      userService.changeUserRoleApi(userId, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User role updated successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message ?? "something went wrong";
      toast.error(message);
    },
  });
  return {
    changeUserRole: mutation.mutate,
    isPending: mutation.isPending,
  };
}