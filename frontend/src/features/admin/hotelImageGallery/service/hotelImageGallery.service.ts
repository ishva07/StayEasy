import api from "@/services/api";
import { updateHotelImageGalleryInput } from "../validation/hotelImageGallery.validation";

export const hotelImageGalleryService = {
    updateHotelImageGallery: async (hotelId: string, data: updateHotelImageGalleryInput) => {
        const formData = new FormData();
        data.imageGallery.forEach((file) => formData.append("imageGallery", file));
        formData.append("existingUrls", JSON.stringify(data.existingUrls));
        const res = await api.put(`/hotels/${hotelId}/images`, formData);
        return res.data.data;
    }
}