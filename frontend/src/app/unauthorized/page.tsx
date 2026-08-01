"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4 text-center px-4">
      <ShieldAlert className="h-12 w-12 text-destructive" />
      <h1 className="text-xl font-semibold">Access Denied</h1>
      <p className="text-sm text-muted-foreground max-w-sm">
        You don't have permission to view this page. If you think this is a mistake, contact your administrator.
      </p>
      <Button>
        <Link href="/">Go to Home</Link>
      </Button>
    </div>
  );
}