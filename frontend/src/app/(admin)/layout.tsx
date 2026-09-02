"use client";

import { useMe } from "@/features/auth/hooks/useMe";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useAuthStore } from "@/stores/authStore";
import { usePermission } from "@/hooks/usePermission";
import { PERMISSIONS } from "@/constants/permissions";
import { DashboardLayout } from "@/template/dashboard-page";
import {
  BedDouble,
  Building2,
  CalendarCheck,
  Hotel,
  LayoutDashboard,
  MapPin,
  Shield,
  Star,
  Tag,
  User,
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
  const { hasPermission } = usePermission();

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

  const allNavItems = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      permission: PERMISSIONS.VIEW_DASHBOARD,
    },
    {
      label: "Hotels",
      href: "/admin/hotels",
      icon: Building2,
      permission: PERMISSIONS.VIEW_HOTEL,
    },
    {
      label: "Bookings",
      href: "/admin/bookings",
      icon: CalendarCheck,
      permission: PERMISSIONS.VIEW_BOOKiNG,
    },
    {
      label: "Reviews",
      href: "/admin/adminReviewsPage",
      icon: Star,
      permission: PERMISSIONS.VIEW_ALL_REVIEW,
    },
    {
      label: "Cities",
      href: "/admin/cities",
      icon: MapPin,
      permission: PERMISSIONS.VIEW_CITY,
    },
    {
      label: "Property Types",
      href: "/admin/property-types",
      icon: Tag,
      permission: PERMISSIONS.VIEW_PROPERTY_TYPE,
    },
    {
      label: "Amenities",
      href: "/admin/amenities",
      icon: BedDouble,
      permission: PERMISSIONS.VIEW_AMENITIES,
    },
    {
      label: "AI Search Logs",
      href: "/admin/aiSearchLog",
      icon: Building2,
      permission: PERMISSIONS.VIEW_AI_SEARCH_LOG,
    },
    {
      label: "Users",
      href: "/admin/users",
      icon: User,
      permission: PERMISSIONS.VIEW_USER,
    },
    {
      label: "Roles",
      href: "/admin/roles",
      icon: Shield,
      permission: PERMISSIONS.VIEW_ROLE,
    },
  ];

  const navItems = allNavItems.filter((item) => hasPermission(item.permission));

  return (
    <div className="theme-admin">
      <DashboardLayout
        appName="Stay Easy"
        user={{ email: user.email, role: user.role }}
        onLogout={() => logout()}
        isLoggingOut={isLoggingOut}
        navItems={navItems}
      >
        {children}
      </DashboardLayout>
    </div>
  );
}