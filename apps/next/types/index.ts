import { NextRequest, NextFetchEvent, NextResponse } from "next/server";
import type { XiorError } from "xior";

export type ApiErrorResponse = {
  message: string;
  status: number;
  error: string;
};

export type ApiError = XiorError<ApiErrorResponse>;

export type NextProxy = (
  request: NextRequest,
  event: NextFetchEvent
) => Promise<NextResponse> | NextResponse;

export type ProxyFactory = (proxy: NextProxy) => NextProxy;

export enum Role {
  OPS_MANAGER,
  ADMIN,
  USER,
}

export type User = {
  // also driver and guide
  email: string;
  password: string;
  id: string;
  name: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  accessToken?: string;
};
export type OperationStatus = "PLANNED" | "ACTIVE" | "COMPLETED" | "CANCELLED";

export type OperationType = {
  id: string;
  code: string;
  tourName: string;
  date: string; // ISO string from API (or Date if you parse)
  startTime: string; // same here
  status: OperationStatus;
  totalPax: number;
  checkedInCount: number;
  vehicleId: string | null;
  driverId: string | null;
  guideId: string | null;
  route: unknown | null; // or a more specific type if you know the shape

  createdAt: string;
  updatedAt: string;
};

export type VehicleType = {
  id: string;
  driverId: string | null;
  createdAt: Date;
  updatedAt: Date;
  name: string | null;
  plate: string;
  lastLat: number | null;
  lastLng: number | null;
  lastHeading: number | null;
  lastSpeed: number | null;
  lastPingAt: Date | null;
};

export type PaxStatus = "PLANNED" | "ACTIVE" | "COMPLETED" | "CANCELLED";

export type PaxType = {
  id: string;
  status: PaxStatus;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  operationId: string;
  phone: string | null;
  pickupLat: number;
  pickupLng: number;
  pickupAddress: string | null;
  seatNo: number | null;
};

export type OperationWithRelations = OperationType & {
  vehicle: VehicleType | null;
  driver: User | null;
  guide: User | null;
  pax: PaxType[] | null;
};
