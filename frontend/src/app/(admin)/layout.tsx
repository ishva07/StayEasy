"use client";

import { useMe } from "@/features/admin/auth/hooks/useMe";
import { useLogout } from "@/features/admin/auth/hooks/useLogout";
import { useAuthStore } from "@/stores/authStore";
import { DashboardLayout } from "@/template/dashboard-page";
import { BedDouble, CalendarCheck, Hotel } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isError, isFetched } = useMe();
  const user = useAuthStore((s) => s.user);
  const { logout, isPending: isLoggingOut } = useLogout();

  useEffect(() => {
    if (isFetched && isError) {
      router.replace("/login");
    }
  }, [isFetched, isError]);

  if (!isFetched) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (isError || !user) {
    return null;
  }

  return (
    <DashboardLayout
      appName="Stay Easy"
      user={{ email: user.email, role: user.role }}
      onLogout={() => logout()}
      isLoggingOut={isLoggingOut}
      navItems={[
        { label: "Hotels", href: "/hotels", icon: Hotel },
        { label: "Bookings", href: "/bookings", icon: CalendarCheck },
      ]}
    >
      {children}
    </DashboardLayout>
  );
}