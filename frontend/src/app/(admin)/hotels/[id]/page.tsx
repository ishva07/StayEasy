"use client";

import { useParams, useRouter } from "next/navigation";
import { useHotelById } from "@/features/admin/hotel/hooks/useHotelById";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { ArrowLeft, Pencil } from "lucide-react";

export default function HotelDetailPage() {
    const router = useRouter();
    const { id } = useParams<{ id: string }>();
    const { data: hotel, isLoading } = useHotelById(id);

    if (isLoading) return <p className="text-sm text-muted-foreground">Loading...</p>;
    if (!hotel) return <p className="text-sm text-muted-foreground">Hotel not found.</p>;

    return (
        <div className="max-w-3xl space-y-6">
            <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={() => router.push("/hotels")}>
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                <Button size="sm" onClick={() => router.push(`/hotels/${id}/edit`)}>
                    <Pencil className="h-4 w-4 mr-1" /> Edit
                </Button>
            </div>

            {hotel.heroImage && (
                <div className="relative h-64 w-full rounded-lg overflow-hidden bg-muted">
                    <Image
                        src={`${process.env.NEXT_PUBLIC_UPLOADS_URL}${hotel.heroImage}`}
                        alt={hotel.name}
                        fill
                        className="object-cover"
                    />
                </div>
            )}

            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-semibold">{hotel.name}</h1>
                    {hotel.isFeatured && <Badge>Featured</Badge>}
                </div>
                <p className="text-muted-foreground">{hotel.city} — {hotel.address}</p>
                <p className="text-sm">{hotel.description}</p>
            </div>

            {hotel.hotelAmenities?.length > 0 && (
                <div>
                    <h2 className="font-medium mb-2">Amenities</h2>
                    <div className="flex flex-wrap gap-2">
                        {hotel.hotelAmenities.map((ha: any) => (
                            <Badge key={ha.amenities.id} variant="secondary">
                                {ha.amenities.name}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {hotel.hotelImages?.length > 0 && (
                <div>
                    <h2 className="font-medium mb-2">Gallery</h2>
                    <div className="grid grid-cols-3 gap-2">
                        {hotel.hotelImages.map((img: any) => (
                            <div key={img.id} className="relative h-24 rounded-md overflow-hidden bg-muted">
                                <Image
                                    src={`${process.env.NEXT_PUBLIC_BASE_URL}${img.url}`}
                                    alt=""
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}