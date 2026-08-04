import { useMutation, useQueryClient } from "@tanstack/react-query";
import { propertyTypeService } from "../service/propertyType.service";
import { toast } from "sonner";

export function useCreatePropertyType() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ name, propertyTypeImage }: { name: string; propertyTypeImage: File }) =>
      propertyTypeService.createPropertyTypeApi(name, propertyTypeImage),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["propertyTypes"] });
      toast.success("Property type added successfully");
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message ?? "something went wrong";
      toast.error(message);
    },
  });
  return {
    createPropertyType: mutation.mutate,
    isPending: mutation.isPending,
  };
}