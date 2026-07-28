import api from "@/services/api";
import { updateHotelAmenitiesInput } from "../validation/hotelAmenities.validation";

export const hotelAmenitiesService = {
    updateHotelAmenities : async (hotelId:string,amenities:updateHotelAmenitiesInput) => {
        const res = await api.put(`/hotels/${hotelId}/amenities`,amenities);
        return res.data.data;
    }
}