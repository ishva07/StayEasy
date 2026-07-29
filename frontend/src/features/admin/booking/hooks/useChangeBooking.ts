import { useMutation, useQueryClient,  } from "@tanstack/react-query";
import { toast } from "sonner";
import { bookingService } from "../service/booking.service";
import { BookingStatus } from "../types/booking.type";

export function useChangeBookingStatus(){
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn:({bookingId,status}:{bookingId:string,status:BookingStatus})=>bookingService.changeBookingStatus(bookingId,status),
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["bookings"]});
            toast.success("Booking Status Updated Successfully");
        },
        onError:(error:any)=>{
            const message = error?.response?.data?.message || "something went wrong while changing status of room booking";
            toast.error(message)
        }
    });
    return{
        changeBookingStatus:mutation.mutate,
        isPending:mutation.isPending
    }
}