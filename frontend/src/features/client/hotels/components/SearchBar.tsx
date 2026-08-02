"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchBar() {
  const router = useRouter();
  const [city, setCity] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city.trim()) params.set("search", city.trim());
    router.push(`/?${params.toString()}`);
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
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="border-0 shadow-none focus-visible:ring-0 px-0 h-6 text-sm font-medium"
        />
      </div>

      <div className="flex-1 px-6 py-4 sm:border-r border-border/60">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
          Check-In
        </p>
        <p className="text-sm text-muted-foreground/70">Add date</p>
      </div>

      <div className="flex-1 px-6 py-4 sm:border-r border-border/60">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
          Check-out
        </p>
        <p className="text-sm text-muted-foreground/70">Add date</p>
      </div>

      <div className="flex-1 px-6 py-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
          Guests
        </p>
        <p className="text-sm text-muted-foreground/70">Add guests</p>
      </div>

      <div className="p-2 flex items-center">
        <Button type="submit" size="icon" className="rounded-full h-12 w-12 shrink-0">
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}