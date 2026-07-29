"use client";

import { useState } from "react";
import { PaginationState,SortingState  } from "@tanstack/react-table";
import { DataTable } from "@/template/DataTable";
import { useGetAllBookings } from "@/features/admin/booking/hooks/useGetAllBookings";
import { useChangeBookingStatus } from "@/features/admin/booking/hooks/useChangeBooking";
import { getBookingColumns } from "@/features/admin/booking/components/booking-column";
import { BookingStatus } from "@/features/admin/booking/types/booking.type";


export default function BookingsPage() {
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const [sorting, setSorting] = useState<SortingState>([]);  

    const sortBy = sorting[0]?.id ?? "createdAt";               
    const order = sorting[0]?.desc ? "desc" : "asc";

    const { data, isLoading } = useGetAllBookings(
        pagination.pageIndex + 1,
        pagination.pageSize,
        sortBy,
        order
    );

    const { changeBookingStatus, isPending: isUpdating } = useChangeBookingStatus();

    const handleStatusChange = (bookingId: string, status: BookingStatus) => {
        changeBookingStatus({ bookingId, status });
    };

    const columns = getBookingColumns({
        onStatusChange: handleStatusChange,
        isUpdating,
    });

    return (
        <div className="space-y-4">
            <h1 className="text-xl font-semibold">Bookings</h1>

            <DataTable
                columns={columns}
                data={data?.data ?? []}
                pageCount={data?.totalPages ?? 0}
                pagination={pagination}
                onPaginationChange={setPagination}
                sorting={sorting}
                onSortingChange={setSorting}
                isLoading={isLoading}
            />
        </div>
    );
}