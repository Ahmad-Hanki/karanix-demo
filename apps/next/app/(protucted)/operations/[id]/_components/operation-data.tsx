import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { OperationWithRelations } from "@/types";

const OperationData = ({ data }: { data: OperationWithRelations }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {data.tourName} ({data.code})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <strong>Date:</strong> {formatDate(data.startTime, "full-date")}
        </div>
        <div>
          <strong>Start:</strong> {formatDate(data.startTime, "hour-minute")}
        </div>
        <div>
          <strong>Status:</strong> {data.status}
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
