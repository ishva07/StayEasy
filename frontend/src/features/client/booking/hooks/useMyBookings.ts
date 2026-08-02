import { useQuery } from "@tanstack/react-query";
import { bookingService } from "../services/booking.service";

export function useMyBookings(){
    return useQuery({
        queryKey:["myBookings"],
        queryFn:()=> bookingService.getMyBooking()   
    })
}