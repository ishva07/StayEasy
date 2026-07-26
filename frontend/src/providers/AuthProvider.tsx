"use client";

import { useEffect, useState } from "react";
import { useMe } from "@/features/admin/auth/hooks/useMe";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isRehydrated, setIsRehydrated] = useState(false);
    const router = useRouter();

    const setUser = useAuthStore((state) => state.setUser);
    const clearUser = useAuthStore((state) => state.clearUser);

    const { data: user, isSuccess, isError, isFetched } = useMe();

    // Step 1: Zustand persist ko manually rehydrate karo (skipHydration: true tha)
    useEffect(() => {
        useAuthStore.persist.rehydrate();
        setIsRehydrated(true);
    }, []);

    // Step 2: server se verify hone ke baad Zustand ko sync karo
    useEffect(() => {
        if (isSuccess && user) {
            setUser(user);
        }
    }, [isSuccess, user]);

    useEffect(() => {
        if (isError) {
            clearUser();
             if (window.location.pathname !== "/login") {
            router.push("/login");  
        }
        }
    }, [isError]);

    // Jab tak rehydration + server verification dono complete na ho, kuch mat dikhao
    if (!isRehydrated || !isFetched) {
        return (
            <div className="flex h-screen items-center justify-center">
                <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
        );
    }

    return <>{children}</>;
}