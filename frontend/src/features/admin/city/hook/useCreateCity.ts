import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cityService } from "../services/city.service";
import { toast } from "sonner";

export function useCreateCity(){
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn:({name,cityImage}:{name:string,cityImage:File})=> cityService.createCityApi(name,cityImage),
        onSuccess:() => {
             queryClient.invalidateQueries({queryKey:["cities"]});
             toast.success("city added successfully")
        },
        onError:(error:any)=>{
            const message = error?.response?.data?.message ?? "something went wrong";
            toast.error(message);
        }
    })
    return{
        createCity:mutation.mutate,
        isPending:mutation.isPending
    }
}