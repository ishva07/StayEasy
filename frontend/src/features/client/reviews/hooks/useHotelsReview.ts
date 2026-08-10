import { useQuery } from "@tanstack/react-query";
import { reviewService } from "../service/reviews.service";

export function useGetHotelReviews(hotelId: string, params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["reviews", "hotel", hotelId, params],
    queryFn: () => reviewService.getHotelReviews(hotelId, params),
    enabled: !!hotelId,
  });
}