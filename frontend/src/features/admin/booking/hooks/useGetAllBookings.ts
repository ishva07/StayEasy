import {  useQuery } from "@tanstack/react-query";
import { bookingService } from "../service/booking.service";

export function useGetAllBookings(page=1,limit=10,sortBy="createdAt",order="desc"){
    return useQuery({
        queryKey:["bookings", page,limit,sortBy,order],
        queryFn: () => bookingService.getAllBooking(page, limit, sortBy, order),  
    })
}