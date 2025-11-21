import { restApi } from "@/lib/api-client";
import { QueryConfig } from "@/lib/query-client";
import { OperationWithRelations, User } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { cache } from "react";

export const getOperationById = cache(
  async ({
    id,
  }: {
    id: string;
  }): Promise<{
    data: OperationWithRelations;
  }> => {
    const response = await restApi.get(`/operations/${id}`);
    return response.data;
  }
);

export const getOperationByIdQueryOption = ({ id }: { id: string }) => {
  return {
    queryKey: ["operation", id],
    queryFn: () => getOperationById({ id }),
  };
};

type UseOperationsOptions = {
  queryConfig?: QueryConfig<typeof getOperationByIdQueryOption>;
  id: string;
};

export const useOperation = ({
  id,
  queryConfig,
}: UseOperationsOptions & { id: string }) => {
  return useQuery({
    ...getOperationByIdQueryOption({ id }),
    ...queryConfig,
  });
};
