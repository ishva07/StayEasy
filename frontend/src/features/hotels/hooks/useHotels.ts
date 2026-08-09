import { useQuery } from "@tanstack/react-query";
import { hotelService } from "../../hotels/services/hotel.service";

interface UseHotelsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: string;
  search?: string;
  featured?: boolean;
  amenityIds?: string[];
  city?: string;
  propertyType?: string;
}

export function useHotels({
  page = 1,
  limit = 10,
  sortBy = "createdAt",
  order = "desc",
  search = "",
  featured,
  amenityIds,
  city,
  propertyType,
}: UseHotelsParams = {}) {
  return useQuery({
    queryKey: ["hotels", { page, limit, sortBy, order, search, featured, amenityIds, city, propertyType }],
    queryFn: () =>
      hotelService.getHotelService({ page, limit, sortBy, order, search, featured, amenityIds, city, propertyType }),
  });
}