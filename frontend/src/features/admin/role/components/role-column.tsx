"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ShieldCheck } from "lucide-react";

export interface Role {
  id: string;
  name: string;
}

interface GetRoleColumnsProps {
  onEdit?: (role: Role) => void;
  onDelete?: (role: Role) => void;
  onPermissions?: (role: Role) => void;
}

export function getRoleColumns({ onEdit, onDelete, onPermissions }: GetRoleColumnsProps): ColumnDef<Role>[] {
  const columns: ColumnDef<Role>[] = [
    {
      accessorKey: "name",
      header: "Role Name",
      enableSorting: true,
    },
  ];

  if (onEdit || onDelete || onPermissions) {
    columns.push({
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {onPermissions && (
            <Button variant="ghost" size="icon" onClick={() => onPermissions(row.original)}>
              <ShieldCheck className="h-4 w-4" />
            </Button>
          )}
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