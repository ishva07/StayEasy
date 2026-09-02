"use client";

import { useState } from "react";
import { PaginationState, SortingState } from "@tanstack/react-table";

import { DataTable } from "@/template/DataTable";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { PERMISSIONS } from "@/constants/permissions";
import { usePermission } from "@/hooks/usePermission";

import { getUser } from "@/features/admin/user/hooks/useGetUser";
import { getUserColumns, User } from "@/features/admin/user/components/user-column";
import { ChangeRoleModal } from "@/features/admin/user/components/ChangeRoleModal";

function UserContent() {
  const { hasPermission } = usePermission();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const sortBy = sorting[0]?.id ?? "email";
  const order = sorting[0]?.desc ? "desc" : "asc";

  const { data, isLoading } = getUser({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    sortBy,
    order,
  });

  const canChangeRole = hasPermission(PERMISSIONS.EDIT_USER_ROLE);
  const [userToChangeRole, setUserToChangeRole] = useState<User | null>(null);

  const columns = getUserColumns({
    onChangeRole: canChangeRole ? (user) => setUserToChangeRole(user) : undefined,
  });

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-6 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Users</h1>
        <p className="mt-2 text-sm text-slate-500">
          View all users and manage their assigned role.
        </p>
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

      <ChangeRoleModal
        user={userToChangeRole}
        open={!!userToChangeRole}
        onOpenChange={(open) => !open && setUserToChangeRole(null)}
      />
    </div>
  );
}

export default function UserPage() {
  return (
    <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_USER}>
      <UserContent />
    </ProtectedRoute>
  );
}