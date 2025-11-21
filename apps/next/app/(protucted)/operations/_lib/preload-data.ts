import { getOperations } from "@/servers/operations/get-operations";
import { OperationsSearchParams } from "./search-params";

const PreloadData = async ({
  searchParams,
}: {
  searchParams: OperationsSearchParams;
}) => {
  const res = await getOperations({
    status: searchParams.status ?? undefined,
    date: searchParams.date ?? undefined,
  });
  return {
    operations: res.data,
  };
};

export default PreloadData;
