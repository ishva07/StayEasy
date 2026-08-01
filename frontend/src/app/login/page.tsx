"use client";

import { useRouter } from "next/navigation";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  const router = useRouter();

  const handleSuccess = (user: any) => {
      console.log("LOGIN SUCCESS - role received:", user?.role, user); 

    if (user?.role === "admin") {   
      router.push("/admin/dashboard");
    } else {
      router.push(`/`);
    }
  };

  return <LoginForm onSuccess={handleSuccess} />;
}