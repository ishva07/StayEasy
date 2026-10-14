"use client";

import { useState } from "react";
import { PaginationState, SortingState } from "@tanstack/react-table";
import { useAuthStore } from "@/stores/authStore";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/template/DataTable";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { PERMISSIONS } from "@/constants/permissions";
import { useAdminUsers } from "@/features/admin/users/hooks/useAdminUsers";
import { useUpdateUserRole } from "@/features/admin/users/hooks/useUpdateUserRole";
import { getUserColumns } from "@/features/admin/users/components/user-columns";

function UsersContent() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const currentUser = useAuthStore((state) => state.user);
  const { data, isLoading, isError } = useAdminUsers();
  const { updateUserRole, isPending } = useUpdateUserRole();
  const canEditRoles =
    currentUser?.permissions.includes(PERMISSIONS.EDIT_USER_ROLE) ?? false;
  const users = data?.users ?? [];
  const pageCount = Math.ceil(users.length / pagination.pageSize);
  const pageUsers = users.slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize,
  );
  const columns = getUserColumns({
    roles: data?.roles ?? [],
    currentUserId: currentUser?.id,
    canEditRoles,
    isUpdating: isPending,
    onRoleChange: (userId, roleId) => updateUserRole({ userId, roleId }),
  });

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
              Users
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              View user details and manage their roles.
            </p>
          </div>
          <Badge variant="secondary" className="text-sm">
            {data?.users.length ?? 0} users
          </Badge>
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-6 shadow-sm">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-slate-900">User list</h2>
          <p className="text-sm text-slate-500">
            Only a user&apos;s role can be changed.
          </p>
        </div>
        {isError && (
          <p className="mb-4 text-sm text-red-600">
            Failed to load users. Please try again.
          </p>
        )}
        <DataTable
          columns={columns}
          data={pageUsers}
          pageCount={pageCount}
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

export default function UsersPage() {
  return (
    <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_USERS}>
      <UsersContent />
    </ProtectedRoute>
  );
}
