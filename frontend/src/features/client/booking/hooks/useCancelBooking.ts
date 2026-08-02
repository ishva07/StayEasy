import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingService } from "../services/booking.service";
import { toast } from "sonner";

export function useCancelBooking(){
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn:(bookingId:string)=>bookingService.cancelBooking(bookingId),

        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["myBookings"]});
            toast.success("Booking cancel successfully.");
        },

        onError:(error:any) =>{
            const message = error.response.data.message;
            toast.error(message);
        }
    });
    return {
        cancelBooking: mutation.mutate,
        isPending:mutation.isPending
    }
}