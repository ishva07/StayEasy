import { useQuery } from "@tanstack/react-query";
import { propertyTypeService } from "../service/propertyType.service";

export function useGetPropertyType() {
  return useQuery({
    queryKey: ["propertyTypes"],
    queryFn: () => propertyTypeService.getPropertyTypeApi(),
    refetchOnWindowFocus:false,
    staleTime: 1000 * 60 * 5
  });
}