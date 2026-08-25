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
  city,
  propertyType,
  guests,
  checkIn,
  checkOut,
  minRating,
  minPrice,
  maxPrice,
}: {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: string;
  search?: string;
  featured?: boolean;
  amenityIds?: string[];
  city?: string;
  propertyType?: string;
  guests?: number;
  checkIn?: string;
  checkOut?: string;
  minRating?: number;
  minPrice?: number;
  maxPrice?: number;
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
      city: city || undefined,
      propertyType: propertyType || undefined,
      guests: guests || undefined,
      checkIn: checkIn || undefined,
      checkOut: checkOut || undefined,
      minRating: minRating || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
    },
  });
  return response.data.data;
},

  getHotelByIdService: async (hotelId: string) => {
    const response = await api.get(`/hotels/${hotelId}`);
    return response.data.data;
  },
};
