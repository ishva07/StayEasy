import { useMutation, useQueryClient,  } from "@tanstack/react-query";
import { roomServices } from "../service/room.service";
import { toast } from "sonner";

export function useDeleteRoom(){
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn:({hotelId,roomId}:{hotelId:string,roomId:string})=>roomServices.deleteRoom(hotelId,roomId),
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["rooms"]});
            toast.success("Room Deleted Successfully");
        },
        onError:(error:any)=>{
            const message = error?.response?.data?.message || "something went wrong while deleting room";
            toast.error(message)
        }
    });
    return{
        deleteRoom:mutation.mutate,
        isPending:mutation.isPending
    }
}