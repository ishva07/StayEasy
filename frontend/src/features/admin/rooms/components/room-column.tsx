"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

export interface Room {
  id: string;
  name: string;
  capacity: number;
  price: string;
  roomImage: string | null;
  hotelId: string;
}

interface GetColumnsProps {
  onEdit?: (room: Room) => void;
  onDelete?: (room: Room) => void;
}

export function getRoomColumns({
  onEdit,
  onDelete,
}: GetColumnsProps): ColumnDef<Room>[] {
  return [
    {
    accessorKey: "roomImage",
    header: "Image",
    enableSorting: false,
    cell: ({ row }) => {
        const imageUrl = row.original.roomImage
            ? `${process.env.NEXT_PUBLIC_UPLOADS_URL}${row.original.roomImage}`   // 👈 same variable
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
      accessorKey: "capacity",
      header: "Capacity",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => `₹${row.original.price}`,
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
         {onEdit &&(
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(row.original)}
          >
            <Pencil className="h-4 w-4" />
          </Button>)}
         {onDelete &&( <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(row.original)}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>)}
        </div>
      ),
    },
  ];
}
