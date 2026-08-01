"use client";

import { useState } from "react";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { DataTable } from "@/template/DataTable";
import { ConfirmDialog } from "@/template/ConfirmDialog";
import { useHotels } from "@/features/hotels/hooks/useHotels";
import { useDeleteHotel } from "@/features/admin/hotel/hooks/useDeleteHotel";
import { getHotelColumns } from "@/features/admin/hotel/components/hotel-columns";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { usePermission } from "@/hooks/usePermission";
import { PERMISSIONS } from "@/constants/permissions";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { Hotel } from "@/features/hotels/types/hotels.type";

export function HotelsContent() {
    const router = useRouter();
    const { hasPermission } = usePermission();


    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = useState<SortingState>([]);

    const sortBy = sorting[0]?.id ?? "createdAt";
    const order = sorting[0]?.desc ? "desc" : "asc";

   const { data, isLoading } = useHotels({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    sortBy,
    order,
});

    const { deleteHotel, isPending: isDeleting } = useDeleteHotel();

    const [hotelToDelete, setHotelToDelete] = useState<Hotel | null>(null);
    
    const canEdit = hasPermission(PERMISSIONS.EDIT_HOTEL);
    const canViewRooms = hasPermission(PERMISSIONS.VIEW_ROOM);
    const canDelete= hasPermission(PERMISSIONS.DELETE_HOTEL)

   
    const columns = getHotelColumns({
        onView: (hotel) => router.push(`/admin/hotels/${hotel.id}`),
        onEdit: canEdit ? (hotel) => router.push(`/admin/hotels/${hotel.id}/edit`) : undefined,
        onViewRooms: canViewRooms ? (hotel) => router.push(`/admin/hotels/${hotel.id}/rooms`) : undefined,
        onDelete: canDelete ? (hotel) => setHotelToDelete(hotel) : undefined,
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
                {hasPermission(PERMISSIONS.ADD_HOTEL) &&(
                    <Button onClick={() => router.push("/admin/hotels/new")}>Add Hotel</Button>
                )}
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

           {canDelete && 
            (<ConfirmDialog
                open={!!hotelToDelete}
                onOpenChange={(open) => !open && setHotelToDelete(null)}
                title="Delete this hotel?"
                description={`"${hotelToDelete?.name}" will be permanently deleted. This cannot be undone.`}
                loading={isDeleting}
                onConfirm={handleConfirmDelete}
            />)
            }
        </div>
    );
}

export default function HotelsPage() {
    return (
        <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_HOTEL}>
            <HotelsContent />
        </ProtectedRoute>
    );
}