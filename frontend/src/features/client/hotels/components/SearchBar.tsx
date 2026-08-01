// features/client/hotel/components/SearchBar.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

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
      className="flex flex-col sm:flex-row gap-2 bg-card p-3 rounded-xl shadow-md border border-border max-w-2xl mx-auto"
    >
      <Input
        placeholder="Search by city... e.g. Ahmedabad"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="flex-1"
      />
      <Button type="submit" className="gap-2">
        <Search className="h-4 w-4" /> Search
      </Button>
    </form>
  );
}