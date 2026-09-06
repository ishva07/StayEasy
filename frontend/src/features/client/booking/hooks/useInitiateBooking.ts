import { useMutation } from "@tanstack/react-query";
import api from "@/services/api";

interface InitiateBookingResponse {
  holdId: string;
  roomId: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  razorpayOrderId: string;
  razorpayKeyId: string;
  amount: number;
  currency: string;
  guest: number
}

export function useInitiateBooking() {
  return useMutation({
    mutationFn: async (data: { roomId: string; checkIn: string; checkOut: string, guests: number
     }) => {
      const res = await api.post("/bookings/initiate", data);
      return res.data.data as InitiateBookingResponse;
    },
  });
}