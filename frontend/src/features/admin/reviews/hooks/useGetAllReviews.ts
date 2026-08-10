import { useQuery } from "@tanstack/react-query";
import { reviewService } from "../service/service.reviews";

export function useGetAllReviews(params?: { page?: number; limit?: number; status?: string }) {
  return useQuery({
    queryKey: ["reviews", "all", params],
    queryFn: () => reviewService.getAllReviews(params),
  });
}