import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { useStartOperation } from "@/servers/operations/start-opration";
import { OperationStatus, OperationWithRelations } from "@/types";
import { useState } from "react";
import { toast } from "react-toastify";

const OperationData = ({ data }: { data: OperationWithRelations }) => {
  const [status, setStatus] = useState<OperationStatus>(data.status);
  const { mutate, isPending: isStarting } = useStartOperation({
    mutationConfig: {
      onSuccess: (data) => {
        if (data) {
          toast.success("Operation started successfully!");
          setStatus("ACTIVE");
        }
      },
    },
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {data.tourName} ({data.code} ) {status && ` - ${status}`}
        </CardTitle>

        <Button
          onClick={() => {
            mutate({ id: data.id });
          }}
          disabled={status === "ACTIVE" || status === "COMPLETED" || isStarting}
          className="w-fit"
        >
          {status === "ACTIVE"
            ? "Operation Active"
            : isStarting
              ? "Starting..."
              : "Start Operation"}
        </Button>
      </CardHeader>
      <CardContent>
        <div>
          <strong>Date:</strong> {formatDate(data.startTime, "full-date")}
        </div>
        <div>
          <strong>Start:</strong> {formatDate(data.startTime, "hour-minute")}
        </div>
        <div>
          <strong>Status:</strong> {status}
        </div>
        <div>
          <strong>Vehicle:</strong>{" "}
          {data.vehicle
            ? `${data.vehicle.plate} (${data.vehicle.name ?? "Unnamed"})`
            : "—"}
        </div>
        <div>
          <strong>Driver:</strong> {data.driver?.name ?? "—"}
        </div>
        <div>
          <strong>Guide:</strong> {data.guide?.name ?? "—"}
        </div>
        <div>
          <strong>Pax:</strong> {data.checkedInCount} / {data.totalPax}
        </div>{" "}
      </CardContent>
    </Card>
  );
};

export { OperationData };
