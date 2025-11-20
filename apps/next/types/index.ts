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
  email: string;
  password: string;
  id: string;
  name: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  accessToken?: string;
};
