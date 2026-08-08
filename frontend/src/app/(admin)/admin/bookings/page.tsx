"use client";

import { useState } from "react";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { DataTable } from "@/template/DataTable";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { PERMISSIONS } from "@/constants/permissions";
import { usePermission } from "@/hooks/usePermission";
import { useGetAllBookings } from "@/features/admin/booking/hooks/useGetAllBookings";
import { useChangeBookingStatus } from "@/features/admin/booking/hooks/useChangeBooking";
import { getBookingColumns } from "@/features/admin/booking/components/booking-column";
import { BookingStatus } from "@/features/admin/booking/types/booking.type";

function BookingsContent() {
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
    const { hasPermission } = usePermission();

    const handleStatusChange = (bookingId: string, status: BookingStatus) => {
        changeBookingStatus({ bookingId, status });
    };

    const columns = getBookingColumns({
        onStatusChange: handleStatusChange,
        isUpdating,
        canChangeStatus: hasPermission(PERMISSIONS.CHANGE_BOOKiNG_STATUS), 
    });

    return (
        <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Bookings</h1>
            <p className="mt-1 text-sm text-slate-500">Review booking activity and manage reservation status.</p>
          </div>
          <div className="text-sm text-slate-500">Showing latest booking records</div>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-6 shadow-sm">
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
      </section>
    </div>
  );
}

export default function BookingsPage() {
    return (
        <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_BOOKiNG}>
            <BookingsContent />
        </ProtectedRoute>
    );
}