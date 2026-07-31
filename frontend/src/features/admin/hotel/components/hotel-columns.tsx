"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Hotel } from "@/features/admin/hotel/types/hotel.types";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Eye, BedDouble } from "lucide-react";

interface GetColumnsProps {
  onEdit?: (hotel: Hotel) => void;
  onViewRooms?:(hotel:Hotel)=>void;
  onDelete?: (hotel: Hotel) => void;
  onView: (hotel: Hotel) => void;
}

export function getHotelColumns({
  onEdit,
  onDelete,
  onView,
  onViewRooms
}: GetColumnsProps): ColumnDef<Hotel>[] {
  return [
    {
      accessorKey: "heroImage",
      header: "Image",
      enableSorting: false,
      cell: ({ row }) => {
        const imageUrl = row.original.heroImage
          ? `${process.env.NEXT_PUBLIC_UPLOADS_URL}${row.original.heroImage}`
          : "";

        return (
          <div className="relative h-12 w-16 rounded-md overflow-hidden bg-muted">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={row.original.name}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "city",
      header: "City",
    },
    {
      accessorKey: "isFeatured",
      header: "Featured",
      cell: ({ row }) => (row.original.isFeatured ? "Yes" : "No"),
    },
   {
  id: "actions",
  header: "Actions",
  enableSorting: false,
  cell: ({ row }) => (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onView(row.original)}
      >
        <Eye className="h-4 w-4" />
      </Button>

      {onViewRooms && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onViewRooms(row.original)}
        >
          <BedDouble className="h-4 w-4" />
        </Button>
      )}

      {onEdit && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(row.original)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}

      {onDelete && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(row.original)}
        >
          <Trash2 className="h-4 w-4 text-red-600" />
        </Button>
      )}
    </div>
  ),
},
  ];
}
