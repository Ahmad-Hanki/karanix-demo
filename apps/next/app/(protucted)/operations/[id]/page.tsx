import { Header } from "@/components/header";
import { getOperationById } from "@/servers/operations/get-oprations-by-id";
import { OperationDetailClient } from "./_components/operation-detail-client";

const OperationDetail = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const operation = await getOperationById({ id });

  console.log("OperationDetail loaded operation:", operation);

  return (
    <div className="space-y-4">
      <Header title="Operation Detail" />
      <OperationDetailClient initialOperation={operation.data} />
    </div>
  );
};

export default OperationDetail;
