"use client";

interface FilterSidebarProps {
  cities?: { id: string; name: string }[];
  propertyTypes?: { id: string; name: string }[];
  amenitiesList?: { id: string; name: string }[];
  selectedCity?: string;
  selectedPropertyType?: string;
  selectedAmenities: string[];
  onChange: (updates: Record<string, string | string[] | null>) => void;
}

export function FilterSidebar({
  cities,
  propertyTypes,
  amenitiesList,
  selectedCity,
  selectedPropertyType,
  selectedAmenities,
  onChange,
}: FilterSidebarProps) {
  const toggleAmenity = (id: string) => {
    const next = selectedAmenities.includes(id)
      ? selectedAmenities.filter((a) => a !== id)
      : [...selectedAmenities, id];
    onChange({ amenityIds: next });
  };

  return (
    <aside className="space-y-8">
      {/* City */}
      <div>
        <h3 className="font-semibold mb-3">City</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {cities?.map((c) => (
            <label key={c.id} className="flex items-center gap-2 text-sm cursor-pointer">
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
          <button onClick={() => onChange({ city: null })} className="text-xs text-primary underline mt-2">
            Clear
          </button>
        )}
      </div>

      {/* Property type */}
      <div>
        <h3 className="font-semibold mb-3">Property type</h3>
        <div className="space-y-2">
          {propertyTypes?.map((type) => (
            <label key={type.id} className="flex items-center gap-2 text-sm cursor-pointer">
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
          <button onClick={() => onChange({ propertyType: null })} className="text-xs text-primary underline mt-2">
            Clear
          </button>
        )}
      </div>

      {/* Amenities */}
      <div>
        <h3 className="font-semibold mb-3">Amenities</h3>
        <div className="space-y-2">
          {amenitiesList?.map((amenity) => (
            <label key={amenity.id} className="flex items-center gap-2 text-sm cursor-pointer">
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
          <button onClick={() => onChange({ amenityIds: [] })} className="text-xs text-primary underline mt-2">
            Clear
          </button>
        )}
      </div>
    </aside>
  );
}