"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMe } from "@/features/auth/hooks/useMe";
import { Permission } from "@/constants/permissions";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: Permission;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredPermission,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const router = useRouter();
  const { data: user, isFetched, isError } = useMe();   

  const hasPermission = (permission: Permission) =>
    user?.permissions?.includes(permission) ?? false;

  const isAuthorized =
    !!user && (!requiredPermission || hasPermission(requiredPermission));

  useEffect(() => {
    if (!isFetched) return;

    if (isError || !user) {
      router.replace(redirectTo);
      return;
    }

    if (!isAuthorized) {
      router.replace("/unauthorized");
    }
  }, [isFetched, isError, user, isAuthorized]);

  if (!isFetched) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (isError || !user || !isAuthorized) {
    return null;
  }

  return <>{children}</>;
}