"use client";

import { useRouter } from "next/navigation";
import { RegisterForm } from "@/features/admin/auth/components/RegisterForm";

export default function RegisterPage() {
  const router = useRouter();

  return (
    <RegisterForm
      onSuccess={() => router.push("/login")}  
    />
  );
}