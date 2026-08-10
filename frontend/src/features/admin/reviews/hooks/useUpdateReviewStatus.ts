import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { reviewService } from "../service/service.reviews";

export function useUpdateReviewStatus() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ status, id }: { status: "PUBLISH" | "REJECT"; id: string }) =>
      reviewService.updateReviewStatus(status, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      toast.success("Review status updated successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Something went wrong while updating review status";
      toast.error(message);
    },
  });
  return {
    updateReviewStatus: mutation.mutate,
    isPending: mutation.isPending,
  };
}