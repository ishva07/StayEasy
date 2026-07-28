import { useQuery } from "@tanstack/react-query";
import { hotelService } from "../service/hotel.service";

export function useHotels(page=1,limit=10,sortBy="createdAt",order="desc"){
    return useQuery({
        queryKey:["hotels",{page,limit,sortBy,order}],
        queryFn:()=> hotelService.getHotelService({page,limit,sortBy,order})
    })
}