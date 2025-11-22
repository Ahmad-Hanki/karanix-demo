import { restApi } from "@/lib/api-client";
import { MutationConfig } from "@/lib/query-client";
import { AlertPayload, OperationType } from "@/types";
import { useMutation } from "@tanstack/react-query";

export const checkAlert = async ({
  id,
}: {
  id: string;
}): Promise<{ data: AlertPayload }> => {
  const response = await restApi.post(`/operations/${id}/check-alert`);
  return response.data;
};

type useCheckAlertOptions = {
  mutationConfig?: MutationConfig<typeof checkAlert>;
};

export const useCheckAlert = ({
  mutationConfig,
}: useCheckAlertOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: checkAlert,
  });
};
