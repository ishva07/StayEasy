import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "../service/reviews.service";
import { toast } from "sonner";

export function useDeleteReview() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => reviewService.deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review deleted successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Something went wrong while deleting review";
      toast.error(message);
    },
  });
  return {
    deleteReview: mutation.mutate,
    isPending: mutation.isPending,
  };
}