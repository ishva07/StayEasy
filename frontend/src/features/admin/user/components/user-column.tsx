"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { UserCog } from "lucide-react";

export interface User {
  id: string;
  email: string;
  roleId: string;
  role: { id: string; name: string };
  createdAt: string;
}

interface GetUserColumnsProps {
  onChangeRole?: (user: User) => void;
}

export function getUserColumns({ onChangeRole }: GetUserColumnsProps): ColumnDef<User>[] {
  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "email",
      header: "Email",
      enableSorting: true,
    },
    {
      accessorKey: "role.name",
      header: "Role",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
          {row.original.role.name}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Joined",
      enableSorting: true,
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
  ];

  if (onChangeRole) {
    columns.push({
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => (
        <Button variant="ghost" size="icon" onClick={() => onChangeRole(row.original)}>
          <UserCog className="h-4 w-4" />
        </Button>
      ),
    });
  }

  return columns;
}