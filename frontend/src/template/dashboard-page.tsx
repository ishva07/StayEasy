"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon, LogOut, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface UserInfo {
  email: string;
  role: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  appName?: string;
  onLogout?: () => void;
  isLoggingOut?: boolean;
  user?: UserInfo;
}

export function DashboardLayout({
  children,
  navItems,
  appName = "MyApp",
  onLogout,
  isLoggingOut = false,
  user,
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
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>

        {/* 👇 User section with 3-dot dropdown */}
        {user && (
          <div className="border-t p-3">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left hover:bg-muted transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {user.email.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.email}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {user.role}
                  </p>
                </div>
                <MoreVertical className="h-4 w-4 text-muted-foreground shrink-0" />
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" side="top" className="w-52">
                <DropdownMenuItem
                  onClick={() => onLogout?.()}
                  disabled={isLoggingOut}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  {isLoggingOut ? "Logging out..." : "Logout"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
