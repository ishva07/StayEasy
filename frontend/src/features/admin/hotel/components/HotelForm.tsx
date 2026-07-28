"use client";

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
import { createHotelSchema, createHotelInputData } from "../validation/hotel.validation";
import { useAmenityOptions } from "@/features/admin/amenities/hook/useAmenities";

interface HotelFormProps {
    defaultValues?: Partial<createHotelInputData>;
    onSubmit: (data: createHotelInputData) => void;
    isSubmitting?: boolean;
    submitLabel?: string;
}

export function HotelForm({
    defaultValues,
    onSubmit,
    isSubmitting = false,
    submitLabel = "Create Hotel",
}: HotelFormProps) {
    const { data: amenityOptions, isLoading: isLoadingAmenities } = useAmenityOptions();

    const form = useForm<createHotelInputData>({
        resolver: zodResolver(createHotelSchema),
        defaultValues: {
            name: "",
            description: "",
            city: "",
            address: "",
            isFeatured: false,
            amenitiesIds: [],
            imageGallery: [],
            ...defaultValues,
        },
    });

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
                                <Textarea rows={4} placeholder="Describe the hotel..." {...field} />
                            </FormControl>
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
                                <FormControl>
                                    <Input placeholder="e.g. Ahmedabad" {...field} />
                                </FormControl>
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
                    render={({ field }) => {
                        const handleHeroImageChange = (event: ChangeEvent<HTMLInputElement>) => {
                            field.onChange(event.target.files?.[0] ?? null);
                        };

                        return (
                            <FormItem>
                                <FormLabel>Hero Image</FormLabel>
                                <FormControl>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleHeroImageChange}
                                        onBlur={field.onBlur}
                                        name={field.name}
                                        ref={field.ref}
                                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-primary-foreground"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        );
                    }}
                />

                <FormField
                    control={form.control}
                    name="imageGallery"
                    render={({ field }) => {
                        const handleGalleryChange = (event: ChangeEvent<HTMLInputElement>) => {
                            field.onChange(Array.from(event.target.files ?? []));
                        };

                        return (
                            <FormItem>
                                <FormLabel>Gallery Images</FormLabel>
                                <FormControl>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleGalleryChange}
                                        onBlur={field.onBlur}
                                        name={field.name}
                                        ref={field.ref}
                                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-primary-foreground"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        );
                    }}
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
                                    amenityOptions?.map((amenity:any) => (
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
                                                                        : current.filter((id) => id !== amenity.id)
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