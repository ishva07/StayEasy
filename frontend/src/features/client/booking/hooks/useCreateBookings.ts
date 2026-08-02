import { useMutation } from "@tanstack/react-query";
import { bookingService } from "../services/booking.service";
import { toast } from "sonner";

export function useCreateBooking() {
  const mutation = useMutation({
    mutationFn: bookingService.createBooking,
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Something went wrong";
      toast.error(message);
    },
  });
  return { createBooking: mutation.mutate, isPending: mutation.isPending };
}