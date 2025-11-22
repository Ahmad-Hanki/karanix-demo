"use client";
import {
  operationsSearchParams,
  OperationsSearchParams,
} from "@/app/(protucted)/operations/_lib/search-params";
import { useQueryStates } from "nuqs";
import { createContext, useContext, useMemo, useTransition } from "react";

const OperationsWrapperContext = createContext<
  | (OperationsSearchParams & {
      setParams: ReturnType<typeof useQueryStates>[1];
      isPending: boolean;
    })
  | null
>(null);

export const OperationsWrapperProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isPending, startTransition] = useTransition();
  const [params, setParams] = useQueryStates(operationsSearchParams, {
    shallow: false,
    scroll: true,
    startTransition,
  });

  const value = useMemo(() => {
    return {
      date: params.date || null,
      status: params.status || null,
      setParams,
      isPending,
    };
  }, [params.date, params.status, isPending, setParams]);

  return (
    <OperationsWrapperContext.Provider value={value}>
      {children}
    </OperationsWrapperContext.Provider>
  );
};

export const useOperationsWrapper = () => {
  const context = useContext(OperationsWrapperContext);
  if (!context) {
    throw new Error(
      "useOperationsWrapper must be used within an OperationsWrapperProvider"
    );
  }
  return context;
};
