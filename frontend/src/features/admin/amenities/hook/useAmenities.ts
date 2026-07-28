import { useQuery } from "@tanstack/react-query";
import { amenityService } from "../service/amenities.service";

export function useAmenityOptions() {
    return useQuery({
        queryKey: ["amenities", "options"],
        queryFn: () => amenityService.getAllAmenitiesOptionService(),
    });
}