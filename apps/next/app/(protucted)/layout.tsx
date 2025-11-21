"use client";

import { SocketProvider } from "@/hooks/socket-context";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SocketProvider>{children}</SocketProvider>;
}
