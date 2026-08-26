import { useQuery } from "@tanstack/react-query";
import { cityService } from "../../city/service/city.service";

export function useGetAllCity(){
    return useQuery({
        queryKey:["cities", "all"],
        queryFn:()=> cityService.getAllCityApi(),
        refetchOnWindowFocus:false,
        staleTime: 1000 * 60 * 5,
    })
}
