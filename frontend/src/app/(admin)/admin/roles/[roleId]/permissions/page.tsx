"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { PERMISSIONS } from "@/constants/permissions";
import { usePermission } from "@/hooks/usePermission";

import { getAllRole } from "@/features/admin/role/hooks/useGetAllRole";
import { getRolePermissions } from "@/features/admin/permission/hooks/useGetRolePermissions";
import { useSaveRolePermissions } from "@/features/admin/permission/hooks/useSaveRolePermissions";
import { getPermissionMeta } from "@/features/admin/permission/components/permission-groups";

interface PermissionRow {
  id: string;
  name: string;
  assigned: boolean;
}

function RolePermissionsContent() {
  const params = useParams<{ roleId: string }>();
  const roleId = params.roleId;
  const router = useRouter();

  const { hasPermission } = usePermission();
  const canEdit = hasPermission(PERMISSIONS.EDIT_ROLE);

  const { data: roles } = getAllRole();
  const role = roles?.find((r: { id: string }) => r.id === roleId);

  const { data, isLoading } = getRolePermissions(roleId);
  const { savePermissions, isPending } = useSaveRolePermissions();

  // local editable state: id -> checked
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (data) {
      const map: Record<string, boolean> = {};
      data.forEach((p: PermissionRow) => (map[p.id] = p.assigned));
      setCheckedMap(map);
    }
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter((p: PermissionRow) => p.name.toLowerCase().includes(q));
  }, [data, search]);

  const allChecked = data && data.length > 0 && data.every((p: PermissionRow) => checkedMap[p.id]);

  const handleToggle = (id: string) => {
    setCheckedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCheckAll = (checked: boolean) => {
    if (!data) return;
    const map: Record<string, boolean> = {};
    data.forEach((p: PermissionRow) => (map[p.id] = checked));
    setCheckedMap(map);
  };

  const handleClear = () => handleCheckAll(false);

  const handleSave = () => {
    const permissionIds = Object.keys(checkedMap).filter((id) => checkedMap[id]);
    savePermissions({ roleId, permissionIds });
  };

  const grouped: Record<string, PermissionRow[]> = {};
  filtered.forEach((permission: PermissionRow) => {
    const { category } = getPermissionMeta(permission.name);
    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(permission);
  });
  const categories = Object.keys(grouped).sort();

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.push("/admin/roles")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
              Permissions for "{role?.name ?? "..."}"
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Toggle which actions this role is allowed to perform.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            placeholder="Search permissions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:max-w-xs"
          />

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="check-all"
                checked={!!allChecked}
                disabled={!canEdit || isLoading}
                onCheckedChange={(checked) => handleCheckAll(!!checked)}
                className="border-2 border-slate-400 data-[state=checked]:border-slate-900"
              />
              <Label htmlFor="check-all" className="text-sm font-medium cursor-pointer">
                Check All
              </Label>
            </div>

            <Button variant="outline" size="sm" onClick={handleClear} disabled={!canEdit || isLoading}>
              Clear
            </Button>

            <Button size="sm" onClick={handleSave} disabled={!canEdit || isPending}>
              {isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </section>

      {isLoading ? (
        <p className="text-sm text-slate-500">Loading permissions...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div
              key={category}
              className="rounded-[1.25rem] border border-slate-200/80 bg-white/95 p-5 shadow-sm"
            >
              <h2 className="mb-3 text-sm font-semibold text-slate-800 uppercase tracking-wide">
                {category}
              </h2>
              <div className="space-y-2">
                {grouped[category].map((permission) => {
                  const { label } = getPermissionMeta(permission.name);
                  return (
                    <div key={permission.id} className="flex items-center gap-2">
                      <Checkbox
                        id={permission.id}
                        checked={!!checkedMap[permission.id]}
                        disabled={!canEdit}
                        onCheckedChange={() => handleToggle(permission.id)}
                        className="border-2 border-slate-400 data-[state=checked]:border-slate-900"
                      />
                      <Label htmlFor={permission.id} className="text-sm font-normal cursor-pointer">
                        {label}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {categories.length === 0 && (
            <p className="text-sm text-slate-500 col-span-full">No permissions match your search.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function RolePermissionsPage() {
  return (
    <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_ROLE}>
      <RolePermissionsContent />
    </ProtectedRoute>
  );
}