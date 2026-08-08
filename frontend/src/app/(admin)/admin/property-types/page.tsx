"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";
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

import { useGetPropertyType } from "@/features/admin/propertyTypes/hooks/usePropertyTypeOptions";
import { useCreatePropertyType } from "@/features/admin/propertyTypes/hooks/useCreatePropertyType";
import { useEditPropertyType } from "@/features/admin/propertyTypes/hooks/useEditPropertyType";
import { useDeletePropertyType } from "@/features/admin/propertyTypes/hooks/useDeletePropertyType";
import {
  getPropertyTypeColumns,
  PropertyType,
} from "@/features/admin/propertyTypes/components/propertyType-column";
import {
  createPropertyTypeSchema,
  updatePropertyTypeSchema,
  createPropertyTypeFormInput,
  updatePropertyTypeFormInput,
} from "@/features/admin/propertyTypes/validation/propertyType.validation";

function PropertyTypeContent() {
  const { hasPermission } = usePermission();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data, isLoading } = useGetPropertyType();

  const { deletePropertyType, isPending: isDeleting } = useDeletePropertyType();
  const [propertyTypeToDelete, setPropertyTypeToDelete] = useState<PropertyType | null>(null);

  const { createPropertyType, isPending: isCreating } = useCreatePropertyType();
  const { editPropertyType, isPending: isUpdating } = useEditPropertyType();
  const [formOpen, setFormOpen] = useState(false);
  const [editingPropertyType, setEditingPropertyType] = useState<PropertyType | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const isSubmitting = isCreating || isUpdating;

  const canAdd = hasPermission(PERMISSIONS.ADD_PROPERTY_TYPE);
  const canEdit = hasPermission(PERMISSIONS.EDIT_PROPERTY_TYPE);
  const canDelete = hasPermission(PERMISSIONS.DELETE_PROPERTY_TYPE);

  const form = useForm<createPropertyTypeFormInput | updatePropertyTypeFormInput>({
    resolver: zodResolver(editingPropertyType ? updatePropertyTypeSchema : createPropertyTypeSchema),
    defaultValues: { name: "" },
  });

  const openCreateForm = () => {
    form.reset({ name: "" });
    setEditingPropertyType(null);
    setImagePreview(null);
    setFormOpen(true);
  };

  const openEditForm = (propertyType: PropertyType) => {
    form.reset({ name: propertyType.name, propertyTypeImage: undefined });
    setEditingPropertyType(propertyType);
    setImagePreview(
      propertyType.image ? `${process.env.NEXT_PUBLIC_UPLOADS_URL}${propertyType.image}` : null
    );
    setFormOpen(true);
  };

  const handleFormSubmit = (formData: updatePropertyTypeFormInput) => {
    if (editingPropertyType) {
      editPropertyType(
        {
          propertyTypeId: editingPropertyType.id,
          name: formData.name,
          propertyTypeImage: formData.propertyTypeImage,
        },
        { onSuccess: () => setFormOpen(false) },
      );
    } else {
      createPropertyType(
        { name: formData.name!, propertyTypeImage: formData.propertyTypeImage! },
        { onSuccess: () => setFormOpen(false) },
      );
    }
  };

  const handleConfirmDelete = () => {
    if (!propertyTypeToDelete) return;
    deletePropertyType(
      { propertyTypeId: propertyTypeToDelete.id },
      { onSuccess: () => setPropertyTypeToDelete(null) },
    );
  };

  const columns = getPropertyTypeColumns({
    onEdit: canEdit ? openEditForm : undefined,
    onDelete: canDelete ? (propertyType) => setPropertyTypeToDelete(propertyType) : undefined,
  });

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Property Types</h1>
            <p className="mt-2 text-sm text-slate-500">Manage property type categories and keep the listing taxonomy up to date.</p>
          </div>
          {canAdd && <Button onClick={openCreateForm}>Add Property Type</Button>}
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-6 shadow-sm">
        <DataTable
          columns={columns}
          data={data ?? []}
          pageCount={1}
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
          title={editingPropertyType ? "Edit Property Type" : "Add Property Type"}
          onSubmit={form.handleSubmit(handleFormSubmit)}
          isSubmitting={isSubmitting}
          submitText={editingPropertyType ? "Update Property Type" : "Create Property Type"}
        >
          <Form {...form}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Villa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="propertyTypeImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type Image</FormLabel>

                    {imagePreview && (
                      <div className="mb-2 h-20 w-28 rounded-md overflow-hidden bg-muted">
                        <img
                          src={imagePreview}
                          alt="Property type preview"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}

                    <FormControl>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                          const file = e.target.files?.[0] ?? null;
                          field.onChange(file);
                          if (file) {
                            setImagePreview(URL.createObjectURL(file));
                          }
                        }}
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                      />
                    </FormControl>

                    {editingPropertyType && (
                      <p className="text-xs text-gray-500 mt-1">
                        Leave empty to keep the current image
                      </p>
                    )}

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
          open={!!propertyTypeToDelete}
          onOpenChange={(open) => !open && setPropertyTypeToDelete(null)}
          title="Delete this property type?"
          description={`"${propertyTypeToDelete?.name}" will be permanently deleted.`}
          loading={isDeleting}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}

export default function PropertyTypePage() {
  return (
    <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_PROPERTY_TYPE}>
      <PropertyTypeContent />
    </ProtectedRoute>
  );
}