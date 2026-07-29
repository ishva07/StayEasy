import { useMutation, useQueryClient,  } from "@tanstack/react-query";
import { roomServices } from "../service/room.service";
import { createRoomFormInput } from '../validation/rooms.validation';
import { toast } from "sonner";

export function useCreateRoom(){
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn:({hotelId,data}:{hotelId:string,data:createRoomFormInput})=>roomServices.createRoom(hotelId,data),
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["rooms"]});
            toast.success("Room Created Successfully");
        },
        onError:(error:any)=>{
            const message = error?.response?.data?.message || "something went wrong while creating room";
            toast.error(message)
        }
    });
    return{
        createRoom:mutation.mutate,
        isPending:mutation.isPending
    }
}