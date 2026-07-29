import { useQuery } from "@tanstack/react-query";
import { roomServices } from "../service/room.service";

export function useGetRoom(hotelId: string, page = 1, limit = 10, sortBy = "createdAt", order = "desc") {
    return useQuery({
        queryKey: ["rooms", hotelId, { page, limit, sortBy, order }],
        queryFn: () => roomServices.getRooms(hotelId, page, limit, sortBy, order),
        enabled: !!hotelId,
    });
}