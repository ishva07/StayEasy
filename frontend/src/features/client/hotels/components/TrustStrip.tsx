import { ShieldCheck, BadgeCheck, HeadphonesIcon } from "lucide-react";

const items = [
  { icon: BadgeCheck, label: "Verified Stays", desc: "Every listing checked" },
  { icon: ShieldCheck, label: "Free Cancellation", desc: "On most bookings" },
  { icon: HeadphonesIcon, label: "24/7 Support", desc: "Always here to help" },
];

export function TrustStrip() {
  return (
    <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      {items.map(({ icon: Icon, label, desc }) => (
        <div
          key={label}
          className="flex items-center gap-3 bg-card border border-border rounded-2xl px-5 py-4"
        >
          <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center shrink-0">
            <Icon className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-muted-foreground">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}