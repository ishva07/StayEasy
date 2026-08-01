import { useQuery } from "@tanstack/react-query";
import { roomServices } from "../services/room.service";

export function useGetRoomById(hotelId: string, roomId: string) {
    return useQuery({
        queryKey: ["room", hotelId, roomId],
        queryFn: () => roomServices.getRoomByIdService(hotelId, roomId),
        enabled: !!hotelId && !!roomId,
    });
}