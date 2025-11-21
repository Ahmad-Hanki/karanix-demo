import { createLoader, parseAsString, parseAsStringEnum } from "nuqs/server";
import { OperationStatus } from "@/types";
export const operationsSearchParams = {
  date: parseAsString,
  status: parseAsStringEnum<OperationStatus>([
    "ACTIVE",
    "PLANNED",
    "COMPLETED",
    "CANCELLED",
  ]),
};

export const loadSearchParams = createLoader(operationsSearchParams);

export type OperationsSearchParams = Awaited<
  ReturnType<typeof loadSearchParams>
>;
