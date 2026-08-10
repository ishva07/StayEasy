import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "../service/reviews.service";
import { createReviewType } from "../validation/reviews.validate";
import { toast } from "sonner";

export function useCreateReview() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: createReviewType) => reviewService.createReview(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      toast.success("Review submitted — pending approval");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Something went wrong while creating review";
      toast.error(message);
    },
  });
  return {
    createReview: mutation.mutate,
    isPending: mutation.isPending,
  };
}