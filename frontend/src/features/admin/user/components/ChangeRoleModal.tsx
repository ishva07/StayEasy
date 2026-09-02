"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { getAllRole } from "@/features/admin/role/hooks/useGetAllRole";
import { useChangeUserRole } from "../hooks/useChangeUserRole";
import type { User } from "./user-column";

interface ChangeRoleModalProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChangeRoleModal({ user, open, onOpenChange }: ChangeRoleModalProps) {
  const { data: roles, isLoading } = getAllRole();
  const { changeUserRole, isPending } = useChangeUserRole();
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");

  useEffect(() => {
    if (user) setSelectedRoleId(user.roleId);
  }, [user]);

  const handleRoleChange = (value: string | null) => {
    setSelectedRoleId(value ?? "");
  };

  const handleSubmit = () => {
    if (!user || !selectedRoleId) return;
    changeUserRole(
      { userId: user.id, roleId: selectedRoleId },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change role for "{user?.email}"</DialogTitle>
        </DialogHeader>

<Select
  value={selectedRoleId}
  onValueChange={(value) => setSelectedRoleId(value ?? "")}
  disabled={isLoading}
>  <SelectTrigger>
    <SelectValue placeholder="Select a role">
      {roles?.find((role: { id: string; name: string }) => role.id === selectedRoleId)?.name}
    </SelectValue>
  </SelectTrigger>
  <SelectContent>
    {roles?.map((role: { id: string; name: string }) => (
      <SelectItem key={role.id} value={role.id}>
        {role.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || !selectedRoleId || selectedRoleId === user?.roleId}
          >
            {isPending ? "Updating..." : "Update Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}