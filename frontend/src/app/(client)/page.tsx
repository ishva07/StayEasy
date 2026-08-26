"use client";

import { useHotels } from "@/features/hotels/hooks/useHotels";
import { Hero } from "@/features/client/hotels/components/Hero";
import { TrustStrip } from "@/features/client/hotels/components/TrustStrip";
import { FeaturedCarousel } from "@/features/client/hotels/components/FeaturedCarousel";
import { useGetAllCity } from "@/features/city/hooks/useGetAllCity";
import { useGetPropertyType } from "@/features/propertyType/hooks/usePropertyTypeOptions";
import { CityCarousel } from "@/features/client/hotels/components/CityCarousel";
import { PropertyTypeCarousel } from "@/features/client/hotels/components/PropertyTypeCarousel";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  const { data: cities, isLoading: isCitiesLoading } = useGetAllCity();
  const { data: propertyTypes, isLoading: isTypesLoading } = useGetPropertyType();

  const {
    data: featuredData,
    isLoading: isFeaturedLoading,
    error: featuredError,
  } = useHotels({
    page: 1,
    limit: 8,
    featured: true,
  });

  const {
    data: popularData,
    isLoading: isPopularLoading,
    error: popularError,
  } = useHotels({
    page: 1,
    limit: 8,
    sortBy: "popular",
  });

  return (
    <div>
      <Hero />

      <div className="pt-14 sm:pt-16">
        <section className="max-w-5xl mx-auto px-4">
          <TrustStrip />
        </section>

        {/* 1. Featured stays — big cards, strong open */}
        <section className="max-w-6xl mx-auto px-4 pt-20">
          <div className="flex items-end justify-between mb-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1.5">
                Handpicked for you
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold">
                Featured stays
              </h2>
            </div>
          </div>
          {isFeaturedLoading ? (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : featuredError ? (
            <p className="text-sm text-red-600">Couldn't load featured stays. Please try again.</p>
          ) : featuredData?.data?.length ? (
            <FeaturedCarousel hotels={featuredData.data} />
          ) : (
            <p className="text-sm text-muted-foreground">No featured hotels yet.</p>
          )}
        </section>

        {/* 2. Browse by city — medium cards */}
        <section className="max-w-6xl mx-auto px-4 pt-20">
          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1.5">
              Explore by destination
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold">
              Browse by city
            </h2>
          </div>
          {isCitiesLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : cities?.length ? (
            <CityCarousel cities={cities} />
          ) : (
            <p className="text-sm text-muted-foreground">No cities yet.</p>
          )}
        </section>

        {/* 3. Browse by property type — circles */}
        <section className="max-w-6xl mx-auto px-4 pt-20">
          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1.5">
              Find your style
            </p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold">
              Browse by property type
            </h2>
          </div>
          {isTypesLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : propertyTypes?.length ? (
            <PropertyTypeCarousel types={propertyTypes} />
          ) : (
            <p className="text-sm text-muted-foreground">No property types yet.</p>
          )}
        </section>

        {/* 4. Most popular stays — big cards again, strong close */}
        <section className="max-w-6xl mx-auto px-4 pt-20 pb-20">
          <div className="flex items-end justify-between mb-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1.5">
                Guest favorites
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-semibold">
                Most popular stays
              </h2>
            </div>
          </div>
          {isPopularLoading ? (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : popularError ? (
            <p className="text-sm text-red-600">Couldn't load popular stays. Please try again.</p>
          ) : popularData?.data?.some((h: any) => h.reviewCount > 0) ? (
            <FeaturedCarousel hotels={popularData.data.filter((h: any) => h.reviewCount > 0)} />
          ) : (
            <p className="text-sm text-muted-foreground">Not enough reviews yet to show popular stays.</p>
          )}

          <div className="flex justify-center mt-10">
            <Link
              href="/search"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline underline-offset-4"
            >
              View all stays
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}