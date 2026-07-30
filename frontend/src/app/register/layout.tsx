"use client"

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="theme-client min-h-screen flex items-center justify-center bg-muted/40">
      {children}
    </div>
  );
}