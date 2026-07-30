import { useMutation } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { toast } from "sonner";

export function useRegister() {
  const mutation = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      toast.success("Registration successful! Please login.");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Something went wrong";
      toast.error(message);
    },
  });
  return { register: mutation.mutate, isPending: mutation.isPending };
}