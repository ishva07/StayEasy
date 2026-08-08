"use client";

import { useState } from "react";
import { PaginationState, SortingState } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/template/DataTable";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { PERMISSIONS } from "@/constants/permissions";
import { useGetAmenities } from "@/features/admin/amenities/hooks/useGetAmenities";
import { getAmenityColumns } from "@/features/admin/amenities/components/amenity-column";

function AmenitiesContent() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const page = pagination.pageIndex + 1;
  const limit = pagination.pageSize;
  const { data, isLoading } = useGetAmenities(page, limit);

  const columns = getAmenityColumns();

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Amenities</h1>
            <p className="mt-2 text-sm text-slate-500">
              View all amenities available in the system.
            </p>
          </div>
          <Badge variant="secondary" className="text-sm">
            {data?.total ?? 0} amenities
          </Badge>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Amenity list</h2>
            <p className="text-sm text-slate-500">Browse installed amenities and their current counts.</p>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={data?.data ?? []}
          pageCount={data?.totalPage ?? 1}
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

export default function AmenitiesPage() {
  return (
    <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_AMENITIES}>
      <AmenitiesContent />
    </ProtectedRoute>
  );
}
