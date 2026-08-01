"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { ArrowLeft } from "lucide-react";

import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";
import { PERMISSIONS } from "@/constants/permissions";
import { usePermission } from "@/hooks/usePermission";

import { useGetRoom } from "@/features/rooms/hooks/useGetRooms";
import { useDeleteRoom } from "@/features/admin/rooms/hooks/useDeleteRoom";
import { useCreateRoom } from "@/features/admin/rooms/hooks/useCreateRoom";
import { useUpdateRoom } from "@/features/admin/rooms/hooks/useUpdateRoom";
import {
  getRoomColumns,
  Room,
} from "@/features/admin/rooms/components/room-column";
import {
  createRoomSchema,
  createRoomFormInput,
  updateRoomFormInput,
  updateRoomSchema,
} from "@/features/admin/rooms/validation/rooms.validation";

function RoomsContent() {
  const router = useRouter();
  const { id: hotelId } = useParams<{ id: string }>();
  const { hasPermission } = usePermission();

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const sortBy = sorting[0]?.id ?? "createdAt";
  const order = sorting[0]?.desc ? "desc" : "asc";

  const { data, isLoading } = useGetRoom(
    hotelId,
    pagination.pageIndex + 1,
    pagination.pageSize,
    sortBy,
    order,
  );

  const { deleteRoom, isPending: isDeleting } = useDeleteRoom();
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);

  const { createRoom, isPending: isCreating } = useCreateRoom();
  const { updateRoom, isPending: isUpdating } = useUpdateRoom();
  const [formOpen, setFormOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const isSubmitting = isCreating || isUpdating;

  const canAdd = hasPermission(PERMISSIONS.ADD_ROOM);
  const canEdit = hasPermission(PERMISSIONS.EDIT_ROOM);
  const canDelete = hasPermission(PERMISSIONS.DELETE_ROOM);

  const form = useForm<createRoomFormInput | updateRoomFormInput>({
    resolver: zodResolver(editingRoom ? updateRoomSchema : createRoomSchema),
    defaultValues: { name: "", capacity: 1, price: 0 },
  });

  const openCreateForm = () => {
    form.reset({ name: "", capacity: 1, price: 0 });
    setEditingRoom(null);
    setImagePreview(null);
    setFormOpen(true);
  };

  const openEditForm = (room: Room) => {
    form.reset({
      name: room.name,
      capacity: room.capacity,
      price: Number(room.price),
      roomImage: undefined,
    });
    setEditingRoom(room);
    setImagePreview(
      room.roomImage ? `${process.env.NEXT_PUBLIC_UPLOADS_URL}${room.roomImage}` : null
    );
    setFormOpen(true);
  };

  const handleFormSubmit = (formData: updateRoomFormInput) => {
    if (editingRoom) {
      updateRoom(
        { hotelId, roomId: editingRoom.id, data: formData },
        { onSuccess: () => setFormOpen(false) },
      );
    } else {
      createRoom(
        { hotelId, data: formData as createRoomFormInput },
        { onSuccess: () => setFormOpen(false) },
      );
    }
  };

  const handleConfirmDelete = () => {
    if (!roomToDelete) return;
    deleteRoom(
      { hotelId, roomId: roomToDelete.id },
      { onSuccess: () => setRoomToDelete(null) },
    );
  };

  const columns = getRoomColumns({
    onEdit: canEdit ? openEditForm : undefined,
    onDelete: canDelete ? (room) => setRoomToDelete(room) : undefined,
  });

  return (
    <div className="space-y-4">
      <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/hotels`)}>
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Hotel
      </Button>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Rooms</h1>
        {canAdd && <Button onClick={openCreateForm}>Add Room</Button>}
      </div>

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

      {(canAdd || canEdit) && (
        <FormModal
          open={formOpen}
          onOpenChange={setFormOpen}
          title={editingRoom ? "Edit Room" : "Add Room"}
          onSubmit={form.handleSubmit(handleFormSubmit)}
          isSubmitting={isSubmitting}
          submitText={editingRoom ? "Update Room" : "Create Room"}
        >
          <Form {...form}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Deluxe Room" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="capacity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Capacity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="roomImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room Image</FormLabel>

                    {imagePreview && (
                      <div className="mb-2 h-20 w-28 rounded-md overflow-hidden bg-muted">
                        <img
                          src={imagePreview}
                          alt="Room preview"
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

                    {editingRoom && (
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
          open={!!roomToDelete}
          onOpenChange={(open) => !open && setRoomToDelete(null)}
          title="Delete this room?"
          description={`"${roomToDelete?.name}" will be permanently deleted.`}
          loading={isDeleting}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}

export default function RoomsPage() {
  return (
    <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_ROOM}>
      <RoomsContent />
    </ProtectedRoute>
  );
}