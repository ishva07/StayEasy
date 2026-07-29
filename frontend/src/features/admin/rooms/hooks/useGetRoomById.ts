import { useQuery } from "@tanstack/react-query";
import { roomServices } from "../service/room.service";

export function useGetRoomById(hotelId: string, roomId: string) {
    return useQuery({
        queryKey: ["room", hotelId, roomId],
        queryFn: () => roomServices.getRoomById(hotelId, roomId),
        enabled: !!hotelId && !!roomId,
    });
}