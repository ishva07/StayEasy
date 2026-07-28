import { useMutation, QueryClient, useQueryClient } from "@tanstack/react-query";
import { createHotelInputData } from "../validation/hotel.validation";
import { hotelService } from "../service/hotel.service";
import { toast } from "sonner";

export function useAddHotels() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: createHotelInputData) =>
      hotelService.createHotelService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      toast.success("Hotel Created successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "something went wrong";
      toast.error(message);
    },
  });

  return {
    addHotel: mutation.mutate,
    isPending: mutation.isPending,
  };
}
