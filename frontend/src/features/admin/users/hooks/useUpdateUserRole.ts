import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { usersService } from "../service/users.service";

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ userId, roleId }: { userId: string; roleId: string }) =>
      usersService.updateUserRole(userId, roleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User role updated successfully");
    },
    onError: (error: unknown) => {
      const message = axios.isAxiosError<{ message?: string }>(error)
        ? error.response?.data?.message ?? error.message
        : error instanceof Error
          ? error.message
          : "Unable to update user role";
      toast.error(message);
    },
  });

  return {
    updateUserRole: mutation.mutate,
    isPending: mutation.isPending,
  };
}
