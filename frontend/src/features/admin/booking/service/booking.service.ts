import api from "@/services/api"
import { BookingStatus } from "../types/booking.type";

export const bookingService = {
    changeBookingStatus : async(bookingId:string,status:BookingStatus)=>{
        const res = await api.put(`/bookings/${bookingId}/status`,{status});
        return res.data.data;
    },

    getAllBooking : async(page=1,limit=10,sortBy="createdAt",order="desc")=>{
        const res = await api.get(`/bookings`,{params:{page,limit,sortBy,order}});
        return res.data.data.data;
    }
}