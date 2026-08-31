"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useHotels } from "@/features/hotels/hooks/useHotels";
import { useGetAllCity } from "@/features/city/hooks/useGetAllCity";
import { useGetPropertyType } from "@/features/propertyType/hooks/usePropertyTypeOptions";
import { useAmenityOptions } from "@/features/admin/amenities/hook/useAmenities";
import { HotelCard } from "@/features/client/hotels/components/HotelCard";
import { FilterSidebar } from "@/features/client/hotels/components/FilterSidebar";
import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, X } from "lucide-react";
import { AiSearchBar } from "@/features/client/aiSearch/components/AiSearchBar";
import { AiSearchResult } from "@/features/client/aiSearch/validation/aiSearch.type";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const checkIn = searchParams.get("checkIn") ?? undefined;
  const checkOut = searchParams.get("checkOut") ?? undefined;
  const guests = searchParams.get("guests")
    ? Number(searchParams.get("guests"))
    : undefined;

  const city = searchParams.get("city") ?? undefined;
  const propertyType = searchParams.get("propertyType") ?? undefined;
  const amenityIds =
    searchParams.get("amenityIds")?.split(",").filter(Boolean) ?? [];
  const search = searchParams.get("search") ?? undefined;
  const keyword = searchParams.get("keyword") ?? undefined;   
  const minRating = searchParams.get("minRating") ?? undefined;
  const page = Number(searchParams.get("page") ?? 1);
  const minPrice = searchParams.get("minPrice") ?? undefined;
  const maxPrice = searchParams.get("maxPrice") ?? undefined;

  // Calculate active filter count
  let activeFilterCount = 0;
  if (city) activeFilterCount++;
  if (propertyType) activeFilterCount++;
  if (amenityIds.length > 0) activeFilterCount += amenityIds.length;
  if (search) activeFilterCount++;
  if (minRating) activeFilterCount++;
  if (minPrice || maxPrice) activeFilterCount++;

  const { data: hotelsData, isLoading } = useHotels({
    page,
    limit: 12,
    city,
    propertyType,
    amenityIds,
    checkIn,
    checkOut,
    guests,
    search,
      keyword,          
    minRating: minRating ? Number(minRating) : undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
  });

  const { data: cities } = useGetAllCity();
  const { data: propertyTypes } = useGetPropertyType();
  const { data: amenitiesList } = useAmenityOptions();

  const updateFilters = (updates: Record<string, string | string[] | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || (Array.isArray(value) && value.length === 0)) {
        params.delete(key);
      } else {
        params.set(key, Array.isArray(value) ? value.join(",") : value);
      }
    });

    params.set("page", "1");
    router.push(`/search?${params.toString()}`);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("city");
    params.delete("propertyType");
    params.delete("amenityIds");
    params.delete("search");
    params.delete("keyword");    
    params.delete("minRating");
    params.delete("minPrice");
    params.delete("maxPrice");
    params.set("page", "1");
    router.push(`/search?${params.toString()}`);
  };

  const goToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`/search?${params.toString()}`);
  };

 const handleAiSearchResult = (result: AiSearchResult, rawQuery: string) => {
    const f = result.filters as (AiSearchResult["filters"] & {
      keyword?: string | null;
    }) | undefined;

    if (f) {
      updateFilters({
        city: f.city ?? null,
        propertyType: f.propertyType ?? null,
        amenityIds: f.amenityIds ?? [],
        guests: f.guests ? String(f.guests) : null,
        checkIn: f.checkIn ?? null,
        checkOut: f.checkOut ?? null,
        minRating: f.minRating ? String(f.minRating) : null,
        minPrice: f.minPrice ? String(f.minPrice) : null,
        maxPrice: f.maxPrice ? String(f.maxPrice) : null,
        search: null,
        keyword: f.keyword ?? null,
      });
    } else {
   
      updateFilters({
      city: null, propertyType: null, amenityIds: [],
      guests: null, checkIn: null, checkOut: null,
      minRating: null, minPrice: null, maxPrice: null,
      search: null,
      keyword: rawQuery,
    });
  }
};

  const cityName = cities?.find((c: any) => c.id === city)?.name;
  const propertyTypeName = propertyTypes?.find(
    (t: any) => t.id === propertyType,
  )?.name;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      {mounted && <AiSearchBar onResult={handleAiSearchResult} />}

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1 sm:mb-2">
            {!mounted
              ? "All stays"
              : cityName
                ? `Hotels in ${cityName}`
                : propertyTypeName
                  ? `${propertyTypeName}s`
                  : "All stays"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {mounted && hotelsData
              ? `${hotelsData.total} properties found`
              : "Loading properties..."}
          </p>
        </div>

        {/* Mobile Filter Button Bar (visible below lg) */}
        {mounted && (
          <div className="lg:hidden">
            <Button
              variant="outline"
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 rounded-full border-border/80 h-10 px-4 text-xs font-semibold"
            >
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Bottom Sheet / Modal for Filters */}
      {mounted && mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs lg:hidden">
          <div
            className="fixed inset-0"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative z-10 flex flex-col w-full sm:max-w-lg max-h-[90vh] rounded-t-3xl sm:rounded-3xl bg-background shadow-2xl overflow-hidden border border-border/60">
            {/* Header with Drag Handle & Close */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                <h2 className="font-display text-lg font-bold">Filters</h2>
                {activeFilterCount > 0 && (
                  <span className="flex h-5 px-2 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {activeFilterCount} active
                  </span>
                )}
              </div>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Filter Body */}
            <div className="flex-1 overflow-y-auto p-6">
              <FilterSidebar
                cities={cities}
                propertyTypes={propertyTypes}
                amenitiesList={amenitiesList}
                selectedCity={city}
                selectedPropertyType={propertyType}
                selectedAmenities={amenityIds}
                selectedSearch={search}
                selectedMinRating={minRating}
                onChange={updateFilters}
                selectedMinPrice={minPrice}
                selectedMaxPrice={maxPrice}
              />
            </div>

            {/* Sticky Bottom Actions */}
            <div className="flex items-center gap-3 p-4 border-t border-border/60 bg-background/95 backdrop-blur-sm">
              <Button
                variant="outline"
                onClick={clearAllFilters}
                className="flex-1 rounded-full h-11 text-xs font-semibold"
                disabled={activeFilterCount === 0}
              >
                Clear all
              </Button>
              <Button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 rounded-full h-11 text-xs font-semibold bg-primary text-primary-foreground"
              >
                Apply filters
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        {/* Desktop Sidebar (hidden on mobile) */}
        <div className="hidden lg:block">
          {mounted ? (
            <FilterSidebar
              cities={cities}
              propertyTypes={propertyTypes}
              amenitiesList={amenitiesList}
              selectedCity={city}
              selectedPropertyType={propertyType}
              selectedAmenities={amenityIds}
              selectedSearch={search}
              selectedMinRating={minRating}
              onChange={updateFilters}
              selectedMinPrice={minPrice}
              selectedMaxPrice={maxPrice}
            />
          ) : (
            <div className="space-y-6 animate-pulse p-4">
              <div className="h-8 w-24 bg-muted rounded" />
              <div className="h-32 bg-muted rounded" />
            </div>
          )}
        </div>

        <div>
          {isLoading || !mounted ? (
            <p className="text-sm text-muted-foreground">Loading stays...</p>
          ) : hotelsData?.data?.length ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {hotelsData.data.map((hotel: any) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))}
              </div>

              {hotelsData.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-10">
                  <button
                    disabled={page <= 1}
                    onClick={() => goToPage(page - 1)}
                    className="px-3 py-1.5 text-sm border border-border rounded disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-muted-foreground">
                    Page {page} of {hotelsData.totalPages}
                  </span>
                  <button
                    disabled={page >= hotelsData.totalPages}
                    onClick={() => goToPage(page + 1)}
                    className="px-3 py-1.5 text-sm border border-border rounded disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No stays match these filters.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}