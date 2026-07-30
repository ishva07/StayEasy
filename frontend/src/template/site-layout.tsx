"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon, LogOut, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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
      <header className="h-16 border-b sticky top-0 bg-background z-50">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 md:px-6">
          <Link href="/" className="font-semibold text-lg text-primary">
            {appName}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm transition-colors",
                  pathname === href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right side: auth-aware */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 rounded-full px-2 py-1 hover:bg-muted transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                      {(user.name ?? user.email).slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium truncate">
                      {user.name ?? "My Account"}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuItem render={<Link href="/my-bookings" />}>
                    My Bookings
                  </DropdownMenuItem>

                  <DropdownMenuItem render={<Link href="/profile" />}>
                    Profile
                  </DropdownMenuItem>
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
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>

                <Link href="/login?tab=register">
                  <Button size="sm">Sign Up</Button>
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
          <div className="md:hidden border-t px-4 py-3 space-y-1 bg-background">
            {navItems.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-md text-sm",
                  pathname === href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted",
                )}
              >
                {label}
              </Link>
            ))}
            <div className="pt-2 border-t mt-2">
              {user ? (
                <>
                  <Link href="/my-bookings" className="block px-3 py-2 text-sm">
                    My Bookings
                  </Link>
                  <button
                    onClick={() => onLogout?.()}
                    className="block w-full text-left px-3 py-2 text-sm text-red-600"
                  >
                    Logout
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
      <footer className="border-t py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {appName}. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
