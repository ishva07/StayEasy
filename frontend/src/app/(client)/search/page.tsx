"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useHotels } from "@/features/hotels/hooks/useHotels";
import { getCity } from "@/features/city/hooks/useGetCity";
import { useGetPropertyType } from "@/features/propertyType/hooks/usePropertyTypeOptions";
import { useAmenityOptions } from "@/features/admin/amenities/hook/useAmenities";
import { HotelCard } from "@/features/client/hotels/components/HotelCard";
import { FilterSidebar } from "@/features/client/hotels/components/FilterSidebar";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const city = searchParams.get("city") ?? undefined;
  const propertyType = searchParams.get("propertyType") ?? undefined;
  const amenityIds = searchParams.get("amenityIds")?.split(",").filter(Boolean) ?? [];
  const page = Number(searchParams.get("page") ?? 1);

  const { data: hotelsData, isLoading } = useHotels({
    page,
    limit: 12,
    city,
    propertyType,
    amenityIds,
  });

  const { data: cities } = getCity();
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

  const goToPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`/search?${params.toString()}`);
  };

  const cityName = cities?.find((c: any) => c.id === city)?.name;
  const propertyTypeName = propertyTypes?.find((t: any) => t.id === propertyType)?.name;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="font-display text-2xl font-bold mb-2">
        {cityName ? `Hotels in ${cityName}` : propertyTypeName ? `${propertyTypeName}s` : "All stays"}
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        {hotelsData?.total ?? 0} properties found
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        <FilterSidebar
          cities={cities}
          propertyTypes={propertyTypes}
          amenitiesList={amenitiesList}
          selectedCity={city}
          selectedPropertyType={propertyType}
          selectedAmenities={amenityIds}
          onChange={updateFilters}
        />

        <div>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
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
            <p className="text-sm text-muted-foreground">No stays match these filters.</p>
          )}
        </div>
      </div>
    </div>
  );
}