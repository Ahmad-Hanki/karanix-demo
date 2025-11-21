"use client";

import { useEffect, useState } from "react";
import { OperationWithRelations, PaxType } from "@/types";
import { OperationData } from "./operation-data";
import { Map } from "./map";
import MainFestTable from "./main-fest-table";
import { useSocket } from "@/hooks/socket-context";
import { toast } from "react-toastify";

type OperationDetailClientProps = {
  initialOperation: OperationWithRelations;
};

type VehiclePositionEvent = {
  vehicleId: string;
  lat: number;
  lng: number;
  heading?: number | null;
  speed?: number | null;
  timestamp: string;
};

type PaxUpdatedEvent = {
  paxId: string;
  status: PaxType["status"];
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

    const handleAlert = (payload: any) => {
      console.log("⚠ operation_alert", payload);
      toast.warn(`Alert: ${payload.message}`);
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
      <OperationData data={initialOperation} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Map pax={paxList} vehiclePos={vehiclePos} />
        <MainFestTable pax={paxList} operationId={initialOperation.id} />
      </div>
    </>
  );
};
