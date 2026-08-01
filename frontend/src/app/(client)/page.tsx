"use client";

import { useSearchParams } from "next/navigation";
import { useHotels } from "@/features/hotels/hooks/useHotels";
import { HotelCard } from "@/features/client/hotels/components/HotelCard";
import { SearchBar } from "@/features/client/hotels/components/SearchBar";

export default function Home() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";

  const { data: featuredData, isLoading: isFeaturedLoading } = useHotels({
    page: 1,
    limit: 6,
    featured: true,
  });

  const { data: allHotelsData, isLoading: isAllLoading } = useHotels({
    page: 1,
    limit: 12,
    search,
  });

  return (
    <div className="space-y-12">
      {/* Hero + Search */}
      <section className="bg-gradient-to-b from-accent to-background py-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Find your perfect stay
          </h1>
          <p className="text-muted-foreground">
            Search hotels across your favorite destinations
          </p>
          <SearchBar />
        </div>
      </section>

      {!search && (
        <section className="max-w-6xl mx-auto px-4">
          <h2 className="text-xl font-semibold mb-4">Featured Hotels</h2>
          {isFeaturedLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : featuredData?.data?.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {featuredData.data.map((hotel: any) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No featured hotels yet.</p>
          )}
        </section>
      )}

      {/* All Hotels / Search Results */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <h2 className="text-xl font-semibold mb-4">
          {search ? `Results for "${search}"` : "All Hotels"}
        </h2>
        {isAllLoading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : allHotelsData?.data?.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {allHotelsData.data.map((hotel: any) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No hotels found.</p>
        )}
      </section>
    </div>
  );
}