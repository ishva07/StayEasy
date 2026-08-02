"use client";

import { Fraunces } from "next/font/google";
import { useMe } from "@/features/auth/hooks/useMe";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useAuthStore } from "@/stores/authStore";
import { SiteLayout } from "@/template/site-layout";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isFetched } = useMe();
  const user = useAuthStore((s) => s.user);
  const { logout, isPending: isLoggingOut } = useLogout();

  return (
    <div className={`theme-client ${fraunces.variable}`}>
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