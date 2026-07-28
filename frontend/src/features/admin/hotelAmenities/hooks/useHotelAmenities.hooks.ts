import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateHotelAmenitiesInput } from "../validation/hotelAmenities.validation";
import { hotelAmenitiesService } from "../services/hotelAmenities.service";
import { toast } from "sonner";

export function useUpdateHotelAmenities() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      hotelId,
      data,
    }: {
      hotelId: string;
      data: updateHotelAmenitiesInput;
    }) => hotelAmenitiesService.updateHotelAmenities(hotelId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
            queryClient.invalidateQueries({ queryKey: ["hotelById"] });
      toast.success("amenities updated successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
  return {
    updateAmenities: mutation.mutate,
    isPending: mutation.isPending,
  };
}
