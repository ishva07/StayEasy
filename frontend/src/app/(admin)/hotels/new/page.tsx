"use client";

import { useRouter } from "next/navigation";
import { z } from "zod";
import { HotelForm } from "@/features/admin/hotel/components/HotelForm";
import { useAddHotels } from "@/features/admin/hotel/hooks/useCreateHotel";
import { createHotelSchema } from "@/features/admin/hotel/validation/hotel.validation";

export default function NewHotelPage() {
    const router = useRouter();
    const { addHotel, isPending } = useAddHotels();

    const handleSubmit = (data: z.infer<typeof createHotelSchema>) => {
        addHotel(data, {
            onSuccess: () => router.push("/hotels"),
        });
    };

    return (
        <div className="max-w-2xl space-y-4">
            <h1 className="text-xl font-semibold">Add New Hotel</h1>
            <HotelForm onSubmit={handleSubmit} isSubmitting={isPending} />
        </div>
    );
}