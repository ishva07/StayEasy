"use client";

import { Badge } from "@/components/ui/badge";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { PERMISSIONS } from "@/constants/permissions";
import { RolePermissionsCard } from "@/features/admin/roles/components/role-permissions-card";
import { useRolesAndPermissions } from "@/features/admin/roles/hooks/useRolesAndPermissions";
import { useUpdateRolePermissions } from "@/features/admin/roles/hooks/useUpdateRolePermissions";
import { useAuthStore } from "@/stores/authStore";

function RolesContent() {
  const user = useAuthStore((state) => state.user);
  const { data, isLoading, isError } = useRolesAndPermissions();
  const { updateRolePermissions, isPending } = useUpdateRolePermissions();
  const canEdit =
    user?.permissions.includes(PERMISSIONS.EDIT_ROLE_PERMISSIONS) ?? false;

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
              Roles
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Choose which existing permissions each role can access.
            </p>
          </div>
          <Badge variant="secondary" className="text-sm">
            {data?.roles.length ?? 0} roles
          </Badge>
        </div>
      </section>

      {isLoading ? (
        <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-6 text-sm text-slate-500 shadow-sm">
          Loading roles and permissions...
        </section>
      ) : isError ? (
        <section className="rounded-[1.75rem] border border-red-200 bg-white/95 p-6 text-sm text-red-600 shadow-sm">
          Failed to load roles and permissions. Please try again.
        </section>
      ) : data?.roles.length ? (
        data.roles.map((role) => (
          <RolePermissionsCard
            key={`${role.id}-${[...role.permissionIds].sort().join(",")}`}
            role={role}
            permissions={data.permissions}
            canEdit={canEdit}
            isSaving={isPending}
            onSave={(roleId, permissionIds) =>
              updateRolePermissions({ roleId, permissionIds })
            }
          />
        ))
      ) : (
        <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-6 text-sm text-slate-500 shadow-sm">
          No roles found.
        </section>
      )}
    </div>
  );
}

export default function RolesPage() {
  return (
    <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_ROLES}>
      <RolesContent />
    </ProtectedRoute>
  );
}
