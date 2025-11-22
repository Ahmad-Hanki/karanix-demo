"use client";

import { useOperationsWrapper } from "@/hooks/transition-context";

export const OperationWrapperLoading = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isPending } = useOperationsWrapper();
  return <>{isPending ? <div>Loading operation details...</div> : children}</>;
};
