"use client";

import { useEffect, useState } from "react";
import {
  AlertPayload,
  OperationWithRelations,
  PaxType,
  PaxUpdatedEvent,
  VehiclePositionEvent,
} from "@/types";
import { OperationData } from "./operation-data";
import { Map } from "./map";
import MainFestTable from "./main-fest-table";
import { useSocket } from "@/hooks/socket-context";
import { toast } from "react-toastify";

type OperationDetailClientProps = {
  initialOperation: OperationWithRelations;
};

export const OperationDetailClient = ({
  initialOperation,
}: OperationDetailClientProps) => {
  const socket = useSocket();

  const [paxList, setPaxList] = useState<PaxType[]>(initialOperation.pax ?? []);
  const [vehiclePos, setVehiclePos] = useState<{
    lat: number;
    lng: number;
  } | null>(
    initialOperation.vehicle?.lastLat && initialOperation.vehicle?.lastLng
      ? {
          lat: initialOperation.vehicle.lastLat,
          lng: initialOperation.vehicle.lastLng,
        }
      : null
  );

  const [status, setStatus] = useState(initialOperation.status);
  const [alert, setAlert] = useState<AlertPayload | null>(null);

  // join socket room + listen for events
  useEffect(() => {
    if (!socket) return;

    const operationId = initialOperation.id;

    socket.emit("join_operation", { operationId });
    console.log("joined operation room", operationId);

    const handleVehiclePosition = (payload: VehiclePositionEvent) => {
      console.log("vehicle_position", payload);
      setVehiclePos({ lat: payload.lat, lng: payload.lng });
    };

    const handlePaxUpdated = (payload: PaxUpdatedEvent) => {
      console.log("pax_updated", payload);
      setPaxList((prev) =>
        prev.map((p) =>
          p.id === payload.paxId ? { ...p, status: payload.status } : p
        )
      );
    };

    const handleAlert = (payload: AlertPayload) => {
      console.log("operation_alert", payload);

      if (payload?.type === "STATUS_CHANGE" && (payload as any).status) {
        setStatus((payload as any).status);
        return;
      }

      if (payload?.type === "LOW_CHECKIN") {
        setAlert(payload);
      }

      toast.info(`Alert: ${payload.message || payload.type}`);
    };

    socket.on("vehicle_position", handleVehiclePosition);
    socket.on("pax_updated", handlePaxUpdated);
    socket.on("operation_alert", handleAlert);

    return () => {
      socket.emit("leave_operation", { operationId });
      socket.off("vehicle_position", handleVehiclePosition);
      socket.off("pax_updated", handlePaxUpdated);
      socket.off("operation_alert", handleAlert);
    };
  }, [socket, initialOperation.id]);

  return (
    <>
      {alert && (
        <div className="mb-2 rounded bg-red-500 text-white text-sm px-3 py-2">
          {alert.message ?? "Low check-in rate for this operation."}
          {typeof alert.ratio === "number" && (
            <span className="ml-2 text-xs">
              ({Math.round(alert.ratio * 100)}% checked in –{" "}
              {alert.checkedInCount}/{alert.totalPax})
            </span>
          )}
        </div>
      )}
      <OperationData
        data={initialOperation}
        setStatus={setStatus}
        status={status}
        setAlert={setAlert}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Map pax={paxList} vehiclePos={vehiclePos} />
        <MainFestTable pax={paxList} operationId={initialOperation.id} />
      </div>
    </>
  );
};
