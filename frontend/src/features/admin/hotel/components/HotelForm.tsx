"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  createHotelSchema,
  editHotelSchema,
  createHotelInputData,
  editHotelInputData,
} from "../validation/hotel.validation";
import { useAmenityOptions } from "@/features/admin/amenities/hook/useAmenities";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetPropertyType } from "@/features/admin/propertyTypes/hooks/usePropertyTypeOptions";
import { getCity } from "@/features/admin/city/hook/useGetCity";

type FormInput = createHotelInputData | editHotelInputData;

interface HotelFormProps {
  mode?: "create" | "edit";
  defaultValues?: Partial<FormInput>;
  initialHeroImageUrl?: string | null;
  initialGalleryUrls?: string[];
  onSubmit: (data: FormInput) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function HotelForm({
  mode = "create",
  defaultValues,
  initialHeroImageUrl = null,
  initialGalleryUrls = [],
  onSubmit,
  isSubmitting = false,
  submitLabel = "Create Hotel",
}: HotelFormProps) {
  const { data: amenityOptions, isLoading: isLoadingAmenities } =
    useAmenityOptions();

  const { data: cityOptions, isLoading: isLoadingCities } = getCity();
  const { data: propertyTypeOptions, isLoading: isLoadingPropertyTypes } =
    useGetPropertyType();

  const form = useForm<FormInput>({
    resolver: zodResolver(
      mode === "edit" ? editHotelSchema : createHotelSchema,
    ),
    defaultValues: {
      name: "",
      description: "",
      cityId: "",
      address: "",
      propertyTypeId: "",
      isFeatured: false,
      amenitiesIds: [],
      heroImage: undefined,
      imageGallery: [],
      ...defaultValues,
    },
  });

  const [heroPreview, setHeroPreview] = useState<string | null>(
    initialHeroImageUrl,
  );
  const [galleryPreviews, setGalleryPreviews] =
    useState<string[]>(initialGalleryUrls);

  useEffect(() => {
    setHeroPreview(initialHeroImageUrl);
  }, [initialHeroImageUrl]);

  useEffect(() => {
    const isSameGallery =
      galleryPreviews.length === initialGalleryUrls.length &&
      galleryPreviews.every((url, index) => url === initialGalleryUrls[index]);

    if (!isSameGallery) {
      setGalleryPreviews(initialGalleryUrls);
    }
  }, [initialGalleryUrls, galleryPreviews]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hotel Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Hotel Taj" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="Describe the hotel..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="cityId"
            render={({ field }) => {
              const selectedCityName = cityOptions?.find(
                (city: any) => city.id === field.value,
              )?.name;

              return (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  {isLoadingCities ? (
                    <div className="h-9 flex items-center px-3 text-sm text-muted-foreground border rounded-md">
                      Loading cities...
                    </div>
                  ) : (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue>
                            {selectedCityName ?? "Select a city"}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cityOptions?.map((city: any) => (
                          <SelectItem key={city.id} value={city.id}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <FormMessage />
                </FormItem>
              )
            }}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Full address" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="propertyTypeId"
          render={({ field }) => {
            const selectedPropertyTypeName = propertyTypeOptions?.find(
              (pt: any) => pt.id === field.value,
            )?.name;

            return (
              <FormItem>
                <FormLabel>Property Type</FormLabel>
                <Select onValueChange={field.onChange} value={field.value ?? ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue>
                        {selectedPropertyTypeName ??
                          (isLoadingPropertyTypes
                            ? "Loading..."
                            : "Select a property type")}
                      </SelectValue>
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {propertyTypeOptions?.map((pt: any) => (
                      <SelectItem key={pt.id} value={pt.id}>
                        {pt.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )
          }}
        />

        <FormField
          control={form.control}
          name="isFeatured"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel className="!mt-0">Mark as Featured</FormLabel>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="heroImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hero Image</FormLabel>

              {heroPreview && (
                <div className="mb-2 h-24 w-32 rounded-md overflow-hidden bg-muted">
                  <img
                    src={heroPreview}
                    alt="Hero preview"
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <FormControl>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0] ?? null;
                    field.onChange(file);
                    if (file) setHeroPreview(URL.createObjectURL(file));
                  }}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-primary-foreground"
                />
              </FormControl>
              {mode === "edit" && (
                <p className="text-xs text-gray-500">
                  Leave empty to keep current hero image
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageGallery"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gallery Images</FormLabel>

              {galleryPreviews.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {galleryPreviews.map((url, idx) => (
                    <div
                      key={idx}
                      className="h-16 w-16 rounded-md overflow-hidden bg-muted"
                    >
                      <img src={url} className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              <FormControl>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const files = Array.from(e.target.files ?? []);
                    field.onChange(files);
                    if (files.length) {
                      setGalleryPreviews((prev) => [
                        ...prev,
                        ...files.map((f) => URL.createObjectURL(f)),
                      ]);
                    }
                  }}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-primary-foreground"
                />
              </FormControl>
              {mode === "edit" && (
                <p className="text-xs text-gray-500">
                  Existing images shown above; selecting new files adds more
                  (doesn't remove old ones)
                </p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amenitiesIds"
          render={() => (
            <FormItem>
              <FormLabel>Amenities</FormLabel>
              <div className="grid grid-cols-2 gap-2">
                {isLoadingAmenities ? (
                  <p className="text-sm text-muted-foreground">
                    Loading amenities...
                  </p>
                ) : (
                  amenityOptions?.map((amenity: any) => (
                    <FormField
                      key={amenity.id}
                      control={form.control}
                      name="amenitiesIds"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(amenity.id)}
                              onCheckedChange={(checked) => {
                                const current = field.value ?? [];
                                field.onChange(
                                  checked
                                    ? [...current, amenity.id]
                                    : current.filter(
                                        (id: string) => id !== amenity.id,
                                      ),
                                );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="!mt-0 font-normal">
                            {amenity.name}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </form>
    </Form>
  );
}
