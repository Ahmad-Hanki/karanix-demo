import { Header } from "@/components/header";
import { getOperationById } from "@/servers/operations/get-oprations-by-id";
import { OperationData } from "./_components/operation-data";
import { Map } from "./_components/map";
import MainFestTable from "./_components/main-fest-table";

const OperationDetail = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const operation = await getOperationById({ id });

  return (
    <div className="space-y-4">
      <Header title="Operation Detail" />
      <OperationData data={operation.data} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Map />
        <MainFestTable pax={operation.data.pax} />
      </div>
    </div>
  );
};

export default OperationDetail;
