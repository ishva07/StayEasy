"use client";

import { useState } from "react";
import { PaginationState, SortingState } from "@tanstack/react-table";

import { DataTable } from "@/template/DataTable";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { PERMISSIONS } from "@/constants/permissions";

import {
  useGetAiSearchLogs,
  useGetAiSearchLogSummary,
} from "@/features/admin/aiSearchLogAdmin/hooks/useaiSearchLogAdmin";
import { getAiSearchLogColumns } from "@/features/admin/aiSearchLogAdmin/components/aiSearchLogAdmin-column";

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-sm">
      <p className="text-xs text-slate-500">{label}</p>
      <p className={`mt-1 text-xl font-semibold ${accent ? "text-emerald-600" : "text-slate-950"}`}>
        {value}
      </p>
    </div>
  );
}

function AiSearchLogContent() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const sortBy = sorting[0]?.id ?? "createdAt";
  const order = sorting[0]?.desc ? "desc" : "asc";

  const { data, isLoading } = useGetAiSearchLogs({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    sortBy,
    order,
  });

  const { data: summary } = useGetAiSearchLogSummary();

  const columns = getAiSearchLogColumns();

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-6 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">AI Search Logs</h1>
        <p className="mt-2 text-sm text-slate-500">
          Monitor whether AI search is parsing real user queries correctly, or falling back to
          keyword search.
        </p>
      </section>

      {summary && (
        <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Total requests" value={summary.total} />
          <StatCard label="Success rate" value={`${summary.successRate}%`} accent />
          <StatCard label="Successful" value={summary.success} />
          <StatCard label="Fell back" value={summary.fallback} />
        </section>
      )}

      {summary && Object.keys(summary.reasons).length > 0 && (
        <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-6 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-slate-950">Fallback reasons</h2>
          <div className="flex flex-wrap gap-3">
            {(Object.entries(summary.reasons) as [string, number][]).map(([reason, count]) => (
              <span
                key={reason}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
              >
                {reason}: {count}
              </span>
            ))}
          </div>
        </section>
      )}

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

export default function AiSearchLogPage() {
  return (
    <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_AI_SEARCH_LOG}>
      <AiSearchLogContent />
    </ProtectedRoute>
  );
}