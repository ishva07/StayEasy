"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export interface City {
  id: string;
  name: string;
  images?: string | null;
}

interface GetCityColumnsProps {
  onEdit?: (city: City) => void;
  onDelete?: (city: City) => void;
}

export function getCityColumns({ onEdit, onDelete }: GetCityColumnsProps): ColumnDef<City>[] {
  const columns: ColumnDef<City>[] = [
    {
      accessorKey: "image",
      header: "Image",
      enableSorting: false,
      cell: ({ row }) => {
        const image = row.original.images;
        const url = image ? `${process.env.NEXT_PUBLIC_UPLOADS_URL}${image}` : null;
        return (
          <div className="h-12 w-16 rounded-md overflow-hidden bg-muted relative">
            {url ? (
              <Image src={url} alt={row.original.name} fill className="object-cover" unoptimized />
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
      header: "City Name",
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