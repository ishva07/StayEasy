"use client";

import { useRouter } from "next/navigation";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "@/features/auth/services/auth.service";
import { useAuthStore } from "@/stores/authStore";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const [isValidating, setIsValidating] = useState(false);

  const handleSuccess = async (user: any) => {
    try {
      setIsValidating(true);
      const validatedUser = await queryClient.fetchQuery({
        queryKey: ["me"],
        queryFn: () => authService.meApi(),
        retry: false,
      });

      queryClient.setQueryData(["me"], validatedUser);
      setUser(validatedUser);

      if (validatedUser?.role === "admin") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/");
      }
    } catch (err) {
      console.error("me validation failed after login", err);
      router.replace("/login");
    } finally {
      setIsValidating(false);
    }
  };

  if (isValidating) {
    return <div className="flex h-screen items-center justify-center">Validating session...</div>;
  }

  return <LoginForm onSuccess={handleSuccess} />;
}