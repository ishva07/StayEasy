import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cityService } from "../services/city.service";
import { toast } from "sonner";

export function useEditCity(){
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn:({cityId,name,cityImage}:{cityId?:string,name?:string,cityImage?:File})=> cityService.editCityApi(cityId,name,cityImage),
        onSuccess:() => {
             queryClient.invalidateQueries({queryKey:["cities"]});
             toast.success("city updated successfully")
        },
        onError:(error:any)=>{
            const message = error?.response?.data?.message ?? "something went wrong while edit city";
            toast.error(message);
        }
    })
    return{
        editCity:mutation.mutate,
        isPending:mutation.isPending
    }
}