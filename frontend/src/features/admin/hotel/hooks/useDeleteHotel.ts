import { useMutation, useQueryClient } from "@tanstack/react-query";
import { hotelService } from "../service/hotel.service";
import { toast } from "sonner";

export function useDeleteHotel() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (hotelId: string) => hotelService.deleteHotelService(hotelId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      toast.success("Hotel deleted successfully");
    },

    onError: (error: any) => {
      const message = error?.response?.data?.message || "something went wrong";
      toast.error(message);
    },
  });
  return {
    deleteHotel: mutation.mutate,
    isPending: mutation.isPending,
  };
}
