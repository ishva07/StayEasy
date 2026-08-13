"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getCity } from "@/features/city/hooks/useGetCity";

export function SearchBar() {
  const router = useRouter();
  const { data: cities } = getCity(); 

  const [cityInput, setCityInput] = useState(""); 
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

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

    router.push(`/search?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex flex-col sm:flex-row items-stretch max-w-3xl mx-auto
                 bg-background/90 backdrop-blur-xl rounded-2xl sm:rounded-full
                 shadow-2xl shadow-black/20 border border-white/40 overflow-hidden"
    >
      <div className="flex-1 px-6 py-4 sm:border-r border-border/60">
        <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
          Destination
        </label>
        <Input
          placeholder="Where to?"
          value={cityInput}
          onChange={(e) => setCityInput(e.target.value)}
          list="city-options"
          className="border-0 shadow-none focus-visible:ring-0 px-0 h-6 text-sm font-medium"
        />
        <datalist id="city-options">
          {cities?.map((c: any) => (
            <option key={c.id} value={c.name} />
          ))}
        </datalist>
      </div>

      <div className="flex-1 px-6 py-4 sm:border-r border-border/60">
        <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
          Check-In
        </label>
        <input
          type="date"
          value={checkIn}
          min={new Date().toISOString().split("T")[0]}
          onChange={(e) => setCheckIn(e.target.value)}
          className="w-full border-0 bg-transparent p-0 text-sm text-foreground focus:outline-none"
        />
      </div>

      <div className="flex-1 px-6 py-4 sm:border-r border-border/60">
        <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
          Check-out
        </label>
        <input
          type="date"
          value={checkOut}
          min={checkIn || new Date().toISOString().split("T")[0]}
          onChange={(e) => setCheckOut(e.target.value)}
          className="w-full border-0 bg-transparent p-0 text-sm text-foreground focus:outline-none"
        />
      </div>

      <div className="flex-1 px-6 py-4">
        <label className="block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
          Guests
        </label>
        <input
          type="number"
          min={1}
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full border-0 bg-transparent p-0 text-sm text-foreground focus:outline-none"
        />
      </div>

      <div className="p-2 flex items-center">
        <Button type="submit" size="icon" className="rounded-full h-12 w-12 shrink-0">
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}