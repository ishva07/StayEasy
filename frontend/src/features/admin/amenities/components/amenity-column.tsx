"use client";

import { ColumnDef } from "@tanstack/react-table";

export interface Amenity {
  id: string;
  name: string;
}

export function getAmenityColumns(): ColumnDef<Amenity>[] {
  return [
    {
      id: "index",
      header: "#",
      enableSorting: false,
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "name",
      header: "Amenity Name",
      enableSorting: true,
    },
  ];
}
