"use client";

import { useEffect, useState } from "react";
import { useMe } from "@/features/auth/hooks/useMe";
import { useAuthStore } from "@/stores/authStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isRehydrated, setIsRehydrated] = useState(false);

    const setUser = useAuthStore((state) => state.setUser);
    const clearUser = useAuthStore((state) => state.clearUser);

    const { data: user, isSuccess, isError, isFetched } = useMe();

    useEffect(() => {
        useAuthStore.persist.rehydrate();
        setIsRehydrated(true);
    }, []);

    useEffect(() => {
        if (isSuccess && user) {
            setUser(user);
        }
    }, [isSuccess, user]);

    useEffect(() => {
        if (isError) {
            clearUser();
        }
    }, [isError]);

    return <>{children}</>;
}