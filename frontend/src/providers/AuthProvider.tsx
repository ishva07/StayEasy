"use client";

import { useEffect, useState } from "react";
import { useMe } from "@/features/admin/auth/hooks/useMe";
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
            // 👈 router.push HATA DIYA — guest ko yahin rehne do, redirect ka faisla
            // page-level ProtectedRoute lega, AuthProvider nahi
        }
    }, [isError]);

    // 👈 poora app block karne wala loading screen bhi HATA DIYA
    // guest pages turant render honi chahiye, useMe() ka wait kiye bina

    return <>{children}</>;
}