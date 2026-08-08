import { useQuery } from "@tanstack/react-query";
import { amenityService } from "../service/amenities.service";

export function useGetAmenities(page = 1, limit = 10) {
  return useQuery({
    queryKey: ["amenities", page, limit],
    queryFn: () => amenityService.getAllAmenitiesService(page, limit),
  });
}
