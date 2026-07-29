import { useMutation, useQueryClient,  } from "@tanstack/react-query";
import { roomServices } from "../service/room.service";
import { toast } from "sonner";
import { updateRoomFormInput } from "../validation/rooms.validation";

export function useUpdateRoom(){
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn:({hotelId,data,roomId}:{hotelId:string,data:updateRoomFormInput,roomId:string})=>roomServices.updateRoom(hotelId,data,roomId),
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["rooms"]});
            toast.success("Room Updated Successfully");
        },
        onError:(error:any)=>{
            const message = error?.response?.data?.message || "something went wrong while updating room";
            toast.error(message)
        }
    });
    return{
        updateRoom:mutation.mutate,
        isPending:mutation.isPending
    }
}