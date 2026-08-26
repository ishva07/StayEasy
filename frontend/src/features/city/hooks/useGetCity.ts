import { useQuery } from "@tanstack/react-query";
import { cityService } from "../../city/service/city.service";

interface GetCityParams {
  page: number;
  limit: number;
  sortBy: string;
  order: string;
}

const defaultParams: GetCityParams = {
  page: 1,
  limit: 10,
  sortBy: "name",
  order: "asc",
};

export function getCity(params: GetCityParams = defaultParams){
    return useQuery({
        queryKey:["cities", params],
        queryFn:()=> cityService.getCityApi(params),
        refetchOnWindowFocus:false,
        staleTime: 1000 * 60 * 5,
    })
}