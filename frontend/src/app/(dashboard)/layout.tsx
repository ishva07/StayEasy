"use client"

import { DashboardLayout } from "@/template/dashboard-page"
import { ShoppingBag, Tag } from "lucide-react"

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
    return (
        <DashboardLayout
            appName="My Shop"
            navItems={[
                { label: "Products", href: "/products", icon: ShoppingBag },
                {label:"Category", href:"/category", icon:Tag}
            ]}
        >
            {children}
        </DashboardLayout>
    )
}