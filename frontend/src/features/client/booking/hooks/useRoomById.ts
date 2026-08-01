import { roomServices } from "@/features/rooms/services/room.service";
import { useQuery } from "@tanstack/react-query";

export function useRoomById(hotelId: string, roomId: string) {
  return useQuery({
    queryKey: ["room", hotelId, roomId],
    queryFn: () => roomServices.getRoomByIdService(hotelId, roomId),
    enabled: !!hotelId && !!roomId,
  });
}