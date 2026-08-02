import api from "@/services/api";

export const bookingService = {
  createBooking: async (data: { roomId: string; checkIn: string; checkOut: string }) => {
    const res = await api.post("/bookings", data);
    return res.data.data;
  },
  getBookingById: async (bookingId: string) => {
  const res = await api.get(`/bookings/${bookingId}`);
  return res.data.data;
},
 getMyBooking:async() => {
      const res = await api.get("/bookings/myBookings");
      return res.data.data;
 },
 cancelBooking:async(bookingId:string)=>{
    const res = await api.patch(`/bookings/${bookingId}/cancel`);
    return res.data.data;
 }
};