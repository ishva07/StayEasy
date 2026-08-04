import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cityService } from "../services/city.service";
import { toast } from "sonner";

export function useDeleteCity(){
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn:({cityId}:{cityId:string})=> cityService.deleteCityApi(cityId),
        onSuccess:() => {
             queryClient.invalidateQueries({queryKey:["cities"]});
             toast.success("city deleted successfully")
        },
        onError:(error:any)=>{
            const message = error?.response?.data?.message ?? "something went wrong while delete city";
            toast.error(message);
        }
    })
    return{
        deleteCity:mutation.mutate,
        isPending:mutation.isPending
    }
}