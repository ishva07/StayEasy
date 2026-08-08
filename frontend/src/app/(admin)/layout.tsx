"use client";

import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAuthStore((s) => s.user);
  const { logout, isPending: isLoggingOut } = useLogout();

  return (
    <ProtectedRoute redirectTo="/login">
      <div className="theme-admin">
        <DashboardLayout
          appName="Stay Easy"
          user={{ email: user?.email ?? "", role: user?.role ?? "user" }}
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
          ]}
        >
          {children}
        </DashboardLayout>
      </div>
    </ProtectedRoute>
  );
}
