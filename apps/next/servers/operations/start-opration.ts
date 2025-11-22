import { restApi } from "@/lib/api-client";
import { MutationConfig } from "@/lib/query-client";
import { OperationType } from "@/types";
import { useMutation } from "@tanstack/react-query";

export const StartOperation = async ({
  id,
}: {
  id: string;
}): Promise<{ data: OperationType }> => {
  const response = await restApi.post(`/operations/${id}/start`);
  return response.data;
};

type useStartOperationOptions = {
  mutationConfig?: MutationConfig<typeof StartOperation>;
};

export const useStartOperation = ({
  mutationConfig,
}: useStartOperationOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: StartOperation,
  });
};
