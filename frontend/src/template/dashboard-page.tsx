"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
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
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <aside className="w-72 bg-slate-900 text-slate-100 border-r border-slate-800/70 shadow-[0_0_0_1px_rgba(148,163,184,0.08)]">
        <div className="h-20 flex items-center border-b border-slate-800/70 px-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-300">{appName}</p>
            <p className="text-xs text-slate-500 mt-1">Admin Control Panel</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-5 space-y-2">
          {navItems.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition-all duration-200",
                pathname === href
                  ? "bg-slate-700 text-white shadow-inner"
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-100",
              )}
            >
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-800 text-slate-400 group-hover:text-slate-200">
                <Icon className="h-4 w-4" />
              </span>
              {label}
            </Link>
          ))}
        </nav>

        {user && (
          <div className="border-t border-slate-800/70 px-4 py-5 space-y-4">
            <div className="flex items-center gap-3 rounded-3xl bg-slate-900/80 px-4 py-3">
              <Avatar className="h-10 w-10 ring-1 ring-white/10">
                <AvatarFallback className="text-sm">
                  {user.email.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-white">{user.email}</p>
                <p className="text-xs text-slate-400 capitalize">{user.role}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onLogout?.()}
              disabled={isLoggingOut}
              className="flex w-full items-center justify-center gap-2 rounded-3xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-medium text-slate-100 transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <LogOut className="h-4 w-4" />
              {isLoggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        )}
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-slate-100/95 backdrop-blur-sm px-6 py-4 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Admin panel</p>
              <h1 className="text-lg font-semibold text-slate-900">{navItems.find((i) => i.href === pathname)?.label ?? appName}</h1>
            </div>
            {user && (
              <div className="rounded-3xl border border-slate-200 bg-white/90 px-4 py-2 text-sm text-slate-700 shadow-sm">
                Signed in as <span className="font-semibold">{user.email}</span>
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 px-6 py-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </div>
      </main>
    </div>
  );
}
