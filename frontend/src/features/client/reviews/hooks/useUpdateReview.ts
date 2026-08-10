import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reviewService } from "../service/reviews.service";
import { updateReviewType } from "../validation/reviews.validate";
import { toast } from "sonner";

export function useUpdateReview() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ data, id }: { data: updateReviewType; id: string }) =>
      reviewService.updateReview(data, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review updated successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Something went wrong while updating review";
      toast.error(message);
    },
  });
  return {
    updatingReview: mutation.mutate,
    isPending: mutation.isPending,
  };
}

