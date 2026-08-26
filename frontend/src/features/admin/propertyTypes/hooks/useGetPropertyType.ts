import { useQuery } from "@tanstack/react-query";
import { propertyTypeService } from "../service/propertyType.service";

export function useGetPropertyType(params: any) {
  return useQuery({
    queryKey: ["propertyTypes", params],
    queryFn: () => propertyTypeService.getPropertyTypeApi(params),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
}