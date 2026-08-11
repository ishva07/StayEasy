import { ShieldCheck, BadgeCheck, HeadphonesIcon } from "lucide-react";

const items = [
  { icon: BadgeCheck, label: "Verified Stays", desc: "Every listing checked" },
  { icon: ShieldCheck, label: "Free Cancellation", desc: "On most bookings" },
  { icon: HeadphonesIcon, label: "24/7 Support", desc: "Always here to help" },
];

export function TrustStrip() {
  return (
    <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
      {items.map(({ icon: Icon, label, desc }) => (
        <div key={label} className="flex items-center gap-2.5">
          <Icon className="h-4 w-4 text-primary shrink-0" />
          <div className="text-left">
            <p className="text-xs font-semibold uppercase tracking-wide">{label}</p>
            <p className="text-[11px] text-muted-foreground">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}