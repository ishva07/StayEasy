import { useQuery } from "@tanstack/react-query";
import { reviewService } from "../service/reviews.service";

export function useGetMyReviews(params?: { page?: number; limit?: number; status?: string }) {
  return useQuery({
    queryKey: ["reviews", "me", params],
    queryFn: () => reviewService.getMyReviews(params),
  });
}