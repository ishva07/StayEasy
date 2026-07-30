"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { createHotelSchema, editHotelSchema, createHotelInputData, editHotelInputData } from "../validation/hotel.validation";
import { useAmenityOptions } from "@/features/admin/amenities/hook/useAmenities";

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
  const { data: amenityOptions, isLoading: isLoadingAmenities } = useAmenityOptions();

  const form = useForm<FormInput>({
    resolver: zodResolver(mode === "edit" ? editHotelSchema : createHotelSchema), // ✅ dynamic resolver
    defaultValues: {
      name: "",
      description: "",
      city: "",
      address: "",
      isFeatured: false,
      amenitiesIds: [],
      heroImage: undefined,
      imageGallery: [],
      ...defaultValues,
    },
  });

  const [heroPreview, setHeroPreview] = useState<string | null>(initialHeroImageUrl);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>(initialGalleryUrls);

  useEffect(() => {
    setHeroPreview(initialHeroImageUrl);
  }, [initialHeroImageUrl]);

  useEffect(() => {
    setGalleryPreviews(initialGalleryUrls);
  }, [initialGalleryUrls]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hotel Name</FormLabel>
              <FormControl><Input placeholder="e.g. Hotel Taj" {...field} /></FormControl>
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
              <FormControl><Textarea rows={4} placeholder="Describe the hotel..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl><Input placeholder="e.g. Ahmedabad" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl><Input placeholder="Full address" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isFeatured"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0">
              <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
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
                  <img src={heroPreview} alt="Hero preview" className="h-full w-full object-cover" />
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
                <p className="text-xs text-gray-500">Leave empty to keep current hero image</p>
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
                    <div key={idx} className="h-16 w-16 rounded-md overflow-hidden bg-muted">
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
                      setGalleryPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))]);
                    }
                  }}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-primary-foreground"
                />
              </FormControl>
              {mode === "edit" && (
                <p className="text-xs text-gray-500">Existing images shown above; selecting new files adds more (doesn't remove old ones)</p>
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
                  <p className="text-sm text-muted-foreground">Loading amenities...</p>
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
                                    : current.filter((id: string) => id !== amenity.id)
                                );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="!mt-0 font-normal">{amenity.name}</FormLabel>
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