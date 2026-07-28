import { useQuery } from "@tanstack/react-query";
import { hotelService } from "../service/hotel.service";

export  function useHotelById (hotelId:string){
    return useQuery({
        queryKey:["hotelById",hotelId],
        queryFn:()=> hotelService.getHotelByIdService(hotelId),
        enabled: !!hotelId
    })
}