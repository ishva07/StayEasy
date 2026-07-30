"use client";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-client min-h-screen flex items-center justify-center bg-muted/40">
      {children}
    </div>
  );
}