"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, X, Building2, User, CalendarCheck, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export interface NavItem {
  label: string;
  href: string;
}

interface UserInfo {
  email: string;
  name?: string;
}

interface SiteLayoutProps {
  children: React.ReactNode;
  navItems: NavItem[];
  appName?: string;
  user?: UserInfo | null;
  onLogout?: () => void;
  isLoggingOut?: boolean;
}

export function SiteLayout({
  children,
  navItems,
  appName = "StayEasy",
  user,
  onLogout,
  isLoggingOut = false,
}: SiteLayoutProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="h-16 sticky top-0 z-50 border-b border-border/60 bg-card/95 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
              <Building2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-semibold tracking-tight">
              {appName}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative py-2 text-sm font-medium transition-colors",
                  pathname === href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
                {pathname === href && (
                  <span className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right side: auth-aware */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 border border-border hover:border-primary/40 hover:bg-accent/50 transition-colors">
                  <Avatar className="h-7 w-7 ring-2 ring-primary/20">
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground font-medium">
                      {(user.name ?? user.email).slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium max-w-[100px] truncate">
                    {user.name ? `Account`: ""}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2">
                  <div className="flex items-center gap-3 px-2 py-2.5">
                    <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                      <AvatarFallback className="text-sm bg-primary text-primary-foreground font-medium">
                        {(user.name ?? user.email).slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">
                        {user.name ?? "My Account"}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <DropdownMenuSeparator className="my-1.5" />

                  <DropdownMenuItem
                    render={<Link href="/my-bookings" />}
                    className="gap-2.5 py-2.5 px-2 rounded-lg cursor-pointer"
                  >
                    <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center shrink-0">
                      <CalendarCheck className="h-4 w-4 text-accent-foreground" />
                    </div>
                    <span className="text-sm font-medium">My Bookings</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-1.5" />

                  <DropdownMenuItem
                    onClick={() => onLogout?.()}
                    disabled={isLoggingOut}
                    className="gap-2.5 py-2.5 px-2 rounded-lg cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <div className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                      <LogOut className="h-4 w-4 text-red-600" />
                    </div>
                    <span className="text-sm font-medium">
                      {isLoggingOut ? "Logging out..." : "Logout"}
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="rounded-full">
                    Login
                  </Button>
                </Link>

                <Link href="/login?tab=register">
                  <Button size="sm" className="rounded-full px-5">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border/60 px-4 py-3 space-y-1 bg-background/95 backdrop-blur-md">
            {navItems.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-lg text-sm font-medium",
                  pathname === href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                {label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border/60 mt-2">
              {user ? (
                <>
                  <Link href="/my-bookings" className="flex items-center gap-2 px-3 py-2 text-sm">
                    <CalendarCheck className="h-4 w-4" /> My Bookings
                  </Link>
                  <Link href="/profile" className="flex items-center gap-2 px-3 py-2 text-sm">
                    <User className="h-4 w-4" /> Profile
                  </Link>
                  <button
                    onClick={() => onLogout?.()}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 text-sm text-red-600"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </>
              ) : (
                <Link href="/login" className="block px-3 py-2 text-sm">
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border/60 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {appName}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}