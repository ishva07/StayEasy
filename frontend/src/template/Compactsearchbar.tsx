"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { getCity } from "@/features/city/hooks/useGetCity";

export function CompactSearchBar() {
  const router = useRouter();
  const { data: cities } = getCity();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const [cityInput, setCityInput] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    
    const trimmed = cityInput.trim();
    if (trimmed) {
      const matchedCity = cities?.find(
        (c: any) => c.name.toLowerCase() === trimmed.toLowerCase()
      );
      if (matchedCity) {
        params.set("city", matchedCity.id);
      }
    }

    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    if (guests) params.set("guests", String(guests));

    setOpen(false);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm
                   text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Search stays</span>
      </button>

      {open && (
        <div
          className="absolute top-full mt-2 right-0 w-[320px] bg-card border border-border
                     rounded-2xl shadow-xl p-4 z-50"
        >
          <form onSubmit={handleSearch} className="space-y-3">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Destination
              </label>
              <input
                type="text"
                placeholder="Where to?"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                list="compact-city-options"
                className="w-full text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
              />
              <datalist id="compact-city-options">
                {cities?.map((c: any) => (
                  <option key={c.id} value={c.name} />
                ))}
              </datalist>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Check-in
                </label>
                <input
                  type="date"
                  value={checkIn}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full text-sm border border-border rounded-lg px-2 py-2 focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Check-out
                </label>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn || new Date().toISOString().split("T")[0]}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full text-sm border border-border rounded-lg px-2 py-2 focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Guests
              </label>
              <input
                type="number"
                min={1}
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full text-sm border border-border rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground
                         rounded-full py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Search className="h-3.5 w-3.5" />
              Search
            </button>
          </form>
        </div>
      )}
    </div>
  );
}