"use client";

import { useState } from "react";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { DataTable } from "@/template/DataTable";
import { ConfirmDialog } from "@/template/ConfirmDialog";
import { useHotels } from "@/features/admin/hotel/hooks/useHotels";
import { useDeleteHotel } from "@/features/admin/hotel/hooks/useDeleteHotel";
import { getHotelColumns } from "@/features/admin/hotel/components/hotel-columns";
import { Hotel } from "@/features/admin/hotel/types/hotel.types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function HotelsPage() {
    const router = useRouter();

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState<SortingState>([]);

    const sortBy = sorting[0]?.id ?? "createdAt";
    const order = sorting[0]?.desc ? "desc" : "asc";

    const { data, isLoading } = useHotels(
        pagination.pageIndex + 1,
        pagination.pageSize,
        sortBy,
        order
    );

    const { deleteHotel, isPending: isDeleting } = useDeleteHotel();

    const [hotelToDelete, setHotelToDelete] = useState<Hotel | null>(null);

    const columns = getHotelColumns({
        onEdit: (hotel) => router.push(`/hotels/${hotel.id}/edit`),
        onView: (hotel) => router.push(`/hotels/${hotel.id}`),
        onViewRooms: (hotel) => router.push(`/hotels/${hotel.id}/rooms`),
        onDelete: (hotel) => setHotelToDelete(hotel),
    });

    const handleConfirmDelete = () => {
        if (!hotelToDelete) return;
        deleteHotel(hotelToDelete.id, {
            onSuccess: () => setHotelToDelete(null),
        });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-xl font-semibold">Hotels</h1>
                <Button onClick={() => router.push("/hotels/new")}>Add Hotel</Button>
            </div>

            <DataTable
                columns={columns}
                data={data?.data ?? []}
                pageCount={data?.totalPage ?? 0}
                pagination={pagination}
                onPaginationChange={setPagination}
                sorting={sorting}
                onSortingChange={setSorting}
                isLoading={isLoading}
            />

            <ConfirmDialog
                open={!!hotelToDelete}
                onOpenChange={(open) => !open && setHotelToDelete(null)}
                title="Delete this hotel?"
                description={`"${hotelToDelete?.name}" will be permanently deleted. This cannot be undone.`}
                loading={isDeleting}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}