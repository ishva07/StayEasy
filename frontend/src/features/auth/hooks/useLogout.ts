import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/auth.service";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";

export function useLogout(){
    const route = useRouter();
    const clearUser = useAuthStore((state) => state.clearUser);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn:()=>authService.logoutApi(),
        onSuccess: () =>{
            clearUser();
            queryClient.clear();
            route.push("/login")
        },
        onError:(error:any) =>{
            const message = error.response.data.message ?? "Something went wrong"
            toast.error(message)
        }
    })

    return {
        logout:mutation.mutate,
        isPending:mutation.isPending
    }
}