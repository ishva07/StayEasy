"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AdminRole, RolePermission } from "../types/role.type";

interface RolePermissionsCardProps {
  role: AdminRole;
  permissions: RolePermission[];
  canEdit: boolean;
  isSaving: boolean;
  onSave: (roleId: string, permissionIds: string[]) => void;
}

function formatPermissionName(name: string) {
  return name
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function RolePermissionsCard({
  role,
  permissions,
  canEdit,
  isSaving,
  onSave,
}: RolePermissionsCardProps) {
  const [selectedPermissionIds, setSelectedPermissionIds] = useState(
    role.permissionIds,
  );

  const originalIds = new Set(role.permissionIds);
  const selectedIds = new Set(selectedPermissionIds);
  const hasChanges =
    originalIds.size !== selectedIds.size ||
    [...originalIds].some((id) => !selectedIds.has(id));

  return (
    <details className="group rounded-[1.75rem] border border-slate-200/80 bg-white/95 shadow-sm">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-[1.75rem] p-6 [&::-webkit-details-marker]:hidden">
        <div>
          <h2 className="text-lg font-semibold capitalize text-slate-900">
            {role.name}
          </h2>
          <p className="text-sm text-slate-500">
            {selectedPermissionIds.length} permissions selected
          </p>
        </div>
        <ChevronDown
          aria-hidden="true"
          className="h-5 w-5 shrink-0 text-slate-500 transition-transform group-open:rotate-180"
        />
      </summary>

      <div className="border-t border-slate-200/80 p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Select the permissions this role should have.
          </p>
          <Button
            type="button"
            disabled={!canEdit || !hasChanges || isSaving}
            onClick={() => onSave(role.id, selectedPermissionIds)}
          >
            {isSaving ? "Saving..." : "Save permissions"}
          </Button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {permissions.map((permission) => (
            <label
              key={permission.id}
              className="flex min-h-11 items-center gap-3 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700"
            >
              <Checkbox
                checked={selectedIds.has(permission.id)}
                disabled={!canEdit || isSaving}
                onCheckedChange={(checked) => {
                  setSelectedPermissionIds((currentIds) =>
                    checked === true
                      ? currentIds.includes(permission.id)
                        ? currentIds
                        : [...currentIds, permission.id]
                      : currentIds.filter((id) => id !== permission.id),
                  );
                }}
              />
              <span>{formatPermissionName(permission.name)}</span>
            </label>
          ))}
        </div>
      </div>
    </details>
  );
}
