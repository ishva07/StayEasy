import { useQuery } from "@tanstack/react-query";
import { bookingService } from "../services/booking.service";

export function useBookingStatusTransitions() {
  return useQuery({
    queryKey: ["bookingStatusTransitions"],
    queryFn: () => bookingService.getStatusTransitions(),
    staleTime: Infinity, 
  });
}