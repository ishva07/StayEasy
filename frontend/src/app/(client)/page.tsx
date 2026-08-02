"use client";

import { useSearchParams } from "next/navigation";
import { useHotels } from "@/features/hotels/hooks/useHotels";
import { HotelCard } from "@/features/client/hotels/components/HotelCard";
import { Hero } from "@/features/client/hotels/components/Hero";
import { TrustStrip } from "@/features/client/hotels/components/TrustStrip";
import { FeaturedCarousel } from "@/features/client/hotels/components/FeaturedCarousel";

export default function HomePage() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") ?? "";

  const { data: featuredData, isLoading: isFeaturedLoading } = useHotels({
    page: 1,
    limit: 8,
    featured: true,
  });

  const { data: allHotelsData, isLoading: isAllLoading } = useHotels({
    page: 1,
    limit: 12,
    search,
  });

  return (
    <div>
      <Hero />

      <div className="pt-16 sm:pt-20">
        <section className="max-w-5xl mx-auto px-4">
          <TrustStrip />
        </section>

        {!search && (
  <section className="max-w-6xl mx-auto px-4 pt-16">
    <div className="flex items-baseline justify-between mb-6">
      <h2 className="font-display text-2xl font-bold">Featured stays</h2>
      <p className="text-xs text-muted-foreground uppercase tracking-wide">
        Handpicked for you
      </p>
    </div>
    {isFeaturedLoading ? (
      <p className="text-sm text-muted-foreground">Loading...</p>
    ) : featuredData?.data?.length ? (
      <FeaturedCarousel hotels={featuredData.data} />
    ) : (
      <p className="text-sm text-muted-foreground">No featured hotels yet.</p>
    )}
  </section>
)}

        <section className="max-w-6xl mx-auto px-4 py-16">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="font-display text-2xl font-bold">
              {search ? `Stays in "${search}"` : "All stays"}
            </h2>
          </div>

          {isAllLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : allHotelsData?.data?.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {allHotelsData.data.map((hotel: any) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No stays found.</p>
          )}
        </section>
      </div>
    </div>
  );
}