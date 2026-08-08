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

import { getCity } from "@/features/admin/city/hook/useGetCity";
import { useCreateCity } from "@/features/admin/city/hook/useCreateCity";
import { useEditCity } from "@/features/admin/city/hook/useEditCity";
import { useDeleteCity } from "@/features/admin/city/hook/useDeleteCity";
import { getCityColumns, City } from "@/features/admin/city/components/city-column";
import {
  createCitySchema,
  updateCitySchema,
  createCityFormInput,
  updateCityFormInput,
} from "@/features/admin/city/validation/city.validation";

function CityContent() {
  const { hasPermission } = usePermission();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data, isLoading } = getCity();

  const { deleteCity, isPending: isDeleting } = useDeleteCity();
  const [cityToDelete, setCityToDelete] = useState<City | null>(null);

  const { createCity, isPending: isCreating } = useCreateCity();
  const { editCity, isPending: isUpdating } = useEditCity();
  const [formOpen, setFormOpen] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const isSubmitting = isCreating || isUpdating;

  const canAdd = hasPermission(PERMISSIONS.ADD_CITY);
  const canEdit = hasPermission(PERMISSIONS.EDIT_CITY);
  const canDelete = hasPermission(PERMISSIONS.DELETE_CITY);

  const form = useForm<createCityFormInput | updateCityFormInput>({
    resolver: zodResolver(editingCity ? updateCitySchema : createCitySchema),
    defaultValues: { name: "" },
  });

  const openCreateForm = () => {
    form.reset({ name: "" });
    setEditingCity(null);
    setImagePreview(null);
    setFormOpen(true);
  };

  const openEditForm = (city: City) => {
    form.reset({ name: city.name, cityImage: undefined });
    setEditingCity(city);
    setImagePreview(
      city.images ? `${process.env.NEXT_PUBLIC_UPLOADS_URL}${city.images}` : null
    );
    setFormOpen(true);
  };

  const handleFormSubmit = (formData: updateCityFormInput) => {
    if (editingCity) {
      editCity(
        { cityId: editingCity.id, name: formData.name, cityImage: formData.cityImage },
        { onSuccess: () => setFormOpen(false) },
      );
    } else {
      createCity(
        { name: formData.name!, cityImage: formData.cityImage! },
        { onSuccess: () => setFormOpen(false) },
      );
    }
  };

  const handleConfirmDelete = () => {
    if (!cityToDelete) return;
    deleteCity(
      { cityId: cityToDelete.id },
      { onSuccess: () => setCityToDelete(null) },
    );
  };

  const columns = getCityColumns({
    onEdit: canEdit ? openEditForm : undefined,
    onDelete: canDelete ? (city) => setCityToDelete(city) : undefined,
  });

  return (
    <div className="space-y-6">
      <section className="rounded-[1.75rem] border border-slate-200/80 bg-white/95 p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">Cities</h1>
            <p className="mt-2 text-sm text-slate-500">Manage your cities, upload city images, and keep destinations up to date.</p>
          </div>
          {canAdd && <Button onClick={openCreateForm}>Add City</Button>}
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
          title={editingCity ? "Edit City" : "Add City"}
          onSubmit={form.handleSubmit(handleFormSubmit)}
          isSubmitting={isSubmitting}
          submitText={editingCity ? "Update City" : "Create City"}
        >
          <Form {...form}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Ahmedabad" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cityImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City Image</FormLabel>

                    {imagePreview && (
                      <div className="mb-2 h-20 w-28 rounded-md overflow-hidden bg-muted">
                        <img
                          src={imagePreview}
                          alt="City preview"
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

                    {editingCity && (
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
          open={!!cityToDelete}
          onOpenChange={(open) => !open && setCityToDelete(null)}
          title="Delete this city?"
          description={`"${cityToDelete?.name}" will be permanently deleted.`}
          loading={isDeleting}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}

export default function CityPage() {
  return (
    <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_CITY}>
      <CityContent />
    </ProtectedRoute>
  );
}