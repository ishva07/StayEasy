"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export interface PropertyType {
  id: string;
  name: string;
  image?: string | null;
}

interface GetPropertyTypeColumnsProps {
  onEdit?: (propertyType: PropertyType) => void;
  onDelete?: (propertyType: PropertyType) => void;
}

export function getPropertyTypeColumns({
  onEdit,
  onDelete,
}: GetPropertyTypeColumnsProps): ColumnDef<PropertyType>[] {
  const columns: ColumnDef<PropertyType>[] = [
    {
      accessorKey: "image",
      header: "Image",
      enableSorting: false,
      cell: ({ row }) => {
        const image = row.original.image;
        const url = image ? `${process.env.NEXT_PUBLIC_UPLOADS_URL}${image}` : null;
        return (
          <div className="h-12 w-16 rounded-md overflow-hidden bg-muted">
            {url ? (
              <img src={url} alt={row.original.name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-[10px] text-muted-foreground">
                No image
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "name",
      header: "Property Type Name",
      enableSorting: true,
    },
  ];

  if (onEdit || onDelete) {
    columns.push({
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {onEdit && (
            <Button variant="ghost" size="icon" onClick={() => onEdit(row.original)}>
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button variant="ghost" size="icon" onClick={() => onDelete(row.original)}>
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          )}
        </div>
      ),
    });
  }

  return columns;
}