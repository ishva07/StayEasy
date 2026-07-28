import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateHotelImageGalleryInput } from "../validation/hotelImageGallery.validation";
import { hotelImageGalleryService } from "../service/hotelImageGallery.service";
import { toast } from "sonner";

export function useUpdateHotelImageGallery(){
     const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      hotelId,
      data,
    }: {
      hotelId: string;
      data: updateHotelImageGalleryInput;
    }) => hotelImageGalleryService.updateHotelImageGallery(hotelId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
      queryClient.invalidateQueries({ queryKey: ["hotelById"] });
      toast.success("Image Gallery updated successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message;
      toast.error(message);
    },
  });
  return {
    updateImageGallery: mutation.mutate,
    isPending: mutation.isPending,
  };

}