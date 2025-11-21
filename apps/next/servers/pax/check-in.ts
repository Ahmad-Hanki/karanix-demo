import { restApi } from "@/lib/api-client";
import { MutationConfig } from "@/lib/query-client";
import { CheckInEventType } from "@/types";
import { useMutation } from "@tanstack/react-query";

export const CheckIn = async ({
  paxId,
  body,
}: {
  paxId: string;
  body: {
    eventId: string;
    method: "qr" | "manual";
    gps?: { lat: number; lng: number };
    photoUrl?: string;
  };
}): Promise<{ data: CheckInEventType }> => {
  const response = await restApi.post(`/pax/${paxId}/checkin`, body);
  return response.data;
};

type useCheckInOptions = {
  mutationConfig?: MutationConfig<typeof CheckIn>;
};

export const useCheckIn = ({ mutationConfig }: useCheckInOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    ...restConfig,
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    mutationFn: CheckIn,
  });
};
