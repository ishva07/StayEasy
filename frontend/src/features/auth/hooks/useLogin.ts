import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import {   useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { loginInput } from "../validation/auth.validate";

export function useLogin() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  const mutation = useMutation({
    mutationFn: (data: loginInput) => authService.loginApi(data),

      onSuccess: (user) => {
      queryClient.removeQueries({ queryKey: ["me"] });   
      setUser(user);
      queryClient.setQueryData(["me"], user);       
    },

    onError: (error: any) => {
      const message = error?.response?.data?.message || "something went wrong";
      toast.error(message);
    },
  });

  return {
    login: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError
  };
}
