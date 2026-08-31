import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { hotelService } from "../../hotels/services/hotel.service";

interface UseHotelsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: string;
  search?: string;
  keyword?: string;          
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
}

export function useHotels({
  page = 1,
  limit = 10,
  sortBy = "createdAt",
  order = "desc",
  search = "",
  keyword = "",           
  featured,
  amenityIds,
  city,
  propertyType,
  guests,
  checkIn,
  checkOut,
  minRating,
  minPrice,
  maxPrice
}: UseHotelsParams = {}) {
  return useQuery({
    queryKey: [
      "hotels",
      {
        page,
        limit,
        sortBy,
        order,
        search,
        keyword,         
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
      },
    ],
    placeholderData: keepPreviousData,
    queryFn: () =>
      hotelService.getHotelService({
        page,
        limit,
        sortBy,
        order,
        search,
        keyword,          
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
      }),
  });
}