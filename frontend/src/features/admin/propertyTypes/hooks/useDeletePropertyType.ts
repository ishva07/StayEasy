import { useMutation, useQueryClient } from "@tanstack/react-query";
import { propertyTypeService } from "../service/propertyType.service";
import { toast } from "sonner";

export function useDeletePropertyType() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ propertyTypeId }: { propertyTypeId: string }) =>
      propertyTypeService.deletePropertyTypeApi(propertyTypeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["propertyTypes"] });
      toast.success("Property type deleted successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message ?? "something went wrong while delete property type";
      toast.error(message);
    },
  });
  return {
    deletePropertyType: mutation.mutate,
    isPending: mutation.isPending,
  };
}