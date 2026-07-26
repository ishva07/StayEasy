import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface AuthUser{
    id:string;
    email:string;
    role:string;
    permission:string[];
}

interface AuthState{
    user:AuthUser|null;
    isAuthenticated:boolean;
    isHydrated:boolean;
    setUser:(user:AuthUser) =>void;
    clearUser:()=>void;
    setHydrated:()=>void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set)=>({
            user:null,
            isAuthenticated:false,
            isHydrated:false,

            setUser:(user:AuthUser)=>
            set({
                user,
                isAuthenticated:true
            }),

            clearUser: () =>
            set({
                 user:null,
                isAuthenticated:false
            }),

            setHydrated:()=>
            set({
                isHydrated:true
            })
        }),
        {
            name:"auth-store",
            partialize:(state)=>({user:state.user}),
            storage:createJSONStorage(()=>localStorage),
            skipHydration:true,
            onRehydrateStorage : () =>(state)=>{
                if(state?.user){
                    state.isAuthenticated=true;
                }
            }
        }
    )
)