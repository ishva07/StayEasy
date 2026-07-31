import { Permission } from "@/constants/permissions";
import { useAuthStore } from "@/stores/authStore";

const EMPTY_PERMISSIONS: string[] = [];

export function usePermission() {
  const permissions = useAuthStore((s) => s.user?.permissions ?? EMPTY_PERMISSIONS);
  const hasPermission = (permission: Permission) => permissions.includes(permission);
  return { hasPermission, permissions };
}