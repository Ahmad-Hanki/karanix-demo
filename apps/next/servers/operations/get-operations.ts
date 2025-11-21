import { restApi } from "@/lib/api-client";
import { QueryConfig } from "@/lib/query-client";
import {
  OperationStatus,
  OperationType,
  OperationWithRelations,
  User,
  VehicleType,
} from "@/types";
import { useQuery, queryOptions } from "@tanstack/react-query";
import { cache } from "react";

export const getOperations = cache(
  async ({
    status,
    date,
    vehicle,
    driver,
    guide,
  }: {
    status?: OperationStatus;
    date?: string;
    vehicle?: boolean;
    driver?: boolean;
    guide?: boolean;
  }): Promise<{
    data: OperationWithRelations[];
  }> => {
    const response = await restApi.get(`/operations`, {
      params: {
        ...(status ? { status } : {}),
        ...(date ? { date } : {}),
        ...(vehicle ? { vehicle } : { vehicle: false }),
        ...(driver ? { driver } : { driver: false }),
        ...(guide ? { guide } : { guide: false }),
      },
    });
    return response.data;
  }
);

export const getOperationsQueryOptions = (
  status?: OperationStatus,
  date?: string
) => {
  return queryOptions({
    queryKey: ["operations", status, date],
    queryFn: () => getOperations({ status, date }),
  });
};

type UseOperationsOptions = {
  queryConfig?: QueryConfig<typeof getOperationsQueryOptions>;
};

export const useOperations = ({ queryConfig }: UseOperationsOptions) => {
  return useQuery({
    ...getOperationsQueryOptions(),
    ...queryConfig,
  });
};
