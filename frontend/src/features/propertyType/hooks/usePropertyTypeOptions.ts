import { useQuery } from "@tanstack/react-query";
import { propertyTypeService } from "../service/propertyType.service";

interface GetPropertyTypeParams {
  page: number;
  limit: number;
  sortBy: string;
  order: string;
}

const defaultParams: GetPropertyTypeParams = {
  page: 1,
  limit: 10,
  sortBy: "name",
  order: "asc",
};

export function useGetPropertyType() {
   return useQuery({
    queryKey: ["propertyTypes", "all"],
    queryFn: () => propertyTypeService.getAllPropertyTypeApi(),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
}

export function useGetPropertyTypes(params: GetPropertyTypeParams = defaultParams) {
  return useQuery({
    queryKey: ["propertyTypes", params],
    queryFn: () => propertyTypeService.getPropertyTypeApi(params),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });
}