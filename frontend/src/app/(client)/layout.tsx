"use client";

import { useMe } from "@/features/admin/auth/hooks/useMe";
import { useLogout } from "@/features/admin/auth/hooks/useLogout";
import { useAuthStore } from "@/stores/authStore";
import { SiteLayout } from "@/template/site-layout";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isFetched } = useMe();          
  const user = useAuthStore((s) => s.user);
  const { logout, isPending: isLoggingOut } = useLogout();

  return (
    <div className="theme-client">
      <SiteLayout
        appName="StayEasy"
        user={isFetched ? user : null}  
        onLogout={() => logout()}
        isLoggingOut={isLoggingOut}
        navItems={[
          { label: "Home", href: "/" },
          { label: "My Bookings", href: "/my-bookings" },
        ]}
      >
        {children}
      </SiteLayout>
    </div>
  );
}