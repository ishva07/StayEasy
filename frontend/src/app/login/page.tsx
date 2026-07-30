"use client";

import { useRouter } from "next/navigation";
import { LoginForm } from "@/features/admin/auth/components/LoginForm";

export default function LoginPage() {
  const router = useRouter();

  const handleSuccess = (user: any) => {
    if (user?.role === "admin") {   // aapke backend mein role name "user"/"admin" hai (Role table se) - naam confirm kar lena
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  };

  return <LoginForm onSuccess={handleSuccess} />;
}