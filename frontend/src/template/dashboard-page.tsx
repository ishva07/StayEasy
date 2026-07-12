"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  appName?: string;
  onLogout?: () => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function DashboardLayout({
  children,
  navItems,
  appName = "MyApp",
  onLogout,
}: DashboardLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <aside className="w-60 border-r flex flex-col">
        <div className="h-16 flex items-center px-6 border-b">
          <span className="font-semibold text-sm">{appName}</span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                pathname === href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        {onLogout && (
          <div className="p-3 border-t">
            <button
              onClick={onLogout}
              className="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        )}
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b flex items-center px-6">
          <span className="text-sm text-muted-foreground">
            {navItems.find((i) => i.href === pathname)?.label ?? appName}
          </span>
        </header>

        <div className="flex-1 p-6">{children}</div>
      </main>
    </div>
  );
}