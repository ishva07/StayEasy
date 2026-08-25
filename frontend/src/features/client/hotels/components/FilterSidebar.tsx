"use client";

import { useState, useEffect } from "react";
import { PriceRangeSlider } from "./PriceRangeSlider";

interface FilterSidebarProps {
  cities?: { id: string; name: string }[];
  propertyTypes?: { id: string; name: string }[];
  amenitiesList?: { id: string; name: string }[];
  selectedCity?: string;
  selectedPropertyType?: string;
  selectedAmenities: string[];
  selectedSearch?: string;
  selectedMinRating?: string;
  selectedMinPrice?: string;
  selectedMaxPrice?: string;
  onChange: (updates: Record<string, string | string[] | null>) => void;
}

const RATING_OPTIONS = ["3", "4", "4.5"];

export function FilterSidebar({
  cities,
  propertyTypes,
  amenitiesList,
  selectedCity,
  selectedPropertyType,
  selectedAmenities,
  selectedSearch,
  selectedMinRating,
  selectedMinPrice,
  selectedMaxPrice,
  onChange,
}: FilterSidebarProps) {
  const [searchInput, setSearchInput] = useState(selectedSearch ?? "");
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    setSearchInput(selectedSearch ?? "");
  }, [selectedSearch]);

  useEffect(() => {
    const trimmed = searchInput.trim();

    if (trimmed === (selectedSearch ?? "")) return;

    setIsPending(true);
    const timeoutId = setTimeout(() => {
      onChange({ search: trimmed ? trimmed : null });
      setIsPending(false);
    }, 400);

    return () => {
      clearTimeout(timeoutId);
      setIsPending(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const toggleAmenity = (id: string) => {
    const next = selectedAmenities.includes(id)
      ? selectedAmenities.filter((a) => a !== id)
      : [...selectedAmenities, id];
    onChange({ amenityIds: next });
  };

  return (
    <aside className="space-y-8">
      {/* Hotel name search */}
      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          Search by hotel name
          {isPending && (
            <span className="text-[10px] font-normal text-muted-foreground normal-case">
              Searching...
            </span>
          )}
        </h3>
        <input
          type="text"
          placeholder="Hotel name..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full text-sm border border-border rounded px-2 py-1.5 focus:outline-none focus:border-primary"
        />
        {selectedSearch && (
          <button
            onClick={() => {
              setSearchInput("");
              onChange({ search: null });
            }}
            className="text-xs text-primary underline mt-2"
          >
            Clear
          </button>
        )}
      </div>

      {/* City */}
      <div>
        <h3 className="font-semibold mb-3">City</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {cities?.map((c) => (
            <label
              key={c.id}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <input
                type="radio"
                name="city"
                checked={selectedCity === c.id}
                onChange={() => onChange({ city: c.id })}
              />
              <span>{c.name}</span>
            </label>
          ))}
        </div>
        {selectedCity && (
          <button
            onClick={() => onChange({ city: null })}
            className="text-xs text-primary underline mt-2"
          >
            Clear
          </button>
        )}
      </div>

      {/* Property type */}
      <div>
        <h3 className="font-semibold mb-3">Property type</h3>
        <div className="space-y-2">
          {propertyTypes?.map((type) => (
            <label
              key={type.id}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <input
                type="radio"
                name="propertyType"
                checked={selectedPropertyType === type.id}
                onChange={() => onChange({ propertyType: type.id })}
              />
              <span className="capitalize">{type.name}</span>
            </label>
          ))}
        </div>
        {selectedPropertyType && (
          <button
            onClick={() => onChange({ propertyType: null })}
            className="text-xs text-primary underline mt-2"
          >
            Clear
          </button>
        )}
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold mb-3">Minimum rating</h3>
        <div className="space-y-2">
          {RATING_OPTIONS.map((rating) => (
            <label
              key={rating}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <input
                type="radio"
                name="minRating"
                checked={selectedMinRating === rating}
                onChange={() => onChange({ minRating: rating })}
              />
              <span>{rating}+ stars</span>
            </label>
          ))}
        </div>
        {selectedMinRating && (
          <button
            onClick={() => onChange({ minRating: null })}
            className="text-xs text-primary underline mt-2"
          >
            Clear
          </button>
        )}
      </div>

      <div>
        <h3 className="font-semibold mb-3">Price range</h3>
        <div className="flex items-center gap-2">
          <PriceRangeSlider
            selectedMinPrice={selectedMinPrice}
            selectedMaxPrice={selectedMaxPrice}
            onChange={onChange}
          />
        </div>
      </div>

      {/* Amenities */}
      <div>
        <h3 className="font-semibold mb-3">Amenities</h3>
        <div className="space-y-2">
          {amenitiesList?.map((amenity) => (
            <label
              key={amenity.id}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedAmenities.includes(amenity.id)}
                onChange={() => toggleAmenity(amenity.id)}
              />
              <span className="capitalize">{amenity.name}</span>
            </label>
          ))}
        </div>
        {selectedAmenities.length > 0 && (
          <button
            onClick={() => onChange({ amenityIds: [] })}
            className="text-xs text-primary underline mt-2"
          >
            Clear
          </button>
        )}
      </div>
    </aside>
  );
}
