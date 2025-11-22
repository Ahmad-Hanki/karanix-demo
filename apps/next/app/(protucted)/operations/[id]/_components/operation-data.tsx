import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { useStartOperation } from "@/servers/operations/start-opration";
import { AlertPayload, OperationStatus, OperationWithRelations } from "@/types";
import { useState } from "react";
import { toast } from "react-toastify";
import { CheckButton } from "./check-button";

const OperationData = ({
  data,
  status,
  setStatus,
  setAlert,
}: {
  data: OperationWithRelations;
  status: OperationStatus;
  setStatus: React.Dispatch<React.SetStateAction<OperationStatus>>;
  setAlert: React.Dispatch<React.SetStateAction<AlertPayload | null>>;
}) => {
  const { mutate, isPending: isStarting } = useStartOperation({
    mutationConfig: {
      onSuccess: (data) => {
        if (data) {
          toast.success("Operation started successfully!");
          setStatus("ACTIVE");
          setAlert(null);
        }
      },
    },
  });
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center gap-3">
          {data.tourName} ({data.code} ) {status && ` - ${status}`}{" "}
          <CheckButton id={data.id} status={status} />
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
