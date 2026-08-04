import { useMutation, useQueryClient } from "@tanstack/react-query";
import { propertyTypeService } from "../service/propertyType.service";
import { toast } from "sonner";

export function useEditPropertyType() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({
      propertyTypeId,
      name,
      propertyTypeImage,
    }: {
      propertyTypeId: string;
      name?: string;
      propertyTypeImage?: File;
    }) => propertyTypeService.editPropertyTypeApi(propertyTypeId, name, propertyTypeImage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["propertyTypes"] });
      toast.success("Property type updated successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message ?? "something went wrong while edit property type";
      toast.error(message);
    },
  });
  return {
    editPropertyType: mutation.mutate,
    isPending: mutation.isPending,
  };
}