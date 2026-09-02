"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PaginationState, SortingState } from "@tanstack/react-table";

import { DataTable } from "@/template/DataTable";
import { ConfirmDialog } from "@/template/ConfirmDialog";
import { FormModal } from "@/template/FormModal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { PERMISSIONS } from "@/constants/permissions";
import { usePermission } from "@/hooks/usePermission";

import { getRole } from "@/features/admin/role/hooks/useGetRole";
import { useCreateRole } from "@/features/admin/role/hooks/useCreateRole";
import { useEditRole } from "@/features/admin/role/hooks/useEditRole";
import { useDeleteRole } from "@/features/admin/role/hooks/useDeleteRole";
import {
  getRoleColumns,
  Role,
} from "@/features/admin/role/components/role-column";
import {
  createRoleSchema,
  updateRoleSchema,
  createRoleFormInput,
  updateRoleFormInput,
} from "@/features/admin/role/validation/role.validation";
import { useRouter } from "next/navigation";

function RoleContent() {
  const { hasPermission } = usePermission();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const sortBy = sorting[0]?.id ?? "name";
  const order = sorting[0]?.desc ? "desc" : "asc";

  const { data, isLoading } = getRole({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    sortBy,
    order,
  });

  const router = useRouter();

  const { deleteRole, isPending: isDeleting } = useDeleteRole();
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  const { createRole, isPending: isCreating } = useCreateRole();
  const { editRole, isPending: isUpdating } = useEditRole();
  const [formOpen, setFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const isSubmitting = isCreating || isUpdating;

  const canAdd = hasPermission(PERMISSIONS.ADD_ROLE);
  const canEdit = hasPermission(PERMISSIONS.EDIT_ROLE);
  const canDelete = hasPermission(PERMISSIONS.DELETE_ROLE);

  const form = useForm<createRoleFormInput | updateRoleFormInput>({
    resolver: zodResolver(editingRole ? updateRoleSchema : createRoleSchema),
    defaultValues: { name: "" },
  });

  const openCreateForm = () => {
    form.reset({ name: "" });
    setEditingRole(null);
    setFormOpen(true);
  };

  const openEditForm = (role: Role) => {
    form.reset({ name: role.name });
    setEditingRole(role);
    setFormOpen(true);
  };

  const handleFormSubmit = (formData: updateRoleFormInput) => {
    if (editingRole) {
      editRole(
        { roleId: editingRole.id, name: formData.name },
        { onSuccess: () => setFormOpen(false) },
      );
    } else {
      createRole(
        { name: formData.name },
        { onSuccess: () => setFormOpen(false) },
      );
    }
  };

  const handleConfirmDelete = () => {
    if (!roleToDelete) return;
    deleteRole(
      { roleId: roleToDelete.id },
      { onSuccess: () => setRoleToDelete(null) },
    );
  };

  

const columns = getRoleColumns({
  onEdit: canEdit ? openEditForm : undefined,
  onDelete: canDelete ? (role) => setRoleToDelete(role) : undefined,
  onPermissions: (role) => router.push(`/admin/roles/${role.id}/permissions`),
});

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
              Roles
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Manage roles and their permissions.
            </p>
          </div>
          {canAdd && <Button onClick={openCreateForm}>Add Role</Button>}
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

      {(canAdd || canEdit) && (
        <FormModal
          open={formOpen}
          onOpenChange={setFormOpen}
          title={editingRole ? "Edit Role" : "Add Role"}
          onSubmit={form.handleSubmit(handleFormSubmit)}
          isSubmitting={isSubmitting}
          submitText={editingRole ? "Update Role" : "Create Role"}
        >
          <Form {...form}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. manager" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Form>
        </FormModal>
      )}

      {canDelete && (
        <ConfirmDialog
          open={!!roleToDelete}
          onOpenChange={(open) => !open && setRoleToDelete(null)}
          title="Delete this role?"
          description={`"${roleToDelete?.name}" will be permanently deleted.`}
          loading={isDeleting}
          onConfirm={handleConfirmDelete}
        />
      )}

    </div>
  );
}

export default function RolePage() {
  return (
    <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_ROLE}>
      <RoleContent />
    </ProtectedRoute>
  );
}