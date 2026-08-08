import { useQuery } from "@tanstack/react-query";
import { cityService } from "../../city/service/city.service";

export function getCity(){
    return useQuery({
        queryKey:["cities"],
        queryFn:()=> cityService.getCityApi()
    })
}