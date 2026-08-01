import api from "@/services/api";
import { Hotel, HotelResponse } from "../types/hotels.type";

export const hotelService = {
  getHotelService: async ({
    page = 1,
    limit = 10,
    sortBy = "createdAt",
    order = "desc",
    search = "",
    featured,
    amenityIds,
  }: {
    page?: number;
    limit?: number;
    sortBy?: string;
    order?: string;
    search?: string;
    featured?: boolean;
    amenityIds?: string[];
  }): Promise<HotelResponse<Hotel>> => {
    const response = await api.get("/hotels", {
      params: {
        page,
        limit,
        sortBy,
        order,
        search: search || undefined, 
        featured: featured ? "true" : undefined, 
        amenityIds: amenityIds?.length ? amenityIds.join(",") : undefined, 
      },
    });
    return response.data.data;
  },

  getHotelByIdService: async (hotelId: string) => {
    const response = await api.get(`/hotels/${hotelId}`);
    return response.data.data;
  },
};
