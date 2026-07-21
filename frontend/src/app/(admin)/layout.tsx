"use client";

import { DashboardLayout } from "@/template/dashboard-page";
import { BedDouble, CalendarCheck, Hotel, ShoppingBag, Tag } from "lucide-react";

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardLayout
      appName="Stay Easy"
      navItems={[
        { label: "Hotels", href: "/hotels", icon: Hotel },
        { label: "Rooms", href: "/rooms", icon: BedDouble },
        { label: "Bookings", href: "/bookings", icon: CalendarCheck },
      ]}
    >
      {children}
    </DashboardLayout>
  );
}
