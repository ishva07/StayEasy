import { useQuery } from "@tanstack/react-query";
import { cityService } from "../services/city.service";

export function getCity(){
    return useQuery({
        queryKey:["cities"],
        queryFn:()=> cityService.getCityApi()
    })
}