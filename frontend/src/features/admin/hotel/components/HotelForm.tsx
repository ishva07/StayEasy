"use client";

import { useEffect, useRef, useState } from "react";
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
import { useGetPropertyType } from "@/features/propertyType/hooks/usePropertyTypeOptions";
import { useGetAllCity } from "@/features/city/hooks/useGetAllCity";
import {
  Building2,
  MapPin,
  ImagePlus,
  Sparkles,
  UploadCloud,
  Check,
} from "lucide-react";

type FormInput = createHotelInputData | editHotelInputData;

interface HotelFormProps {
  mode?: "create" | "edit";
  defaultValues?: Partial<FormInput>;
  initialHeroImageUrl?: string | null;
  initialGalleryUrls?: string[];
  onSubmit: (data: FormInput, galleryState: { keptExistingUrls: string[]; newGalleryFiles: File[] }) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

interface GalleryItem {
  key: string;
  url: string;
  file?: File;
}

// Small presentational wrapper — visual only, no logic
function SectionCard({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: any;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
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

  const { data: cityOptions, isLoading: isLoadingCities } = useGetAllCity();
  const { data: propertyTypeOptions, isLoading: isLoadingPropertyTypes } =
    useGetPropertyType();
  const cities = Array.isArray(cityOptions)
    ? cityOptions
    : (cityOptions?.data ?? []);

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

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(
    initialGalleryUrls.map((url) => ({ key: url, url })),
  );

  const prevInitialGalleryKey = useRef(initialGalleryUrls.join("|"));

  useEffect(() => {
    const key = initialGalleryUrls.join("|");
    if (key !== prevInitialGalleryKey.current) {
      prevInitialGalleryKey.current = key;
      setGalleryPreviews(initialGalleryUrls);
    }
  }, [initialGalleryUrls]);

  return (
    <Form {...form}>
      <form  onSubmit={form.handleSubmit((data) => {
    const keptExistingUrls = galleryItems.filter((item) => !item.file).map((item) => item.url);
    const newGalleryFiles = galleryItems.filter((item) => item.file).map((item) => item.file!);
    onSubmit(data, { keptExistingUrls, newGalleryFiles });
  })} className="space-y-6 pb-24">
        {/* ---- Basic Info ---- */}
        <SectionCard
          icon={Building2}
          title="Basic Information"
          subtitle="Name, description and category"
        >
          <div className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hotel Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Hotel Taj"
                      className="h-11"
                      {...field}
                    />
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
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11">
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
                  );
                }}
              />

              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibility</FormLabel>
                    <button
                      type="button"
                      onClick={() => field.onChange(!field.value)}
                      className={`h-11 w-full flex items-center justify-between rounded-md border px-3 text-sm transition
                        ${
                          field.value
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-input bg-background text-slate-600"
                        }`}
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles className="h-3.5 w-3.5" />
                        Mark as Featured
                      </span>
                      {field.value && <Check className="h-4 w-4" />}
                    </button>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </SectionCard>

        {/* ---- Location ---- */}
        <SectionCard
          icon={MapPin}
          title="Location"
          subtitle="Where guests will find this property"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="cityId"
              render={({ field }) => {
                const selectedCityName = cities.find(
                  (city: any) => city.id === field.value,
                )?.name;

                return (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    {isLoadingCities ? (
                      <div className="h-11 flex items-center px-3 text-sm text-muted-foreground border rounded-md">
                        Loading cities...
                      </div>
                    ) : (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value ?? ""}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11">
                            <SelectValue>
                              {selectedCityName ?? "Select a city"}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cities.map((city: any) => (
                            <SelectItem key={city.id} value={city.id}>
                              {city.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Full address"
                      className="h-11"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </SectionCard>

        {/* ---- Images ---- */}
        <SectionCard
          icon={ImagePlus}
          title="Photos"
          subtitle="Hero image and gallery"
        >
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="heroImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hero Image</FormLabel>
                  <FormControl>
                    <label
                      htmlFor="heroImageInput"
                      className="relative flex h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-center transition hover:border-slate-400 hover:bg-slate-100 overflow-hidden"
                    >
                      {heroPreview ? (
                        <>
                          <img
                            src={heroPreview}
                            alt="Hero preview"
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition flex items-center justify-center">
                            <span className="text-white text-xs font-medium">
                              Click to change
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <UploadCloud className="h-6 w-6 text-slate-400" />
                          <span className="text-sm text-slate-500">
                            Click to upload hero image
                          </span>
                        </>
                      )}
                      <input
                        id="heroImageInput"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const file = e.target.files?.[0] ?? null;
                          field.onChange(file);
                          if (file) setHeroPreview(URL.createObjectURL(file));
                        }}
                      />
                    </label>
                  </FormControl>
                  {mode === "edit" && (
                    <p className="text-xs text-slate-400">
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

                  <div className="flex flex-wrap gap-3">
                    {galleryItems.map((item) => (
                      <div
                        key={item.key}
                        className="relative h-20 w-20 overflow-hidden rounded-lg bg-muted ring-1 ring-slate-200"
                      >
                        <img
                          src={item.url}
                          alt="Hotel gallery preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}

                    <label
                      htmlFor="galleryInput"
                      className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-slate-300 text-slate-400 hover:border-slate-400 hover:text-slate-500 transition"
                    >
                      <ImagePlus className="h-4 w-4" />
                      <span className="text-[10px]">Add</span>
                      <input
                        id="galleryInput"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const files = Array.from(e.target.files ?? []);
                          if (!files.length) return;

                          const newItems = files.map((file) => ({
                            key: crypto.randomUUID(),
                            url: URL.createObjectURL(file),
                            file,
                          }));
                          setGalleryItems((prev) => [...prev, ...newItems]);

                          const updatedFiles = [
                            ...(field.value ?? []),
                            ...files,
                          ];
                          field.onChange(updatedFiles);

                          // Reset so selecting the exact same file again after removing
                          // it still fires onChange (browsers dedupe identical selections)
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>

                  {mode === "edit" && (
                    <p className="text-xs text-slate-400">
                      Add more images to the existing gallery. Existing images stay in place.
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </SectionCard>

        {/* ---- Amenities ---- */}
        <SectionCard
          icon={Sparkles}
          title="Amenities"
          subtitle="What this property offers"
        >
          <FormField
            control={form.control}
            name="amenitiesIds"
            render={() => (
              <FormItem>
                <div className="flex flex-wrap gap-2">
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
                        render={({ field }) => {
                          const isChecked = field.value?.includes(amenity.id);
                          return (
                            <button
                              type="button"
                              onClick={() => {
                                const current = field.value ?? [];
                                field.onChange(
                                  isChecked
                                    ? current.filter(
                                        (id: string) => id !== amenity.id,
                                      )
                                    : [...current, amenity.id],
                                );
                              }}
                              className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition
                                ${
                                  isChecked
                                    ? "border-slate-900 bg-slate-900 text-white"
                                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                }`}
                            >
                              {isChecked && <Check className="h-3 w-3" />}
                              {amenity.name}
                            </button>
                          );
                        }}
                      />
                    ))
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </SectionCard>

        {/* ---- Sticky submit bar ---- */}
        <div className="fixed bottom-0 left-0 right-0 lg:left-[280px] border-t border-slate-200 bg-white/95 backdrop-blur px-6 py-4 flex justify-end">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-11 px-8 rounded-full font-semibold"
          >
            {isSubmitting ? "Saving..." : submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
