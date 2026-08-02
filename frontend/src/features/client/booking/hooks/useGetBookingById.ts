import { useQuery } from "@tanstack/react-query";
import { bookingService } from "../services/booking.service";

export function useGetBookingById(bookingId: string) {
  return useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => bookingService.getBookingById(bookingId),
    enabled: !!bookingId,
  });
}