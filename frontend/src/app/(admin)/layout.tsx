"use client";

import { useMe } from "@/features/auth/hooks/useMe";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useAuthStore } from "@/stores/authStore";
import { DashboardLayout } from "@/template/dashboard-page";
import {
  BedDouble,
  Building2,
  CalendarCheck,
  Hotel,
  LayoutDashboard,
  MapPin,
  Tag,
} from "lucide-react";
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
    return (
      <div className="theme-admin flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (isError || !user) {
    return null;
  }

  return (
    <div className="theme-admin">
      <DashboardLayout
        appName="Stay Easy"
        user={{ email: user.email, role: user.role }}
        onLogout={() => logout()}
        isLoggingOut={isLoggingOut}
        navItems={[
          {
            label: "Dashboard",
            href: "/admin/dashboard",
            icon: LayoutDashboard,
          },
          {
            label: "Hotels",
            href: "/admin/hotels",
            icon: Building2,
          },
          {
            label: "Bookings",
            href: "/admin/bookings",
            icon: CalendarCheck,
          },
          {
            label: "Cities",
            href: "/admin/cities",
            icon: MapPin,
          },
          {
            label: "Property Types",
            href: "/admin/property-types",
            icon: Tag,
          },
          {
            label: "Amenities",
            href: "/admin/amenities",
            icon: BedDouble,
          },
        ]}
      >
        {children}
      </DashboardLayout>
    </div>
  );
}
