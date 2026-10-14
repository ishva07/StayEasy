"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AdminUser, UserRole } from "../types/user.type";

interface GetUserColumnsProps {
  roles: UserRole[];
  currentUserId?: string;
  canEditRoles: boolean;
  isUpdating: boolean;
  onRoleChange: (userId: string, roleId: string) => void;
}

export function getUserColumns({
  roles,
  currentUserId,
  canEditRoles,
  isUpdating,
  onRoleChange,
}: GetUserColumnsProps): ColumnDef<AdminUser>[] {
  return [
    {
      id: "name",
      header: "Name",
      enableSorting: false,
      cell: ({ row }) =>
        `${row.original.firstName} ${row.original.lastName}`,
    },
    {
      accessorKey: "email",
      header: "Email",
      enableSorting: false,
    },
    {
      id: "role",
      header: "Role",
      enableSorting: false,
      cell: ({ row }) => {
        const user = row.original;
        const isCurrentUser = user.id === currentUserId;

        return (
          <div>
            <Select
              value={user.roleId}
              disabled={isUpdating || isCurrentUser || !canEditRoles}
              onValueChange={(roleId) => {
                if (roleId) onRoleChange(user.id, roleId);
              }}
            >
              <SelectTrigger
                className="w-40"
                aria-label={`Role for ${user.email}`}
              >
                <SelectValue>{user.role.name}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isCurrentUser && (
              <span className="mt-1 block text-xs text-muted-foreground">
                Your own role cannot be changed.
              </span>
            )}
          </div>
        );
      },
    },
  ];
}
