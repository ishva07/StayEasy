import { useMutation, QueryClient, useQueryClient } from '@tanstack/react-query';
import { editHotelInputData } from "../validation/hotel.validation";
import { hotelService } from "../service/hotel.service";
import { toast } from 'sonner';

export function useEditHotels(){
  const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn:({hotelId,data}:{hotelId:string,data:editHotelInputData}) => hotelService.editHotelsService(hotelId,data),
        onSuccess:() =>{
            queryClient.invalidateQueries({queryKey:["hotels"]});
            toast.success("Hotel Updated successfully")
        },
        onError:(error:any) =>{
            const message = error?.response?.data?.message || "something went wrong";
            toast.error(message)
        }
    })

    return {
        editHotel:mutation.mutate,
        isPending:mutation.isPending
    }
}