"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ThemeClassSetter() {
  const pathname = usePathname();

  useEffect(() => {
    const themeClass = pathname?.startsWith("/admin") ? "theme-admin" : "theme-client";
    document.body.classList.remove("theme-admin", "theme-client");
    document.body.classList.add(themeClass);
  }, [pathname]);

  return null;
}