import { useQuery } from "@tanstack/react-query";
import { roomServices } from "../services/room.service";

export function useGetRoom(hotelId: string, page = 1, limit = 10, sortBy = "createdAt", order = "desc") {
    return useQuery({
        queryKey: ["rooms", hotelId, { page, limit, sortBy, order }],
        queryFn: () => roomServices.getRoomService(hotelId, page, limit, sortBy, order),
        enabled: !!hotelId,
    });
}